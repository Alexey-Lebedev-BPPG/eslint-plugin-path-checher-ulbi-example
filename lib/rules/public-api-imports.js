"use strict";

const { isPathRelative } = require("../helpers");

module.exports = {
  // eslint-disable-next-line eslint-plugin/prefer-message-ids
  meta: {
    // eslint-disable-next-line eslint-plugin/require-meta-type
    type: null,
    docs: { description: "description", recommended: false, url: null },
    fixable: null, // Or `code` or `whitespace`
    // описываем, какие аргументы будем прокидывать в плагин (чтоб можно было динамически прокинуть алиас)
    schema: [{ type: "object", properties: { alias: { type: "string" } } }],
  },

  create(context) {
    // достаем наш аргумент алиаса, который мы прокинули в плагин
    const alias =
      context.options[0] && context.options[0].alias
        ? context.options[0].alias
        : "";

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

        if (isImportNotFromPublicApi) {
          // через эту функцию пробрасывается сообщение об ошибке
          context.report({
            node,
            // eslint-disable-next-line eslint-plugin/prefer-message-ids
            message:
              "Абсолютный импорт разрешен только из Public API (index.ts)",
          });
        }
      },
    };
  },
};
