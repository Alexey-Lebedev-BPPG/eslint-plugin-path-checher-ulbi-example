import path from 'path';
import {isPathRelative} from '../helpers/index';
import micromatch from 'micromatch';
import {Rule} from 'eslint';

// Определяем тип для опций
interface LayerImportsOptions {
  alias?: string;
  typeProject?: 'react' | 'next';
  ignoreImportPatterns?: string[];
}

const layerImports: Rule.RuleModule = {
  create(context) {
    // достаем наш аргумент алиаса, который мы прокинули в плагин
    const {
      alias = '',
      ignoreImportPatterns = [],
      typeProject = 'react',
    }: LayerImportsOptions = context.options[0] || {};

    const isReact = typeProject === 'react';

    // правила, по которым сущности могут включать в себя другие сущности
    const layers: {[key: string]: string[]} = isReact
      ? {
          app: ['pages', 'widgets', 'features', 'shared', 'entities'],
          entities: ['shared', 'entities'],
          features: ['shared', 'entities'],
          pages: ['widgets', 'features', 'shared', 'entities'],
          shared: ['shared'],
          widgets: ['features', 'shared', 'entities'],
        }
      : {
          'app-fsd': ['pages-fsd', 'widgets', 'features', 'shared', 'entities'],
          entities: ['shared', 'entities'],
          features: ['shared', 'entities'],
          'pages-fsd': ['widgets', 'features', 'shared', 'entities'],
          shared: ['shared'],
          widgets: ['features', 'shared', 'entities'],
        };

    // определенные сегменты, которые используются в проекте и которые мы с помощью правила будем отслеживать, чтоб исключить сторонние библиотеки (убираем shared слой, т.к. там не всегда строгое придерживание FSD)
    const availableLayers: {[key: string]: string} = isReact
      ? {
          app: 'app',
          entities: 'entities',
          features: 'features',
          pages: 'pages',
          shared: 'shared',
          widgets: 'widgets',
        }
      : {
          'app-fsd': 'app-fsd',
          entities: 'entities',
          features: 'features',
          'pages-fsd': 'pages-fsd',
          shared: 'shared',
          widgets: 'widgets',
        };

    // функция получения слоя текущего файла
    const getCurrentFileLayer = () => {
      // получаем путь текущего файла
      const currentFilePath = context.filename;
      // нормализуем путь текущего файла
      const normalizedPath = path.toNamespacedPath(currentFilePath);
      const projectPath = normalizedPath.split('src')[1];

      if (!projectPath) return null;

      // проверяем, что путь относится к виндовс системе или нет
      const isWindowsOS = projectPath?.includes('\\');
      // делим на сегменты
      const segments = projectPath?.split(isWindowsOS ? '\\' : '/');
      // возвращаем layer
      return segments?.[1];
    };

    // функция получения первого слоя от абсолютного пути
    const getImportLayer = (value: string): string => {
      // получаем путь до файла (например, app/entities/Article) + проверяем, если есть alias, то удаляем его. Если его нет, то оставляем путь как есть
      const importPath = alias ? value.replace(`${alias}/`, '') : value;
      // делим на сегменты
      const segments = importPath.split('/');
      // возвращаем layer
      return segments[0];
    };

    return {
      // принимает ноду из AST
      ImportDeclaration(node: Rule.Node) {
        // получаем полный путь
        const importPath = (node as any).source.value as string;
        // получаем слой текущего файла
        const currentFileLayer = getCurrentFileLayer();
        // получаем первый слой из импорта
        const importLayer = getImportLayer(importPath);

        // если при проверке путей путь будет относительным, то ничего не делаем
        if (!currentFileLayer || isPathRelative(importPath)) return;

        // если оба слоя не являются разрешенными, то ничего не делаем
        if (!availableLayers[importLayer] || !availableLayers[currentFileLayer])
          return;

        // указывает, что текущий файл является ли тем, который нужно проигнорировать (те исключения, которые мы прокидываем в плагин), для этого проходимся по паттернам, которые мы передали из вне и чтоб хоть один совпал
        const isIgnored = ignoreImportPatterns.some((pattern: string) =>
          // эта функция вернет true, если паттерн соответствует пути (первым аргументом принимает путь, а вторым каждый паттерн)
          micromatch.isMatch(importPath, pattern),
        );

        // если путь в списке исключения (который мы должны проигнорировать), то ничего не делаемы
        if (isIgnored) return;

        // проверяет, можно ли на текущем слое использовать импортируемый слой
        if (!layers[currentFileLayer].includes(importLayer)) {
          // через эту функцию пробрасывается сообщение об ошибке
          context.report({
            data: {layers: layers[currentFileLayer]?.join(',') || ''},
            messageId: 'invalidLayerImport',
            node: (node as any).source,
          });
        }
      },
    };
  },
  meta: {
    docs: {
      description: 'Проверка импортов между слоями FSD архитектуры',
      recommended: false,
    },
    fixable: undefined,
    messages: {
      invalidLayerImport:
        'Слой может импортировать в себя только нижележащие слои [{{ layers }}]',
    },

    // описываем, какие аргументы будем прокидывать в плагин (чтоб можно было динамически прокинуть алиас)
    schema: [
      {
        additionalProperties: false,
        properties: {
          alias: {type: 'string'},
          // исключения, которые нужно игнорировать
          ignoreImportPatterns: {items: {type: 'string'}, type: 'array'},
          typeProject: {enum: ['react', 'next'], type: 'string'},
        },
        type: 'object',
      },
    ],

    type: 'suggestion',
  },
};

export default layerImports;
