import layerImports from './rules/layer-imports';
import pathChecker from './rules/path-checker';
import publicApiImports from './rules/public-api-imports';

export const rules = {
  'layer-imports': layerImports,
  'path-checker': pathChecker,
  'public-api-imports': publicApiImports,
};

// Для совместимости с Flat Config
const plugin = {
  configs: {
    recommended: {
      plugins: ['path-checher-ulbi-example'],
      rules: {
        'path-checher-ulbi-example/layer-imports': 'error',
        'path-checher-ulbi-example/path-checker': 'error',
        'path-checher-ulbi-example/public-api-imports': 'error',
      },
    },
  },
  rules,
};

export default plugin;
