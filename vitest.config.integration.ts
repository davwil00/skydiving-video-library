import { defineConfig } from 'vitest/config'
export default defineConfig({
  test: {
    include: ["src/tests/**/*.test.ts"],
    poolOptions: {
      threads: {
        singleThread: true,
      }
    }
  },
  resolve: {
    alias: {
      auth: "/src/auth",
      quotes: "/src/quotes",
      lib: "/src/lib"
    }
  }
});
