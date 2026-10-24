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

`manifest.json` has to be at the root of the zip, so zip the contents of `dist/`, not the folder itself.

Windows (PowerShell):

```powershell
bun firefox/build.mjs
cd firefox\dist
tar -a -c -f ..\extension.zip (Get-ChildItem -Name)
cd ..\..
```

macOS / Linux:

```bash
bun firefox/build.mjs
cd firefox/dist && zip -r ../extension.zip . && cd ../..
```

The zip ends up at `firefox/extension.zip`. Check it with `tar -tf firefox/extension.zip`: you should see `manifest.json` and paths like `icons/icon-16.png`, with no `dist/` in front.

### 4. Try it out

Open [codeforces.com](https://codeforces.com), refresh the page once, click the extension icon and pick a theme. 🎉

## 🛠️ Troubleshooting

- **"Manifest file is missing or unreadable" (Chrome) or "manifest.json not found" (Firefox):** you picked the wrong folder. Select the one that has `manifest.json` right inside it. For a Firefox zip, `manifest.json` must be at the top level of the archive.
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
├── build.mjs
└── package.json
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
