import { describe, it, expect, vi } from "vitest";
import { isValidElement, type ReactElement } from "react";

vi.mock("remotion", () => ({
  Composition: (props: Record<string, unknown>) => {
    return { __mock: "Composition", props };
  },
}));

import { RemotionRoot } from "../Root";
import { MyComposition } from "../Composition";

type CompositionProps = {
  id: string;
  component: unknown;
  durationInFrames: number;
  fps: number;
  width: number;
  height: number;
};

const isCompositionMock = (
  value: unknown,
): value is { __mock: "Composition"; props: CompositionProps } => {
  return (
    typeof value === "object" &&
    value !== null &&
    "__mock" in value &&
    (value as { __mock: unknown }).__mock === "Composition"
  );
};

describe("RemotionRoot", () => {
  it("returns a fragment containing exactly one Composition child", () => {
    const tree = RemotionRoot({}) as ReactElement;
    expect(isValidElement(tree)).toBe(true);
    const children = (tree.props as { children: unknown }).children as unknown[];
    expect(Array.isArray(children) ? children.length : 1).toBe(1);
  });

  it("registers Composition with the documented props", () => {
    const tree = RemotionRoot({}) as ReactElement;
    const child = (tree.props as { children: ReactElement }).children;
    const rendered = (child.type as (p: unknown) => unknown)(child.props);
    if (!isCompositionMock(rendered)) {
      throw new Error("Expected mocked Composition output");
    }
    expect(rendered.props).toEqual({
      id: "MyComp",
      component: MyComposition,
      durationInFrames: 60,
      fps: 30,
      width: 1280,
      height: 720,
    });
  });
});
