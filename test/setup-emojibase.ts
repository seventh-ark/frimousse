import { afterEach, beforeEach, vi } from "vitest";

function mockFetch(
  entries: Record<
    string,
    {
      GET?: () => Promise<Response>;
      HEAD?: () => Promise<Response>;
      [method: string]: (() => Promise<Response>) | undefined;
    }
  >,
) {
  return vi
    .spyOn(globalThis, "fetch")
    .mockImplementation(async (url, options) => {
      const method = options?.method?.toUpperCase() || "GET";
      const requestUrl =
        typeof url === "string"
          ? url
          : url instanceof Request
            ? url.url
            : url.toString();

      for (const targetUrl in entries) {
        const entry = entries[targetUrl as keyof typeof entries];

        if (requestUrl === targetUrl && entry?.[method]) {
          return entry[method]();
        }
      }

      return Promise.reject(new Error(`Unhandled request: ${method} ${url}`));
    });
}

beforeEach(() => {
  mockFetch({
    "https://cdn.jsdelivr.net/npm/emojibase-data@latest/en/data.json": {
      GET: async () => {
        const data = (await import("emojibase-data/en/data.json")).default;
        return Promise.resolve(
          new Response(JSON.stringify(data), {
            headers: {
              ETag: "abc123",
            },
          }),
        );
      },
      HEAD: async () => {
        return Promise.resolve(
          new Response(null, {
            status: 200,
            headers: {
              ETag: "abc123",
            },
          }),
        );
      },
    },
    "https://cdn.jsdelivr.net/npm/emojibase-data@latest/en/messages.json": {
      GET: async () => {
        const data = (await import("emojibase-data/en/messages.json")).default;
        return Promise.resolve(
          new Response(JSON.stringify(data), {
            headers: {
              ETag: "def456",
            },
          }),
        );
      },
      HEAD: async () => {
        return Promise.resolve(
          new Response(null, {
            status: 200,
            headers: {
              ETag: "def456",
            },
          }),
        );
      },
    },
    "https://cdn.jsdelivr.net/npm/emojibase-data@latest/fr/data.json": {
      GET: async () => {
        const data = (await import("emojibase-data/fr/data.json")).default;
        return Promise.resolve(
          new Response(JSON.stringify(data), {
            headers: {
              ETag: "ghi789",
            },
          }),
        );
      },
      HEAD: async () => {
        return Promise.resolve(
          new Response(null, {
            status: 200,
            headers: {
              ETag: "ghi789",
            },
          }),
        );
      },
    },
    "https://cdn.jsdelivr.net/npm/emojibase-data@latest/fr/messages.json": {
      GET: async () => {
        const data = (await import("emojibase-data/fr/messages.json")).default;
        return Promise.resolve(
          new Response(JSON.stringify(data), {
            headers: {
              ETag: "jkl012",
            },
          }),
        );
      },
      HEAD: async () => {
        return Promise.resolve(
          new Response(null, {
            status: 200,
            headers: {
              ETag: "jkl012",
            },
          }),
        );
      },
    },
  });
});

afterEach(() => {
  vi.restoreAllMocks();
});
