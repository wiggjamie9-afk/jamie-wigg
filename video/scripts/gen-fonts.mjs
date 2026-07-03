// Regenerates src/fonts.css by base64-inlining the brand woff2 faces from the
// @fontsource packages into @font-face rules. Data URIs load instantly offline
// (no file serving, no @remotion/fonts / delayRender needed). Every scene fades
// in from opacity 0, so there is no flash-of-unstyled-text to worry about.
// Run from the video/ dir: `node scripts/gen-fonts.mjs`.
import { readFileSync, writeFileSync } from "node:fs";

const FACES = [
  {
    family: "Space Grotesk",
    weight: 700,
    file: "node_modules/@fontsource/space-grotesk/files/space-grotesk-latin-700-normal.woff2",
  },
  {
    family: "JetBrains Mono",
    weight: 500,
    file: "node_modules/@fontsource/jetbrains-mono/files/jetbrains-mono-latin-500-normal.woff2",
  },
];

const rules = FACES.map((f) => {
  const b64 = readFileSync(f.file).toString("base64");
  return (
    `@font-face {\n` +
    `  font-family: "${f.family}";\n` +
    `  font-style: normal;\n` +
    `  font-weight: ${f.weight};\n` +
    `  font-display: block;\n` +
    `  src: url(data:font/woff2;base64,${b64}) format("woff2");\n` +
    `}\n`
  );
}).join("\n");

const header =
  "/* AUTO-GENERATED — do not edit by hand. Regenerate: node scripts/gen-fonts.mjs */\n" +
  "/* Brand faces inlined as base64 woff2 so they load instantly offline. */\n\n";

writeFileSync("src/fonts.css", header + rules);
console.log("wrote src/fonts.css");
