# 🎨 Codeforces Coloors

Dark mode and a few other themes for [Codeforces](https://codeforces.com), plus a focus mode for when you just want to solve the problem.

Not affiliated with Codeforces, just a fan restyle.

## What it does

- **Themes:** Dark, Black, Blue, Pink, Light, and Device (follows your OS setting)
- **Styles most of the site:** problems, sample tests, tables, comments, submissions, the heatmap, code highlighting, and the code editor
- **Matching logos:** the Codeforces and Telegram logos change with the theme
- **Focus Mode:** hides the sidebar and widens the content. Toggle it in the popup or press `Ctrl + Shift + F` (`Cmd + Shift + F` on Mac)
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
- **Something's broken:** click **Errors** on the extension's card, or inspect the service worker, to see what's going on.
- **Firefox:** not set up for it, since the manifest uses a Chromium-style service worker.

## Project layout

```
cf-extension/
├── src/
│   ├── manifest.json
│   ├── background.js     # handles the Focus Mode shortcut
│   ├── content/          # theme CSS + script that runs on Codeforces
│   ├── popup/            # the theme picker popup
│   ├── icons/
│   └── img/
├── build.mjs
└── package.json
```

## How it works

The popup saves your pick (`theme`, `focus`) to `chrome.storage`. The content script on Codeforces reads it and sets `data-theme` on the `<html>` tag. `content.css` defines all the colors as CSS variables for each theme, so everything else just uses those variables. The **Light** theme turns all the overrides off, so you see the normal site.

It only runs on `codeforces.com`, only needs the `storage` permission, and doesn't collect any data.

## Adding a theme

1. Copy a `:root[data-theme="..."]` block in `src/content/content.css`, rename it and tweak the colors
2. Add a logo URL for it in `cfLogos` in `src/content/content.js`
3. Add a button for it in `src/popup/popup.html` (same `data-value`, plus 3 `data-colors` for the preview dots)
4. Reload the extension and check a problem page, standings, submissions, a blog and the editor

## Contributing

Found a page that looks off? Open an issue with the link and a screenshot. PRs are welcome too!
