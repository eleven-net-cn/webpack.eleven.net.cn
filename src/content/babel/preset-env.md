### 基本的语法转换，需要添加预设[@babel/preset-env](https://babeljs.io/docs/en/babel-preset-env)

   1. 安装依赖包

      ```sh
      yarn add @babel/preset-env -D
      ```
   2. 添加配置
   
      ```js
      {
        "presets": [
          [
             "@babel/preset-env",
             {
               "modules": false, // 对ES6的模块文件不做转化，以便使用tree shaking、sideEffects等
             }
          ]
        ],
        "plugins": []
      }
      ```

> Babel 默认只转换新的 JavaScript 句法（syntax），而不转换新的 API，比如 Iterator、Generator、Set、Maps、Proxy、Reflect、Symbol、Promise 等全局对象，以及一些定义在全局对象上的方法（比如 Object.assign）都不会转码。<br>转译新的 API，需要借助polyfill方案去解决，使用`@babel/polyfill`或`@babel/plugin-transform-runtime`，二选一即可。