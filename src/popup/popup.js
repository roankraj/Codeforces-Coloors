(function () {
  const root = document.getElementById("dd");
  const btn = document.getElementById("dd-btn");
  const list = document.getElementById("dd-list");
  const text = document.getElementById("dd-text");
  const swatches = document.getElementById("dd-swatches");
  const opts = [...list.querySelectorAll(".dd-opt")];
  const utils = document.querySelector(".utils");
  const focusMode = document.querySelector('[data-util="focus-mode"]');

  // Create colour circles for each theme
  opts.forEach(function (opt) {
    const dots = document.createElement("span");
    dots.className = "swatches";

    (opt.dataset.colors || "")
      .split(",")
      .slice(0, 3)
      .forEach(function (color) {
        const dot = document.createElement("i");
        dot.style.setProperty("--c", color.trim());
        dots.appendChild(dot);
      });

    opt.prepend(dots);
  });

  async function setOptStorage(opt) {
    const theme = opt.dataset.value || "dark";

    await chrome.storage.local.set({ theme });
  }

  // Select a theme and update the dropdown button
  function select(opt) {
    opts.forEach(function (o) {
      o.classList.toggle("selected", o === opt);
    });

    text.textContent = opt.textContent.trim();

    swatches.replaceChildren(
      ...opt.querySelector(".swatches").cloneNode(true).childNodes,
    );

    root.dataset.value = opt.dataset.value;
    list.hidden = true;
    root.classList.remove("open");
  }

  // Set the initial settings
  chrome.storage.local.get(["theme", "focus"], function (result) {
    const theme = result.theme || "dark";
    const focus = result.focus || false;

    focusMode.checked = focus;

    select(
      opts.find(function (opt) {
        return opt.dataset.value === theme;
      }) || opts[0],
    );
  });

  // Open or close the dropdown
  btn.addEventListener("click", function () {
    const isOpen = !list.hidden;

    list.hidden = isOpen;
    root.classList.toggle("open", !isOpen);
  });

  // Select a theme when clicked
  opts.forEach(function (opt) {
    opt.addEventListener("click", function () {
      select(opt);
      setOptStorage(opt);
    });
  });

  // Close the dropdown when clicking outside
  document.addEventListener("click", function (e) {
    if (!root.contains(e.target)) {
      list.hidden = true;
      root.classList.remove("open");
    }
  });

  // Utilites
  focusMode.addEventListener("change", async function () {
    if (focusMode.checked) {
      await chrome.storage.local.set({ focus: true });
    } else {
      await chrome.storage.local.set({ focus: false });
    }
  });
})();
