let cfReplaced = false;
let teleReplaced = false;

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
    blogHeading.style.setProperty("color", "#eee", "important");
  });

  const pageContent = document.getElementById("pageContent");
  if (cfReplaced && teleReplaced && pageContent) {
    obs.disconnect();
  }
});

observer.observe(document.documentElement, {
  childList: true,
  subtree: true,
});
