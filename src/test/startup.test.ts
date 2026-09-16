import { describe, expect, it, vi } from "vitest";

const imports = vi.hoisted(() => ({ loaded: [] as string[] }));

vi.mock("../git.js", () => {
  imports.loaded.push("git");
  return {
    getReviewWindowData: async () => ({ repoRoot: "/repo", files: [] }),
    loadReviewFileContents: async () => "",
  };
});
vi.mock("../prompt.js", () => {
  imports.loaded.push("prompt");
  return { composeReviewPrompt: () => "" };
});
vi.mock("../shortcuts.js", () => {
  imports.loaded.push("shortcuts");
  return { loadCommentShortcuts: () => ({ shortcuts: [], warnings: [] }) };
});
vi.mock("../ui/review-app.js", () => {
  imports.loaded.push("review-app");
  return { runReviewApp: async () => ({ type: "cancel" }) };
});

import slopReviewExtension from "../index.js";

describe("extension startup", () => {
  it("registers the command without loading the review implementation", async () => {
    let handler: ((args: string, ctx: unknown) => Promise<void>) | undefined;
    const pi = {
      registerCommand(name: string, command: { handler: typeof handler }) {
        if (name === "slopchop") handler = command.handler;
      },
      registerShortcut() {},
      on() {},
    };

    slopReviewExtension(pi as never);

    expect(imports.loaded).toEqual([]);
    expect(handler).toBeTypeOf("function");

    await handler!("", {
      cwd: "/repo",
      ui: { notify() {} },
    });

    expect(new Set(imports.loaded)).toEqual(new Set(["git", "prompt", "shortcuts", "review-app"]));
  });
});
