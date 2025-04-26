document.addEventListener("DOMContentLoaded", function () {
  const browserLang = navigator.language.slice(0, 2);
  const supportedLangs = ["en", "sq", "fr", "it", "ru", "es"];
  const defaultLang = supportedLangs.includes(browserLang) ? browserLang : "en";

  const savedLang = localStorage.getItem("lang") || defaultLang;
  applyTranslations(savedLang);

  // Highlight the saved language on load
  document.querySelectorAll("[data-lang]").forEach(el => {
    el.classList.toggle("actively", el.getAttribute("data-lang") === savedLang);
  });

  // Set dropdown label correctly on load
  const dropdownBtn = document.getElementById("languageDropdown");
  if (dropdownBtn) dropdownBtn.innerText = savedLang.toUpperCase();

  // Handle user changing the language
  document.querySelectorAll("[data-lang]").forEach((el) => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      const selectedLang = el.getAttribute("data-lang");

      // Move the `actively` class
      document.querySelectorAll("[data-lang]").forEach(item => {
        item.classList.toggle("actively", item === el);
      });

      localStorage.setItem("lang", selectedLang);

      // Update cart if present
      if (typeof updateCartDisplay === "function") {
        updateCartDisplay();
      }

      // Update the dropdown button text
      if (dropdownBtn) dropdownBtn.innerText = selectedLang.toUpperCase();

      // Reload to rebuild dynamic content in new language
      window.location.reload();
    });
  });
});

function applyTranslations(lang) {
  const langObj = translations[lang];
  if (!langObj) return;

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    const value = getTranslationValue(langObj, key);
    if (value) {
      el.innerHTML = value;
    } else {
      console.error(`Translation missing for key: ${key}`);
    }
  });
}

function getTranslationValue(obj, key) {
  if (obj[key]) return obj[key];

  const parts = key.split(".");
  let current = obj;
  for (let part of parts) {
    if (current.hasOwnProperty(parts.slice(parts.indexOf(part)).join("."))) {
      return current[parts.slice(parts.indexOf(part)).join(".")];
    }
    if (!current[part]) return null;
    current = current[part];
  }
  return typeof current === "string" ? current : null;
}

function flattenTranslations(obj, prefix = '', result = {}) {
  for (const key in obj) {
    const newKey = prefix ? `${prefix}.${key}` : key;
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      flattenTranslations(obj[key], newKey, result);
    } else {
      result[newKey] = obj[key];
    }
  }
  return result;
}

function t(key) {
  const lang = localStorage.getItem("lang") || "en";
  const flatLangObj = flattenTranslations(translations[lang]);
  return flatLangObj[key] || key;
}
