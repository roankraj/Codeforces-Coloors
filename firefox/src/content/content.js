browser.storage.onChanged.addListener(function (changes, storageArea) {
  if (storageArea === "local" && changes.theme) {
    let newValue = changes.theme.newValue || "dark";

    if (newValue === "device") {
      const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

      newValue = isDark ? "dark" : "light";
    }

    document.documentElement.setAttribute("data-theme", newValue);
  }

  if (storageArea === "local" && changes.focus) {
    const newValue = changes.focus.newValue || "false";

    document.documentElement.setAttribute("data-focus-mode", newValue);
  }
});

browser.storage.local.get(["theme", "focus"], function (result) {
  let theme = result.theme || "dark";
  const focus = result.focus || "false";

  if (theme === "device") {
    const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

    theme = isDark ? "dark" : "light";
  }

  document.documentElement.setAttribute("data-focus-mode", focus);
  document.documentElement.setAttribute("data-theme", theme);
});
