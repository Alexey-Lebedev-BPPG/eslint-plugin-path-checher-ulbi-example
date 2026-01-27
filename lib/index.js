// import layerImports from './rules/layer-imports';
// import pathChecker from './rules/path-checker';
// import publicApiImports from './rules/public-api-imports';
// // import {ESLint} from 'eslint';

// export const rules = {
//   'layer-imports': layerImports,
//   'path-checker': pathChecker,
//   'public-api-imports': publicApiImports,
// };

// // Для совместимости с Flat Config
// // const plugin: ESLint.Plugin = {
// const plugin = {
//   configs: {
//     recommended: {
//       plugins: ['path-checher-ulbi-example'],
//       rules: {
//         'path-checher-ulbi-example/layer-imports': 'error',
//         'path-checher-ulbi-example/path-checker': 'error',
//         'path-checher-ulbi-example/public-api-imports': 'error',
//       },
//     },
//   },
//   rules,
// };

// export default plugin;

// /**
//  * @fileoverview plugin for production project
//  * @author alexey
//  */
// 'use strict';

// //------------------------------------------------------------------------------
// // Requirements
// //------------------------------------------------------------------------------

// import requireIndex from 'requireindex';

// //------------------------------------------------------------------------------
// // Plugin Definition
// //------------------------------------------------------------------------------

// // import all rules in lib/rules
// module.exports.rules = requireIndex(__dirname + '/rules');

const layerImports = require('./rules/layer-imports');
const pathChecker = require('./rules/path-checker');
const publicApiImports = require('./rules/public-api-imports');

const rules = {
  'layer-imports': layerImports,
  'path-checker': pathChecker,
  'public-api-imports': publicApiImports,
};

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

module.exports = plugin;
