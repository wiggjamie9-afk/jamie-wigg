import { describe, it, expect, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";

/**
 * Mock the Remotion primitives so scenes can render outside Remotion Studio:
 * - AbsoluteFill / Sequence become plain pass-through elements,
 * - useCurrentFrame yields a mid-timeline frame,
 * - interpolate returns the end of the output range (fully-entered state),
 * so the smoke test exercises every scene's JSX at full opacity.
 */
vi.mock("remotion", () => ({
  AbsoluteFill: ({
    children,
    style,
  }: {
    children?: React.ReactNode;
    style?: React.CSSProperties;
  }) => <div style={style}>{children}</div>,
  Sequence: ({ children }: { children?: React.ReactNode }) => <>{children}</>,
  useCurrentFrame: () => 45,
  interpolate: (_frame: number, _inputRange: number[], outputRange: number[]) =>
    outputRange[outputRange.length - 1],
}));

import { MyComposition, sceneStarts, TOTAL_FRAMES } from "../Composition";

describe("timeline math", () => {
  it("starts the first scene at frame 0", () => {
    expect(sceneStarts[0]).toBe(0);
  });

  it("overlaps each scene with the previous by the crossfade length", () => {
    // intro(100) - 20, then +100 - 20, then +100 - 20
    expect(sceneStarts).toEqual([0, 80, 160, 240]);
  });

  it("derives the total length from the last scene start plus its duration", () => {
    expect(TOTAL_FRAMES).toBe(330);
  });
});

describe("MyComposition", () => {
  it("is a function component", () => {
    expect(typeof MyComposition).toBe("function");
  });

  it("renders the wordmark and call-to-action content", () => {
    const html = renderToStaticMarkup(<MyComposition />);
    expect(html).toContain("RHYTHMIX");
    expect(html).toContain("rhythmixapp.com.au");
    expect(html).toContain("AI Music Platform");
  });
});
