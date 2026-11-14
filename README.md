# 🎨 Codeforces Coloors

Dark mode and a few other themes for [Codeforces](https://codeforces.com), plus a focus mode for when you just want to solve the problem.

Works in Chrome, Edge, Brave and Firefox.

Not affiliated with Codeforces, just a fan restyle.

## What it does

- **Themes:** Dark, Black, Blue, Pink, Light, and Device (follows your OS setting).
  - **Dark** is the default. **Black** is the same look on a pure black page.
  - **Device** switches between Dark and Light to match your OS. It checks when the page loads or when you change the setting, so after changing your OS theme, refresh the tab.
- **Styles most of the site:** problems, sample tests, tables, comments, submissions, the heatmap, code highlighting, and the code editor.
- **Matching logos:** the Codeforces and Telegram logos change with the theme.
- **Focus Mode:** hides the sidebar and widens the content. Toggle it in the popup or press `Ctrl + Shift + F` (`Cmd + Shift + F` on Mac). It works with every theme, including Light.
- **Remembers your settings** between tabs and sessions.

Want the original look back? Pick **Light**.

## 🚀 Load it locally

Both browser versions share the same source code and styling. Browser-specific configurations are maintained separately in the `manifests/` directory.

### 1. Get the code

```bash
git clone <your-repo-url>
cd cf-extension
bun install
```

You need [Bun](https://bun.sh) 1.2 or newer.

### 2. Build the extension

Run the build command from the project root:

```bash
bun run build
```

This generates two separate distribution folders:

- `dist_chrome/` – Chrome, Edge, Brave and other Chromium-based browsers.
- `dist_firefox/` – Firefox.

Both builds use the same source files from `src/`. The build script automatically copies the appropriate browser manifest into each distribution folder.

You don't need separate source directories or separate build commands for each browser.

### 3. Chrome, Edge, Brave and other Chromium browsers

After building:

1. Go to `chrome://extensions` (or `edge://extensions`, `brave://extensions`).
2. Turn on **Developer mode** (top right).
3. Click **Load unpacked**.
4. Select the `dist_chrome/` folder. It must directly contain `manifest.json`.
5. Click the puzzle icon in the toolbar and pin the extension.

### 4. Firefox

After building:

1. Go to `about:debugging#/runtime/this-firefox`.
2. Click **Load Temporary Add-on...**.
3. Select `dist_firefox/manifest.json`.
4. Click the puzzle icon in the toolbar and pin the extension.

Temporary add-ons are removed when Firefox closes, so load it again each session.

To launch Firefox with the extension already loaded and automatically reload it when you rebuild, use [web-ext](https://extensionworkshop.com/documentation/develop/getting-started-with-web-ext/):

```bash
npx web-ext run --source-dir dist_firefox
```

### 5. Try it out

Open [codeforces.com](https://codeforces.com), refresh the page once, click the extension icon and pick a theme. 🎉

## 📦 Build from source

This section is for add-on reviewers and anyone who wants to verify that the generated browser extensions match the source code.

Both browser versions are generated from a single shared source directory. Their only browser-specific configuration is maintained in separate manifest directories.

### What is and isn't generated

- **Hand-written source:** everything in `src/` (content scripts, popup, icons, images and other shared assets).
- **Browser-specific configuration:** `manifests/chrome/` and `manifests/firefox/`.
- **Generated:** `dist_chrome/` and `dist_firefox/`. These folders are created by the build script and should never be edited manually.
- **Build dependency:** [esbuild](https://esbuild.github.io), used to bundle and minify JavaScript and CSS.

### Requirements

| Item             | Requirement                                 |
| ---------------- | ------------------------------------------- |
| Operating system | Windows 10 or later, macOS, or Linux        |
| Build tool       | [Bun](https://bun.sh) 1.2 or newer          |
| Dependencies     | `esbuild`, installed through `package.json` |
| Network          | Required when installing dependencies       |

Install Bun if you don't have it, then check the version:

```bash
bun --version
```

Installation instructions are available at [bun.sh](https://bun.sh).

### Build steps

1. Clone or unpack the repository and open a terminal in the project root.
2. Install dependencies:

   ```bash
   bun install --frozen-lockfile
   ```

3. Run the build:

   ```bash
   bun run build
   ```

4. The script generates both browser distributions:

   ```text
   dist_chrome/
   dist_firefox/
   ```

Both distributions are built using the same files from `src/`, with the appropriate manifest selected from `manifests/`.

### Packaging the extensions

The contents of the distribution folder must be at the root of the ZIP archive, with `manifest.json` directly inside it.

You can use Python to package either version.

**Chrome:**

```bash
python -c "import os, zipfile; root='dist_chrome'; out='chrome.zip'; z=zipfile.ZipFile(out,'w',zipfile.ZIP_DEFLATED); [z.write(os.path.join(dp,f),os.path.relpath(os.path.join(dp,f),root).replace(os.sep,'/')) for dp,ds,fs in os.walk(root) for f in fs]; z.close()"
```

**Firefox:**

```bash
python -c "import os, zipfile; root='dist_firefox'; out='firefox.zip'; z=zipfile.ZipFile(out,'w',zipfile.ZIP_DEFLATED); [z.write(os.path.join(dp,f),os.path.relpath(os.path.join(dp,f),root).replace(os.sep,'/')) for dp,ds,fs in os.walk(root) for f in fs]; z.close()"
```

To inspect an archive:

```bash
python -m zipfile -l firefox.zip
```

Make sure `manifest.json` is at the archive root and paths use forward slashes.

## 🛠️ Troubleshooting

- **"Manifest file is missing or unreadable":** You selected the wrong folder. For Chromium, select `dist_chrome/`; for Firefox, select `dist_firefox/`. Both must directly contain `manifest.json`.
- **Firefox: "Invalid file name in archive":** The ZIP may contain Windows-style backslashes. Use the Python packaging command above.
- **Theme isn't showing up:** Refresh the Codeforces tab.
- **Shortcut does nothing:** Something else might be using it. Change it at `chrome://extensions/shortcuts` in Chrome, or in Firefox at `about:addons` → the gear icon → **Manage Extension Shortcuts**.
- **Device theme doesn't follow my OS:** It only checks when the page loads or when you change the setting. Refresh the tab after switching your OS theme. In Firefox, turning on `privacy.resistFingerprinting` makes the browser always report a light theme.
- **Can't find the extension icon:** Both browsers hide new extensions. Open the puzzle-piece menu in the toolbar and pin it.
- **Firefox: the add-on is gone after restarting:** Temporary add-ons don't survive a restart. Load it again, or use `npx web-ext run`.
- **Something's broken:** In Chrome, click **Errors** on the extension's card, or inspect the service worker. In Firefox, click **Inspect** on the add-on's card in `about:debugging` to open the background script's console.

## Project layout

```text
cf-extension/
├── src/                       # Shared source for both browsers
│   ├── content/               # Themes and content scripts
│   ├── icons/                 # Extension icons
│   ├── img/                   # Logos and other images
│   │   ├── bell/
│   │   ├── cf/
│   │   ├── lava/
│   │   ├── mobile/
│   │   └── tele/
│   └── popup/                 # Theme picker and Focus Mode
│
├── manifests/
│   ├── chrome/                # Chromium manifest
│   └── firefox/               # Firefox manifest
│
├── dist_chrome/               # Generated Chromium extension
├── dist_firefox/              # Generated Firefox extension
│
├── build.mjs                  # Builds both browser versions
├── package.json
├── bun.lock
└── LICENSE
```

The two distributions share the same content scripts, popup, styling, icons and images. Only their browser-specific manifests differ.

The build script takes care of generating both distributions, so there is no need to maintain duplicate source files.

## How it works

The popup saves your picks (`theme`, `focus`) to the extension's `storage.local`. The content script on Codeforces reads them and sets two attributes on the `<html>` tag:

- `data-theme` selects a theme. `content.css` defines every color as a CSS variable in one block per theme, and all the other rules only use those variables. **Device** is turned into `dark` or `light` by the script, so the CSS never sees it.
- `data-focus-mode` (`"true"` or `"false"`) turns the Focus Mode rules on or off. These sit at the end of `content.css`, outside the theme rules.

The **Light** theme turns all the theme overrides off, so you see the normal site.

The Focus Mode shortcut is handled by the background script. It flips the saved `focus` value, and the page and popup update themselves from that.

It only runs on `codeforces.com`, only needs the `storage` permission, and doesn't collect any data.

Internally the Pink theme is called `love`, so you'll see that name in the CSS and in `data-theme`.

## Adding a theme

All theme development happens inside the shared `src/` directory. You don't need to repeat changes for Firefox.

1. In `src/content/content.css`, copy a `:root[data-theme="..."]` block (Dark or Black for a dark theme, `love` for a light one), rename it and tweak the colors. Keep every variable, because themes don't inherit from each other.
2. Add the theme's Codeforces logo as `src/img/cf/codeforces-logo-<name>.webp` and point `--cf-logo` at it in your new block.
3. For a dark theme, set `--lava-right`, `--lava-left` and `--bell` to the dark images, as Dark, Black and Blue do. For a light theme, leave them out like Pink does, and add your theme name next to `love` in the `&:not([data-theme="love"])` selectors near the end of the file (the ASSETS and dark-only extras sections). Otherwise those rules would use variables that don't exist, and also dim the page for a light theme.
4. Add an option for it in `src/popup/popup.html` (same `data-value` as the theme name, plus 3 `data-colors` for the preview dots).
5. Run the build command:

   ```bash
   bun run build
   ```

6. Reload the extension in your browser and check a problem page, standings, submissions, a blog and the editor.

## Contributing

Found a page that looks off? Open an issue with the link and a screenshot. PRs are welcome too!
