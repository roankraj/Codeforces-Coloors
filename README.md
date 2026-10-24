# 🎨 Codeforces Coloors

Dark mode and a few other themes for [Codeforces](https://codeforces.com), plus a focus mode for when you just want to solve the problem.

Works in Chrome, Edge, Brave and Firefox.

Not affiliated with Codeforces, just a fan restyle.

## What it does

- **Themes:** Dark, Black, Blue, Pink, Light, and Device (follows your OS setting)
  - **Dark** is the default. **Black** is the same look on a pure black page.
  - **Device** switches between Dark and Light to match your OS. It checks when the page loads or when you change the setting, so after changing your OS theme, refresh the tab.
- **Styles most of the site:** problems, sample tests, tables, comments, submissions, the heatmap, code highlighting, and the code editor
- **Matching logos:** the Codeforces and Telegram logos change with the theme
- **Focus Mode:** hides the sidebar and widens the content. Toggle it in the popup or press `Ctrl + Shift + F` (`Cmd + Shift + F` on Mac). It works with every theme, including Light.
- **Remembers your settings** between tabs and sessions
  Want the original look back? Pick **Light**.

## 🚀 Load it locally

The project has two versions that share the same look:

| Browser                   | Folder     | Needs                              |
| ------------------------- | ---------- | ---------------------------------- |
| Chrome, Edge, Brave, etc. | `src/`     | Chrome 120+ (the CSS uses nesting) |
| Firefox                   | `firefox/` | Firefox 140+                       |

### 1. Get the code

```bash
git clone <your-repo-url>
cd cf-extension
bun install
```

You need [Bun](https://bun.sh) 1.2 or newer. See [Build from source](#-build-from-source-firefox-add-on) for install instructions.

### 2. Chrome, Edge, Brave and other Chromium browsers

#### Pick a folder

`manifest.json` lives in `src/`, so you can either:

- **Use `src/` directly.** No build needed, easiest option.
- **Build and use `dist/`.**

```bash
bun run build
```

(If the build command doesn't work, check the scripts in `package.json`.)

#### Add it to your browser

1. Go to `chrome://extensions` (or `edge://extensions`, `brave://extensions`)
2. Turn on **Developer mode** (top right)
3. Click **Load unpacked**
4. Select the folder from the previous step. It has to be the one that directly contains `manifest.json`
5. Click the puzzle icon in the toolbar and pin the extension

#### Made some changes?

Hit the reload icon on the extension's card in `chrome://extensions`, then refresh your Codeforces tab. If you're using `dist/`, rebuild first.

### 3. Firefox

The Firefox version lives in `firefox/` and has its own build script. Firefox can't load it straight from `firefox/src/`, so build it first:

```bash
bun firefox/build.mjs
```

This creates `firefox/dist/`. Then:

1. Go to `about:debugging#/runtime/this-firefox`
2. Click **Load Temporary Add-on...**
3. Select `firefox/dist/manifest.json` (a `.zip` works too, see below)
4. Click the puzzle icon in the toolbar and pin the extension

Temporary add-ons are removed when Firefox closes, so load it again each session. To skip that, run it with [web-ext](https://extensionworkshop.com/documentation/develop/getting-started-with-web-ext/), which opens a Firefox with the extension already loaded and reloads it when you rebuild:

```bash
npx web-ext run --source-dir firefox/dist
```

#### Made some changes?

Rebuild with `bun firefox/build.mjs`, click **Reload** on the add-on's card in `about:debugging`, then refresh your Codeforces tab.

#### Making a zip

`manifest.json` has to be at the root of the zip, and the paths inside must use forward slashes (`icons/icon-16.png`, not `icons\icon-16.png`). Windows PowerShell's `Compress-Archive` writes backslashes, and Firefox rejects those with "Invalid file name in archive", so use one of these instead.

Any OS with Python 3 (run from the `cf-extension` folder after building):

```bash
python -c "import os, zipfile; root='firefox/dist'; out='firefox/extension.zip'; z=zipfile.ZipFile(out,'w',zipfile.ZIP_DEFLATED); [z.write(os.path.join(dp,f),os.path.relpath(os.path.join(dp,f),root).replace(os.sep,'/')) for dp,ds,fs in os.walk(root) for f in fs]; z.close()"
```

macOS / Linux, if you have `zip`:

```bash
cd firefox/dist && zip -r ../extension.zip . && cd ../..
```

The zip ends up at `firefox/extension.zip`. To check it, run `python -m zipfile -l firefox/extension.zip`: you should see `manifest.json` and paths like `icons/icon-16.png`, with no `dist/` in front.

### 4. Try it out

Open [codeforces.com](https://codeforces.com), refresh the page once, click the extension icon and pick a theme. 🎉

## 📦 Build from source (Firefox add-on)

This section is for add-on reviewers, and for anyone who wants to check that the published Firefox add-on matches this source. The add-on's JavaScript and CSS are minified by the build, so the readable source is in `firefox/src/`, and the steps below recreate the submitted add-on from it.

### What is and isn't generated

- **Hand-written source:** everything in `firefox/src/` (`manifest.json`, `background.js`, `content/`, `popup/`, `icons/`, `img/`).
- **Generated:** everything in `firefox/dist/`. It is created by the build and never edited by hand.
- **No third-party libraries are bundled into the add-on.** The only dependency is [esbuild](https://esbuild.github.io), which is used at build time to bundle and minify.

### Requirements

| Item             | Requirement                                                                                                                                 |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| Operating system | Windows 10 or later, macOS, or Linux. The build only uses Bun and esbuild, which run on all three. The submitted build was made on Windows. |
| Build tool       | [Bun](https://bun.sh) **1.2 or newer**. Node.js and npm are not needed for the build.                                                       |
| Dependencies     | `esbuild`, installed from `package.json`. The exact version is pinned in `bun.lock`.                                                        |
| Disk and network | About 100 MB of free disk space. Network access is only needed to download Bun and the packages in step 2.                                  |

Install Bun if you don't have it, then check the version with `bun --version`:

```bash
# macOS / Linux
curl -fsSL https://bun.sh/install | bash

# Windows (PowerShell)
powershell -c "irm bun.sh/install.ps1 | iex"

# or, anywhere you already have npm
npm install -g bun
```

### Steps

1. **Unpack the source** and open a terminal in the folder that contains `package.json` and `firefox/`.

2. **Install the dependencies.** This installs the exact esbuild version recorded in `bun.lock`:

   ```bash
   bun install --frozen-lockfile
   ```

3. **Run the build script:**

   ```bash
   bun firefox/build.mjs
   ```

   It prints `Firefox build complete!` and takes a few seconds.

4. **Find the result in `firefox/dist/`.** This folder is the add-on:

   ```
   firefox/dist/
   ├── manifest.json
   ├── background.js
   ├── content/content.js, content.css
   ├── popup/popup.html, popup.js, popup.css
   └── icons/icon-16.png, icon-32.png, icon-64.png, icon-128.png
   ```

5. **Package it (optional).** The contents of `firefox/dist/` (not the folder itself) zipped with `manifest.json` at the root are what gets submitted. See [Making a zip](#making-a-zip).

### What the build script does

`firefox/build.mjs` runs these steps, in order:

1. Deletes and recreates `firefox/dist/`.
2. Runs esbuild on `content/content.js`, `content/content.css`, `popup/popup.js`, `popup/popup.css` and `background.js` with `bundle`, `format: "iife"` and `minify` turned on. The images (`.png`, `.webp`, `.svg`) referenced from the CSS are inlined as base64 data URLs, so the `img/` folder isn't copied to `dist/`.
3. Copies `manifest.json`, the `icons/` folder and `popup/popup.html` into `firefox/dist/` unchanged.

Everything it needs is read from `firefox/src/`, and it resolves its paths from its own location, so it works from any directory.

## 🛠️ Troubleshooting

- **"Manifest file is missing or unreadable" (Chrome) or "manifest.json not found" (Firefox):** you picked the wrong folder. Select the one that has `manifest.json` right inside it. For a Firefox zip, `manifest.json` must be at the top level of the archive.
- **Firefox: "Invalid file name in archive":** the zip uses backslashes in its paths, usually because it was made with PowerShell's `Compress-Archive`. Make it with one of the commands in [Making a zip](#making-a-zip).
- **Theme isn't showing up:** refresh the Codeforces tab.
- **Shortcut does nothing:** something else might be using it. Change it at `chrome://extensions/shortcuts` in Chrome, or in Firefox at `about:addons` → the gear icon → **Manage Extension Shortcuts**.
- **Device theme doesn't follow my OS:** it only checks when the page loads or when you change the setting. Refresh the tab after switching your OS theme. In Firefox, turning on `privacy.resistFingerprinting` makes the browser always report a light theme.
- **Can't find the extension icon:** both browsers hide new extensions. Open the puzzle-piece menu in the toolbar and pin it.
- **Firefox: the add-on is gone after restarting:** temporary add-ons don't survive a restart. Load it again, or use `npx web-ext run`.
- **Something's broken:** in Chrome, click **Errors** on the extension's card, or inspect the service worker. In Firefox, click **Inspect** on the add-on's card in `about:debugging` to open the background script's console.

## Project layout

```
cf-extension/
├── src/                  # Chromium version
│   ├── manifest.json
│   ├── background.js     # handles the Focus Mode shortcut
│   ├── content/          # content.css (themes + styling) and content.js (applies your settings)
│   ├── popup/            # the popup: theme picker and Focus Mode checkbox
│   ├── icons/
│   └── img/              # logos (cf/, tele/) and menu images (lava/, bell/)
├── firefox/              # Firefox version
│   ├── src/              # same layout as src/, with a Firefox manifest
│   ├── build.mjs         # builds firefox/src into firefox/dist
│   └── dist/             # generated, don't edit
├── build.mjs             # builds src into dist (Chromium)
├── package.json
├── bun.lock              # pins the exact dependency versions
└── LICENSE
```

The two versions have the same files. The differences are in `manifest.json` (Firefox needs an add-on ID and runs the background script as an event page instead of a service worker) and in the scripts, which use the `browser` API in Firefox and `chrome` in Chromium.

## How it works

The popup saves your picks (`theme`, `focus`) to the extension's `storage.local`. The content script on Codeforces reads them and sets two attributes on the `<html>` tag:

- `data-theme` selects a theme. `content.css` defines every color as a CSS variable in one block per theme, and all the other rules only use those variables. **Device** is turned into `dark` or `light` by the script, so the CSS never sees it.
- `data-focus-mode` (`"true"` or `"false"`) turns the Focus Mode rules on or off. These sit at the end of `content.css`, outside the theme rules.
  The **Light** theme turns all the theme overrides off, so you see the normal site.

The Focus Mode shortcut is handled by `background.js`. It flips the saved `focus` value, and the page and popup update themselves from that.

It only runs on `codeforces.com`, only needs the `storage` permission, and doesn't collect any data.

Internally the Pink theme is called `love`, so you'll see that name in the CSS and in `data-theme`.

## Adding a theme

Do these steps in `src/`, then repeat them in `firefox/src/` so both versions stay the same.

1. In `content/content.css`, copy a `:root[data-theme="..."]` block (Dark or Black for a dark theme, `love` for a light one), rename it and tweak the colors. Keep every variable, because themes don't inherit from each other.
2. Add the theme's Codeforces logo as `img/cf/codeforces-logo-<name>.webp` and point `--cf-logo` at it in your new block.
3. For a dark theme, set `--lava-right`, `--lava-left` and `--bell` to the dark images, as Dark, Black and Blue do. For a light theme, leave them out like Pink does, and add your theme name next to `love` in the `&:not([data-theme="love"])` selectors near the end of the file (the ASSETS and dark-only extras sections). Otherwise those rules would use variables that don't exist, and also dim the page for a light theme.
4. Add an option for it in `popup/popup.html` (same `data-value` as the theme name, plus 3 `data-colors` for the preview dots).
5. Reload the extension and check a problem page, standings, submissions, a blog and the editor.

## Contributing

Found a page that looks off? Open an issue with the link and a screenshot. PRs are welcome too!
