1. babel 官方认为，把不稳定的 stage0-3 作为一种预设是不太合理的，`@babel/preset-env`、`@babel/polyfill`等只支持到`stage-4`级别，因此 babel 新版本废弃了 stage 预设，转而让用户自己选择使用哪个 proposal 特性的插件，这将带来更多的明确性（用户无须理解 stage，自己选的插件，自己便能明确的知道代码中可以使用哪个特性）。  

2. 所有建议特性的插件，都改变了命名规范，即类似 `@babel/plugin-proposal-function-bind` 这样的命名方式来表明这是个 proposal 阶段特性。  

3. 所以，处于建议阶段的特性，基本都已从`@babel/preset-env`、`@babel/polyfill`等包中被移除，需要自己去另外安装对应的 preset、plugin，（一般你能找到的名称里有 proposal 字样的包，需要自己在`@babel/preset-env`、`@babel/plugin-transform-runtime`以外做配置）。  

4. 各个级别当前可以选用的 proposal 插件大概如下（[传送门](https://github.com/babel/babel/blob/master/packages/babel-preset-stage-0/README.md)）：

    ```js
    {
        "plugins": [
        // Stage 0
        "@babel/plugin-proposal-function-bind",

        // Stage 1
        "@babel/plugin-proposal-export-default-from",
        "@babel/plugin-proposal-logical-assignment-operators",
        ["@babel/plugin-proposal-optional-chaining", { "loose": false }],
        ["@babel/plugin-proposal-pipeline-operator", { "proposal": "minimal" }],
        ["@babel/plugin-proposal-nullish-coalescing-operator", { "loose": false }],
        "@babel/plugin-proposal-do-expressions",

        // Stage 2
        ["@babel/plugin-proposal-decorators", { "legacy": true }],
        "@babel/plugin-proposal-function-sent",
        "@babel/plugin-proposal-export-namespace-from",
        "@babel/plugin-proposal-numeric-separator",
        "@babel/plugin-proposal-throw-expressions",

        // Stage 3
        "@babel/plugin-syntax-dynamic-import",
        "@babel/plugin-syntax-import-meta",
        ["@babel/plugin-proposal-class-properties", { "loose": false }],
        "@babel/plugin-proposal-json-strings"
      ]
    }
    ```