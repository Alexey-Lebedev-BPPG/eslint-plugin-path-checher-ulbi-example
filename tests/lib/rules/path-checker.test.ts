import rule from '../../../dist/rules/path-checker';
import {RuleTester} from 'eslint';

const ruleTester = new RuleTester({
  // добавляем поддержку импортов
  languageOptions: {ecmaVersion: 2022, sourceType: 'module'},
});

ruleTester.run('path-checker', rule, {
  // тестирование неправильного импорта
  invalid: [
    // тестируем без алиаса
    {
      // какую строчку тестим
      code: 'import { addCommentFormActions, addCommentFormReducer} from "entities/Article/model/slice/addCommentForm";',
      // какой результат ошибки
      errors: [{messageId: 'shouldBeRelative'}],
      // где расположен файл
      filename:
        '/home/alexey/Рабочий стол/Alexey/Ulbi-Example/src/entities/Article',
      output:
        'import { addCommentFormActions, addCommentFormReducer} from "./Article/model/slice/addCommentForm";',
    },
    // тестируем с алиасом
    {
      // какую строчку тестим
      code: "import { addCommentFormActions, addCommentFormReducer} from '@/entities/Article/model/slice/addCommentForm';",
      // какой результат ошибки
      errors: [{messageId: 'shouldBeRelative'}],
      // где расположен файл
      filename:
        '/home/alexey/Рабочий стол/Alexey/Ulbi-Example/src/entities/Article',
      // передаем алиас в плагин
      options: [{alias: '@', typeProject: 'react'}],
      output:
        'import { addCommentFormActions, addCommentFormReducer} from "./Article/model/slice/addCommentForm";',
    },
    // тестируем для Windows пути
    {
      // какую строчку тестим
      code: "import { addCommentFormActions, addCommentFormReducer} from '@/entities/Article/model/slice/addCommentForm';",
      // какой результат ошибки
      errors: [{messageId: 'shouldBeRelative'}],
      // где расположен файл
      filename:
        'C:\\Users\\tim\\Desktop\\javascript\\GOOD_COURSE_test\\src\\entities\\Article',
      options: [{alias: '@', typeProject: 'react'}],
      output:
        'import { addCommentFormActions, addCommentFormReducer} from "./Article/model/slice/addCommentForm";',
    },
    // тестируем для Next.js проекта
    {
      // какую строчку тестим
      code: "import { addCommentFormActions, addCommentFormReducer} from '@/pages-fsd/Article/model/slice/addCommentForm';",
      // какой результат ошибки
      errors: [{messageId: 'shouldBeRelative'}],
      // где расположен файл
      filename:
        'C:\\Users\\tim\\Desktop\\javascript\\GOOD_COURSE_test\\src\\pages-fsd\\Article',
      options: [{alias: '@', typeProject: 'next'}],
      output:
        'import { addCommentFormActions, addCommentFormReducer} from "./Article/model/slice/addCommentForm";',
    },
  ],
  valid: [
    {
      // какую строчку тестим
      code: "import { addCommentFormActions, addCommentFormReducer} from '../../model/slice/addCommentForm';",
      // где расположен файл
      filename:
        '/home/alexey/Рабочий стол/Alexey/Ulbi-Example/src/entities/Article.ts',
      // какой результат ошибки (ввиду того, что тестим положительный кейс, здесь их не должно быть)
      // errors: [],
    },
  ],
});
