chrome.commands.onCommand.addListener(async function (command) {
  if (command === "toggle-focus-mode") {
    chrome.storage.local.get("focus", async function (result) {
      const focus = result.focus || "false";
      const newFocus = focus === "true" ? "false" : "true";

      await chrome.storage.local.set({ focus: newFocus });
    });
  } else if (command === "toggle-light-theme") {
    chrome.storage.local.get("theme", async function (result) {
      const currTheme = result.theme || "dark";

      if (currTheme === "light") {
        chrome.storage.local.get("prevTheme", async function (prevResult) {
          const prevTheme = prevResult.prevTheme || "dark";
          await chrome.storage.local.set({ theme: prevTheme });
        });
      } else if (currTheme !== "light") {
        await chrome.storage.local.set({
          theme: "light",
          prevTheme: currTheme,
        });
      }
    });
  }
});
