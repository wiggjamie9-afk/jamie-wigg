// Ffmpeg adapter facade. Detects the runtime once at import time and
// re-exports the matching adapter (Node child_process vs browser
// @ffmpeg/ffmpeg). Consumers do not need to know which one they got —
// the public surface is identical: `probe / trim / concat / mux /
// extractFrame`. The Node adapter expects filesystem paths (strings);
// the WASM adapter expects Blobs and returns Blobs. Same intent, same
// names, different I/O units — picked based on the host.
//
// The CLI imports `./node.mjs` directly to avoid a top-level await in
// the hot path. The web app imports `./wasm.mjs` directly. This facade
// is for the shared engine code paths that may run on either runtime.

const isNode =
  typeof process !== "undefined" &&
  !!process.versions &&
  !!process.versions.node;

// Lazy dynamic import — only one of the two adapters is ever loaded in
// any given runtime. This keeps the browser bundle free of `child_process`
// and the Node bundle free of `@ffmpeg/ffmpeg`'s WASM payload.
export const ffmpeg = isNode
  ? await import("./node.mjs")
  : await import("./wasm.mjs");

export const probe = (...args) => ffmpeg.probe(...args);
export const trim = (...args) => ffmpeg.trim(...args);
export const concat = (...args) => ffmpeg.concat(...args);
export const mux = (...args) => ffmpeg.mux(...args);
export const extractFrame = (...args) => ffmpeg.extractFrame(...args);

export { isNode };
