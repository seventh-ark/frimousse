import { describe, expect, it } from "vitest";
import { shallow } from "../compare";

describe("shallow", () => {
  it("compares primitive values", () => {
    expect(shallow(42, 42)).toBe(true);
    expect(shallow("hello", "hello")).toBe(true);
    expect(shallow(false, false)).toBe(true);
    expect(shallow(null, null)).toBe(true);
    expect(shallow(undefined, undefined)).toBe(true);

    expect(shallow(42, 43)).toBe(false);
    expect(shallow("hello", "world")).toBe(false);
    expect(shallow(false, true)).toBe(false);
    expect(shallow(null, undefined)).toBe(false);
  });

  it("compares objects shallowly", () => {
    expect(shallow({}, {})).toBe(true);
    expect(shallow({ a: 1, b: 2 }, { a: 1, b: 2 })).toBe(true);
    expect(shallow({ a: "hello" }, { a: "hello" })).toBe(true);
    expect(shallow({ a: null }, { a: null })).toBe(true);

    expect(shallow({ a: 1, b: 2 }, { a: 1, b: 3 })).toBe(false);
    expect(shallow({ a: 1 }, { a: 1, b: 2 })).toBe(false);
    expect(shallow({ a: 1 }, { b: 2 })).toBe(false);
    expect(shallow({ a: null }, { a: 1 })).toBe(false);
  });

  it("compares arrays shallowly", () => {
    expect(shallow([], [])).toBe(true);
    expect(shallow([1, 2, 3], [1, 2, 3])).toBe(true);
    expect(shallow(["a", "b"], ["a", "b"])).toBe(true);

    expect(shallow([], {})).toBe(false);
    expect(shallow([1, 2, 3], [1, 2])).toBe(false);
    expect(shallow([1, 2, 3], [1, 3, 2])).toBe(false);
    expect(shallow([1, 2, 3], [1, 2, 4])).toBe(false);
  });
});
