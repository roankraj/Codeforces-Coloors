import * as esbuild from "esbuild";
import { rm, mkdir, cp } from "node:fs/promises";

const browsers = ["chrome", "firefox"];

const entryPoints = [
  "src/content/content.js",
  "src/content/content.css",
  "src/popup/popup.js",
  "src/popup/popup.css",
  "src/background.js",
];

for (const browser of browsers) {
  const outDir = `dist_${browser}`;

  // Clean previous build
  await rm(outDir, { recursive: true, force: true });
  await mkdir(outDir, { recursive: true });

  // Bundle shared source files
  await esbuild.build({
    entryPoints,
    outbase: "src",
    outdir: outDir,
    bundle: true,
    format: "iife",
    loader: {
      ".png": "dataurl",
      ".webp": "dataurl",
      ".svg": "dataurl",
    },
    minify: true,
  });

  // Copy browser-specific manifest
  await cp(`manifests/${browser}/manifest.json`, `${outDir}/manifest.json`);

  // Copy shared assets
  await cp("src/icons", `${outDir}/icons`, {
    recursive: true,
  });

  await cp("src/img", `${outDir}/img`, {
    recursive: true,
  });

  // Copy popup HTML
  await cp("src/popup/popup.html", `${outDir}/popup/popup.html`);

  console.log(`${browser.toUpperCase()} build complete!`);
}

console.log("\nAll builds completed successfully!");
