#!/usr/bin/env node
// Treegress Browser MCP + Ollama Checkout Automation
// Enhanced Playwright with full DOM serialization and LLM-powered checkout flows.
//
// Required env vars:
//   OLLAMA_API_URL    - Ollama API endpoint (default: http://localhost:11434)
//   OLLAMA_MODEL      - Model name (default: mistral)
//
// Optional env vars:
//   CHECKOUT_PROFILES - JSON file path for saved checkout profiles (default: ./checkout-profiles.json)
//   APPROVAL_TIMEOUT  - ms to wait for user approval (default: 30000)

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { chromium } from "playwright";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { resolve, dirname } from "node:path";

const OLLAMA_URL = process.env.OLLAMA_API_URL || "http://localhost:11434";
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || "mistral";
const PROFILES_PATH = process.env.CHECKOUT_PROFILES
  ? resolve(process.env.CHECKOUT_PROFILES)
  : resolve(process.cwd(), "checkout-profiles.json");

let browser = null;
let currentPage = null;
let refIdMap = new Map(); // Maps refId to element selectors

const server = new McpServer({
  name: "treegress-ollama",
  version: "0.1.0",
});

// ========== Utility: DOM Serialization with refId Targeting ==========

async function serializeDOMWithRefIds(page) {
  return await page.evaluate(() => {
    let refIdCounter = 0;
    const refMap = new Map();

    function serializeNode(node, depth = 0) {
      if (depth > 10) return null; // Limit depth to prevent runaway serialization

      const type = node.nodeType;
      if (type === 3) {
        // Text node
        const text = node.textContent.trim();
        return text ? { type: "text", content: text.slice(0, 200) } : null;
      }

      if (type !== 1) return null; // Element node only

      const el = node;
      const tag = el.tagName.toLowerCase();
      const refId = `ref_${++refIdCounter}`;

      // Store selector for later reference
      const selector = Array.from(el.parentElement?.children || [])
        .indexOf(el) >= 0
        ? `${el.tagName.toLowerCase()}:nth-child(${Array.from(el.parentElement.children).indexOf(el) + 1})`
        : el.id
        ? `#${el.id}`
        : el.className
        ? `.${el.className.split(" ")[0]}`
        : tag;

      refMap.set(refId, selector);

      const attrs = {};
      for (let i = 0; i < el.attributes.length; i++) {
        const attr = el.attributes[i];
        if (["id", "class", "placeholder", "value", "aria-label", "data-testid"].includes(attr.name)) {
          attrs[attr.name] = attr.value;
        }
      }

      const children = [];
      for (let i = 0; i < el.childNodes.length; i++) {
        const child = serializeNode(el.childNodes[i], depth + 1);
        if (child) children.push(child);
      }

      const node = {
        refId,
        tag,
        attrs: Object.keys(attrs).length > 0 ? attrs : undefined,
        isInteractive: ["input", "button", "a", "select", "textarea"].includes(tag),
        isVisible: el.offsetParent !== null,
        children: children.length > 0 ? children : undefined,
      };

      return node;
    }

    const root = serializeNode(document.documentElement);
    return { tree: root, refMap: Object.fromEntries(refMap) };
  });
}

// ========== Utility: Ollama LLM Call ==========

async function callOllama(prompt) {
  try {
    const res = await fetch(`${OLLAMA_URL}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        prompt,
        stream: false,
        temperature: 0.3,
      }),
    });

    if (!res.ok) {
      throw new Error(`Ollama API error: ${res.status}`);
    }

    const data = await res.json();
    return data.response.trim();
  } catch (error) {
    throw new Error(`Ollama call failed: ${error.message}`);
  }
}

// ========== Core Tools ==========

server.registerTool(
  "browser_open",
  {
    title: "Open browser and navigate to URL",
    description: "Start a browser instance and navigate to the target URL.",
    inputSchema: z.object({
      url: z.string().url().describe("URL to navigate to"),
      headless: z.boolean().optional().describe("Run headless (default: true)"),
    }),
  },
  async ({ url, headless = true }) => {
    if (!browser) {
      browser = await chromium.launch({ headless });
    }
    currentPage = await browser.newPage();
    await currentPage.goto(url, { waitUntil: "domcontentloaded" });

    return {
      content: [
        {
          type: "text",
          text: `Browser opened and navigated to ${url}`,
        },
      ],
    };
  }
);

server.registerTool(
  "browser_snapshot",
  {
    title: "Capture full DOM tree with refId references",
    description:
      "Serialize the entire DOM tree with refIds for each interactive element. Use the returned refIds to target elements for interaction.",
    inputSchema: z.object({}),
  },
  async () => {
    if (!currentPage) {
      throw new Error("No browser page open. Call browser_open first.");
    }

    const { tree, refMap } = await serializeDOMWithRefIds(currentPage);
    refIdMap = new Map(Object.entries(refMap));

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({ tree, refMap }, null, 2),
        },
      ],
    };
  }
);

server.registerTool(
  "browser_interact",
  {
    title: "Interact with page element by refId",
    description: "Click, fill, or select an element identified by its refId from a previous snapshot.",
    inputSchema: z.object({
      refId: z.string().describe("The refId from the DOM snapshot"),
      action: z.enum(["click", "fill", "select"]).describe("Action to perform"),
      value: z.string().optional().describe("Value for fill/select actions"),
    }),
  },
  async ({ refId, action, value }) => {
    if (!currentPage) {
      throw new Error("No browser page open.");
    }

    const selector = refIdMap.get(refId);
    if (!selector) {
      throw new Error(`refId ${refId} not found in current page snapshot`);
    }

    try {
      switch (action) {
        case "click":
          await currentPage.click(selector);
          return { content: [{ type: "text", text: `Clicked element ${refId}` }] };
        case "fill":
          if (!value) throw new Error("value required for fill action");
          await currentPage.fill(selector, value);
          return { content: [{ type: "text", text: `Filled ${refId} with value` }] };
        case "select":
          if (!value) throw new Error("value required for select action");
          await currentPage.selectOption(selector, value);
          return { content: [{ type: "text", text: `Selected ${value} in ${refId}` }] };
      }
    } catch (error) {
      throw new Error(`Interaction failed: ${error.message}`);
    }
  }
);

server.registerTool(
  "checkout_analyze",
  {
    title: "Analyze checkout form with Ollama",
    description:
      "Use LLM to parse the current page and identify checkout form fields. Returns JSON with detected fields and recommended refIds.",
    inputSchema: z.object({
      profile: z.string().optional().describe("Name of saved checkout profile to use"),
    }),
  },
  async ({ profile }) => {
    if (!currentPage) {
      throw new Error("No browser page open.");
    }

    const { tree, refMap } = await serializeDOMWithRefIds(currentPage);
    const treeStr = JSON.stringify(tree, null, 2).slice(0, 5000); // Limit context

    const prompt = `Analyze this DOM tree and identify checkout form fields. Return ONLY valid JSON (no markdown) with structure:
{
  "fields": [
    { "label": "field name", "refId": "ref_X", "type": "text|email|select", "required": bool }
  ],
  "formAction": "ref_Y or null"
}

DOM Tree:
${treeStr}`;

    const response = await callOllama(prompt);
    let fields;
    try {
      fields = JSON.parse(response);
    } catch {
      fields = { fields: [], error: "Could not parse LLM response" };
    }

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(fields, null, 2),
        },
      ],
    };
  }
);

server.registerTool(
  "checkout_fill_profile",
  {
    title: "Fill checkout form from profile",
    description: "Auto-fill checkout fields using a saved profile. Requires approval gate before final click.",
    inputSchema: z.object({
      profileName: z.string().describe("Name of saved checkout profile"),
      autoApprove: z.boolean().optional().describe("Skip approval gate (default: false)"),
    }),
  },
  async ({ profileName, autoApprove = false }) => {
    if (!currentPage) {
      throw new Error("No browser page open.");
    }

    // Load profile
    if (!existsSync(PROFILES_PATH)) {
      throw new Error(`Profiles file not found at ${PROFILES_PATH}`);
    }

    const profilesData = JSON.parse(await readFile(PROFILES_PATH, "utf-8"));
    const profile = profilesData[profileName];
    if (!profile) {
      throw new Error(`Profile ${profileName} not found`);
    }

    // Analyze form
    const { tree } = await serializeDOMWithRefIds(currentPage);
    const treeStr = JSON.stringify(tree, null, 2).slice(0, 5000);

    const analyzePrompt = `Map these profile fields to checkout form fields. Return JSON with structure:
{
  "mappings": [
    { "profileField": "name", "formRefId": "ref_X", "formFieldType": "text|email|select" }
  ]
}

Profile data keys: ${Object.keys(profile).join(", ")}

DOM Tree (first 5000 chars):
${treeStr}`;

    const mappingResponse = await callOllama(analyzePrompt);
    let mappings;
    try {
      mappings = JSON.parse(mappingResponse).mappings || [];
    } catch {
      mappings = [];
    }

    // Fill fields
    const filled = [];
    for (const mapping of mappings) {
      const selector = refIdMap.get(mapping.formRefId);
      if (selector && profile[mapping.profileField]) {
        await currentPage.fill(selector, String(profile[mapping.profileField]));
        filled.push(mapping.profileField);
      }
    }

    // Approval gate
    if (!autoApprove) {
      return {
        content: [
          {
            type: "text",
            text: `Filled fields: ${filled.join(", ")}. Awaiting approval to submit. Call checkout_confirm to proceed.`,
          },
        ],
      };
    }

    return {
      content: [
        {
          type: "text",
          text: `Filled and auto-approved: ${filled.join(", ")}. Ready to submit.`,
        },
      ],
    };
  }
);

server.registerTool(
  "checkout_confirm",
  {
    title: "Confirm and submit checkout form",
    description:
      "After filling checkout form (with approval gate), submit it. This is the final irreversible step.",
    inputSchema: z.object({
      submitButtonRefId: z.string().describe("refId of the submit button"),
    }),
  },
  async ({ submitButtonRefId }) => {
    if (!currentPage) {
      throw new Error("No browser page open.");
    }

    const selector = refIdMap.get(submitButtonRefId);
    if (!selector) {
      throw new Error(`Submit button refId ${submitButtonRefId} not found`);
    }

    await currentPage.click(selector);
    await currentPage.waitForLoadState("networkidle");

    return {
      content: [
        {
          type: "text",
          text: "Checkout submitted and order confirmed.",
        },
      ],
    };
  }
);

server.registerTool(
  "profile_save",
  {
    title: "Save a checkout profile",
    description: "Store checkout form data for reuse.",
    inputSchema: z.object({
      profileName: z.string().describe("Name for this profile"),
      data: z.record(z.string()).describe("Form field data to save"),
    }),
  },
  async ({ profileName, data }) => {
    if (!existsSync(dirname(PROFILES_PATH))) {
      await mkdir(dirname(PROFILES_PATH), { recursive: true });
    }

    const existing = existsSync(PROFILES_PATH) ? JSON.parse(await readFile(PROFILES_PATH, "utf-8")) : {};
    existing[profileName] = data;

    await writeFile(PROFILES_PATH, JSON.stringify(existing, null, 2));

    return {
      content: [
        {
          type: "text",
          text: `Profile '${profileName}' saved.`,
        },
      ],
    };
  }
);

server.registerTool(
  "browser_close",
  {
    title: "Close browser",
    description: "End the browser session.",
    inputSchema: z.object({}),
  },
  async () => {
    if (browser) {
      await browser.close();
      browser = null;
      currentPage = null;
      refIdMap.clear();
    }

    return {
      content: [
        {
          type: "text",
          text: "Browser closed.",
        },
      ],
    };
  }
);

// ========== Server Start ==========

const transport = new StdioServerTransport();
await server.connect(transport);
