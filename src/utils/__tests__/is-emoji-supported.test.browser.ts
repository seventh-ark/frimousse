import { describe, expect, it } from "vitest";
import { isEmojiSupported } from "../is-emoji-supported";

describe("isEmojiSupported", () => {
  it("should return false when in a non-browser environment", () => {
    const originalCreateElement = document.createElement;

    document.createElement =
      undefined as unknown as typeof document.createElement;

    expect(isEmojiSupported("😊")).toBe(false);

    document.createElement = originalCreateElement;
  });

  it("should return true when an emoji is supported", () => {
    expect(isEmojiSupported("😊")).toBe(true);
  });

  it("should return false when an emoji is not supported", () => {
    expect(isEmojiSupported("😊😊")).toBe(false);
    expect(isEmojiSupported("�")).toBe(false);
  });
});
