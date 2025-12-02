import { dictionaries, LANG_CODES } from "../i18n/dictionaries.js";

import { dictionaries, LANG_CODES } from "../i18n/dictionaries.js";

// Определяем язык один раз при загрузке страницы
let currentLanguage = (function detectInitialLanguage() {
  let lang = "";

  // 1) Пробуем взять из URL-параметра ?lang=
  try {
    const params = new URLSearchParams(window.location.search);
    lang = (params.get("lang") || "").toLowerCase();
  } catch (e) {
    lang = "";
  }

  const allowed = LANG_CODES || ["ua", "en", "ru", "es"];

  if (!allowed.includes(lang)) {
    // 2) Если в URL нет или неверный — пробуем взять из localStorage
    try {
      const stored = (localStorage.getItem("sayTheNumberLang") || "").toLowerCase();
      if (allowed.includes(stored)) {
        lang = stored;
      }
    } catch (e) {
      // игнорируем
    }
  }

  if (!lang) {
    // 3) Если все ещё пусто — смотрим <html lang="">
    const htmlLang = (document.documentElement.lang || "").toLowerCase();
    if (htmlLang.includes("uk") || htmlLang.includes("ua")) lang = "ua";
    else if (htmlLang.includes("en")) lang = "en";
    else if (htmlLang.includes("ru")) lang = "ru";
    else if (htmlLang.includes("es")) lang = "es";
  }

  if (!lang) {
    // 4) Если и тут ничего — язык браузера
    const browserLang = (navigator.language || navigator.userLanguage || "").toLowerCase();
    if (browserLang.startsWith("uk") || browserLang.startsWith("ua")) lang = "ua";
    else if (browserLang.startsWith("en")) lang = "en";
    else if (browserLang.startsWith("ru")) lang = "ru";
    else if (browserLang.startsWith("es")) lang = "es";
  }

  // 5) Финальный fallback — украинский
  if (!lang || !allowed.includes(lang)) {
    lang = "ua";
  }

  // 6) Сохраняем выбор, чтобы при следующем запуске игра помнила язык
  try {
    localStorage.setItem("sayTheNumberLang", lang);
  } catch (e) {
    // если заблокирован localStorage — просто игнорируем
  }

  return lang;
})();

// слушатели смены языка
const listeners = new Set();

function getFromDictionary(dict, path) {
  return path.split(".").reduce((acc, key) => {
    if (acc && Object.prototype.hasOwnProperty.call(acc, key)) {
      return acc[key];
    }
    return undefined;
  }, dict);
}

function notify() {
  listeners.forEach((listener) => listener(currentLanguage));
}

// 🔹 Инициализация i18n с учётом URL и localStorage
export async function initI18n(defaultLang = "ua") {
  let lang = defaultLang;

  // 1. Пытаемся взять язык из URL (?lang=en / ?lang=ua / ?lang=es / ?lang=ru)
  try {
    const params = new URLSearchParams(window.location.search);
    const urlLang = params.get("lang");
    if (urlLang && LANG_CODES.includes(urlLang)) {
      lang = urlLang;
    } else {
      // 2. Если в URL нет — пробуем из localStorage
      const saved = localStorage.getItem("mws_lang");
      if (saved && LANG_CODES.includes(saved)) {
        lang = saved;
      }
    }
  } catch (e) {
    // если что-то с window/URLSearchParams — просто игнорируем
  }

  // 3. Фолбек — если всё равно что-то не то, ставим "ua"
  if (!LANG_CODES.includes(lang)) {
    lang = "ua";
  }

  currentLanguage = lang;

  // 4. Сохраняем выбранный язык в localStorage для следующих заходов
  try {
    localStorage.setItem("mws_lang", currentLanguage);
  } catch (e) {
    // если localStorage недоступен — просто пропускаем
  }

  return currentLanguage;
}

export function t(path, fallback) {
  const current = getFromDictionary(dictionaries[currentLanguage], path);
  if (current !== undefined) {
    return current;
  }
  if (fallback) {
    return fallback;
  }
  for (const code of LANG_CODES) {
    const fromOther = getFromDictionary(dictionaries[code], path);
    if (fromOther !== undefined) {
      return fromOther;
    }
  }
  return path;
}

export function setLanguage(code) {
  if (!LANG_CODES.includes(code) || code === currentLanguage) {
    return;
  }
  currentLanguage = code;

  // при ручном переключении тоже сохраняем язык
  try {
    localStorage.setItem("mws_lang", currentLanguage);
  } catch (e) {}

  notify();
}

export function getCurrentLanguage() {
  return currentLanguage;
}

export function onLanguageChange(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getAvailableLanguages() {
  return LANG_CODES.map((code) => ({
    code,
    label: dictionaries[code]?.language || code.toUpperCase()
  }));
}
