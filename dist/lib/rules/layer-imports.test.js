"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const layer_imports_1 = __importDefault(require("../../../dist/rules/layer-imports"));
const eslint_1 = require("eslint");
const ruleTester = new eslint_1.RuleTester({
    // добавляем поддержку импортов
    languageOptions: { ecmaVersion: 2022, sourceType: 'module' },
});
const aliasOptionsReact = [{ alias: '@', typeProject: 'react' }];
const aliasOptionsNext = [{ alias: '@', typeProject: 'next' }];
ruleTester.run('layer-imports', layer_imports_1.default, {
    // тестирование неправильного импорта
    invalid: [
        {
            // какую строчку тестим
            code: "import { useLocation } from '@/features/Article';",
            // какой результат ошибки (ввиду того, что тестим положительный кейс, здесь их не должно быть)
            errors: [
                { data: { layers: 'shared,entities' }, messageId: 'invalidLayerImport' },
            ],
            filename: 'C:\\Users\\tim\\Desktop\\javascript\\GOOD_COURSE_test\\src\\entities\\providers',
            options: aliasOptionsReact,
        },
        {
            // какую строчку тестим
            code: "import { useLocation } from '@/features/Article';",
            // какой результат ошибки (ввиду того, что тестим положительный кейс, здесь их не должно быть)
            errors: [
                { data: { layers: 'shared,entities' }, messageId: 'invalidLayerImport' },
            ],
            filename: 'C:\\Users\\tim\\Desktop\\javascript\\GOOD_COURSE_test\\src\\entities\\providers',
            options: aliasOptionsNext,
        },
        {
            // какую строчку тестим
            code: "import { useLocation } from '@/widgets/Article';",
            // какой результат ошибки (ввиду того, что тестим положительный кейс, здесь их не должно быть)
            errors: [
                { data: { layers: 'shared,entities' }, messageId: 'invalidLayerImport' },
            ],
            filename: 'C:\\Users\\tim\\Desktop\\javascript\\GOOD_COURSE_test\\src\\features\\providers',
            options: aliasOptionsReact,
        },
        {
            // какую строчку тестим
            code: "import { useLocation } from '@/widgets/Article';",
            // какой результат ошибки (ввиду того, что тестим положительный кейс, здесь их не должно быть)
            errors: [
                { data: { layers: 'shared,entities' }, messageId: 'invalidLayerImport' },
            ],
            filename: 'C:\\Users\\tim\\Desktop\\javascript\\GOOD_COURSE_test\\src\\features\\providers',
            options: aliasOptionsNext,
        },
        {
            // какую строчку тестим
            code: "import { useLocation } from '@/widgets/Article';",
            // какой результат ошибки (ввиду того, что тестим положительный кейс, здесь их не должно быть)
            errors: [
                { data: { layers: 'shared,entities' }, messageId: 'invalidLayerImport' },
            ],
            filename: 'C:\\Users\\tim\\Desktop\\javascript\\GOOD_COURSE_test\\src\\entities\\providers',
            options: aliasOptionsReact,
        },
        {
            // какую строчку тестим
            code: "import { useLocation } from '@/widgets/Article';",
            // какой результат ошибки (ввиду того, что тестим положительный кейс, здесь их не должно быть)
            errors: [
                { data: { layers: 'shared,entities' }, messageId: 'invalidLayerImport' },
            ],
            filename: 'C:\\Users\\tim\\Desktop\\javascript\\GOOD_COURSE_test\\src\\entities\\providers',
            options: aliasOptionsNext,
        },
    ],
    valid: [
        {
            // какую строчку тестим
            code: "import { addCommentFormActions, addCommentFormReducer, } from '@/shared/Button.tsx';",
            filename: 'C:\\Users\\tim\\Desktop\\javascript\\GOOD_COURSE_test\\src\\features\\Article',
            // какой результат ошибки (ввиду того, что тестим положительный кейс, здесь их не должно быть)
            // errors: [],
            options: aliasOptionsReact,
        },
        {
            // какую строчку тестим
            code: "import { addCommentFormActions, addCommentFormReducer, } from '@/shared/Button.tsx';",
            filename: 'C:\\Users\\tim\\Desktop\\javascript\\GOOD_COURSE_test\\src\\features\\Article',
            options: aliasOptionsNext,
        },
        {
            // какую строчку тестим
            code: "import { addCommentFormActions, addCommentFormReducer, } from '@/entities/Article';",
            filename: 'C:\\Users\\tim\\Desktop\\javascript\\GOOD_COURSE_test\\src\\features\\Article',
            options: aliasOptionsReact,
        },
        {
            // какую строчку тестим
            code: "import { addCommentFormActions, addCommentFormReducer, } from '@/entities/Article';",
            filename: 'C:\\Users\\tim\\Desktop\\javascript\\GOOD_COURSE_test\\src\\features\\Article',
            options: aliasOptionsNext,
        },
        {
            // какую строчку тестим
            code: "import { addCommentFormActions, addCommentFormReducer, } from '@/widgets/Article';",
            filename: 'C:\\Users\\tim\\Desktop\\javascript\\GOOD_COURSE_test\\src\\app\\providers',
            options: aliasOptionsReact,
        },
        {
            // какую строчку тестим
            code: "import { addCommentFormActions, addCommentFormReducer, } from '@/widgets/Article';",
            filename: 'C:\\Users\\tim\\Desktop\\javascript\\GOOD_COURSE_test\\src\\app-fsd\\providers',
            options: aliasOptionsNext,
        },
        {
            // какую строчку тестим
            code: "import { useLocation } from 'react-router-dom';",
            filename: 'C:\\Users\\tim\\Desktop\\javascript\\GOOD_COURSE_test\\src\\widgets\\pages',
            options: aliasOptionsReact,
        },
        {
            // какую строчку тестим
            code: "import { useLocation } from 'react-router-dom';",
            filename: 'C:\\Users\\tim\\Desktop\\javascript\\GOOD_COURSE_test\\src\\widgets\\pages-fsd',
            options: aliasOptionsNext,
        },
        {
            // какую строчку тестим
            code: "import { useLocation } from 'redux';",
            filename: 'C:\\Users\\tim\\Desktop\\javascript\\GOOD_COURSE_test\\src\\app\\providers',
            options: aliasOptionsReact,
        },
        {
            // какую строчку тестим
            code: "import { useLocation } from 'redux';",
            filename: 'C:\\Users\\tim\\Desktop\\javascript\\GOOD_COURSE_test\\src\\app-fsd\\providers',
            options: aliasOptionsNext,
        },
        {
            // какую строчку тестим
            code: "import { StoreProvider } from '@/app/providers/StoreProvider';",
            filename: 'C:\\Users\\tim\\Desktop\\javascript\\GOOD_COURSE_test\\src\\index.tsx',
            options: aliasOptionsReact,
        },
        {
            // какую строчку тестим
            code: "import { StoreProvider } from '@/app-fsd/providers/StoreProvider';",
            filename: 'C:\\Users\\tim\\Desktop\\javascript\\GOOD_COURSE_test\\src\\index.tsx',
            options: aliasOptionsNext,
        },
        {
            // какую строчку тестим
            code: "import { StateSchema } from '@/app/providers/StoreProvider';",
            filename: 'C:\\Users\\tim\\Desktop\\javascript\\GOOD_COURSE_test\\src\\entities\\Article.ts',
            options: [
                {
                    alias: '@',
                    ignoreImportPatterns: ['**/StoreProvider'],
                    typeProject: 'react',
                },
            ],
        },
        {
            // какую строчку тестим
            code: "import { StateSchema } from '@/app-fsd/providers/StoreProvider';",
            filename: 'C:\\Users\\tim\\Desktop\\javascript\\GOOD_COURSE_test\\src\\entities\\Article.ts',
            options: [
                {
                    alias: '@',
                    ignoreImportPatterns: ['**/StoreProvider'],
                    typeProject: 'next',
                },
            ],
        },
    ],
});
