1. 安装依赖

    ```js
    yarn add @babel/plugin-proposal-decorators @babel/plugin-proposal-class-properties -D
    ```

2. .babelrc 增加配置
    ```js
    {
      assumptions: {
        /**
         * https://babeljs.io/docs/en/assumptions#setpublicclassfields
        *
        * 装饰器的 legancy: true，依赖此配置
        *  - https://babeljs.io/docs/en/babel-plugin-proposal-decorators#legacy
        */
        setPublicClassFields: true,
      },
      "presets": [],
      "plugins": [
        [
          // @babel/plugin-proposal-decorators 需要在 @babel/plugin-proposal-class-properties 之前
          '@babel/plugin-proposal-decorators',
          {
            legacy: true, // 推荐
          },
        ],
        ['@babel/plugin-proposal-class-properties'],
      ]
    }
    ```