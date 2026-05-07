import { describe, it, expect } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { MyComposition } from "../Composition";

describe("MyComposition", () => {
  it("is exported as a function component", () => {
    expect(typeof MyComposition).toBe("function");
  });

  it("returns null when invoked directly", () => {
    expect(MyComposition()).toBeNull();
  });

  it("renders to an empty string", () => {
    expect(renderToStaticMarkup(<MyComposition />)).toBe("");
  });
});
