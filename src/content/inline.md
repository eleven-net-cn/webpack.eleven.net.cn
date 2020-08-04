## 内联 js/css 等资源

在某些特殊场景，你可能希望将 js/css 等资源，直接通过 style/script 标签的形式插入到 html 中。

比较常见的如：

1. runtime 代码，因为体积极小，单独成文件只会增加 http 请求的时间，不如直接放置到 html 页面上。

2. 在移动端，如果使用 REM 方案，这段 js 的计算代码，应当尽可能早的加载、执行，尽早的确定 html 根标签的 `font-size`。

在 webpack 打包的过程中，想要实现，大概可以有以下 3 种方式。

### react-dev-utils/InlineChunkHtmlPlugin

React 官方在 CRA 脚手架中提供了这种方式，去将指定的 chunk 内联到 html。

使用方式：

```js
const HtmlWebpackPlugin = require('html-webpack-plugin')
const InlineChunkHtmlPlugin = require('react-dev-utils/InlineChunkHtmlPlugin')

module.exports = {
  ...
  plugins: [
    // 数组中指定正则表达式去匹配
    new InlineChunkHtmlPlugin(HtmlWebpackPlugin, [/runtime~.+[.]js/]),
  ],
  ...
}
```

在数组中指定的正则表达式，用于匹配 webpack **打包后的产物**，命中的将会被内联到 html，注意需要依赖 `html-webpack-plugin`。

如果是非 CRA 创建的项目，可以使用社区的这个包 [inline-chunk-html-plugin](https://www.npmjs.com/package/inline-chunk-html-plugin) 。

### [inline-source-webpack-plugin](https://github.com/KyLeoHC/inline-source-webpack-plugin)

此 plugin 适用 webpack4 以上，如果是低版本 webpack，可以使用 [inline-resource-plugin](https://github.com/KyLeoHC/inline-resource-plugin) 。

使用方式：

1. 在 webpack 的配置文件中添加插件配置，注意需要依赖 `html-webpack-plugin` 。

    ```js
    // webpack.config.js
    const HtmlWebpackPlugin = require('html-webpack-plugin')
    const InlineSourceWebpackPlugin = require('inline-source-webpack-plugin')

    module.exports = {
      ...
      plugins: [
        new HtmlWebpackPlugin({
          ...
        }),
        new InlineSourceWebpackPlugin({
          compress: true,
          rootpath: './src', // 可以指定 plugin 处理时的根目录（从项目的根目录开始）
          noAssetMatch: 'warn'
        }),
      ],
      ...
    }
    ```

2. 在 html 文件中添加 script 标签，指定 inline、inline-asset、inline-asset-delete 等属性。

    内联项目中的某个文件，或者内联 webpack 的编译产物文件，两者使用方式略有区别，请看下方注释。

    ```html
    <!-- html 文件 -->
    <!DOCTYPE html>
    <html lang="zh-CN">
      <head>
        <meta charset="UTF-8">
        <title>test</title>
        <link href="inline.css" inline="true">
        <!-- 1、直接填写路径、文件名，该文件即可被内联（注意：选中内联的文件代码不会经过 babel 转译） -->
        <script src="lib/inline~rem.js" inline="true"></script>
      </head>
      <body>
        <div class="container">
          <h1>hello world!</h1>
        </div>
        <!-- 2、'inline-asset' 属性会去匹配 webpack 的打包产物，将命中的产物内联。注意：你可能要留意产物文件和 runtime 文件的先后顺序。 -->
        <script inline inline-asset="runtime\.\w+\.js$" inline-asset-delete></script>
        <script inline inline-asset="bundle\.\w+\.js$" inline-asset-delete></script>
      </body>
    </html>
    ```

### [raw-loader](https://github.com/webpack-contrib/raw-loader)

raw-loader 一般性的使用是：将某模块文件转成字符串输出。同时，我们也可以用来将某文件内联到 html。

使用方式：

安装过 raw-loader 以后，在 html 文件中添加如下 script 标签。依赖的是 `html-webpack-plugin` 来识别该语法（如果 html-webpack-plugin 插件是比较旧的版本，语法需要有点区别）。

```html
<!-- html 文件 -->
<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8">
    <title>test</title>
    <script>
      <%=require('raw-loader!babel-loader!../src/lib/inline~rem.js').default%>
    </script>
  </head>
  <body>

  </body>
</html>
```

编写 require 语句时，可以指定多个 loader 去处理指定的文件，例如上方即指定了 `babel-loader` 处理。

raw-loader 默认生成使用 ES 模块语法的 JS 模块，需要注意一下，可能会导致使用出错或不生效。

参考文档：[webpack使用raw-loader内联静态资源失效](https://blog.csdn.net/weixin_43711917/article/details/105748406)


### 总结

综合上面几种方法，都能实现，各有一点区别。

1. react-dev-utils/InlineChunkHtmlPlugin 在 CRA 创建的项目里使用，处理 runtime 代码很合适；只能将打包的产物文件内联。

2. inline-source-webpack-plugin 既可以将某个文件内联，也可以将打包的产物内联；但是，直接内联某个文件，该文件不会经过 babel 转译，要注意这个问题。

3. raw-loader 只能将某个文件内联，不能将打包的产物内联；内联的某个文件可以经过 babel 转译。