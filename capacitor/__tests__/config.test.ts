/**
 * Tests for the Capacitor wrapper configuration files added in this PR:
 *   - capacitor.config.ts     (CapacitorConfig export)
 *   - appflow.config.json     (Appflow CI/CD config)
 *   - ionic.config.json       (Ionic project config)
 *   - package.json            (npm package manifest)
 *   - .gitignore              (ignore patterns)
 *
 * These are structural/schema tests that assert the configs export the
 * expected shape and values so that accidental mis-edits (wrong bundle
 * ID, missing scripts, wrong dependency versions, etc.) are caught early.
 */

import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

// Root of the capacitor/ package (one level up from __tests__/)
const ROOT = resolve(__dirname, "..");

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function readJson(relativePath: string): Record<string, unknown> {
  const raw = readFileSync(resolve(ROOT, relativePath), "utf8");
  return JSON.parse(raw) as Record<string, unknown>;
}

function readText(relativePath: string): string {
  return readFileSync(resolve(ROOT, relativePath), "utf8");
}

// ---------------------------------------------------------------------------
// capacitor.config.ts
// ---------------------------------------------------------------------------

describe("capacitor.config.ts", () => {
  // Dynamic-import the compiled config. Vitest transpiles TypeScript on the
  // fly via esbuild, so the `import type` from @capacitor/cli is erased and
  // the module resolves without the CLI package being present at runtime.
  async function loadConfig() {
    const mod = await import("../capacitor.config");
    return mod.default as {
      appId: string;
      appName: string;
      webDir: string;
      ios?: Record<string, unknown>;
      server?: Record<string, unknown>;
    };
  }

  it("exports a default object", async () => {
    const config = await loadConfig();
    expect(config).toBeDefined();
    expect(typeof config).toBe("object");
  });

  it('sets appId to the correct reverse-DNS bundle identifier "com.rhythmix.studio"', async () => {
    const config = await loadConfig();
    expect(config.appId).toBe("com.rhythmix.studio");
  });

  it('sets appName to "RHYTHMIX Studio"', async () => {
    const config = await loadConfig();
    expect(config.appName).toBe("RHYTHMIX Studio");
  });

  it('sets webDir to "www"', async () => {
    const config = await loadConfig();
    expect(config.webDir).toBe("www");
  });

  it("includes an ios configuration block", async () => {
    const config = await loadConfig();
    expect(config.ios).toBeDefined();
    expect(typeof config.ios).toBe("object");
  });

  it('sets ios.contentInset to "always"', async () => {
    const config = await loadConfig();
    expect(config.ios?.contentInset).toBe("always");
  });

  it("disables limitsNavigationsToAppBoundDomains (required for IndexedDB Blob + drag-drop)", async () => {
    const config = await loadConfig();
    expect(config.ios?.limitsNavigationsToAppBoundDomains).toBe(false);
  });

  it("disables allowsLinkPreview on iOS", async () => {
    const config = await loadConfig();
    expect(config.ios?.allowsLinkPreview).toBe(false);
  });

  it("includes a server configuration block", async () => {
    const config = await loadConfig();
    expect(config.server).toBeDefined();
    expect(typeof config.server).toBe("object");
  });

  it('sets server.androidScheme to "https"', async () => {
    const config = await loadConfig();
    expect(config.server?.androidScheme).toBe("https");
  });

  it('sets server.iosScheme to "https"', async () => {
    const config = await loadConfig();
    expect(config.server?.iosScheme).toBe("https");
  });

  it("does NOT set server.url (production build must use bundled www/)", async () => {
    const config = await loadConfig();
    // server.url is intentionally commented-out for production. If someone
    // accidentally uncomments it, this test catches the regression.
    expect((config.server as Record<string, unknown> | undefined)?.url).toBeUndefined();
  });

  it("appId follows reverse-DNS naming convention", async () => {
    const config = await loadConfig();
    // Must be at least three dot-separated segments.
    expect(config.appId).toMatch(/^[a-z][a-z0-9]*(?:\.[a-z][a-z0-9]*){2,}$/i);
  });
});

// ---------------------------------------------------------------------------
// appflow.config.json
// ---------------------------------------------------------------------------

describe("appflow.config.json", () => {
  function load() {
    return readJson("appflow.config.json");
  }

  it("is valid JSON", () => {
    expect(() => load()).not.toThrow();
  });

  it("has a $schema field", () => {
    const config = load();
    expect(typeof config.$schema).toBe("string");
    expect((config.$schema as string).length).toBeGreaterThan(0);
  });

  it("has an apps array", () => {
    const config = load();
    expect(Array.isArray(config.apps)).toBe(true);
  });

  it("has exactly one app entry", () => {
    const config = load();
    expect((config.apps as unknown[]).length).toBe(1);
  });

  it("app entry has an appId field", () => {
    const config = load();
    const app = (config.apps as Record<string, unknown>[])[0];
    expect(typeof app.appId).toBe("string");
  });

  it('app entry has root set to "."', () => {
    const config = load();
    const app = (config.apps as Record<string, unknown>[])[0];
    expect(app.root).toBe(".");
  });

  it("app entry has dependencyInstallCommand using pnpm", () => {
    const config = load();
    const app = (config.apps as Record<string, unknown>[])[0];
    expect(typeof app.dependencyInstallCommand).toBe("string");
    expect(app.dependencyInstallCommand as string).toContain("pnpm");
  });

  it('app entry dependencyInstallCommand uses "--no-frozen-lockfile" for CI flexibility', () => {
    const config = load();
    const app = (config.apps as Record<string, unknown>[])[0];
    expect(app.dependencyInstallCommand as string).toContain("--no-frozen-lockfile");
  });

  it("app entry has webBuildCommand", () => {
    const config = load();
    const app = (config.apps as Record<string, unknown>[])[0];
    expect(typeof app.webBuildCommand).toBe("string");
    expect((app.webBuildCommand as string).length).toBeGreaterThan(0);
  });

  it('app entry webBuildCommand runs "pnpm build"', () => {
    const config = load();
    const app = (config.apps as Record<string, unknown>[])[0];
    expect(app.webBuildCommand).toBe("pnpm build");
  });

  it("appId is still the placeholder (a reminder to replace it before first build)", () => {
    // This is intentional: the README instructs devs to replace it.
    // If this test fails it means someone replaced it — update the test
    // to assert the real Appflow ID instead.
    const config = load();
    const app = (config.apps as Record<string, unknown>[])[0];
    expect(app.appId).toBe("REPLACE_WITH_APPFLOW_APP_ID");
  });
});

// ---------------------------------------------------------------------------
// ionic.config.json
// ---------------------------------------------------------------------------

describe("ionic.config.json", () => {
  function load() {
    return readJson("ionic.config.json");
  }

  it("is valid JSON", () => {
    expect(() => load()).not.toThrow();
  });

  it('has name set to "rhythmix-studio"', () => {
    const config = load();
    expect(config.name).toBe("rhythmix-studio");
  });

  it('has type set to "custom"', () => {
    const config = load();
    expect(config.type).toBe("custom");
  });

  it("has an integrations object", () => {
    const config = load();
    expect(typeof config.integrations).toBe("object");
    expect(config.integrations).not.toBeNull();
  });

  it("integrations includes a capacitor key", () => {
    const c = load();
    const intg = c.integrations as Record<string, unknown>;
    expect("capacitor" in intg).toBe(true);
  });

  it("has an id field", () => {
    const config = load();
    expect(typeof config.id).toBe("string");
  });

  it("id is still the placeholder (a reminder to replace it before first build)", () => {
    const config = load();
    expect(config.id).toBe("REPLACE_WITH_APPFLOW_APP_ID");
  });

  it("both config files use the same placeholder id value", () => {
    const ionic = readJson("ionic.config.json");
    const appflow = readJson("appflow.config.json");
    const appflowApp = (appflow.apps as Record<string, unknown>[])[0];
    expect(ionic.id).toBe(appflowApp.appId);
  });
});

// ---------------------------------------------------------------------------
// package.json
// ---------------------------------------------------------------------------

describe("package.json", () => {
  function load() {
    return readJson("package.json");
  }

  it("is valid JSON", () => {
    expect(() => load()).not.toThrow();
  });

  it('has name "rhythmix-studio-ios"', () => {
    expect(load().name).toBe("rhythmix-studio-ios");
  });

  it("has a version field matching semver", () => {
    const { version } = load();
    expect(typeof version).toBe("string");
    expect(version as string).toMatch(/^\d+\.\d+\.\d+$/);
  });

  it("is marked private (prevents accidental npm publish)", () => {
    expect(load().private).toBe(true);
  });

  it("has a description", () => {
    const { description } = load();
    expect(typeof description).toBe("string");
    expect((description as string).length).toBeGreaterThan(0);
  });

  describe("scripts", () => {
    function scripts() {
      return load().scripts as Record<string, string>;
    }

    it('has a "build:web" script', () => {
      expect(typeof scripts()["build:web"]).toBe("string");
    });

    it('"build:web" script targets the ../studio directory', () => {
      expect(scripts()["build:web"]).toContain("../studio");
    });

    it('has a "sync:web" script', () => {
      expect(typeof scripts()["sync:web"]).toBe("string");
    });

    it('"sync:web" removes www/ before copying (clean sync)', () => {
      expect(scripts()["sync:web"]).toContain("rm -rf www");
    });

    it('"sync:web" copies studio/out to www/', () => {
      expect(scripts()["sync:web"]).toContain("../studio/out");
      expect(scripts()["sync:web"]).toContain("www");
    });

    it('"sync:web" runs cap sync after copy', () => {
      expect(scripts()["sync:web"]).toContain("cap sync");
    });

    it('has a "build" script that composes build:web and sync:web', () => {
      const build = scripts()["build"];
      expect(typeof build).toBe("string");
      expect(build).toContain("build:web");
      expect(build).toContain("sync:web");
    });

    it('has an "open:ios" script', () => {
      expect(typeof scripts()["open:ios"]).toBe("string");
    });

    it('"open:ios" opens Capacitor iOS project', () => {
      expect(scripts()["open:ios"]).toContain("cap open ios");
    });

    it('has an "add:ios" script', () => {
      expect(typeof scripts()["add:ios"]).toBe("string");
    });

    it('"add:ios" adds the iOS platform via Capacitor', () => {
      expect(scripts()["add:ios"]).toContain("cap add ios");
    });
  });

  describe("dependencies", () => {
    function deps() {
      return load().dependencies as Record<string, string>;
    }

    it("includes @capacitor/core", () => {
      expect(typeof deps()["@capacitor/core"]).toBe("string");
    });

    it("@capacitor/core targets v7", () => {
      expect(deps()["@capacitor/core"]).toMatch(/^\^?7\./);
    });

    it("includes @capacitor/ios", () => {
      expect(typeof deps()["@capacitor/ios"]).toBe("string");
    });

    it("@capacitor/ios targets v7", () => {
      expect(deps()["@capacitor/ios"]).toMatch(/^\^?7\./);
    });

    it("@capacitor/core and @capacitor/ios share the same major version (consistency)", () => {
      const core = deps()["@capacitor/core"];
      const ios = deps()["@capacitor/ios"];
      const majorOf = (v: string) => v.replace(/^\^|~/, "").split(".")[0];
      expect(majorOf(core)).toBe(majorOf(ios));
    });
  });

  describe("devDependencies", () => {
    function devDeps() {
      return load().devDependencies as Record<string, string>;
    }

    it("includes @capacitor/cli", () => {
      expect(typeof devDeps()["@capacitor/cli"]).toBe("string");
    });

    it("@capacitor/cli targets v7 (aligned with runtime packages)", () => {
      expect(devDeps()["@capacitor/cli"]).toMatch(/^\^?7\./);
    });

    it("includes @ionic/cli", () => {
      expect(typeof devDeps()["@ionic/cli"]).toBe("string");
    });

    it("@ionic/cli is at least v7", () => {
      const ver = devDeps()["@ionic/cli"].replace(/^\^|~/, "");
      expect(parseInt(ver.split(".")[0], 10)).toBeGreaterThanOrEqual(7);
    });

    it("includes typescript", () => {
      expect(typeof devDeps()["typescript"]).toBe("string");
    });

    it("typescript is v5 or later", () => {
      const ver = devDeps()["typescript"].replace(/^\^|~/, "");
      expect(parseInt(ver.split(".")[0], 10)).toBeGreaterThanOrEqual(5);
    });
  });
});

// ---------------------------------------------------------------------------
// .gitignore
// ---------------------------------------------------------------------------

describe(".gitignore", () => {
  function load() {
    return readText(".gitignore");
  }

  it("is non-empty", () => {
    expect(load().trim().length).toBeGreaterThan(0);
  });

  it("ignores node_modules/", () => {
    expect(load()).toContain("node_modules/");
  });

  it("ignores www/ (the generated static-export copy)", () => {
    expect(load()).toContain("www/");
  });

  it("ignores ios/App/Pods/ (CocoaPods build artifacts)", () => {
    expect(load()).toContain("ios/App/Pods/");
  });

  it("ignores ios/App/build/", () => {
    expect(load()).toContain("ios/App/build/");
  });

  it("ignores ios/App/DerivedData/", () => {
    expect(load()).toContain("ios/App/DerivedData/");
  });

  it("ignores ios/.DS_Store (macOS metadata)", () => {
    expect(load()).toContain("ios/.DS_Store");
  });

  it("ignores ios/App/output/", () => {
    expect(load()).toContain("ios/App/output/");
  });

  it("ignores android/app/build/ (future Android support)", () => {
    expect(load()).toContain("android/app/build/");
  });

  it("ignores android/build/", () => {
    expect(load()).toContain("android/build/");
  });

  it("ignores android/.gradle/", () => {
    expect(load()).toContain("android/.gradle/");
  });

  it("ignores android/local.properties (machine-specific SDK paths)", () => {
    expect(load()).toContain("android/local.properties");
  });

  it("ignores .appflow/ (Appflow CLI cache)", () => {
    expect(load()).toContain(".appflow/");
  });

  it("does NOT ignore capacitor.config.ts (must be committed)", () => {
    // The config file is intentional source — it must not be ignored.
    const lines = load()
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => !l.startsWith("#") && l.length > 0);
    const ignoresConfigTs = lines.some(
      (l) => l === "capacitor.config.ts" || l === "*.ts" || l === "*.config.ts",
    );
    expect(ignoresConfigTs).toBe(false);
  });

  it("does NOT ignore package.json (must be committed)", () => {
    const lines = load()
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => !l.startsWith("#") && l.length > 0);
    const ignoresPkg = lines.some((l) => l === "package.json" || l === "*.json");
    expect(ignoresPkg).toBe(false);
  });

  it("does NOT ignore appflow.config.json (must be committed)", () => {
    const content = load();
    // The file should not have a blanket *.json or appflow.config.json ignore.
    const lines = content
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => !l.startsWith("#") && l.length > 0);
    const ignoresAppflow = lines.some(
      (l) => l === "appflow.config.json" || l === "*.json",
    );
    expect(ignoresAppflow).toBe(false);
  });

  it("contains entries for all four major categories (node, www, ios, android)", () => {
    const content = load();
    expect(content).toContain("node_modules");
    expect(content).toContain("www");
    expect(content).toContain("ios/");
    expect(content).toContain("android/");
  });
});