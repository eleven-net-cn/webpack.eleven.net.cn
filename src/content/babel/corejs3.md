1. 以上是core-js@2的配置，而core-js@3的更新，带来了新的变化，**@babel/polyfill无法提供core-js@2向core-js@3过渡，所以现在有新的方案去替代@babel/polyfill，**（需要Babel版本升级到7.4.0及以上），详细可以阅读官方的几篇文档：
    1. [作者的官方阐述](https://github.com/zloirock/core-js/blob/master/docs/2019-03-19-core-js-3-babel-and-a-look-into-the-future.md)
    2. [Babel 7.4.0版本的更新内容，及官方的升级建议](https://babeljs.io/blog/2019/03/19/7.4.0)
    3. [core-js@2向core-js@3升级，官方的Pull request](https://github.com/babel/babel/pull/7646)

2. @babel/preset-env也因core-js@3的原因，需要配置corejs参数，否则webpack运行时会报warning；

3. @babel/polyfill不必再安装，转而需要依靠`core-js`和`regenerator-runtime`（详细原因请看作者的阐述），替代方案用法如下：

    1. 安装依赖

        ```sh
        yarn add babel-loader@8 @babel/core @babel/preset-env -D
        yarn add core-js regenerator-runtime
        ```
    2. .babelrc配置

        ```js
        {
          "presets": [
            [
              "@babel/preset-env",
              {
                "modules": false, // 对ES6的模块文件不做转化，以便使用tree shaking、sideEffects等
                "useBuiltIns": "entry", // browserslist环境不支持的所有垫片都导入
                // https://babeljs.io/docs/en/babel-preset-env#usebuiltins
                // https://github.com/zloirock/core-js/blob/master/docs/2019-03-19-core-js-3-babel-and-a-look-into-the-future.md
                "corejs": {
                  "version": 3, // 使用core-js@3
                  "proposals": true,
                }
              }
            ]
          ],
          "plugins": []
        }
        ```
    3. js代码里取代原先的`import '@babel/polyfill'`，做如下修改：

        ```js
        import "core-js/stable"
        import "regenerator-runtime/runtime"
        ```

4. 而@babel/plugin-transform-runtime，也随着core-js@3有更新：

    1. 安装依赖

        ```sh
        yarn add babel-loader@8 @babel/core @babel/preset-env @babel/plugin-transform-runtime -D
        yarn add @babel/runtime-corejs3
        ```

    2. .babelrc文件配置

        ```js
        {
          "presets": [
            [
              "@babel/preset-env",
              {
                "modules": false,
              }
            ]
          ],
          "plugins": [
            [
              "@babel/plugin-transform-runtime",
              {
                "corejs": {
                  "version": 3,
                  "proposals": true
                },
                "useESModules": true
              }
            ]
          ]
        }
        ```