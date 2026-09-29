import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const manifest = JSON.parse(readFileSync(new URL("../../package.json", import.meta.url), "utf8"));

describe("extension packaging", () => {
  it("uses Pi's host modules when opening a review instead of installing another runtime", () => {
    // A separate TUI copy can bypass Pi's loader and duplicate runtime classes.
    for (const name of ["@earendil-works/pi-coding-agent", "@earendil-works/pi-tui"]) {
      expect(manifest.peerDependencies?.[name]).toBe("*");
      expect(manifest.dependencies?.[name]).toBeUndefined();
    }
    expect(manifest.dependencies.diff).toBeDefined();
  });
});
