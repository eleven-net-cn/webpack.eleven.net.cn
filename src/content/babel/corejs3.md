1. 以上是 core-js@2 的配置，而 core-js@3 的更新，带来了新的变化，**@babel/polyfill 无法提供 core-js@2 向 core-js@3 过渡，所以现在有新的方案去替代@babel/polyfill，**（需要 babel-loader 版本升级到 8.0.0 以上，@babel/core 版本升级到 7.4.0 及以上），详细可以阅读官方的几篇文档：

   1. [作者的官方阐述](https://github.com/zloirock/core-js/blob/master/docs/2019-03-19-core-js-3-babel-and-a-look-into-the-future.md)
   2. [Babel 7.4.0 版本的更新内容，及官方的升级建议](https://babeljs.io/blog/2019/03/19/7.4.0)
   3. [core-js@2 向 core-js@3 升级，官方的 Pull request](https://github.com/babel/babel/pull/7646)

2. @babel/preset-env 也因 core-js@3 的原因，需要配置 corejs 参数，否则 webpack 运行时会报 warning；

3. @babel/polyfill 不必再安装，转而需要依靠`core-js`和`regenerator-runtime`（详细原因请看作者的阐述），替代方案用法如下：

   1. 安装依赖

      ```sh
      yarn add babel-loader @babel/core @babel/preset-env -D
      yarn add core-js regenerator-runtime
      ```

   2. .babelrc 配置

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
                // Babel 7.4 supports injecting proposals polyfills. By default, @babel/preset-env does not inject them, but you can opt-in using the proposals flag: corejs: { version: 3, proposals: true }.
                "proposals": true,
              }
            }
          ]
        ],
        "plugins": []
      }
      ```

   3. js 代码里取代原先的`import '@babel/polyfill'`，做如下修改：

      ```js
      import 'core-js/stable';
      import 'regenerator-runtime/runtime';
      ```

4. 而@babel/plugin-transform-runtime，也随着 core-js@3 有更新：

   1. 安装依赖

      ```sh
      yarn add babel-loader @babel/core @babel/preset-env @babel/plugin-transform-runtime -D
      yarn add @babel/runtime-corejs3
      ```

   2. .babelrc 文件配置

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
                // Another notable change is the support of ECMAScript proposals. By default, @babel/plugin-transform-runtime does not inject polyfills for proposals and use entry points which do not include them but, exactly as you can do in @babel/preset-env, you can set the proposals flag to enable them: corejs: { version: 3, proposals: true }.
                "proposals": true
              },
              "useESModules": true
            }
          ]
        ]
      }
      ```

      `‘hello‘.includes(‘h‘)`这种句法，在使用 corejs@3 后，也可以被自动转译。

5. 一些预设级别的特性默认情况下是不包含的（文档：https://babeljs.io/docs/en/v7-migration#remove-proposal-polyfills-in-babel-polyfill-https-githubcom-babel-babel-issues-8416）， 如果想要包含：

   ```js
   import 'core-js/shim'; // included < Stage 4 proposals
   ```