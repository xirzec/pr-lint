import * as esbuild from "esbuild";

await esbuild.build({
  entryPoints: ["src/index.ts"],
  bundle: true,
  outfile: "dist/index.js",
  platform: "node",
  target: "node16",
  format: "esm",
  banner: {
    js: `import { createRequire } from 'module';const require = createRequire(import.meta.url);`,
  },
  logLevel: "info",
});
