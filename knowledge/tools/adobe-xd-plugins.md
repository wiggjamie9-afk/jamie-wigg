# Adobe XD Plugin Samples: Plugin Development Reference

Repository of 60+ sample plugins demonstrating how to build plugins for Adobe XD. Covers UI creation, scenegraph manipulation, file I/O, network requests, commands, and panel plugins. Starter reference for extending Adobe XD with custom functionality.

GitHub: `AdobeXD/plugin-samples` · Tutorials: `adobexdplatform.com/plugin-docs/tutorials/` · Minimum XD Version: 13.0+

## Why It's Relevant Here

Two angles:

1. **Design tool extension** — If RHYTHMIX design work happens in Adobe XD (in addition to/instead of Figma), XD plugins enable custom workflows (e.g., batch export to HyperFrames, color system sync, text styling automation).

2. **Plugin development reference** — XD plugin architecture (UI layer, scenegraph API, file I/O, commands) mirrors patterns in other design tools. Sample code and tutorials are valuable for understanding extensibility.

## Plugin Architecture

### Three Plugin Types

| Type | Use Case | Example |
|---|---|---|
| **Dialog plugins** | One-off action, modal dialog | Import data, generate chart, color palette |
| **Panel plugins** (v21+) | Persistent sidebar UI, real-time updates | Design tokens, asset browser, properties panel |
| **Command plugins** | Headless operation, menu item | Batch rename, layout alignment, export renditions |

### Core APIs

| API | Purpose | Examples |
|---|---|---|
| **UI** | Dialog/panel creation (HTML, React, Vue, h-function) | Forms, buttons, inputs, menus |
| **Scenegraph** | Artboard/layer manipulation | Create/modify shapes, text, images, groups |
| **ScenenodeList** | Filter, select, batch operations | Select by type, apply styling |
| **Commands** | Built-in XD operations | Align, distribute, group, export |
| **File I/O** | Read/write files, export renditions | Import CSV, generate PNG, save metadata |
| **Network I/O** | Fetch API, XHR, OAuth | API calls, Adobe Stock integration |
| **Application** | App context (language, version) | Localization, conditional features |

## Sample Plugins (Selection)

### Quickstart / Hello World

| Sample | APIs | Purpose |
|---|---|---|
| `quick-start` | Scenegraph | Create rectangle, insert into artboard |
| `quick-start-panel` | Scenegraph | Panel: increase rect size by input |
| `quick-start-react` | Scenegraph + React | Rectangle creation (React version) |
| `ui-hello` | UI | Simple "Hello World" dialog |
| `ui-hello-react` | UI + React | "Hello World" in React |
| `ui-hello-vue` | UI + Vue | "Hello World" in Vue |

### UI & Dialogs

| Sample | APIs | Purpose |
|---|---|---|
| `ui-hello-h` | UI (h-function) | Dialog using h() for JSX-like syntax |
| `ui-simple-form` | UI | Form with input, textarea, select, button |
| `ui-button-padding` | UI (h-function) | Simple form with label, input, footer |
| `ui-buttons-galore` | UI (querySelector) | Various button types via DOM |
| `ui-dialog-variations` | UI | Different dialog layouts |
| `ui-playground` | UI | All UI controls showcase |
| `ui-context-menu` | UI | Context menu (h-function) |
| `ui-tabs-react` | UI + React | Tabbed interface in React |

### Panel Plugins (v21+)

| Sample | APIs | Purpose |
|---|---|---|
| `ui-panel-scaffold` | UI | Panel structure template |
| `ui-panel-button-padding` | UI | Padding buttons, real-time updates |
| `ui-panel-hello-react` | UI + React | React panel, live color editing |
| `ui-panel-show-renditions` | UI + File I/O | Display export renditions in panel |
| `ui-panel-simple-drag-and-drop` | UI + Scenegraph | Drag/drop to canvas (v26+) |
| `ui-panel-typography-react` | UI + React | Typography showcase in panel |

### Scenegraph & Drawing

| Sample | APIs | Purpose |
|---|---|---|
| `how-to-create-path-objects` | Scenegraph | Shape creation via path objects |
| `how-to-draw-lines` | Scenegraph | Line object creation |
| `how-to-style-text` | Scenegraph | Styled text nodes |
| `sg-lots-of-lines` | Scenegraph | Draw multiple lines |
| `sg-repeater` | Scenegraph, Commands | Duplicate selection (circular/horizontal) |
| `sg-chart-generator` | Scenegraph, Commands | Generate pie charts, bar charts |
| `sg-meme-me` | Scenegraph, Commands | Text + image → meme |
| `sg-turtle` | Scenegraph | Turtle graphics renderer |

### File I/O & Network

| Sample | APIs | Purpose |
|---|---|---|
| `how-to-import` | File I/O, Scenegraph | Import .txt file |
| `how-to-generate-an-export-rendition` | File I/O, Application | Export object as PNG/PDF |
| `how-to-make-network-requests` | Network I/O (Fetch, XHR) | API calls with error handling |
| `how-to-integrate-with-OAuth` | Network I/O, XHR | Third-party OAuth flow |
| `e2e-adobe-stock` | UI, Network I/O | Adobe Stock photo search |
| `e2e-stock-chart` | UI, File I/O, Network I/O | Stock quote → chart drawing |
| `sg-update-weather` | Scenegraph, Network I/O | Update text elements with temps |

### End-to-End Examples

| Sample | APIs | Purpose |
|---|---|---|
| `e2e-colorize-text` | UI, Scenegraph, ScenenodeList | Text color utilities |
| `e2e-create-polygon` | UI, Scenegraph, ScenenodeList | Custom polygon creator |
| `e2e-customize-banner` | UI, Scenegraph | Sized banner generator |
| `i18n-pojo` | UI, Application | Localization example |

## Quick Start: Setup & Running

### Development Environment

1. **Clone the repo** to XD's plugin directory:

**macOS**:
```bash
cd ~/Library/Application\ Support/Adobe/Adobe\ XD/
mv plugins oldplugins  # backup existing
git clone git@github.com:AdobeXD/plugin-samples.git develop
```

**Windows**:
```
C:\Users\%USERNAME%\AppData\Local\Packages\Adobe.CC.XD_adky2gkssdxte\LocalState\
Rename "plugins" to "oldplugins" (via Windows Explorer)
Clone repository as "develop"
```

2. **Launch XD** (or reload with `COMMAND+SHIFT+R` / `CTRL+SHIFT+R`)

3. **Access plugins** from Plugins menu → Samples

### Running a Sample

1. Open Adobe XD
2. Plugins → Samples → [Sample Name]
3. Follow plugin dialog/panel instructions
4. Check README in each sample folder for details

### Development Workflow

1. **Edit plugin code** (JavaScript, React, Vue)
2. **Reload plugins** (`COMMAND+SHIFT+R` / `CTRL+SHIFT+R`)
3. **Test in XD** (no restart needed)
4. **Debug** via browser console or logs

## Creating Your Own Plugin

### Minimal Plugin (JavaScript)

```javascript
// main.js
const { Rectangle, Color } = require("scenegraph");
const { dialog } = require("application");

async function createRect() {
  const rectangle = new Rectangle();
  rectangle.width = 100;
  rectangle.height = 100;
  rectangle.fill = new Color("#FF0000");
  
  selection.insertionParent.addChild(rectangle);
  rectangle.moveTo({ x: 100, y: 100 });
  
  dialog.alert("Rectangle created!");
}

module.exports = {
  commands: {
    createRect: createRect
  }
};
```

### Plugin Manifest (manifest.json)

```json
{
  "id": "com.example.myplugin",
  "name": "My Plugin",
  "version": "1.0.0",
  "minVersion": "21.0",
  "main": "main.js",
  "requiredPermissions": [],
  "uiModes": ["design"],
  "documentAccess": "all"
}
```

### With React UI

```jsx
// ui.jsx (in panel plugin)
import React, { useState } from "react";

export function MyPanel() {
  const [value, setValue] = useState("");

  const handleClick = () => {
    window.postMessage({ type: "command", payload: value });
  };

  return (
    <div>
      <h2>My Panel</h2>
      <input value={value} onChange={(e) => setValue(e.target.value)} />
      <button onClick={handleClick}>Apply</button>
    </div>
  );
}
```

## Best Practices

| Practice | Explanation |
|---|---|
| **Read sample READMEs** | Each sample has documentation and code comments |
| **Check minimum version** | Features vary by XD version; test compatibility |
| **Use scenegraph safely** | Batch operations where possible; minimize DOM traversals |
| **Handle user cancellation** | Dialogs can return `null`; check before operating |
| **Localize strings** | Use `application.appLanguage` for i18n |
| **Test on real artboards** | Plugins work on selection context; test with actual layers |
| **Export renditions carefully** | File I/O is async; use try/catch, handle permissions |

## Fit & Caveats

- **XD only** — These plugins run only in Adobe XD, not Illustrator/Photoshop (different plugin APIs)
- **Synchronous scenegraph** — Most XD plugin operations are synchronous; async limited to file/network I/O
- **Selection-based** — Many operations depend on user selection; handle empty selection
- **Panel plugin v21+** — Persistent panels require XD 21 or later (older versions dialog-only)
- **Limited background tasks** — Plugins don't run in background; they're tied to user interactions

## Ecosystem Integration Patterns

### Pattern 1: XD → HyperFrames Export

Create an XD plugin that exports artboard as HyperFrames composition:

```javascript
// Export XD artboard properties
const artboard = selection.items[0];
const rendition = await exportRendition(artboard, "png");

// Generate HyperFrames HTML with same dimensions/colors
const hyperframesCode = generateHyperFramesHTML({
  width: artboard.width,
  height: artboard.height,
  backgroundColor: artboard.fill.color,
  elements: artboard.children.map(child => ({
    type: child.type,
    props: extractProps(child)
  }))
});

// Save as index.html in rhythmix-* folder
```

### Pattern 2: Design Token Sync

XD plugin reads design tokens (colors, fonts, spacing) and writes to code:

```javascript
// Extract all color groups from XD
const colors = selection.items.filter(item => item.name.startsWith("color-"));

// Generate design-tokens.ts
const tokens = generateTokenFile(colors);
saveFile("design-tokens.ts", tokens);
```

### Pattern 3: Batch Naming & Organization

Plugin renames layers, groups, artboards based on naming convention:

```javascript
// Rename selected layers for HyperFrames composition
// Rename with scenegraph paths: "scene.background", "scene.foreground"
const layers = selection.items;
layers.forEach((layer, i) => {
  layer.name = `layer_${i}`;
});
```

## References

- **Official Tutorials**: https://adobexdplatform.com/plugin-docs/tutorials/
- **Plugin Reference**: https://adobexdplatform.com/plugin-docs/reference/
- **Sample Repository**: https://github.com/AdobeXD/plugin-samples
- **Plugin Marketplace**: https://www.adobe.com/products/xd/plugins
- **XD Developer Console**: Built into XD (Plugins > Development > Show Console)

---

**Use Case for Ecosystem:** Reference library of 60+ Adobe XD plugin samples for extending XD with custom workflows. Covers UI creation (dialogs, panels), scenegraph manipulation, file I/O, network requests, and commands. Useful if design work happens in XD (in addition to Figma). Sample code and tutorials demonstrate plugin architecture patterns. Potential integrations: XD artboard → HyperFrames export, design token sync to code, batch layer organization for composition generation.
