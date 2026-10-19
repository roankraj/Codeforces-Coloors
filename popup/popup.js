(function () {
  const root = document.getElementById("dd");
  const btn = document.getElementById("dd-btn");
  const list = document.getElementById("dd-list");
  const text = document.getElementById("dd-text");
  const swatches = document.getElementById("dd-swatches");
  const opts = [...list.querySelectorAll(".dd-opt")];

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

  // Set the initial theme
  select(
    opts.find(function (opt) {
      return opt.dataset.value === "dark";
    }) || opts[0],
  );

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
    });
  });

  // Close the dropdown when clicking outside
  document.addEventListener("click", function (e) {
    if (!root.contains(e.target)) {
      list.hidden = true;
      root.classList.remove("open");
    }
  });
})();
