/**
 * Render-runner event types — pure data, no behavior.
 *
 * The render runner (`render-runner.ts`) emits these through the `onEvent`
 * callback supplied by the caller. The `/render/[id]` page (T11) subscribes
 * and translates them into UI state. Tests in T14 assert on exact event
 * sequences for the happy path and the partial-failure path.
 *
 * Per spec R6: failed scenes do NOT halt the render. After 3 attempts the
 * runner emits `scene:failed` for the last attempt and moves on. The final
 * compose substitutes a placeholder frame (see `makePlaceholderBlob` in the
 * runner) so the timeline length still matches the audio.
 *
 * Important rule honored across both modules: the user's Replicate token is
 * never embedded in any event payload. Error strings are sanitised at the
 * point of construction.
 */

export type RenderEvent =
  | { type: "scene:queued"; sceneId: string }
  | { type: "scene:generating"; sceneId: string; attempt: number }
  | { type: "scene:downloaded"; sceneId: string; bytes: number }
  | { type: "scene:composed"; sceneId: string }
  | { type: "scene:failed"; sceneId: string; attempt: number; error: string }
  | { type: "compose:start" }
  | { type: "compose:progress"; percent: number }
  | { type: "compose:done" };

export type RenderHandler = (event: RenderEvent) => void;
