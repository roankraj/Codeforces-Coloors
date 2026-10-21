let focusModeChanges = false;

function toggleFocus(focus) {
  const main = document.querySelector("html body .content-with-sidebar");
  const sidebar = document.querySelector("#sidebar");

  if (focus) {
    if (main) {
      main.style.setProperty("margin", "1em 11.625em", "important");
    }
    if (sidebar) {
      sidebar.style.setProperty("opacity", "0", "important");
      sidebar.style.setProperty("pointer-events", "none", "important");
    }
  } else {
    if (main) {
      main.style.setProperty("margin", "1em 22em 1em 1em", "important");
    }
    if (sidebar) {
      sidebar.style.setProperty("opacity", "1", "important");
      sidebar.style.setProperty("pointer-events", "auto", "important");
    }
  }
}

const observer = new MutationObserver((mutations, obs) => {
  const pageContent = document.getElementById("pageContent");

  if (pageContent) {
    if (!pageContent.classList.contains("content-with-sidebar")) {
      focusModeChanges = true;
    } else {
      const main = document.querySelector(".content-with-sidebar");
      const sidebar = document.querySelector("#sidebar");

      if (main && sidebar) {
        chrome.storage.local.get(["focus"], function (result) {
          const focus = result.focus ?? false;

          if (focus) {
            main.style.setProperty("margin", "1em 11em", "important");
            if (sidebar) {
              sidebar.style.setProperty("opacity", "0", "important");
              sidebar.style.setProperty("pointer-events", "none", "important");
            }
          } else {
            main.style.setProperty("margin", "1em 22em 1em 1em", "important");
            if (sidebar) {
              sidebar.style.setProperty("opacity", "1", "important");
              sidebar.style.setProperty("pointer-events", "auto", "important");
            }
          }
        });

        focusModeChanges = true;
      }
    }
  }

  if (pageContent && focusModeChanges) {
    obs.disconnect();
  }
});

observer.observe(document.documentElement, {
  childList: true,
  subtree: true,
});

chrome.storage.onChanged.addListener(function (changes, storageArea) {
  if (storageArea === "local" && changes.theme) {
    let newValue = changes.theme.newValue || "dark";

    if (newValue === "device") {
      const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

      newValue = isDark ? "dark" : "light";
    }

    document.documentElement.setAttribute("data-theme", newValue);
  }

  if (storageArea === "local" && changes.focus) {
    const newValue = changes.focus.newValue || false;

    toggleFocus(newValue);
  }
});

chrome.storage.local.get("theme", function (result) {
  let theme = result.theme || "dark";

  if (theme === "device") {
    const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

    theme = isDark ? "dark" : "light";
  }

  document.documentElement.setAttribute("data-theme", theme);
});
