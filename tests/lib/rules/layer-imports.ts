import rule from '../../../lib/rules/layer-imports';
import { RuleTester } from 'eslint';

const ruleTester = new RuleTester({
  // добавляем поддержку импортов
  parserOptions: { ecmaVersion: 6, sourceType: "module" },
});

const aliasOptionsReact = [{ alias: "@", typeProject: 'react' }];
const aliasOptionsNext = [{ alias: "@", typeProject: 'next' }];

ruleTester.run("layer-imports", rule, {
  valid: [
    {
      filename:
        "C:\\Users\\tim\\Desktop\\javascript\\GOOD_COURSE_test\\src\\features\\Article",
      // какую строчку тестим
      code: "import { addCommentFormActions, addCommentFormReducer, } from '@/shared/Button.tsx';",
      // какой результат ошибки (ввиду того, что тестим положительный кейс, здесь их не должно быть)
      // errors: [],
      options: aliasOptionsReact,
    },
    {
      filename:
        "C:\\Users\\tim\\Desktop\\javascript\\GOOD_COURSE_test\\src\\features\\Article",
      // какую строчку тестим
      code: "import { addCommentFormActions, addCommentFormReducer, } from '@/shared/Button.tsx';",
      options: aliasOptionsNext,
    },
    {
      filename:
        "C:\\Users\\tim\\Desktop\\javascript\\GOOD_COURSE_test\\src\\features\\Article",
      // какую строчку тестим
      code: "import { addCommentFormActions, addCommentFormReducer, } from '@/entities/Article';",
      options: aliasOptionsReact,
    },
    {
      filename:
        "C:\\Users\\tim\\Desktop\\javascript\\GOOD_COURSE_test\\src\\features\\Article",
      // какую строчку тестим
      code: "import { addCommentFormActions, addCommentFormReducer, } from '@/entities/Article';",
      options: aliasOptionsNext,
    },
    {
      filename:
        "C:\\Users\\tim\\Desktop\\javascript\\GOOD_COURSE_test\\src\\app\\providers",
      // какую строчку тестим
      code: "import { addCommentFormActions, addCommentFormReducer, } from '@/widgets/Article';",
      options: aliasOptionsReact,
    },
    {
      filename:
        "C:\\Users\\tim\\Desktop\\javascript\\GOOD_COURSE_test\\src\\app-fsd\\providers",
      // какую строчку тестим
      code: "import { addCommentFormActions, addCommentFormReducer, } from '@/widgets/Article';",
      options: aliasOptionsNext,
    },
    {
      filename:
        "C:\\Users\\tim\\Desktop\\javascript\\GOOD_COURSE_test\\src\\widgets\\pages",
      // какую строчку тестим
      code: "import { useLocation } from 'react-router-dom';",
      options: aliasOptionsReact,
    },
    {
      filename:
        "C:\\Users\\tim\\Desktop\\javascript\\GOOD_COURSE_test\\src\\widgets\\pages-fsd",
      // какую строчку тестим
      code: "import { useLocation } from 'react-router-dom';",
      options: aliasOptionsNext,
    },
    {
      filename:
        "C:\\Users\\tim\\Desktop\\javascript\\GOOD_COURSE_test\\src\\app\\providers",
      // какую строчку тестим
      code: "import { useLocation } from 'redux';",
      options: aliasOptionsReact,
    },
    {
      filename:
        "C:\\Users\\tim\\Desktop\\javascript\\GOOD_COURSE_test\\src\\app-fsd\\providers",
      // какую строчку тестим
      code: "import { useLocation } from 'redux';",
      options: aliasOptionsNext,
    },
    {
      filename:
        "C:\\Users\\tim\\Desktop\\javascript\\GOOD_COURSE_test\\src\\index.tsx",
      // какую строчку тестим
      code: "import { StoreProvider } from '@/app/providers/StoreProvider';",
      options: aliasOptionsReact,
    },
    {
      filename:
        "C:\\Users\\tim\\Desktop\\javascript\\GOOD_COURSE_test\\src\\index.tsx",
      // какую строчку тестим
      code: "import { StoreProvider } from '@/app-fsd/providers/StoreProvider';",
      options: aliasOptionsNext,
    },
    {
      filename:
        "C:\\Users\\tim\\Desktop\\javascript\\GOOD_COURSE_test\\src\\entities\\Article.ts",
      // какую строчку тестим
      code: "import { StateSchema } from '@/app/providers/StoreProvider';",
      options: [{ alias: "@", typeProject: 'react', ignoreImportPatterns: ["**/StoreProvider"] }],
    },
    {
      filename:
        "C:\\Users\\tim\\Desktop\\javascript\\GOOD_COURSE_test\\src\\entities\\Article.ts",
      // какую строчку тестим
      code: "import { StateSchema } from '@/app-fsd/providers/StoreProvider';",
      options: [{ alias: "@", typeProject: 'next', ignoreImportPatterns: ["**/StoreProvider"] }],
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
        { message: "Слой может импортировать в себя только нижележащие слои [shared,entities]" },
      ],
      options: aliasOptionsReact,
    },
    {
      filename:
        "C:\\Users\\tim\\Desktop\\javascript\\GOOD_COURSE_test\\src\\entities\\providers",
      // какую строчку тестим
      code: "import { useLocation } from '@/features/Article';",
      // какой результат ошибки (ввиду того, что тестим положительный кейс, здесь их не должно быть)
      errors: [
        { message: "Слой может импортировать в себя только нижележащие слои [shared,entities]" },
      ],
      options: aliasOptionsNext,
    },
    {
      filename:
        "C:\\Users\\tim\\Desktop\\javascript\\GOOD_COURSE_test\\src\\features\\providers",
      // какую строчку тестим
      code: "import { useLocation } from '@/widgets/Article';",
      // какой результат ошибки (ввиду того, что тестим положительный кейс, здесь их не должно быть)
      errors: [
        { message: "Слой может импортировать в себя только нижележащие слои [shared,entities]" },
      ],
      options: aliasOptionsReact,
    },
    {
      filename:
        "C:\\Users\\tim\\Desktop\\javascript\\GOOD_COURSE_test\\src\\features\\providers",
      // какую строчку тестим
      code: "import { useLocation } from '@/widgets/Article';",
      // какой результат ошибки (ввиду того, что тестим положительный кейс, здесь их не должно быть)
      errors: [
        { message: "Слой может импортировать в себя только нижележащие слои [shared,entities]" },
      ],
      options: aliasOptionsNext,
    },
    {
      filename:
        "C:\\Users\\tim\\Desktop\\javascript\\GOOD_COURSE_test\\src\\entities\\providers",
      // какую строчку тестим
      code: "import { useLocation } from '@/widgets/Article';",
      // какой результат ошибки (ввиду того, что тестим положительный кейс, здесь их не должно быть)
      errors: [
        { message: "Слой может импортировать в себя только нижележащие слои [shared,entities]" },
      ],
      options: aliasOptionsReact,
    },
    {
      filename:
        "C:\\Users\\tim\\Desktop\\javascript\\GOOD_COURSE_test\\src\\entities\\providers",
      // какую строчку тестим
      code: "import { useLocation } from '@/widgets/Article';",
      // какой результат ошибки (ввиду того, что тестим положительный кейс, здесь их не должно быть)
      errors: [
        { message: "Слой может импортировать в себя только нижележащие слои [shared,entities]" },
      ],
      options: aliasOptionsNext,
    },
  ],
});
