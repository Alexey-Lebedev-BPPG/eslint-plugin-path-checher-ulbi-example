# path-checher-ulbi-example/layer-imports

📝 Проверка импортов между слоями FSD архитектуры.

💼 This rule is enabled in the ✅ `recommended` config.

<!-- end auto-generated rule header -->

Please describe the origin of the rule here.

## Rule Details

This rule aims to...

Examples of **incorrect** code for this rule:

```js
// fill me in
```

Examples of **correct** code for this rule:

```js
// fill me in
```

### Options

```json
{
  "path-checher-ulbi-example/layer-imports": [
    "error",
    {
      "alias": "@",
      "typeProject": "react",
      "ignoreImportPatterns": ["**/node_modules/**"]
    }
  ]
}
```

- `alias` (string, optional) — алиас путей в проекте (например, `@` или `~`). Используется для удаления алиаса из пути импорта при проверке.
- `typeProject` ('react' | 'next', optional) — тип проекта. По умолчанию `'react'`. Определяет названия слоёв FSD архитектуры (`react` использует `app`, `pages`; `next` использует `app-fsd`, `pages-fsd`).
- `ignoreImportPatterns` (string[], optional) — массив паттернов (micromatch) для игнорирования импортов. Например, `["**/node_modules/**"]` исключит проверку импортов из node_modules.

## When Not To Use It

Give a short description of when it would be appropriate to turn off this rule.

## Further Reading

If there are other links that describe the issue this rule addresses, please include them here in a bulleted list.
