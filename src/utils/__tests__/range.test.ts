import { describe, expect, it } from "vitest";
import { range } from "../range";

describe("range", () => {
  it("should generate a range of numbers from start to end", () => {
    expect(range(1, 5)).toEqual([1, 2, 3, 4, 5]);
    expect(range(3, 3)).toEqual([3]);
    expect(range(-3, 2)).toEqual([-3, -2, -1, 0, 1, 2]);
  });

  it("should handle invalid ranges", () => {
    expect(range(5, 3)).toEqual([]);
  });
});
