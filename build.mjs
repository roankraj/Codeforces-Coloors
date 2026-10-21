import * as esbuild from "esbuild";
import { rm, mkdir, cp } from "node:fs/promises";

await rm("dist", { recursive: true, force: true });
await mkdir("dist", { recursive: true });

await esbuild.build({
  entryPoints: [
    "src/content/content.js",
    "src/content/content.css",
    "src/popup/popup.js",
    "src/popup/popup.css",
    "src/background.js",
  ],
  outbase: "src",
  outdir: "dist",
  minify: true,
});

await cp("src/manifest.json", "dist/manifest.json");
await cp("src/icons", "dist/icons", { recursive: true });
await cp("src/img", "dist/img", { recursive: true }); // added
await cp("src/popup/popup.html", "dist/popup/popup.html");

console.log("Build complete!");
