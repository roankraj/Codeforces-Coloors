chrome.commands.onCommand.addListener(async function (command) {
  if (command === "toggle-focus-mode") {
    browser.storage.local.get("focus", async function (result) {
      const focus = result.focus || "false";
      const newFocus = focus === "true" ? "false" : "true";

      await browser.storage.local.set({ focus: newFocus });
    });
  }
});
