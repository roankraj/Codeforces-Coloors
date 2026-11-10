if (browser.commands) {
  browser.commands.onCommand.addListener(async (command) => {
    if (command === "toggle-focus-mode") {
      const { focus = "false" } = await browser.storage.local.get("focus");

      await browser.storage.local.set({
        focus: focus === "true" ? "false" : "true",
      });
    } else if (command === "toggle-light-theme") {
      const { theme: currTheme = "dark", prevTheme = "dark" } =
        await browser.storage.local.get(["theme", "prevTheme"]);

      if (currTheme === "light") {
        await browser.storage.local.set({ theme: prevTheme });
      } else {
        await browser.storage.local.set({
          theme: "light",
          prevTheme: currTheme,
        });
      }
    }
  });
}
