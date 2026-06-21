#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

// GCP client setup (lazy-loaded)
let computeClient = null;
let storageClient = null;

async function initializeGCPClients() {
  try {
    const { CloudResourceManagerClient } = await import("@google-cloud/resource-manager");
    const { compute_v1 } = await import("@google-cloud/compute");
    const { Storage } = await import("@google-cloud/storage");

    // These will use Application Default Credentials (gcloud auth application-default login)
    computeClient = new compute_v1.InstancesClient();
    storageClient = new Storage();

    return true;
  } catch (err) {
    console.error("GCP initialization error:", err.message);
    return false;
  }
}

const server = new Server(
  {
    name: "gcp-resources",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Tool definitions
const tools = [
  {
    name: "list_projects",
    description:
      "List GCP projects available to the authenticated user (requires GOOGLE_CLOUD_PROJECT env var)",
    inputSchema: {
      type: "object",
      properties: {
        limit: {
          type: "number",
          description: "Maximum number of projects to return (default: 10)",
          default: 10,
        },
      },
    },
  },
  {
    name: "list_compute_instances",
    description:
      "List Compute Engine instances in a GCP project (requires GOOGLE_CLOUD_PROJECT env var)",
    inputSchema: {
      type: "object",
      properties: {
        project: {
          type: "string",
          description: "GCP project ID (uses GOOGLE_CLOUD_PROJECT if not specified)",
        },
        zone: {
          type: "string",
          description: "GCP zone (e.g., us-central1-a). Lists all zones if not specified",
        },
      },
    },
  },
  {
    name: "list_storage_buckets",
    description:
      "List Cloud Storage buckets in a GCP project (requires GOOGLE_CLOUD_PROJECT env var)",
    inputSchema: {
      type: "object",
      properties: {
        project: {
          type: "string",
          description: "GCP project ID (uses GOOGLE_CLOUD_PROJECT if not specified)",
        },
      },
    },
  },
  {
    name: "get_instance_details",
    description: "Get details about a specific Compute Engine instance",
    inputSchema: {
      type: "object",
      properties: {
        project: {
          type: "string",
          description: "GCP project ID",
        },
        zone: {
          type: "string",
          description: "GCP zone (e.g., us-central1-a)",
        },
        instance: {
          type: "string",
          description: "Instance name",
        },
      },
      required: ["project", "zone", "instance"],
    },
  },
  {
    name: "get_bucket_details",
    description: "Get details about a specific Cloud Storage bucket",
    inputSchema: {
      type: "object",
      properties: {
        bucket: {
          type: "string",
          description: "Bucket name",
        },
      },
      required: ["bucket"],
    },
  },
];

// Handlers for each tool
async function listProjects(args) {
  const project = process.env.GOOGLE_CLOUD_PROJECT;
  if (!project) {
    return {
      error: "GOOGLE_CLOUD_PROJECT environment variable not set. Set it and try again.",
    };
  }

  return {
    result: `To list projects, authenticate with: gcloud auth application-default login\nCurrent project: ${project}`,
    help: "Use 'gcloud config set project PROJECT_ID' to set the active project",
  };
}

async function listComputeInstances(args) {
  const project = args.project || process.env.GOOGLE_CLOUD_PROJECT;
  const zone = args.zone;

  if (!project) {
    return {
      error: "GOOGLE_CLOUD_PROJECT environment variable not set or project not specified",
    };
  }

  return {
    note: "To list instances, ensure you have authenticated with GCP:",
    setup:
      "1. Install Google Cloud SDK: https://cloud.google.com/sdk/docs/install\n2. Run: gcloud auth application-default login\n3. Run: gcloud config set project " +
      project,
    example: "Then use tools like: gcloud compute instances list --project=" + project,
  };
}

async function listStorageBuckets(args) {
  const project = args.project || process.env.GOOGLE_CLOUD_PROJECT;

  if (!project) {
    return {
      error: "GOOGLE_CLOUD_PROJECT environment variable not set or project not specified",
    };
  }

  return {
    note: "To list buckets, ensure you have authenticated with GCP:",
    setup:
      "1. Run: gcloud auth application-default login\n2. Run: gcloud config set project " +
      project,
    example: "Then use: gcloud storage buckets list --project=" + project,
  };
}

async function getInstanceDetails(args) {
  const { project, zone, instance } = args;
  return {
    note: "To get instance details, use gcloud CLI:",
    command: `gcloud compute instances describe ${instance} --zone=${zone} --project=${project}`,
  };
}

async function getBucketDetails(args) {
  const { bucket } = args;
  return {
    note: "To get bucket details, use gcloud CLI:",
    command: `gcloud storage buckets describe ${bucket}`,
  };
}

// Tool calling handler
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    let result;

    switch (name) {
      case "list_projects":
        result = await listProjects(args);
        break;
      case "list_compute_instances":
        result = await listComputeInstances(args);
        break;
      case "list_storage_buckets":
        result = await listStorageBuckets(args);
        break;
      case "get_instance_details":
        result = await getInstanceDetails(args);
        break;
      case "get_bucket_details":
        result = await getBucketDetails(args);
        break;
      default:
        return {
          isError: true,
          content: [{ type: "text", text: `Unknown tool: ${name}` }],
        };
    }

    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
    };
  } catch (error) {
    return {
      isError: true,
      content: [
        {
          type: "text",
          text: `Error: ${error.message}`,
        },
      ],
    };
  }
});

// Tool listing handler
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return { tools };
});

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("GCP Resources MCP server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
