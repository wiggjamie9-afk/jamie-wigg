import { describe, it, expect, vi, beforeEach } from "vitest";

const registerRoot = vi.fn();

vi.mock("remotion", () => ({
  registerRoot,
  Composition: () => null,
}));

describe("entry point", () => {
  beforeEach(() => {
    registerRoot.mockClear();
    vi.resetModules();
  });

  it("calls registerRoot with RemotionRoot exactly once on import", async () => {
    await import("../index");
    const { RemotionRoot } = await import("../Root");
    expect(registerRoot).toHaveBeenCalledTimes(1);
    expect(registerRoot).toHaveBeenCalledWith(RemotionRoot);
  });
});
