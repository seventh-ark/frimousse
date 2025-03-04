import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  dts: {
    resolve: [/emojibase/],
  },
  splitting: true,
  clean: true,
  format: ["esm", "cjs"],
  sourcemap: true,
});
