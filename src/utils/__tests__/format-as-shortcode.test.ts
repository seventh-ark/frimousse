import { describe, expect, it } from "vitest";
import { formatAsShortcode } from "../format-as-shortcode";

describe("formatAsShortcode", () => {
  it("should convert names to shortcodes", () => {
    expect(formatAsShortcode("Hello world")).toBe(":hello_world:");
    expect(formatAsShortcode("   Hello@World__/_ example0 123")).toBe(
      ":hello_world_example0_123:",
    );
  });

  it("should handle accents", () => {
    expect(formatAsShortcode("Amélie, café & español")).toBe(
      ":amelie_cafe_espanol:",
    );
  });

  it("should handle abbreviations", () => {
    expect(formatAsShortcode("U.S.A.")).toBe(":usa:");
    expect(formatAsShortcode("Justice — D.A.N.C.E.")).toBe(":justice_dance:");
  });
});
