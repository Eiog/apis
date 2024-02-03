import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['./src/worker.ts'],
  outDir: './public',
  clean: false,
  format: ['cjs'],
  external: [],
  dts: false,
  minify: false,
})
