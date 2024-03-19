# eslint-plugin-path-checher-ulbi-example

plugin for production project

## Installation

You'll first need to install [ESLint](https://eslint.org/):

```sh
npm i eslint --save-dev
```

Next, install `eslint-plugin-path-checher-ulbi-example`:

```sh
npm install eslint-plugin-path-checher-ulbi-example --save-dev
```

## Usage

Add `path-checher-ulbi-example` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
    "plugins": [
        "path-checher-ulbi-example"
    ]
}
```


Then configure the rules you want to use under the rules section.

```json
{
    "rules": {
        "path-checher-ulbi-example/rule-name": 2
    }
}
```

## Rules

<!-- begin auto-generated rules list -->

🔧 Automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/user-guide/command-line-interface#--fix).

| Name                                                   | Description                          | 🔧 |
| :----------------------------------------------------- | :----------------------------------- | :- |
| [layer-imports](docs/rules/layer-imports.md)           | description                          |    |
| [path-checker](docs/rules/path-checker.md)             | feature sliced relative path checker | 🔧 |
| [public-api-imports](docs/rules/public-api-imports.md) | description                          | 🔧 |

<!-- end auto-generated rules list -->


