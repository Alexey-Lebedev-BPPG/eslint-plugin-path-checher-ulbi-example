"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rules = void 0;
const layer_imports_1 = __importDefault(require("./rules/layer-imports"));
const path_checker_1 = __importDefault(require("./rules/path-checker"));
const public_api_imports_1 = __importDefault(require("./rules/public-api-imports"));
exports.rules = {
    'layer-imports': layer_imports_1.default,
    'path-checker': path_checker_1.default,
    'public-api-imports': public_api_imports_1.default,
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
    rules: exports.rules,
};
exports.default = plugin;
