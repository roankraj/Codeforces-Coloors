(function () {
  if (!chrome.commands || !chrome.commands.onCommand) {
    return;
  }

  chrome.commands.onCommand.addListener(function (command) {
    if (command === "toggle-focus-mode") {
      chrome.storage.local.get("focus", function (result) {
        const focus = result.focus || "false";

        chrome.storage.local.set({
          focus: focus === "true" ? "false" : "true",
        });
      });
    } else if (command === "toggle-light-theme") {
      chrome.storage.local.get(["theme", "prevTheme"], function (result) {
        const currTheme = result.theme || "dark";
        const prevTheme = result.prevTheme || "dark";

        if (currTheme === "light") {
          chrome.storage.local.set({
            theme: prevTheme,
          });
        } else {
          chrome.storage.local.set({
            theme: "light",
            prevTheme: currTheme,
          });
        }
      });
    }
  });
})();
