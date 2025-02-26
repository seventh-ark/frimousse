import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useStableCallback } from "../use-stable-callback";

describe("useStableCallback", () => {
  it("should return a stable reference across renders", () => {
    const callback1 = vi.fn();
    const callback2 = vi.fn();
    const { result, rerender } = renderHook(
      ({ callback }) => useStableCallback(callback),
      { initialProps: { callback: callback1 } },
    );

    const initialResult = result.current;

    rerender({ callback: callback2 });

    expect(result.current).toBe(initialResult);
  });

  it("should call the latest callback", () => {
    const callback1 = vi.fn().mockReturnValue("1");
    const callback2 = vi.fn().mockReturnValue("2");
    const { result, rerender } = renderHook(
      ({ callback }) => useStableCallback(callback),
      { initialProps: { callback: callback1 } },
    );

    const result1 = result.current("hello");
    expect(callback1).toHaveBeenCalledWith("hello");
    expect(result1).toBe("1");

    callback1.mockClear();

    rerender({ callback: callback2 });

    const result2 = result.current("hello");

    expect(callback1).not.toHaveBeenCalled();
    expect(callback2).toHaveBeenCalledWith("hello");
    expect(result2).toBe("2");
  });

  it("should pass all arguments to the callback", () => {
    const callback = vi.fn();
    const { result } = renderHook(() => useStableCallback(callback));

    result.current(1, "two", { three: true }, [4]);

    expect(callback).toHaveBeenCalledWith(1, "two", { three: true }, [4]);
  });
});
