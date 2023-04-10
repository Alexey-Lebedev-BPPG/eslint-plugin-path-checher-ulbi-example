"use strict";

const rule = require("../../../lib/rules/public-api-imports"),
  RuleTester = require("eslint").RuleTester;

const ruleTester = new RuleTester({
  // добавляем поддержку импортов
  parserOptions: { ecmaVersion: 6, sourceType: "module" },
});

const aliasOptions = [{ alias: "@" }];

ruleTester.run("public-api-imports", rule, {
  valid: [
    {
      // какую строчку тестим
      code: "import { addCommentFormActions, addCommentFormReducer, } from '../../model/slice/addCommentForm';",
      // какой результат ошибки (ввиду того, что тестим положительный кейс, здесь их не должно быть)
      errors: [],
    },
    {
      // какую строчку тестим
      code: "import { addCommentFormActions, addCommentFormReducer, } from '@/entities/Article';",
      // какой результат ошибки (ввиду того, что тестим положительный кейс, здесь их не должно быть)
      errors: [],
    },
  ],
  // тестирование неправильного импорта
  invalid: [
    {
      // какую строчку тестим
      code: "import { addCommentFormActions, addCommentFormReducer, } from '@/entities/Article/model/file.ts';",
      // какой результат ошибки
      errors: [
        {
          message: "Абсолютный импорт разрешен только из Public API (index.ts)",
        },
      ],
      // передаем алиас в плагин
      options: aliasOptions,
    },
  ],
});
