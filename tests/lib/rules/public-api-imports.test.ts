import rule from '../../../dist/rules/public-api-imports';
import {RuleTester} from 'eslint';

// тестирование пакета
const ruleTester = new RuleTester({
  // добавляем поддержку импортов
  languageOptions: {ecmaVersion: 2022, sourceType: 'module'},
});

const aliasOptionsReact = [{alias: '@', typeProject: 'react'}];
const aliasOptionsNext = [{alias: '@', typeProject: 'next'}];

const testFilesPatterns = [
  '**/*.test.*',
  '**/*.spec.*',
  '**/StoreDecorator.tsx',
];

ruleTester.run('public-api-imports', rule, {
  // тестирование неправильного импорта
  invalid: [
    {
      // какую строчку тестим
      code: "import { addCommentFormActions, addCommentFormReducer} from '@/entities/Article/model/file.ts';",
      // какой результат ошибки
      errors: [{messageId: 'PUBLIC_ERROR'}],
      // передаем алиас в плагин
      options: aliasOptionsReact,
      output:
        'import { addCommentFormActions, addCommentFormReducer} from "@/entities/Article";',
    },
    {
      // какую строчку тестим
      code: "import { addCommentFormActions, addCommentFormReducer} from '@/entities/Article/model/file.ts';",
      // какой результат ошибки
      errors: [{messageId: 'PUBLIC_ERROR'}],
      // передаем алиас в плагин
      options: aliasOptionsNext,
      output:
        'import { addCommentFormActions, addCommentFormReducer} from "@/entities/Article";',
    },
    {
      // какую строчку тестим
      code: "import { addCommentFormActions, addCommentFormReducer, } from '@/entities/Article/testing/file.ts';",
      // какой результат ошибки (ввиду того, что тестим положительный кейс, здесь их не должно быть)
      errors: [{messageId: 'PUBLIC_ERROR'}],
      // где расположен файл
      filename:
        '/home/alexey/Рабочий стол/Alexey/Ulbi-Example/src/entities/StoreDecorator.tsx',
      // передаем параметры в плагин
      options: [{alias: '@', testFilesPatterns, typeProject: 'react'}],
      output:
        'import { addCommentFormActions, addCommentFormReducer, } from "@/entities/Article";',
    },
    {
      // какую строчку тестим
      code: "import { addCommentFormActions, addCommentFormReducer} from '@/entities/Article/testing';",
      // какой результат ошибки (ввиду того, что тестим положительный кейс, здесь их не должно быть)
      errors: [{messageId: 'TESTING_PUBLIC_ERROR'}],
      // где расположен файл
      filename:
        '/home/alexey/Рабочий стол/Alexey/Ulbi-Example/src/entities/forbidden.ts',
      // передаем параметры в плагин
      options: [{alias: '@', testFilesPatterns, typeProject: 'react'}],
    },
    {
      // какую строчку тестим
      code: "import { addCommentFormActions, addCommentFormReducer} from '@/entities/Article/testing';",
      // какой результат ошибки (ввиду того, что тестим положительный кейс, здесь их не должно быть)
      errors: [{messageId: 'TESTING_PUBLIC_ERROR'}],
      // где расположен файл
      filename:
        '/home/alexey/Рабочий стол/Alexey/Ulbi-Example/src/entities/forbidden.ts',
      // передаем параметры в плагин
      options: [{alias: '@', testFilesPatterns, typeProject: 'next'}],
    },
    {
      // какую строчку тестим
      code: "import { someAction } from '@/widgets/SomeWidget/model/actions';",
      // какой результат ошибки
      errors: [{messageId: 'PUBLIC_ERROR'}],
      // где расположен файл
      filename:
        '/home/alexey/Рабочий стол/Alexey/Ulbi-Example/src/widgets/SomeWidget.tsx',
      options: aliasOptionsReact,
      output: 'import { someAction } from "@/widgets/SomeWidget";',
    },
  ],
  valid: [
    {
      // какую строчку тестим
      code: "import { addCommentFormActions, addCommentFormReducer} from '../../model/slice/addCommentForm';",
      // какой результат ошибки (ввиду того, что тестим положительный кейс, здесь их не должно быть)
      // errors: [],
    },
    {
      // какую строчку тестим
      code: "import { addCommentFormActions, addCommentFormReducer} from '@/entities/Article';",
    },
    {
      // какую строчку тестим
      code: "import { addCommentFormActions, addCommentFormReducer} from '@/entities/Article/testing';",
      // где расположен файл
      filename:
        '/home/alexey/Рабочий стол/Alexey/Ulbi-Example/src/entities/file.test.ts',
      // передаем параметры в плагин
      options: [{alias: '@', testFilesPatterns, typeProject: 'react'}],
    },
    {
      // какую строчку тестим
      code: "import { addCommentFormActions, addCommentFormReducer} from '@/entities/Article/testing';",
      // где расположен файл
      filename:
        '/home/alexey/Рабочий стол/Alexey/Ulbi-Example/src/entities/file.test.ts',
      // передаем параметры в плагин
      options: [{alias: '@', testFilesPatterns, typeProject: 'next'}],
    },
    {
      // какую строчку тестим
      code: "import { addCommentFormActions, addCommentFormReducer} from '@/entities/Article/testing';",
      // где расположен файл
      filename:
        '/home/alexey/Рабочий стол/Alexey/Ulbi-Example/src/entities/StoreDecorator.tsx',
      // передаем параметры в плагин
      options: [{alias: '@', testFilesPatterns, typeProject: 'react'}],
    },
    {
      // какую строчку тестим
      code: "import { addCommentFormActions, addCommentFormReducer} from '@/entities/Article/testing';",
      // где расположен файл
      filename:
        '/home/alexey/Рабочий стол/Alexey/Ulbi-Example/src/entities/StoreDecorator.tsx',
      // передаем параметры в плагин
      options: [{alias: '@', testFilesPatterns, typeProject: 'next'}],
    },
    {
      // какую строчку тестим
      code: "import { addCommentFormActions, addCommentFormReducer} from '@/entities/Article/testing';",
      // где расположен файл
      filename:
        '/home/alexey/Рабочий стол/Alexey/Ulbi-Example/src/entities/file.spec.ts',
      // передаем параметры в плагин
      options: [{alias: '@', testFilesPatterns, typeProject: 'react'}],
    },
  ],
});
