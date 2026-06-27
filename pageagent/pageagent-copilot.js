/*
 * RHYTHMIX PageAgent Copilot — drop-in in-page GUI agent loader
 * ------------------------------------------------------------
 * PageAgent (https://github.com/PageAgent/page-agent, MIT) is a text-based
 * DOM-driven GUI agent that runs entirely in the page — no extension, no
 * headless browser, no screenshots. This loader wires it into any RHYTHMIX
 * page with one <script> tag and sensible, brand-aware defaults.
 *
 * Usage (simplest — free demo LLM, evaluation only):
 *   <script src="/pageagent/pageagent-copilot.js" defer></script>
 *
 * Usage (production — bring your own LLM):
 *   <script>
 *     window.PAGEAGENT_CONFIG = {
 *       model:   'qwen3.5-plus',
 *       baseURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
 *       apiKey:  'YOUR_API_KEY',      // never commit a real key to the repo
 *       language:'en-US',
 *     };
 *   </script>
 *   <script src="/pageagent/pageagent-copilot.js" defer></script>
 *
 * Config can also be set via data-* attributes on the script tag:
 *   <script src="/pageagent/pageagent-copilot.js"
 *           data-model="qwen3.5-plus"
 *           data-base-url="https://dashscope.aliyuncs.com/compatible-mode/v1"
 *           data-api-key="..."
 *           data-language="en-US"
 *           data-version="1.10.0" defer></script>
 *
 * After load, a programmatic handle is available:
 *   window.rhythmixCopilot.run('Click the request a cut button')
 *   window.rhythmixCopilot.ready   // Promise<PageAgent | null>
 */
(function () {
  'use strict';

  // Idempotent: never wire the copilot twice on one page.
  if (window.rhythmixCopilot) return;

  var VERSION_DEFAULT = '1.10.0';
  var CDN = {
    // Global mirror (jsDelivr). China mirror swapped in automatically on failure.
    global: function (v, file) {
      return 'https://cdn.jsdelivr.net/npm/page-agent@' + v + '/dist/iife/' + file;
    },
    china: function (v, file) {
      return 'https://registry.npmmirror.com/page-agent/' + v + '/files/dist/iife/' + file;
    },
  };

  // ---- Resolve config: window.PAGEAGENT_CONFIG overlaid by script data-* ----
  var script = document.currentScript ||
    (function () {
      var s = document.getElementsByTagName('script');
      return s[s.length - 1];
    })();

  function dataAttr(name) {
    return script && script.dataset ? script.dataset[name] : undefined;
  }

  var winCfg = window.PAGEAGENT_CONFIG || {};
  var cfg = {
    model:    winCfg.model    || dataAttr('model')    || undefined,
    baseURL:  winCfg.baseURL  || dataAttr('baseUrl')  || undefined,
    apiKey:   winCfg.apiKey   || dataAttr('apiKey')   || undefined,
    language: winCfg.language || dataAttr('language') || 'en-US',
    version:  winCfg.version  || dataAttr('version')  || VERSION_DEFAULT,
    // Force demo bundle even if a key is present (handy for local testing).
    demo:     (winCfg.demo != null ? winCfg.demo : dataAttr('demo')) || false,
  };

  // Production mode requires a real LLM endpoint + key. Otherwise fall back to
  // the free demo bundle, which ships its own testing LLM (evaluation only).
  var useProduction = !cfg.demo && cfg.apiKey && cfg.baseURL && cfg.model;
  var bundleFile = useProduction ? 'page-agent.js' : 'page-agent.demo.js';

  // ---- Resolve promise that downstream code can await ----
  var resolveReady;
  var ready = new Promise(function (res) { resolveReady = res; });

  function warn(msg) {
    if (typeof console !== 'undefined' && console.warn) {
      console.warn('[rhythmix-copilot] ' + msg);
    }
  }

  function loadScript(src) {
    return new Promise(function (resolve, reject) {
      var el = document.createElement('script');
      el.src = src;
      el.crossOrigin = 'anonymous';
      // autoInit=false: we instantiate ourselves so placement/config is ours.
      el.async = true;
      el.onload = function () { resolve(); };
      el.onerror = function () { reject(new Error('failed to load ' + src)); };
      document.head.appendChild(el);
    });
  }

  function instantiate() {
    if (typeof window.PageAgent !== 'function') {
      warn('PageAgent global not found after bundle load.');
      resolveReady(null);
      return;
    }
    var agent;
    try {
      if (useProduction) {
        agent = new window.PageAgent({
          model: cfg.model,
          baseURL: cfg.baseURL,
          apiKey: cfg.apiKey,
          language: cfg.language,
        });
      } else {
        // Demo bundle: no key needed, uses PageAgent's free testing LLM.
        warn('Running on the free demo LLM — for technical evaluation only. ' +
             'Provide window.PAGEAGENT_CONFIG with your own model/baseURL/apiKey for production.');
        agent = new window.PageAgent({ language: cfg.language });
      }
    } catch (e) {
      warn('PageAgent construction failed: ' + (e && e.message));
      resolveReady(null);
      return;
    }
    window.rhythmixCopilot.agent = agent;
    resolveReady(agent);
  }

  // Try global mirror, fall back to China mirror, else give up gracefully.
  function boot() {
    var v = cfg.version;
    loadScript(CDN.global(v, bundleFile))
      .catch(function () {
        warn('Global CDN unreachable, trying China mirror…');
        return loadScript(CDN.china(v, bundleFile));
      })
      .then(instantiate)
      .catch(function (e) {
        warn('Could not load PageAgent from any mirror: ' + (e && e.message) +
             '. If you are in a sandboxed/egress-restricted environment, the ' +
             'CDN may be blocked.');
        resolveReady(null);
      });
  }

  // ---- Public handle ----
  window.rhythmixCopilot = {
    ready: ready,
    agent: null,
    config: cfg,
    /**
     * Run a natural-language task against the current page.
     * @param {string} task e.g. "Fill the email field with hi@example.com and submit"
     * @returns {Promise} resolves when the agent finishes (or rejects on error)
     */
    run: function (task) {
      return ready.then(function (agent) {
        if (!agent) {
          return Promise.reject(new Error('PageAgent is not available on this page.'));
        }
        return agent.execute(task);
      });
    },
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }
})();
