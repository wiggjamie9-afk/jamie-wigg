// build:web — in the upstream fork this compiles the Preact app from crates/web/ui.
// This minimal reimplementation ships a self-contained web/ UI with no build step,
// so this script just verifies the asset exists (keeping the documented command working).
import { access } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const entry = join(root, "web", "index.html");

try {
  await access(entry);
  console.log("build:web ✓ web/index.html present (no compile step in this build)");
} catch {
  console.error("build:web ✗ web/index.html missing");
  process.exit(1);
}
