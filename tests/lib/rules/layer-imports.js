"use strict";

const rule = require("../../../lib/rules/layer-imports"),
  RuleTester = require("eslint").RuleTester;

const ruleTester = new RuleTester({
  // добавляем поддержку импортов
  parserOptions: { ecmaVersion: 6, sourceType: "module" },
});

const aliasOptions = [{ alias: "@" }];

ruleTester.run("layer-imports", rule, {
  valid: [
    {
      filename:
        "C:\\Users\\tim\\Desktop\\javascript\\GOOD_COURSE_test\\src\\features\\Article",
      // какую строчку тестим
      code: "import { addCommentFormActions, addCommentFormReducer, } from '@/shared/Button.tsx';",
      // какой результат ошибки (ввиду того, что тестим положительный кейс, здесь их не должно быть)
      errors: [],
      options: aliasOptions,
    },
    {
      filename:
        "C:\\Users\\tim\\Desktop\\javascript\\GOOD_COURSE_test\\src\\features\\Article",
      // какую строчку тестим
      code: "import { addCommentFormActions, addCommentFormReducer, } from '@/entities/Article';",
      // какой результат ошибки (ввиду того, что тестим положительный кейс, здесь их не должно быть)
      errors: [],
      options: aliasOptions,
    },
    {
      filename:
        "C:\\Users\\tim\\Desktop\\javascript\\GOOD_COURSE_test\\src\\app\\providers",
      // какую строчку тестим
      code: "import { addCommentFormActions, addCommentFormReducer, } from '@/widgets/Article';",
      // какой результат ошибки (ввиду того, что тестим положительный кейс, здесь их не должно быть)
      errors: [],
      options: aliasOptions,
    },
    {
      filename:
        "C:\\Users\\tim\\Desktop\\javascript\\GOOD_COURSE_test\\src\\widgets\\pages",
      // какую строчку тестим
      code: "import { useLocation } from 'react-router-dom';",
      // какой результат ошибки (ввиду того, что тестим положительный кейс, здесь их не должно быть)
      errors: [],
      options: aliasOptions,
    },
    {
      filename:
        "C:\\Users\\tim\\Desktop\\javascript\\GOOD_COURSE_test\\src\\app\\providers",
      // какую строчку тестим
      code: "import { useLocation } from 'redux';",
      // какой результат ошибки (ввиду того, что тестим положительный кейс, здесь их не должно быть)
      errors: [],
      options: aliasOptions,
    },
    {
      filename:
        "C:\\Users\\tim\\Desktop\\javascript\\GOOD_COURSE_test\\src\\index.tsx",
      // какую строчку тестим
      code: "import { StoreProvider } from '@/app/providers/StoreProvider';",
      // какой результат ошибки (ввиду того, что тестим положительный кейс, здесь их не должно быть)
      errors: [],
      options: aliasOptions,
    },
    {
      filename:
        "C:\\Users\\tim\\Desktop\\javascript\\GOOD_COURSE_test\\src\\entities\\Article.ts",
      // какую строчку тестим
      code: "import { StateSchema } from '@/app/providers/StoreProvider';",
      // какой результат ошибки (ввиду того, что тестим положительный кейс, здесь их не должно быть)
      errors: [],
      options: [{ alias: "@", ignoreImportPatterns: ["**/StoreProvider"] }],
    },
  ],
  // тестирование неправильного импорта
  invalid: [
    {
      filename:
        "C:\\Users\\tim\\Desktop\\javascript\\GOOD_COURSE_test\\src\\entities\\providers",
      // какую строчку тестим
      code: "import { useLocation } from '@/features/Article';",
      // какой результат ошибки (ввиду того, что тестим положительный кейс, здесь их не должно быть)
      errors: [
        { message: "Слой может импортировать в себя только нижележащие слои" },
      ],
      options: aliasOptions,
    },
    {
      filename:
        "C:\\Users\\tim\\Desktop\\javascript\\GOOD_COURSE_test\\src\\features\\providers",
      // какую строчку тестим
      code: "import { useLocation } from '@/widgets/Article';",
      // какой результат ошибки (ввиду того, что тестим положительный кейс, здесь их не должно быть)
      errors: [
        { message: "Слой может импортировать в себя только нижележащие слои" },
      ],
      options: aliasOptions,
    },
    {
      filename:
        "C:\\Users\\tim\\Desktop\\javascript\\GOOD_COURSE_test\\src\\entities\\providers",
      // какую строчку тестим
      code: "import { useLocation } from '@/widgets/Article';",
      // какой результат ошибки (ввиду того, что тестим положительный кейс, здесь их не должно быть)
      errors: [
        { message: "Слой может импортировать в себя только нижележащие слои" },
      ],
      options: aliasOptions,
    },
  ],
});
