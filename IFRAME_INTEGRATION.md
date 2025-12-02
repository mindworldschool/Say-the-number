# Интеграция игры "Say the Number" через iframe

## Код для встраивания на сайт MindWorld School

Используйте этот код на страницах сайта для автоматического определения языка игры:

```html
<iframe
  id="say-the-number-iframe"
  src=""
  style="width: 100%; height: 600px; border: none;"
  title="Say the Number - Number Recognition Game"
></iframe>

<script>
(function () {
  let lang = "";
  const path = window.location.pathname.toLowerCase();
  const htmlLang = (document.documentElement.lang || "").toLowerCase();

  console.log("[Say the Number] PATH:", path);
  console.log("[Say the Number] html lang:", htmlLang);

  // 1. Определение языка по пути страницы
  if (path.includes("/en/") || path.endsWith("/en")) {
    lang = "en";
  } else if (path.includes("/ru/") || path.endsWith("/ru")) {
    lang = "ru";
  } else if (path.includes("/es/") || path.endsWith("/es")) {
    lang = "es";
  }

  // 2. Если путь не содержит языковой префикс (украинская версия без /ua/)
  if (!lang) {
    if (htmlLang.includes("uk") || htmlLang.includes("ua")) {
      lang = "ua";
    } else if (htmlLang.includes("en")) {
      lang = "en";
    } else if (htmlLang.includes("ru")) {
      lang = "ru";
    } else if (htmlLang.includes("es")) {
      lang = "es";
    }
  }

  // 3. Если всё ещё не определили — язык браузера
  if (!lang) {
    const browserLang = (navigator.language || "").toLowerCase();
    if (browserLang.startsWith("uk") || browserLang.startsWith("ua")) {
      lang = "ua";
    } else if (browserLang.startsWith("en")) {
      lang = "en";
    } else if (browserLang.startsWith("ru")) {
      lang = "ru";
    } else if (browserLang.startsWith("es")) {
      lang = "es";
    }
  }

  // 4. По умолчанию — украинский
  if (!lang) lang = "ua";

  console.log("[Say the Number] FINAL LANG =", lang);

  // 5. Устанавливаем URL игры с нужным языком
  const gameURL = "https://mindworldschool.github.io/Say-the-number/?lang=" + lang;
  document.getElementById("say-the-number-iframe").src = gameURL;
})();
</script>
```

## Как это работает:

1. **Определение по пути URL:**
   - `/en/` → английский
   - `/ru/` → русский
   - `/es/` → испанский
   - без префикса → украинский

2. **Определение по атрибуту lang в HTML:**
   - `<html lang="uk">` → украинский
   - `<html lang="en">` → английский
   - и т.д.

3. **Определение по языку браузера** (если предыдущие методы не сработали)

4. **По умолчанию:** украинский язык

## Пример для разных страниц:

### Украинская страница (без языкового префикса):
```
https://mindworldschool.com/lessons/memory → игра откроется на украинском
```

### Английская страница:
```
https://mindworldschool.com/en/lessons/memory → игра откроется на английском
```

### Русская страница:
```
https://mindworldschool.com/ru/lessons/memory → игра откроется на русском
```

### Испанская страница:
```
https://mindworldschool.com/es/lessons/memory → игра откроется на испанском
```

## Важно:

- ID iframe должен быть `say-the-number-iframe` (или измените его в скрипте)
- Убедитесь, что атрибут `lang` установлен в теге `<html>` для резервного определения языка
- Скрипт должен выполняться после загрузки iframe элемента
