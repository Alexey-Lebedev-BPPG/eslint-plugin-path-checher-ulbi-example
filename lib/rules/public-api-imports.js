"use strict";

// const path = require("path");
const { isPathRelative } = require("../helpers");
// библиотека позволяет работать с путями и регулярками
const micromatch = require("micromatch");

module.exports = {
  // eslint-disable-next-line eslint-plugin/prefer-message-ids
  meta: {
    // eslint-disable-next-line eslint-plugin/require-meta-type
    type: null,
    docs: { description: "description", recommended: false, url: null },
    fixable: null, // Or `code` or `whitespace`
    // описываем, какие аргументы будем прокидывать в плагин (чтоб можно было динамически прокинуть алиас)
    schema: [
      {
        type: "object",
        properties: {
          alias: { type: "string" },
          testFilesPatterns: { type: "array" },
        },
      },
    ],
  },

  create(context) {
    // достаем наш аргумент алиаса, который мы прокинули в плагин
    const { alias = "", testFilesPatterns = [] } = context.options[0] || {};

    // определенные сегменты, которые используются в проекте и которые мы с помощью правила будем отслеживать, чтоб исключить сторонние библиотеки (убираем shared слой, т.к. там не всегда строгое придерживание FSD)
    const checkingLayers = {
      entities: "entities",
      features: "features",
      pages: "pages",
      widgets: "widgets",
    };

    return {
      // принимает ноду из AST
      ImportDeclaration(node) {
        const valueNode = node.source.value;
        // получаем путь до файла (например, app/entities/Article) + проверяем, если есть alias, то удаляем его. Если его нет, то оставляем путь как есть
        const importTo = alias ? valueNode.replace(`${alias}/`, "") : valueNode;

        // если при проверке путей будет true, то ничего не делаем
        if (isPathRelative(importTo)) return;

        // делим наш относительный путь на сегменты такого типа [entities, article, model, types]
        const segments = importTo.split("/");

        // из сегментов достаем слой
        const layer = segments[0];

        // если слой не совпадает с объектом слоев, то ничего не делаем (т.е. делаем дальнейшую проверку, если путь начинается со слов, указанных в checkingLayers)
        if (!checkingLayers[layer]) return;

        // делаем переменную, которая будет указывать, что сегментов не должно превышать 3 шт.
        const isImportNotFromPublicApi = segments.length > 2;

        // делаем переменную, которая будет указывать, что если у нас элемент 3 в массиве (например [entities, article, testing]? где testing - файл testing.ts для тестового апи) и количество сегментов меньше 4
        const isTestingPublicApi =
          segments[2] === "testing" && segments.length < 4;

        if (isImportNotFromPublicApi && !isTestingPublicApi) {
          // через эту функцию пробрасывается сообщение об ошибке
          context.report({
            node,
            // eslint-disable-next-line eslint-plugin/prefer-message-ids
            message:
              "Абсолютный импорт разрешен только из Public API (index.ts)",
          });
        }

        if (isTestingPublicApi) {
          // получаем полный путь текущего файла, в котором находимся (например, /home/alexey/Рабочий стол/Alexey/eslint-plugin-path-checher-ulbi-example/lib/rules/path-checker.js)
          const currentFilePath = context.getFilename();
          // может потребоваться, если использовать пути windows, запускать пути linux
          // const normalizedPath = path
          //   .toNamespacedPath(currentFilePath)
          //   .replace(/\\/g, "/");

          // указывает, что текущий файл является тестовым, для этого проходимся по паттернам, которые мы передали из вне и чтоб хоть один совпал
          const isCurrentFileTesting = testFilesPatterns.some((pattern) =>
            // эта функция вернет true, если паттерн соответствует пути (первым аргументом принимает путь, а вторым каждый паттерн)
            micromatch.isMatch(currentFilePath, pattern)
          );

          // если файл не тестовый, значит мы нарушили правило
          if (!isCurrentFileTesting) {
            context.report({
              node,
              // eslint-disable-next-line eslint-plugin/prefer-message-ids
              message:
                "Тестовые данные необходимо импортировать из publicApi/testing.ts",
            });
          }
        }
      },
    };
  },
};
