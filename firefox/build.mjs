import * as esbuild from "esbuild";
import { rm, mkdir, cp } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Everything is resolved relative to this file (the firefox folder),
// so the script works no matter which directory you run it from.
const root = path.dirname(fileURLToPath(import.meta.url));
const src = path.join(root, "src");
const dist = path.join(root, "dist");

await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });

await esbuild.build({
  entryPoints: [
    path.join(src, "content/content.js"),
    path.join(src, "content/content.css"),
    path.join(src, "popup/popup.js"),
    path.join(src, "popup/popup.css"),
    path.join(src, "background.js"),
  ],
  outbase: src,
  outdir: dist,
  bundle: true,
  format: "iife",
  loader: {
    ".png": "dataurl",
    ".webp": "dataurl",
    ".svg": "dataurl",
  },
  minify: true,
});

await cp(path.join(src, "manifest.json"), path.join(dist, "manifest.json"));
await cp(path.join(src, "icons"), path.join(dist, "icons"), {
  recursive: true,
});
await cp(
  path.join(src, "popup/popup.html"),
  path.join(dist, "popup/popup.html"),
);

console.log("Firefox build complete!");
