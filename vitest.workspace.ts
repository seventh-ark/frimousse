import { defineWorkspace } from "vitest/config";

export default defineWorkspace([
  {
    extends: "vitest.config.ts",
    test: {
      name: "jsdom",
      environment: "jsdom",
      include: ["src/**/*.test.{ts,tsx}"],
      setupFiles: ["test/setup-jsdom.ts", "test/setup-emojibase.ts"],
    },
  },
  {
    extends: "vitest.config.ts",
    test: {
      name: "browser",
      include: ["src/**/*.test.browser.{ts,tsx}"],
      setupFiles: ["test/setup-browser.ts", "test/setup-emojibase.ts"],
      browser: {
        enabled: true,
        headless: true,
        provider: "playwright",
        instances: [{ browser: "chromium" }],
      },
    },
  },
]);
