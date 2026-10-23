# 🎨 Codeforces Coloors

Dark mode and a few other themes for [Codeforces](https://codeforces.com), plus a focus mode for when you just want to solve the problem.

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

Works in Chrome, Edge, Brave and other Chromium browsers. Use Chrome 120+ since the CSS uses nesting.

### 1. Get the code

```bash
git clone <your-repo-url>
cd cf-extension
```

### 2. Pick a folder

`manifest.json` lives in `src/`, so you can either:

- **Use `src/` directly.** No build needed, easiest option.
- **Build and use `dist/`.**

```bash
  bun install
  bun run build
```

(If the build command doesn't work, check the scripts in `package.json`.)

### 3. Add it to your browser

1. Go to `chrome://extensions` (or `edge://extensions`, `brave://extensions`)
2. Turn on **Developer mode** (top right)
3. Click **Load unpacked**
4. Select the folder from step 2. It has to be the one that directly contains `manifest.json`
5. Click the puzzle icon in the toolbar and pin the extension

### 4. Try it out

Open [codeforces.com](https://codeforces.com), refresh the page once, click the extension icon and pick a theme. 🎉

### Made some changes?

Hit the reload icon on the extension's card in `chrome://extensions`, then refresh your Codeforces tab. If you're using `dist/`, rebuild first.

## 🛠️ Troubleshooting

- **"Manifest file is missing or unreadable":** you picked the wrong folder. Select the one that has `manifest.json` right inside it.
- **Theme isn't showing up:** refresh the Codeforces tab.
- **Shortcut does nothing:** something else might be using it. Change it at `chrome://extensions/shortcuts`.
- **Device theme doesn't follow my OS:** it only checks when the page loads or when you change the setting. Refresh the tab after switching your OS theme.
- **Something's broken:** click **Errors** on the extension's card, or inspect the service worker, to see what's going on.
- **Firefox:** not set up for it, since the manifest uses a Chromium-style service worker.

## Project layout

```
cf-extension/
├── src/
│   ├── manifest.json
│   ├── background.js     # handles the Focus Mode shortcut
│   ├── content/          # content.css (themes + styling) and content.js (applies your settings)
│   ├── popup/            # the popup: theme picker and Focus Mode checkbox
│   ├── icons/
│   └── img/              # logos (cf/, tele/) and menu images (lava/, bell/)
├── build.mjs
└── package.json
```

## How it works

The popup saves your picks (`theme`, `focus`) to `chrome.storage`. The content script on Codeforces reads them and sets two attributes on the `<html>` tag:

- `data-theme` selects a theme. `content.css` defines every color as a CSS variable in one block per theme, and all the other rules only use those variables. **Device** is turned into `dark` or `light` by the script, so the CSS never sees it.
- `data-focus-mode` (`"true"` or `"false"`) turns the Focus Mode rules on or off. These sit at the end of `content.css`, outside the theme rules.
  The **Light** theme turns all the theme overrides off, so you see the normal site.

The Focus Mode shortcut is handled by `background.js`. It flips the saved `focus` value, and the page and popup update themselves from that.

It only runs on `codeforces.com`, only needs the `storage` permission, and doesn't collect any data.

Internally the Pink theme is called `love`, so you'll see that name in the CSS and in `data-theme`.

## Adding a theme

1. In `src/content/content.css`, copy a `:root[data-theme="..."]` block (Dark or Black for a dark theme, `love` for a light one), rename it and tweak the colors. Keep every variable, because themes don't inherit from each other.
2. Add the theme's Codeforces logo as `src/img/cf/codeforces-logo-<name>.webp` and point `--cf-logo` at it in your new block.
3. For a dark theme, set `--lava-right`, `--lava-left` and `--bell` to the dark images, as Dark, Black and Blue do. For a light theme, leave them out like Pink does, and add your theme name next to `love` in the `&:not([data-theme="love"])` selectors near the end of the file (the ASSETS and dark-only extras sections). Otherwise those rules would use variables that don't exist, and also dim the page for a light theme.
4. Add an option for it in `src/popup/popup.html` (same `data-value` as the theme name, plus 3 `data-colors` for the preview dots).
5. Reload the extension and check a problem page, standings, submissions, a blog and the editor.

## Contributing

Found a page that looks off? Open an issue with the link and a screenshot. PRs are welcome too!
