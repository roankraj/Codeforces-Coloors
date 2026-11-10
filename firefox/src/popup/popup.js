(function () {
  const root = document.getElementById("dd");
  const btn = document.getElementById("dd-btn");
  const list = document.getElementById("dd-list");
  const text = document.getElementById("dd-text");
  const swatches = document.getElementById("dd-swatches");
  const opts = [...list.querySelectorAll(".dd-opt")];
  const focusMode = document.querySelector('[data-util="focus-mode"]');

  // name the shortcuts
  browser.commands.getAll().then((commands) => {
    commands.forEach((command) => {
      const el = document.querySelector(
        `.shortcut[data-command="${command.name}"]`,
      );

      if (!el) return;

      if (command.shortcut) el.textContent = command.shortcut;
      else el.hidden = true;
    });
  });

  // create theme_name to element dictionary
  const optNameMap = new Map(opts.map((opt) => [opt.dataset.value, opt]));

  // Create colour circles for each theme
  opts.forEach((opt) => {
    const dots = document.createElement("span");
    dots.className = "swatches";

    (opt.dataset.colors || "")
      .split(",")
      .slice(0, 3)
      .forEach((color) => {
        const dot = document.createElement("i");
        dot.style.setProperty("--c", color.trim());
        dots.appendChild(dot);
      });

    opt.prepend(dots);
  });

  async function setOptStorage(opt) {
    const theme = opt.dataset.value || "dark";

    if (theme === "light") {
      const result = await browser.storage.local.get("theme");
      const currTheme = result.theme || "dark";
      if (currTheme === "light") return;

      await browser.storage.local.set({
        prevTheme: currTheme,
        theme: "light",
      });
    } else {
      await browser.storage.local.set({ theme });
    }
  }

  // Select a theme and update the dropdown button
  function select(opt) {
    opts.forEach((o) => o.classList.toggle("selected", o === opt));

    text.textContent = opt.textContent.trim().split(/\s+/)[0];

    swatches.replaceChildren(
      ...opt.querySelector(".swatches").cloneNode(true).childNodes,
    );

    root.dataset.value = opt.dataset.value;
    list.hidden = true;
    root.classList.remove("open");
  }

  // Set the initial settings
  browser.storage.local.get(["theme", "focus"]).then((result) => {
    const theme = result.theme || "dark";
    const focus = result.focus || "false";

    focusMode.checked = focus === "true";

    select(opts.find((opt) => opt.dataset.value === theme) || opts[0]);
  });

  // Open or close the dropdown
  btn.addEventListener("click", () => {
    const isOpen = !list.hidden;

    list.hidden = isOpen;
    root.classList.toggle("open", !isOpen);
  });

  // Select a theme when clicked
  opts.forEach((opt) => {
    opt.addEventListener("click", () => {
      select(opt);
      setOptStorage(opt);
    });
  });

  // Close the dropdown when clicking outside
  document.addEventListener("click", (e) => {
    if (!root.contains(e.target)) {
      list.hidden = true;
      root.classList.remove("open");
    }
  });

  // Utilities
  focusMode.addEventListener("change", async () => {
    await browser.storage.local.set({
      focus: focusMode.checked ? "true" : "false",
    });
  });

  browser.storage.onChanged.addListener((changes, area) => {
    if (area !== "local") return;

    if (changes.focus) {
      const focus = changes.focus.newValue || "false";
      focusMode.checked = focus === "true";
    }
    if (changes.theme) {
      const theme = changes.theme.newValue || "dark";
      select(optNameMap.get(theme) ?? optNameMap.get("dark"));
    }
  });
})();
