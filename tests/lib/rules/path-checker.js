"use strict";

const rule = require("../../../lib/rules/path-checker"),
  RuleTester = require("eslint").RuleTester;

// тестирование пакета
const ruleTester = new RuleTester({
  // добавляем поддержку импортов
  parserOptions: { ecmaVersion: 6, sourceType: "module" },
});

ruleTester.run("path-checker", rule, {
  valid: [
    {
      // где расположен файл
      filename:
        "/home/alexey/Рабочий стол/Alexey/Ulbi-Example/src/entities/Article",
      // какую строчку тестим
      code: "import { addCommentFormActions, addCommentFormReducer, } from '../../model/slice/addCommentForm';",
      // какой результат ошибки (ввиду того, что тестим положительный кейс, здесь их не должно быть)
      errors: [],
    },
  ],
  // тестирование неправильного импорта
  invalid: [
    // тестируем без алиаса
    {
      // где расположен файл
      filename:
        "/home/alexey/Рабочий стол/Alexey/Ulbi-Example/src/entities/Article",
      // какую строчку тестим
      code: "import { addCommentFormActions, addCommentFormReducer, } from 'entities/Article/model/slice/addCommentForm';",
      // какой результат ошибки
      errors: [
        {
          message: "В рамках одного слайса все пути должны быть относительными",
        },
      ],
    },
    // тестируем с алиасом
    {
      // где расположен файл
      filename:
        "/home/alexey/Рабочий стол/Alexey/Ulbi-Example/src/entities/Article",
      // какую строчку тестим
      code: "import { addCommentFormActions, addCommentFormReducer, } from '@/entities/Article/model/slice/addCommentForm';",
      // какой результат ошибки
      errors: [
        {
          message: "В рамках одного слайса все пути должны быть относительными",
        },
      ],
      // передаем алиас в плагин
      options: [{ alias: "@" }],
    },
  ],
});
