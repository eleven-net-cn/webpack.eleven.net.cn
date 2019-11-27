### [@babel/plugin-transform-runtime](https://babeljs.io/docs/en/babel-plugin-transform-runtime#docsNav)

1. 安装依赖包

    ```js
    yarn add @babel/plugin-transform-runtime -D
    ```

    1. 如果配置参数 corejs 未设置或为 false，需安装依赖`@babel/runtime`（这部分代码会被抽离并打包到应用 js 里，所以可以安装在 dependencies 里），仅对 es6 语法转译，而不对新 API 转译。

      ```js
      yarn add @babel/runtime
      ```

    2. 如果配置参数 corejs 设置为 2，需安装依赖`@babel/runtime-corejs2`（同上，推荐安装在 dependencies 里。），对语法、新 API 都转译。
      ```js
      yarn add @babel/runtime-corejs2
      ```
    3. 推荐使用`corejs:2`，但是，检测不到`‘hello‘.includes(‘h‘)`这种句法，所以存在一定隐患，书写代码时需注意。

    4. [@babel/runtime](https://babeljs.io/docs/en/babel-runtime)和[@babel/runtime-corejs2](https://babeljs.io/docs/en/babel-runtime-corejs2)这两个库唯一的区别是：corejs2 这个库增加了对 core-js（用来对 ES6 各个语法 polyfill 的库）这个库的依赖，所以在 corejs 为 false 的情况下，只能做语法的转换，并不能 polyfill 任何新 API。

2. .babelrc 文件写上配置

    ```js
    {
      "presets": [
        [
          "@babel/preset-env",
          {
            "modules": false
          }
        ]
      ],
      "plugins": [
        [
          "@babel/plugin-transform-runtime",
          {
            "corejs": 2 // 推荐
          }
        ]
      ]
    }
    ```

3. [配置参数](https://babeljs.io/docs/en/babel-plugin-transform-runtime#docsNav)
    1. `corejs`，默认值是 false，只对语法进行转换，不对新 API 进行处理；当设置为 2 的时候，需要安装`@babel/runtime-corejs2`，这时会对 api 进行处理。
    2. `helpers`，默认值是 true，用来开启是否使用 helper 函数来重写语法转换的函数。
    3. `useESModules`，默认值是 false，是否对文件使用 ES 的模块语法，使用 ES 的模块语法可以减少文件的大小。