// Dictionaries for Number Recognition Trainer
export const dictionaries = {
  "ua": {
    "language": "Українська",
    "header": {
      "titleMain": "Mind Abacus",
      "tagline": "Розпізнавання чисел на абакусі"
    },
    "footer": "MindWorld School © 2025",
    
    "settings": {
      "title": "Налаштування тренування",
      "description": "Оберіть параметри для тренування розпізнавання чисел",
      "digitsLabel": "Розрядність числа",
      "digitsOptions": [
        { "value": 1, "label": "1 цифра (0-9)" },
        { "value": 2, "label": "2 цифри (10-99)" },
        { "value": 3, "label": "3 цифри (100-999)" },
        { "value": 4, "label": "4 цифри (1000-9999)" },
        { "value": 5, "label": "5 цифр (10000-99999)" },
        { "value": 6, "label": "6 цифр (100000-999999)" },
        { "value": 7, "label": "7 цифр" },
        { "value": 8, "label": "8 цифр" },
        { "value": 9, "label": "9 цифр" }
      ],
      "timeLabel": "Час показу числа",
      "timeUnit": "сек",
      "totalExamplesLabel": "Кількість прикладів",
      "totalExamplesOptions": [
        { "value": 5, "label": "5 прикладів" },
        { "value": 10, "label": "10 прикладів" },
        { "value": 20, "label": "20 прикладів" },
        { "value": 50, "label": "50 прикладів" },
        { "value": 100, "label": "100 прикладів" }
      ],
      "startButton": "Почати тренування"
    },
    
    "game": {
      "prepare": "Приготуйтесь...",
      "watch": "Запам'ятайте число!",
      "answerPrompt": "Яке число ви побачили?",
      "answerPlaceholder": "Введіть число",
      "submitButton": "Відповісти",
      "correct": "Правильно! 🎉",
      "incorrect": "Неправильно",
      "correctWas": "Правильна відповідь:",
      "progress": "Приклад {current} з {total}",
      "score": "Рахунок",
      "correctCount": "Правильно",
      "incorrectCount": "Помилок"
    },
    
    "results": {
      "title": "Результати тренування",
      "description": "Ось як ви впоралися",
      "accuracy": "Точність",
      "correctAnswers": "Правильних відповідей",
      "incorrectAnswers": "Помилок",
      "totalExamples": "Всього прикладів",
      "duration": "Час тренування",
      "durationFormat": "{seconds} сек",
      "excellent": "Відмінно! 🌟",
      "good": "Добре! 👍",
      "needPractice": "Потрібно більше практики 💪",
      "newSessionButton": "Нове тренування",
      "changeSettingsButton": "Змінити налаштування"
    },
    
    "errors": {
      "emptyAnswer": "Будь ласка, введіть число",
      "invalidAnswer": "Введіть коректне число",
      "generic": "Сталася помилка"
    }
  },

  "en": {
    "language": "English",
    "header": {
      "titleMain": "Mind Abacus",
      "tagline": "Number Recognition on Abacus"
    },
    "footer": "MindWorld School © 2025",
    
    "settings": {
      "title": "Training Settings",
      "description": "Choose parameters for number recognition training",
      "digitsLabel": "Number of Digits",
      "digitsOptions": [
        { "value": 1, "label": "1 digit (0-9)" },
        { "value": 2, "label": "2 digits (10-99)" },
        { "value": 3, "label": "3 digits (100-999)" },
        { "value": 4, "label": "4 digits (1000-9999)" },
        { "value": 5, "label": "5 digits (10000-99999)" },
        { "value": 6, "label": "6 digits (100000-999999)" },
        { "value": 7, "label": "7 digits" },
        { "value": 8, "label": "8 digits" },
        { "value": 9, "label": "9 digits" }
      ],
      "timeLabel": "Display Time",
      "timeUnit": "sec",
      "totalExamplesLabel": "Number of Examples",
      "totalExamplesOptions": [
        { "value": 5, "label": "5 examples" },
        { "value": 10, "label": "10 examples" },
        { "value": 20, "label": "20 examples" },
        { "value": 50, "label": "50 examples" },
        { "value": 100, "label": "100 examples" }
      ],
      "startButton": "Start Training"
    },
    
    "game": {
      "prepare": "Get ready...",
      "watch": "Remember this number!",
      "answerPrompt": "What number did you see?",
      "answerPlaceholder": "Enter number",
      "submitButton": "Submit",
      "correct": "Correct! 🎉",
      "incorrect": "Incorrect",
      "correctWas": "Correct answer:",
      "progress": "Example {current} of {total}",
      "score": "Score",
      "correctCount": "Correct",
      "incorrectCount": "Mistakes"
    },
    
    "results": {
      "title": "Training Results",
      "description": "Here's how you did",
      "accuracy": "Accuracy",
      "correctAnswers": "Correct Answers",
      "incorrectAnswers": "Mistakes",
      "totalExamples": "Total Examples",
      "duration": "Training Time",
      "durationFormat": "{seconds} sec",
      "excellent": "Excellent! 🌟",
      "good": "Good! 👍",
      "needPractice": "Need more practice 💪",
      "newSessionButton": "New Training",
      "changeSettingsButton": "Change Settings"
    },
    
    "errors": {
      "emptyAnswer": "Please enter a number",
      "invalidAnswer": "Please enter a valid number",
      "generic": "An error occurred"
    }
  },

  "ru": {
    "language": "Русский",
    "header": {
      "titleMain": "Mind Abacus",
      "tagline": "Распознавание чисел на абакусе"
    },
    "footer": "MindWorld School © 2025",
    
    "settings": {
      "title": "Настройки тренировки",
      "description": "Выберите параметры для тренировки распознавания чисел",
      "digitsLabel": "Разрядность числа",
      "digitsOptions": [
        { "value": 1, "label": "1 цифра (0-9)" },
        { "value": 2, "label": "2 цифры (10-99)" },
        { "value": 3, "label": "3 цифры (100-999)" },
        { "value": 4, "label": "4 цифры (1000-9999)" },
        { "value": 5, "label": "5 цифр (10000-99999)" },
        { "value": 6, "label": "6 цифр (100000-999999)" },
        { "value": 7, "label": "7 цифр" },
        { "value": 8, "label": "8 цифр" },
        { "value": 9, "label": "9 цифр" }
      ],
      "timeLabel": "Время показа числа",
      "timeUnit": "сек",
      "totalExamplesLabel": "Количество примеров",
      "totalExamplesOptions": [
        { "value": 5, "label": "5 примеров" },
        { "value": 10, "label": "10 примеров" },
        { "value": 20, "label": "20 примеров" },
        { "value": 50, "label": "50 примеров" },
        { "value": 100, "label": "100 примеров" }
      ],
      "startButton": "Начать тренировку"
    },
    
    "game": {
      "prepare": "Приготовьтесь...",
      "watch": "Запомните число!",
      "answerPrompt": "Какое число вы видели?",
      "answerPlaceholder": "Введите число",
      "submitButton": "Ответить",
      "correct": "Правильно! 🎉",
      "incorrect": "Неправильно",
      "correctWas": "Правильный ответ:",
      "progress": "Пример {current} из {total}",
      "score": "Счёт",
      "correctCount": "Правильно",
      "incorrectCount": "Ошибок"
    },
    
    "results": {
      "title": "Результаты тренировки",
      "description": "Вот как вы справились",
      "accuracy": "Точность",
      "correctAnswers": "Правильных ответов",
      "incorrectAnswers": "Ошибок",
      "totalExamples": "Всего примеров",
      "duration": "Время тренировки",
      "durationFormat": "{seconds} сек",
      "excellent": "Отлично! 🌟",
      "good": "Хорошо! 👍",
      "needPractice": "Нужно больше практики 💪",
      "newSessionButton": "Новая тренировка",
      "changeSettingsButton": "Изменить настройки"
    },
    
    "errors": {
      "emptyAnswer": "Пожалуйста, введите число",
      "invalidAnswer": "Введите корректное число",
      "generic": "Произошла ошибка"
    }
  },

  "es": {
    "language": "Español",
    "header": {
      "titleMain": "Mind Abacus",
      "tagline": "Reconocimiento de números en el ábaco"
    },
    "footer": "MindWorld School © 2025",
    
    "settings": {
      "title": "Configuración del entrenamiento",
      "description": "Elige los parámetros para el entrenamiento de reconocimiento de números",
      "digitsLabel": "Número de dígitos",
      "digitsOptions": [
        { "value": 1, "label": "1 dígito (0-9)" },
        { "value": 2, "label": "2 dígitos (10-99)" },
        { "value": 3, "label": "3 dígitos (100-999)" },
        { "value": 4, "label": "4 dígitos (1000-9999)" },
        { "value": 5, "label": "5 dígitos (10000-99999)" },
        { "value": 6, "label": "6 dígitos (100000-999999)" },
        { "value": 7, "label": "7 dígitos" },
        { "value": 8, "label": "8 dígitos" },
        { "value": 9, "label": "9 dígitos" }
      ],
      "timeLabel": "Tiempo de visualización",
      "timeUnit": "seg",
      "totalExamplesLabel": "Número de ejemplos",
      "totalExamplesOptions": [
        { "value": 5, "label": "5 ejemplos" },
        { "value": 10, "label": "10 ejemplos" },
        { "value": 20, "label": "20 ejemplos" },
        { "value": 50, "label": "50 ejemplos" },
        { "value": 100, "label": "100 ejemplos" }
      ],
      "startButton": "Comenzar entrenamiento"
    },
    
    "game": {
      "prepare": "Prepárate...",
      "watch": "¡Recuerda este número!",
      "answerPrompt": "¿Qué número viste?",
      "answerPlaceholder": "Ingresa el número",
      "submitButton": "Enviar",
      "correct": "¡Correcto! 🎉",
      "incorrect": "Incorrecto",
      "correctWas": "Respuesta correcta:",
      "progress": "Ejemplo {current} de {total}",
      "score": "Puntuación",
      "correctCount": "Correctos",
      "incorrectCount": "Errores"
    },
    
    "results": {
      "title": "Resultados del entrenamiento",
      "description": "Así te fue",
      "accuracy": "Precisión",
      "correctAnswers": "Respuestas correctas",
      "incorrectAnswers": "Errores",
      "totalExamples": "Total de ejemplos",
      "duration": "Tiempo de entrenamiento",
      "durationFormat": "{seconds} seg",
      "excellent": "¡Excelente! 🌟",
      "good": "¡Bien! 👍",
      "needPractice": "Necesitas más práctica 💪",
      "newSessionButton": "Nuevo entrenamiento",
      "changeSettingsButton": "Cambiar configuración"
    },
    
    "errors": {
      "emptyAnswer": "Por favor ingresa un número",
      "invalidAnswer": "Por favor ingresa un número válido",
      "generic": "Ocurrió un error"
    }
  }
};

// Explicitly set language order: UA, EN, RU, ES
export const LANG_CODES = ["ua", "en", "ru", "es"];
