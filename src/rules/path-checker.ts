import path from 'path';
import {isPathRelative} from '../helpers/index';
import {Rule} from 'eslint';

// interface PathCheckerOptions {
//   alias?: string;
//   typeProject?: 'react' | 'next';
// }

const pathChecker: Rule.RuleModule = {
  create(context) {
    // достаем наш аргумент алиаса, который мы прокинули в плагин
    const {alias = '', typeProject = 'react'} = context.options[0] || {};

    // функция для проверки системы
    const getIsWindowsOs = (currentFilePath: string): boolean =>
      path.toNamespacedPath(currentFilePath).includes('\\');

    // const getNormalizedCurrentFilePath = (currentFilePath: string) => {
    const getNormalizedCurrentFilePath = (
      currentFilePath: string,
    ): string | undefined => {
      // нормализовываем путь (приводим к единому виду)
      const fromNormalizedPath = path.toNamespacedPath(currentFilePath);
      // проверяем, что путь относится к виндовс системе или нет
      const isWindowsOS = getIsWindowsOs(currentFilePath);
      // отсекаем от пути все, что до слова src
      const projectFrom = fromNormalizedPath.split('src')[1];
      // разбиваем путь по /, при этом экранируя его
      return projectFrom?.split(isWindowsOS ? '\\' : '/').join('/');
      // результат например: /entities/Article/Article.tsx
    };

    // функция принимающая путь и проверяющая, должен ли путь быть относительным
    const shouldBeRelative = (
      from: string,
      to: string,
      typeProject: 'react' | 'next',
    ): boolean => {
      const isReact = typeProject === 'react';

      // определенные сегменты, которые используются в проекте и которые мы с помощью правила будем отслеживать, чтоб исключить сторонние библиотеки
      const layers: {[key: string]: string} = isReact
        ? {
            entities: 'entities',
            features: 'features',
            pages: 'pages',
            shared: 'shared',
            widgets: 'widgets',
          }
        : {
            entities: 'entities',
            features: 'features',
            'pages-fsd': 'pages-fsd',
            shared: 'shared',
            widgets: 'widgets',
          };

      // проверем, что если путь относительный, то завершаем проверку
      if (isPathRelative(to)) return false;

      // проверяем путь до файла (to):

      // делим путь на сегменты
      // для примера пусть путь будет такой: entities/Article
      const toArray = to.split('/');
      // достаем сегмент и слой
      const toLayer = toArray[0]; // entities
      const toSlice = toArray[1]; // Article

      // проверяем: если вообще нет сегмента или слоя или сегмента нет в списке проверяемых слоев, то завершаем проверку
      if (!toLayer || !toSlice || !layers[toLayer]) return false;

      // проверяем путь файла, в котором находимся (from):
      // нормализовываем путь (приводим к единому виду)
      const projectFrom = getNormalizedCurrentFilePath(from);
      if (!projectFrom) return false;

      const fromArray = projectFrom?.split('/');
      // ввиду того, что сам символ / будет первым элементом, обращаемся уже не к 0, а 1
      const fromLayer = fromArray?.[1]; // entities
      const fromSlice = fromArray?.[2]; // Article

      // проверяем: если вообще нет сегмента или слоя или сегмента нет в списке проверяемых слоев, то завершаем проверку
      if (!fromLayer || !fromSlice || !layers[fromLayer]) return false;

      // если это условие соблюдается, то должны сделать путь относительным (линтер будет ругаться)
      return toLayer === fromLayer && toSlice === fromSlice;
    };

    return {
      // принимает ноду из AST
      ImportDeclaration(node: Rule.Node) {
        try {
          const valueNode = (node as any).source.value as string;
          // получаем путь до файла (например, app/entities/Article) + проверяем, если есть alias, то удаляем его. Если его нет, то оставляем путь как есть
          const importTo = alias
            ? valueNode.replace(`${alias}/`, '')
            : valueNode;

          // получаем полный путь текущего файла, в котором находимся (например, /home/alexey/Рабочий стол/Alexey/eslint-plugin-path-checher-ulbi-example/lib/rules/path-checker.js)
          const fromFilename = context.filename;

          // если при проверке путей будет true, то выдаем ошибку
          if (shouldBeRelative(fromFilename, importTo, typeProject)) {
            // проверяем, что путь относится к виндовс системе или нет
            const isWindowsOS = getIsWindowsOs(fromFilename);

            // нормализовываем путь (приводим к единому виду)
            const normalizedPath = getNormalizedCurrentFilePath(fromFilename);

            if (!normalizedPath) return;

            // отрезаем название файла
            // например вместо entities/Article/Article.tsx будет entities/Article
            const normalizedDir = normalizedPath
              .split('/')
              .slice(0, -1)
              .join('/');

            // маппим два пути и получаем относительный путь одного к другому (при чем normalizedPath всегда будет начинаться с "/", а путь импорта без него, поэтому добавляем к importTo символ слеша)
            let relativePath = path
              .relative(`/${normalizedDir}`, `/${importTo}`)
              .split(isWindowsOS ? '\\' : '/')
              .join('/');

            // эта функция при формировании такого пути ("../../") работает корректно. Но если нужен такой путь (./test), то эту точку нужно добавлять самостоятельно
            if (!relativePath.startsWith('.')) {
              relativePath = './' + relativePath;
            }

            // через эту функцию пробрасывается сообщение об ошибке
            context.report({
              // метод, в котором можно работать с нодами. передаем путь, из которого делаем импорт и заменяем на свой текст
              fix: (fixer) =>
                fixer.replaceText((node as any).source, `"${relativePath}"`),
              messageId: 'shouldBeRelative',
              node: (node as any).source,
            });
          }
        } catch (error) {
          console.log('Error lint', error);
        }
      },
    };
  },
  meta: {
    docs: {
      description: 'feature sliced relative path checker',
      recommended: false,
    },
    fixable: 'code',
    messages: {
      shouldBeRelative:
        'В рамках одного слайса все пути должны быть относительными',
    },
    // описываем, какие аргументы будем прокидывать в плагин (чтоб можно было динамически прокинуть алиас)
    schema: [
      {
        additionalProperties: false,
        properties: {
          alias: {type: 'string'},
          typeProject: {enum: ['react', 'next'], type: 'string'},
        },
        type: 'object',
      },
    ],

    type: 'suggestion',
  },
};

export default pathChecker;
