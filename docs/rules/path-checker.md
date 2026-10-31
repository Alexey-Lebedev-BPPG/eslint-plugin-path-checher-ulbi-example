# path-checher-ulbi-example/path-checker

📝 Feature sliced relative path checker.

💼 This rule is enabled in the ✅ `recommended` config.

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

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
  "path-checher-ulbi-example/path-checker": [
    "error",
    {
      "alias": "@",
      "typeProject": "react"
    }
  ]
}
```

- `alias` (string, optional) — алиас путей в проекте (например, `@` или `~`). Используется для удаления алиаса из пути импорта при проверке.
- `typeProject` ('react' | 'next', optional) — тип проекта. По умолчанию `'react'`. Определяет названия слоёв FSD архитектуры.

## When Not To Use It

Give a short description of when it would be appropriate to turn off this rule.

## Further Reading

If there are other links that describe the issue this rule addresses, please include them here in a bulleted list.
