import { describe, it, expect } from "vitest";
import {
  buildNewProjectMeta,
  newProjectStorageKey,
  type NewProjectMeta,
} from "./new-project";

describe("newProjectStorageKey", () => {
  it("namespaces the key by planId", () => {
    expect(newProjectStorageKey("abc123")).toBe("rhythmix:new:abc123");
  });
});

describe("buildNewProjectMeta", () => {
  it("keeps the BPM for a music project", () => {
    const meta = buildNewProjectMeta({
      kind: "music",
      theme: "neon city",
      bpm: 128,
      fileName: "track.mp3",
      fileSize: 1234,
    });
    expect(meta).toEqual<NewProjectMeta>({
      kind: "music",
      theme: "neon city",
      bpm: 128,
      fileName: "track.mp3",
      fileSize: 1234,
    });
  });

  it("forces BPM to null for a podcast even if one is passed in", () => {
    const meta = buildNewProjectMeta({
      kind: "podcast",
      theme: "calm studio backdrop",
      bpm: 128,
      fileName: "episode-12.m4a",
      fileSize: 9_000_000,
    });
    expect(meta.kind).toBe("podcast");
    expect(meta.bpm).toBeNull();
  });

  it("preserves a null BPM for music left on auto-detect", () => {
    const meta = buildNewProjectMeta({
      kind: "music",
      theme: "sunrise",
      bpm: null,
      fileName: "track.wav",
      fileSize: 4242,
    });
    expect(meta.bpm).toBeNull();
  });

  it("trims surrounding whitespace from the theme", () => {
    const meta = buildNewProjectMeta({
      kind: "podcast",
      theme: "   warm desk mic   ",
      bpm: null,
      fileName: "ep.mp3",
      fileSize: 10,
    });
    expect(meta.theme).toBe("warm desk mic");
  });
});
