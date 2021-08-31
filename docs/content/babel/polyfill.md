### [@babel/polyfill](https://babeljs.io/docs/en/babel-polyfill#docsNav)

> 本质上@babel/polyfill是core-js库的别名，随着core-js@3的更新，@babel/polyfill无法从2过渡到3，所以@babel/polyfill已经被放弃，请查看[corejs 3 的更新](./corejs3.md)。

1. 安装依赖包：

    ```js
    yarn add @babel/polyfill
    ```

2. .babelrc 文件写上配置，@babel/polyfill 不用写入配置，会根据useBuiltIns参数去决定如何被调用。

    ```js
    {
      "presets": [
        [
          "@babel/preset-env",
          {
            "useBuiltIns": "entry",
            "modules": false,
            "corejs": 2, // 新版本的@babel/polyfill包含了core-js@2和core-js@3版本，所以需要声明版本，否则webpack运行时会报warning，此处暂时使用core-js@2版本（末尾会附上@core-js@3怎么用）
          }
        ]
      ]
    }
    ```

3. [配置参数](https://babeljs.io/docs/en/babel-preset-env)
    1. `modules`，`"amd" | "umd" | "systemjs" | "commonjs" | "cjs" | "auto" | false`，默认值是 auto。  
      用来转换 ES6 的模块语法。如果使用 false，将不会对文件的模块语法进行转化。  
      如果要使用 webpack 中的一些新特性，比如 tree shaking 和 sideEffects，就需要设置为 false，对 ES6 的模块文件不做转化，因为这些特性只对 ES6 的模块有效。
    2. `useBuiltIns`，`"usage" | "entry" | false`，默认值是 false。
      - `false`：需要在 js 代码第一行主动 import '@babel/polyfill'，会将@babel/polyfill 整个包全部导入。  
        （不推荐，能覆盖到所有 API 的转译，但体积最大）
      - `entry`：需要在 js 代码第一行主动 import '@babel/polyfill'，会将 browserslist 环境不支持的所有垫片都导入。  
        （能够覆盖到‘hello‘.includes(‘h‘)这种句法，足够安全且代码体积不是特别大）
      - `usage`：项目里不用主动 import，会自动将代码里已使用到的、且 browserslist 环境不支持的垫片导入。  
        （但是检测不到‘hello‘.includes(‘h‘)这种句法，对这类原型链上的句法问题不会做转译，**书写代码需注意**）
    3. `targets`，用来配置需要支持的的环境，不仅支持浏览器，还支持 node。如果没有配置 targets 选项，就会读取项目中的 browserslist 配置项。
    4. `loose`，默认值是 false，如果 preset-env 中包含的 plugin 支持 loose 的设置，那么可以通过这个字段来做统一的设置。