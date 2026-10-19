let cfReplaced = false;
let teleReplaced = false;

let focusModeChanges = false;

function toggleFocus(focus) {
  const main = document.querySelector("html body .content-with-sidebar");
  const sidebar = document.querySelector("#sidebar");

  if (focus) {
    if (main) {
      main.style.setProperty("margin", "1em 11em", "important");
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
  if (!cfReplaced) {
    const cfLogo = document.querySelector('img[alt="Codeforces"]');
    if (
      cfLogo &&
      cfLogo.src.includes("codeforces-logo-with-telegram-555x130.png")
    ) {
      cfLogo.src =
        "https://res.cloudinary.com/mt8ekld4/image/upload/v1791866063/output_image.webp";
      cfLogo.style.setProperty("visibility", "visible", "important");
      cfLogo.style.setProperty("opacity", "1", "important");
      cfReplaced = true;
    }
  }

  if (!teleReplaced) {
    const teleLogo = document.querySelector('img[alt="Telegram"]');
    if (teleLogo && teleLogo.src.includes("telegram-100x100.png")) {
      teleLogo.src =
        "https://res.cloudinary.com/mt8ekld4/image/upload/v1791795490/telegram-100x100-dark.webp";
      teleLogo.style.setProperty("visibility", "visible", "important");
      teleLogo.style.setProperty("opacity", "1", "important");
      teleReplaced = true;
    }
  }

  const blogHeadingAll = document.querySelectorAll('a[href*="/blog/"]');
  blogHeadingAll.forEach((blogHeading) => {
    blogHeading.style.setProperty("color", "var(--soft)", "important");
  });

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

  if (cfReplaced && teleReplaced && pageContent && focusModeChanges) {
    obs.disconnect();
  }
});

observer.observe(document.documentElement, {
  childList: true,
  subtree: true,
});

chrome.storage.onChanged.addListener(function (changes, storageArea) {
  if (storageArea === "local" && changes.theme) {
    const newValue = changes.theme.newValue || "dark";

    document.documentElement.setAttribute("data-theme", newValue);
  }

  if (storageArea === "local" && changes.focus) {
    const newValue = changes.focus.newValue || false;

    toggleFocus(newValue);
  }
});

chrome.storage.local.get("theme", function (result) {
  const theme = result.theme || "dark";

  document.documentElement.setAttribute("data-theme", theme);
});
