chrome.commands.onCommand.addListener(async function (command) {
  if (command === "toggle-focus-mode") {
    chrome.storage.local.get("focus", async function (result) {
      const focus = result.focus || false;

      await chrome.storage.local.set({ focus: !focus });
    });
  }
});
