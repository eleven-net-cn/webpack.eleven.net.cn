1. 安装依赖

    ```js
    yarn add @babel/plugin-proposal-decorators @babel/plugin-proposal-class-properties -D
    ```

2. .babelrc 增加配置
    ```js
    {
      "presets": [],
      "plugins": [
        [
          "@babel/plugin-proposal-decorators",  // @babel/plugin-proposal-decorators需要在@babel/plugin-proposal-class-properties之前
          {
            "legacy": true // 推荐
          }
        ],
        [
          "@babel/plugin-proposal-class-properties",
          {
            "loose": true // babel编译时，对class的属性采用赋值表达式，而不是Object.defineProperty（更简洁）
          }
        ]
      ]
    }
    ```