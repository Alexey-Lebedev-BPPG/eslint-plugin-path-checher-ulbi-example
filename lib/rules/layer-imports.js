"use strict";

const path = require("path");
const { isPathRelative } = require("../helpers");
// библиотека позволяет работать с путями и регулярками
const micromatch = require("micromatch");

module.exports = {
  // eslint-disable-next-line eslint-plugin/prefer-message-ids
  meta: {
    // eslint-disable-next-line eslint-plugin/require-meta-type
    type: null,
    docs: { description: "description", recommended: false, url: null },
    fixable: null,
    // описываем, какие аргументы будем прокидывать в плагин (чтоб можно было динамически прокинуть алиас)
    schema: [
      {
        type: "object",
        properties: {
          alias: { type: "string" },
          // исключения, которые нужно игнорировать
          ignoreImportPatterns: { type: "array" },
        },
      },
    ],
  },

  create(context) {
    // достаем наш аргумент алиаса, который мы прокинули в плагин
    const { alias = "", ignoreImportPatterns = [] } = context.options[0] || {};

    // правила, по которым сущности могут включать в себя другие сущности
    const layers = {
      app: ["pages", "widgets", "features", "shared", "entities"],
      pages: ["widgets", "features", "shared", "entities"],
      widgets: ["features", "shared", "entities"],
      features: ["shared", "entities"],
      entities: ["shared", "entities"],
      shared: ["shared"],
    };

    // определенные сегменты, которые используются в проекте и которые мы с помощью правила будем отслеживать, чтоб исключить сторонние библиотеки (убираем shared слой, т.к. там не всегда строгое придерживание FSD)
    const availableLayers = {
      app: "app",
      pages: "pages",
      widgets: "widgets",
      features: "features",
      entities: "entities",
      shared: "shared",
    };

    // функция получения слоя текущего файла
    const getCurrentFileLayer = () => {
      // получаем путь текущего файла
      const currentFilePath = context.getFilename();
      // нормализуем путь текущего файла
      const normalizedPath = path.toNamespacedPath(currentFilePath);
      const projectPath = normalizedPath.split("src")[1];
      // проверяем, что путь относится к виндовс системе или нет
      const isWindowsOS = projectPath.includes("\\");
      // делим на сегменты
      const segments = projectPath.split(isWindowsOS ? "\\" : "/");
      // возвращаем layer
      return segments[1];
    };

    // функция получения первого слоя от абсолютного пути
    const getImportLayer = (value) => {
      // получаем путь до файла (например, app/entities/Article) + проверяем, если есть alias, то удаляем его. Если его нет, то оставляем путь как есть
      const importPath = alias ? value.replace(`${alias}/`, "") : value;
      // делим на сегменты
      const segments = importPath.split("/");
      // возвращаем layer
      return segments[0];
    };

    return {
      // принимает ноду из AST
      ImportDeclaration(node) {
        // получаем полный путь
        const importPath = node.source.value;
        // получаем слой текущего файла
        const currentFileLayer = getCurrentFileLayer();
        // получаем первый слой из импорта
        const importLayer = getImportLayer(importPath);

        // если при проверке путей путь будет относительным, то ничего не делаем
        if (isPathRelative(importPath)) return;

        // если оба слоя не являются разрешенными, то ничего не делаем
        if (!availableLayers[importLayer] || !availableLayers[currentFileLayer])
          return;

        // указывает, что текущий файл является ли тем, который нужно проигнорировать (те исключения, которые мы прокидываем в плагин), для этого проходимся по паттернам, которые мы передали из вне и чтоб хоть один совпал
        const isIgnored = ignoreImportPatterns.some((pattern) =>
          // эта функция вернет true, если паттерн соответствует пути (первым аргументом принимает путь, а вторым каждый паттерн)
          micromatch.isMatch(importPath, pattern)
        );

        // если путь в списке исключения (который мы должны проигнорировать), то ничего не делаемы
        if (isIgnored) return;

        // проверяет, можно ли на текущем слое использовать импортируемый слой
        if (!layers[currentFileLayer].includes(importLayer)) {
          // через эту функцию пробрасывается сообщение об ошибке
          context.report({
            node,
            // eslint-disable-next-line eslint-plugin/prefer-message-ids
            message: `Слой может импортировать в себя только нижележащие слои [${[
              ...layers[currentFileLayer],
            ]}]`,
          });
        }
      },
    };
  },
};
