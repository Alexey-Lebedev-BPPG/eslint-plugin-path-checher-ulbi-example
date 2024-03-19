'use strict';

const path = require('path');
const {isPathRelative} = require('../helpers');

module.exports = {
  // eslint-disable-next-line eslint-plugin/prefer-message-ids
  meta: {
    // eslint-disable-next-line eslint-plugin/require-meta-type
    type: null,
    docs: {
      description: 'feature sliced relative path checker',
      recommended: false,
      url: null,
    },
    fixable: 'code',
    // описываем, какие аргументы будем прокидывать в плагин (чтоб можно было динамически прокинуть алиас)
    schema: [{type: 'object', properties: {alias: {type: 'string'}, typeProject: { type: "string" }}}],
  },

  create(context) {
    // достаем наш аргумент алиаса, который мы прокинули в плагин
    const {
      alias = '',
      // 'react' | 'next'
      typeProject = 'react',
    } = context.options[0] || {};

    return {
      // принимает ноду из AST
      ImportDeclaration(node) {
        try {
          const valueNode = node.source.value;
          // получаем путь до файла (например, app/entities/Article) + проверяем, если есть alias, то удаляем его. Если его нет, то оставляем путь как есть
          const importTo = alias
            ? valueNode.replace(`${alias}/`, '')
            : valueNode;

          // получаем полный путь текущего файла, в котором находимся (например, /home/alexey/Рабочий стол/Alexey/eslint-plugin-path-checher-ulbi-example/lib/rules/path-checker.js)
          const fromFilename = context.getFilename();

          // если при проверке путей будет true, то выдаем ошибку
          if (shouldBeRelative(fromFilename, importTo, typeProject)) {
            // через эту функцию пробрасывается сообщение об ошибке
            context.report({
              node,
              // eslint-disable-next-line eslint-plugin/prefer-message-ids
              message:
                'В рамках одного слайса все пути должны быть относительными',
              // метод, в котором можно работать с нодами. передаем путь, из которого делаем импорт и заменяем на свой текст
              fix: (fixer) => {
                // проверяем, что путь относится к виндовс системе или нет
                const isWindowsOS = getIsWindowsOs(fromFilename);

                // нормализовываем путь (приводим к единому виду) и отрезаем название файла
                // например вместо entities/Article/Article.tsx будет entities/Article
                const normalizedPath = getNormalizedCurrentFilePath(
                  fromFilename
                )
                  .split('/')
                  .slice(0, -1)
                  .join('/');

                // маппим два пути и получаем относительный путь одного к другому (при чем normalizedPath всегда будет начинаться с "/", а путь импорта без него, поэтому добавляем к importTo символ слеша)
                let relativePath = path
                  .relative(normalizedPath, `/${importTo}`)
                  .split(isWindowsOS ? '\\' : '/')
                  .join('/');

                // эта функция при формировании такого пути ("../../") работает корректно. Но если нужен такой путь (./test), то эту точку нужно добавлять самостоятельно
                if (!relativePath.startsWith('.'))
                  relativePath = './' + relativePath;

                return fixer.replaceText(node.source, `"${relativePath}"`);
              },
            });
          }
        } catch (error) {
          console.log('Error lint', error);
        }
      },
    };
  },
};

// функция для проверки системы
function getIsWindowsOs(currentFilePath) {
  return path.toNamespacedPath(currentFilePath).includes('\\');
}

function getNormalizedCurrentFilePath(currentFilePath) {
  // нормализовываем путь (приводим к единому виду)
  const fromNormalizedPath = path.toNamespacedPath(currentFilePath);
  // проверяем, что путь относится к виндовс системе или нет
  const isWindowsOS = getIsWindowsOs(currentFilePath);
  // отсекаем от пути все, что до слова src
  const projectFrom = fromNormalizedPath.split('src')[1];
  // разбиваем путь по /, при этом экранируя его
  return projectFrom?.split(isWindowsOS ? '\\' : '/').join('/');
  // результат например: /entities/Article/Article.tsx
}

// функция принимающая путь и проверяющая, должен ли путь быть относительным
function shouldBeRelative(from, to, typeProject) {
  const isReact = typeProject === 'react';

  // определенные сегменты, которые используются в проекте и которые мы с помощью правила будем отслеживать, чтоб исключить сторонние библиотеки
  const layers = isReact ? {
    pages: 'pages',
    widgets: 'widgets',
    features: 'features',
    entities: 'entities',
    shared: 'shared',
  } : {
    ['pages-fsd']: 'pages-fsd',
    widgets: 'widgets',
    features: 'features',
    entities: 'entities',
    shared: 'shared',
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

  const fromArray = projectFrom?.split('/');
  // ввиду того, что сам символ / будет первым элементом, обращаемся уже не к 0, а 1
  const fromLayer = fromArray?.[1]; // entities
  const fromSlice = fromArray?.[2]; // Article

  // проверяем: если вообще нет сегмента или слоя или сегмента нет в списке проверяемых слоев, то завершаем проверку
  if (!fromLayer || !fromSlice || !layers[fromLayer]) return false;

  // если это условие соблюдается, то должны сделать путь относительным (линтер будет ругаться)
  return toLayer === fromLayer && toSlice === fromSlice;
}

// в таком случае, мы будем ругаться, т.к. слой (entities) и слайс(Article) у нас совпадает. В остальных случаях ругаться не будем
// Например:
// "/home/alexey/Рабочий стол/Alexey/test/src/entities/Article"     и     "entities/Article/test.js"

// можно проверить пути для разных ОС:
// console.log(
//   shouldBeRelative(
//     "C:\\Users\\tim\\Desktop\\javascript\\GOOD_COURSE_test\\src\\entities\\Article",
//     "entities/Article/testTest"
//   )
// ); // true
// console.log(
//   shouldBeRelative(
//     "C:\\Users\\tim\\Desktop\\javascript\\GOOD_COURSE_test\\src\\entities\\Article",
//     "entities/Test/testTest"
//   )
// ); // false
// console.log(
//   shouldBeRelative(
//     "C:\\Users\\tim\\Desktop\\javascript\\GOOD_COURSE_test\\src\\entities\\Article",
//     "features/Article/testTest"
//   )
// ); // false
// console.log(
//   shouldBeRelative(
//     "C:\\Users\\tim\\Desktop\\javascript\\GOOD_COURSE_test\\src\\features\\Article",
//     "features/Article/testTest"
//   )
// ); // true
// console.log(
//   shouldBeRelative(
//     "C:\\Users\\tim\\Desktop\\javascript\\GOOD_COURSE_test\\src\\entities\\Article",
//     "app/index.tsx"
//   )
// ); // false
// console.log(
//   shouldBeRelative(
//     "C:/Users/tim/Desktop/javascript/GOOD_COURSE_test/src/entities/Article",
//     "entities/Article/testTest/testTest"
//   )
// ); // true
// console.log(
//   shouldBeRelative(
//     "C:\\Users\\tim\\Desktop\\javascript\\GOOD_COURSE_test\\src\\entities\\Article",
//     "../../model/selectors/getSidebarItems"
//   )
// ); // false
