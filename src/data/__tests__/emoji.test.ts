import { afterEach, describe, expect, it, vi } from "vitest";
import type { Locale } from "../../types";
import { LOCAL_DATA_KEY, SESSION_METADATA_KEY, getEmojiData } from "../emoji";

describe("getEmojiData", () => {
  afterEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  it("should return the emoji data", async () => {
    const data = await getEmojiData("en");

    expect(data).toBeDefined();
  });

  it("should support aborting the request", async () => {
    const controller = new AbortController();
    const promise = getEmojiData("en", controller.signal);

    controller.abort();

    const data = await promise;

    expect(data).toBeDefined();
  });

  it("should save data locally", async () => {
    await getEmojiData("en");

    const localStorageData = localStorage.getItem(LOCAL_DATA_KEY("en"));
    const sessionStorageData = sessionStorage.getItem(SESSION_METADATA_KEY);

    expect(localStorageData).not.toBeNull();
    expect(sessionStorageData).not.toBeNull();
  });

  it("should use local data if available from a previous session", async () => {
    await getEmojiData("en");

    sessionStorage.clear();

    const fetchSpy = vi.spyOn(globalThis, "fetch");

    await getEmojiData("en");

    expect(fetchSpy).toHaveBeenCalledTimes(2);
    expect(fetchSpy.mock.calls[0]).toEqual([
      "https://cdn.jsdelivr.net/npm/emojibase-data@latest/en/data.json",
      { method: "HEAD" },
    ]);
    expect(fetchSpy.mock.calls[1]).toEqual([
      "https://cdn.jsdelivr.net/npm/emojibase-data@latest/en/messages.json",
      { method: "HEAD" },
    ]);
  });

  it("should not use broken local data", async () => {
    localStorage.setItem(LOCAL_DATA_KEY("en"), "{}");
    sessionStorage.setItem(SESSION_METADATA_KEY, "{}");

    await getEmojiData("en");

    const localStorageData = localStorage.getItem(LOCAL_DATA_KEY("en"));
    const sessionStorageData = sessionStorage.getItem(SESSION_METADATA_KEY);

    expect(localStorageData).not.toBe("{}");
    expect(sessionStorageData).not.toBe("{}");
  });

  it("should fallback to the default locale when receiving an unsupported locale", async () => {
    const data = await getEmojiData("unsupported-locale" as Locale);

    expect(data).toBeDefined();
  });
});
