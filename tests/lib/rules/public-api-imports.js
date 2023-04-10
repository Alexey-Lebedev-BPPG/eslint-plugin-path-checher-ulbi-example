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
    {
      // где расположен файл
      filename:
        "/home/alexey/Рабочий стол/Alexey/Ulbi-Example/src/entities/file.test.ts",
      // какую строчку тестим
      code: "import { addCommentFormActions, addCommentFormReducer, } from '@/entities/Article/testing';",
      // какой результат ошибки (ввиду того, что тестим положительный кейс, здесь их не должно быть)
      errors: [],
      // передаем параметры в плагин
      options: [
        {
          alias: "@",
          testFilesPatterns: [
            "**/*.test.*",
            "**/*.test.*",
            "**/StoreDecorator.tsx",
          ],
        },
      ],
    },
    {
      // где расположен файл
      filename:
        "/home/alexey/Рабочий стол/Alexey/Ulbi-Example/src/entities/StoreDecorator.tsx",
      // какую строчку тестим
      code: "import { addCommentFormActions, addCommentFormReducer, } from '@/entities/Article/testing';",
      // какой результат ошибки (ввиду того, что тестим положительный кейс, здесь их не должно быть)
      errors: [],
      // передаем параметры в плагин
      options: [
        {
          alias: "@",
          testFilesPatterns: [
            "**/*.test.*",
            "**/*.test.*",
            "**/StoreDecorator.tsx",
          ],
        },
      ],
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
    {
      // где расположен файл
      filename:
        "/home/alexey/Рабочий стол/Alexey/Ulbi-Example/src/entities/StoreDecorator.tsx",
      // какую строчку тестим
      code: "import { addCommentFormActions, addCommentFormReducer, } from '@/entities/Article/testing/file.ts';",
      // какой результат ошибки (ввиду того, что тестим положительный кейс, здесь их не должно быть)
      errors: [
        {
          message: "Абсолютный импорт разрешен только из Public API (index.ts)",
        },
      ],
      // передаем параметры в плагин
      options: [
        {
          alias: "@",
          testFilesPatterns: [
            "**/*.test.*",
            "**/*.test.*",
            "**/StoreDecorator.tsx",
          ],
        },
      ],
    },
    {
      // где расположен файл
      filename:
        "/home/alexey/Рабочий стол/Alexey/Ulbi-Example/src/entities/forbidden.ts",
      // какую строчку тестим
      code: "import { addCommentFormActions, addCommentFormReducer, } from '@/entities/Article/testing';",
      // какой результат ошибки (ввиду того, что тестим положительный кейс, здесь их не должно быть)
      errors: [
        {
          message:
            "Тестовые данные необходимо импортировать из publicApi/testing.ts",
        },
      ],
      // передаем параметры в плагин
      options: [
        {
          alias: "@",
          testFilesPatterns: [
            "**/*.test.*",
            "**/*.test.*",
            "**/StoreDecorator.tsx",
          ],
        },
      ],
    },
  ],
});
