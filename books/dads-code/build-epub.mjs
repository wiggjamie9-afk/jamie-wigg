#!/usr/bin/env node
// Build a valid EPUB 3 from manuscript.md.
// Each top-level "# Heading" becomes a chapter. Usage: node build-epub.mjs
// Writes the unzipped tree to ./build/ ; zip it with the sibling step in the README.

import { readFileSync, writeFileSync, mkdirSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = join(HERE, "build");

const META = {
  title: "Dad's Code",
  subtitle: "The Frequency of Being Real — A Memoir of Fatherhood, ADHD & Growing Up",
  author: "Jamie Wigg",
  language: "en",
  identifier: "urn:uuid:b1f2c3d4-dadc-0de0-2026-jamiewiggmemo",
  date: "2026-06-29",
};

const esc = (s) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// --- parse manuscript ---
const md = readFileSync(join(HERE, "manuscript.md"), "utf8");
const lines = md.split("\n");
const sections = [];
let cur = null;
for (const line of lines) {
  const m = line.match(/^#\s+(.*)$/);
  if (m) {
    cur = { title: m[1].trim(), body: [] };
    sections.push(cur);
  } else if (cur) {
    cur.body.push(line);
  }
}

// --- body markdown -> xhtml (paragraphs + bullet lists) ---
function bodyToHtml(bodyLines) {
  const text = bodyLines.join("\n").trim();
  const blocks = text.split(/\n\s*\n/);
  const out = [];
  for (const block of blocks) {
    const b = block.trim();
    if (!b) continue;
    const rows = b.split("\n");
    if (rows.every((r) => r.trim().startsWith("- "))) {
      out.push(
        "<ul>" +
          rows.map((r) => `<li>${esc(r.trim().slice(2))}</li>`).join("") +
          "</ul>"
      );
    } else {
      out.push(`<p>${esc(b.replace(/\n/g, " "))}</p>`);
    }
  }
  return out.join("\n");
}

function chapterXhtml(title, htmlBody) {
  return `<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" lang="${META.language}">
<head><meta charset="utf-8"/><title>${esc(title)}</title><link rel="stylesheet" type="text/css" href="style.css"/></head>
<body><section epub:type="chapter"><h1>${esc(title)}</h1>
${htmlBody}
</section></body></html>`;
}

// --- assemble files ---
rmSync(OUT, { recursive: true, force: true });
const write = (rel, content) => {
  const p = join(OUT, rel);
  mkdirSync(dirname(p), { recursive: true });
  writeFileSync(p, content);
};

write("mimetype", "application/epub+zip");

write(
  "META-INF/container.xml",
  `<?xml version="1.0" encoding="utf-8"?>
<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
  <rootfiles><rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/></rootfiles>
</container>`
);

write(
  "OEBPS/style.css",
  `body{font-family:Georgia,'Times New Roman',serif;line-height:1.6;margin:5% 7%;color:#1a1a1a;}
h1{font-size:1.5em;line-height:1.25;margin:0 0 1em;text-align:left;}
p{margin:0 0 1em;text-align:justify;text-indent:1.2em;}
p:first-of-type{text-indent:0;}
ul{margin:0 0 1em 1.2em;} li{margin:0 0 .4em;}
.title-page{text-align:center;margin-top:25%;}
.title-page h1{font-size:2.4em;text-align:center;margin:.2em 0;}
.title-page .sub{font-size:1.05em;font-style:italic;color:#444;margin:.6em 2em 2em;}
.title-page .author{font-size:1.2em;margin-top:2em;}`
);

write(
  "OEBPS/titlepage.xhtml",
  `<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" lang="${META.language}">
<head><meta charset="utf-8"/><title>${esc(META.title)}</title><link rel="stylesheet" type="text/css" href="style.css"/></head>
<body><div class="title-page"><h1>${esc(META.title)}</h1><p class="sub">${esc(META.subtitle)}</p><p class="author">${esc(META.author)}</p></div></body></html>`
);

const chapFiles = sections.map((s, i) => {
  const id = `chap${String(i + 1).padStart(2, "0")}`;
  write(`OEBPS/${id}.xhtml`, chapterXhtml(s.title, bodyToHtml(s.body)));
  return { id, file: `${id}.xhtml`, title: s.title };
});

// nav (EPUB 3)
write(
  "OEBPS/nav.xhtml",
  `<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" lang="${META.language}">
<head><meta charset="utf-8"/><title>Contents</title></head>
<body><nav epub:type="toc" id="toc"><h1>Contents</h1><ol>
${chapFiles.map((c) => `<li><a href="${c.file}">${esc(c.title)}</a></li>`).join("\n")}
</ol></nav></body></html>`
);

// ncx (EPUB 2 fallback)
write(
  "OEBPS/toc.ncx",
  `<?xml version="1.0" encoding="utf-8"?>
<ncx xmlns="http://www.daisy.org/z3986/2005/ncx/" version="2005-1">
<head><meta name="dtb:uid" content="${META.identifier}"/></head>
<docTitle><text>${esc(META.title)}</text></docTitle>
<navMap>
${chapFiles
  .map(
    (c, i) =>
      `<navPoint id="${c.id}" playOrder="${i + 1}"><navLabel><text>${esc(
        c.title
      )}</text></navLabel><content src="${c.file}"/></navPoint>`
  )
  .join("\n")}
</navMap></ncx>`
);

write(
  "OEBPS/content.opf",
  `<?xml version="1.0" encoding="utf-8"?>
<package xmlns="http://www.idpf.org/2007/opf" version="3.0" unique-identifier="bookid">
  <metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
    <dc:identifier id="bookid">${META.identifier}</dc:identifier>
    <dc:title>${esc(META.title)}: ${esc(META.subtitle)}</dc:title>
    <dc:creator>${esc(META.author)}</dc:creator>
    <dc:language>${META.language}</dc:language>
    <dc:date>${META.date}</dc:date>
    <meta property="dcterms:modified">${META.date}T00:00:00Z</meta>
  </metadata>
  <manifest>
    <item id="nav" href="nav.xhtml" media-type="application/xhtml+xml" properties="nav"/>
    <item id="ncx" href="toc.ncx" media-type="application/x-dtbncx+xml"/>
    <item id="css" href="style.css" media-type="text/css"/>
    <item id="title" href="titlepage.xhtml" media-type="application/xhtml+xml"/>
${chapFiles.map((c) => `    <item id="${c.id}" href="${c.file}" media-type="application/xhtml+xml"/>`).join("\n")}
  </manifest>
  <spine toc="ncx">
    <itemref idref="title"/>
${chapFiles.map((c) => `    <itemref idref="${c.id}"/>`).join("\n")}
  </spine>
</package>`
);

console.log(`Built ${chapFiles.length} chapters into ${OUT}`);
chapFiles.forEach((c) => console.log(`  - ${c.title}`));
