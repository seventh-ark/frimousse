import { defineConfig } from "vitest/config";

export default defineConfig({
  optimizeDeps: {
    include: ["react/jsx-dev-runtime"],
  },
  test: {
    coverage: {
      provider: "v8",
      include: ["src/**/*.{ts,tsx}", "!**/__tests__/**"],
      exclude: ["src/index.ts"],
      ignoreEmptyLines: true,
      excludeAfterRemap: true,
    },
  },
});
