# RHYTHMIX PageAgent Copilot

A drop-in **in-page GUI agent** for RHYTHMIX web properties, built on
[PageAgent](https://github.com/PageAgent/page-agent) (MIT) — a text-based,
DOM-driven agent that controls a web interface with natural language. No browser
extension, no headless browser, no screenshots: everything runs as in-page
JavaScript, client-side.

> PageAgent builds on [browser-use](https://github.com/browser-use/browser-use).
> It is designed for **client-side web enhancement**, not server-side automation.

## Files

| File | What it is |
|---|---|
| `pageagent-copilot.js` | Reusable loader. Injects PageAgent and exposes `window.rhythmixCopilot`. |
| `../pageagent.html` | Branded standalone demo page (lives at site root → `rhythmixapp.com.au/pageagent.html`). |

## Quick start (free demo LLM — evaluation only)

Add one line to any page:

```html
<script src="/pageagent/pageagent-copilot.js" defer></script>
```

This loads the PageAgent **demo bundle**, which ships its own free testing LLM.
It's flagged *for technical evaluation only* — do not ship it as a production
feature.

## Production (bring your own LLM)

Set `window.PAGEAGENT_CONFIG` **before** the loader, pointing at any
OpenAI-compatible endpoint with your own key:

```html
<script>
  window.PAGEAGENT_CONFIG = {
    model:    'qwen3.5-plus',
    baseURL:  'https://dashscope.aliyuncs.com/compatible-mode/v1',
    apiKey:   'YOUR_API_KEY',   // inject at deploy time — never commit a real key
    language: 'en-US',
  };
</script>
<script src="/pageagent/pageagent-copilot.js" defer></script>
```

When a `model` + `baseURL` + `apiKey` are all present, the loader switches to the
production bundle (`page-agent.js`) and instantiates the agent with your config.
Otherwise it falls back to the demo bundle.

> **Key handling:** these pages are static and served from a public repo
> (GitHub Pages). Do **not** hardcode a real API key here. Inject it at deploy
> time, proxy through a Worker (see `studio/workers/replicate-proxy/` for the
> pattern), or keep the copilot demo-only on public pages.

### Config via data attributes

Everything in `PAGEAGENT_CONFIG` can also be set on the script tag:

```html
<script src="/pageagent/pageagent-copilot.js"
        data-model="qwen3.5-plus"
        data-base-url="https://dashscope.aliyuncs.com/compatible-mode/v1"
        data-api-key="..."
        data-language="en-US"
        data-version="1.10.0" defer></script>
```

`window.PAGEAGENT_CONFIG` wins over data attributes when both are set.

## Programmatic API

After the script loads, `window.rhythmixCopilot` is available:

```js
// Run a natural-language task against the current page
window.rhythmixCopilot.run('Set the email to fan@rhythmix.app and pick a 30s portrait cut');

// Await the underlying PageAgent instance (null if the CDN was unreachable)
window.rhythmixCopilot.ready.then(agent => {
  if (agent) agent.execute('Click the request a cut button');
});
```

| Member | Type | Notes |
|---|---|---|
| `rhythmixCopilot.run(task)` | `(string) => Promise` | Resolves when the agent finishes; rejects if no agent is available. |
| `rhythmixCopilot.ready` | `Promise<PageAgent\|null>` | Resolves once the bundle loads (or `null` on failure). |
| `rhythmixCopilot.agent` | `PageAgent\|null` | The live instance after `ready` resolves. |
| `rhythmixCopilot.config` | `object` | The resolved config (without secrets logged). |

## CDN mirrors & resilience

The loader pins PageAgent **v1.10.0** and tries the global jsDelivr mirror first,
then automatically falls back to the China `npmmirror` mirror. If both are
unreachable (e.g. an egress-restricted sandbox), `run()` rejects and
`ready` resolves to `null` — the demo page (`pageagent.html`) catches this and
uses a small deterministic local interpreter so the form still responds.

Pin a different version with `version: '...'` in `PAGEAGENT_CONFIG` or
`data-version="..."`.

## Adding the copilot to other RHYTHMIX pages

1. Copy the `<script src="/pageagent/pageagent-copilot.js" defer></script>` tag
   into the page's `<body>` (and a `PAGEAGENT_CONFIG` block above it for prod).
2. Make sure interactive controls have clear, human-readable labels — PageAgent
   reads the DOM as text, so good `<label>`s, `aria-label`s, and button text make
   it far more reliable.
3. Test with `python3 -m http.server 8000` from the repo root, then open
   `http://localhost:8000/pageagent.html`.

## Local preview

```bash
python3 -m http.server 8000 --bind 127.0.0.1
# open http://localhost:8000/pageagent.html
```

## License

The loader and demo page are part of this repo. PageAgent and browser-use are
MIT-licensed by their respective authors.
