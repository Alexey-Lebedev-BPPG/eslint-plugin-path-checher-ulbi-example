"use strict";

const path = require("path");
const { isPathRelative } = require("../helpers");

module.exports = {
  // eslint-disable-next-line eslint-plugin/prefer-message-ids
  meta: {
    // eslint-disable-next-line eslint-plugin/require-meta-type
    type: null,
    docs: {
      description: "feature sliced relative path checker",
      recommended: false,
      url: null,
    },
    fixable: null,
    // описываем, какие аргументы будем прокидывать в плагин (чтоб можно было динамически прокинуть алиас)
    schema: [{ type: "object", properties: { alias: { type: "string" } } }],
  },

  create(context) {
    // достаем наш аргумент алиаса, который мы прокинули в плагин
    const alias =
      context.options[0] && context.options[0].alias
        ? context.options[0].alias
        : "";

    return {
      // принимает ноду из AST
      ImportDeclaration(node) {
        const valueNode = node.source.value;
        // получаем путь до файла (например, app/entities/Article) + проверяем, если есть alias, то удаляем его. Если его нет, то оставляем путь как есть
        const importTo = alias ? valueNode.replace(`${alias}/`, "") : valueNode;

        // получаем полный путь текущего файла, в котором находимся (например, /home/alexey/Рабочий стол/Alexey/eslint-plugin-path-checher-ulbi-example/lib/rules/path-checker.js)
        const fromFilename = context.getFilename();

        // если при проверке путей будет true, то выдаем ошибку
        if (shouldBeRelative(fromFilename, importTo))
          // через эту функцию пробрасывается сообщение об ошибке
          context.report({
            node,
            // eslint-disable-next-line eslint-plugin/prefer-message-ids
            message:
              "В рамках одного слайса все пути должны быть относительными",
          });
      },
    };
  },
};

// определенные сегменты, которые используются в проекте и которые мы с помощью правила будем отслеживать, чтоб исключить сторонние библиотеки
const layers = {
  entities: "entities",
  features: "features",
  pages: "pages",
  shared: "shared",
  widgets: "widgets",
};

// функция принимающая путь и проверяющая, должен ли путь быть относительным
function shouldBeRelative(from, to) {
  // проверем, что если путь относительный, то завершаем проверку
  if (isPathRelative(to)) return false;

  // проверям путь до файла (to):

  // делим путь на сегменты
  // для примера пусть путь будет такой: entities/Article
  const toArray = to.split("/");
  // достаем сегмент и слой
  const toLayer = toArray[0]; // entities
  const toSlice = toArray[1]; // Article

  // проверяем: если вобще нет сегмента или слоя или сегмента нет в списке проверяемых слоев, то завершаем проверку
  if (!toLayer || !toSlice || !layers[toLayer]) return false;

  // проверяем путь файла, в котором находимся (from):

  // нормализовываем путь (приводим к единому виду)
  const fromNormalizedPath = path.toNamespacedPath(from);
  // проверяем, что путь относится к виндовс системе или нет
  const isWindowsOS = fromNormalizedPath.includes("\\");
  // отсекаем от пути все, что до слова src
  const projectFrom = fromNormalizedPath.split("src")[1];
  // разбиваем путь по /, при этом экранируя его
  const fromArray = projectFrom.split(isWindowsOS ? "\\" : "/"); // [ '', 'entities', 'Article' ]
  // ввиду того, что сам символ / будет первым элементом, обращаемся уже не к 0, а 1
  const fromLayer = fromArray[1]; // entities
  const fromSlice = fromArray[2]; // Article

  // проверяем: если вобще нет сегмента или слоя или сегмента нет в списке проверяемых слоев, то завершаем проверку
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
//     "entities/Article/fasfasfas"
//   )
// ); // true
// console.log(
//   shouldBeRelative(
//     "C:\\Users\\tim\\Desktop\\javascript\\GOOD_COURSE_test\\src\\entities\\Article",
//     "entities/ASdasd/fasfasfas"
//   )
// ); // false
// console.log(
//   shouldBeRelative(
//     "C:\\Users\\tim\\Desktop\\javascript\\GOOD_COURSE_test\\src\\entities\\Article",
//     "features/Article/fasfasfas"
//   )
// ); // false
// console.log(
//   shouldBeRelative(
//     "C:\\Users\\tim\\Desktop\\javascript\\GOOD_COURSE_test\\src\\features\\Article",
//     "features/Article/fasfasfas"
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
//     "entities/Article/asfasf/asfasf"
//   )
// ); // true
// console.log(
//   shouldBeRelative(
//     "C:\\Users\\tim\\Desktop\\javascript\\GOOD_COURSE_test\\src\\entities\\Article",
//     "../../model/selectors/getSidebarItems"
//   )
// ); // false
