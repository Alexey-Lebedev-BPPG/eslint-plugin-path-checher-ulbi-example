"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isPathRelative = void 0;
const isPathRelative = (path) => {
    // если у нас пути вот такого плана, то мы считаем, что наш путь относительный
    return path === '.' || path.startsWith('./') || path.startsWith('../');
};
exports.isPathRelative = isPathRelative;
