## 模块配置别名、扩展名

1. 给模块配置扩展名，导入时即可省略文件后缀，webpack将自动完成查找。

2. 给模块或目录配置别名，即可在导入时避免书写冗长的引入路径，如：`import $ from 'utils/zepto.min'`；某个自己写的通用插件，配置别名为`xx`后，即可：`import xx from 'xx'`。

3. 示例代码：

    ```js
    const paths = require('./paths')

    module.exports = {
      ...
      resolve: {
        // 配置模块扩展名
        extensions: ['.js', '.json', '.css', '.less', '.art'],
        // 配置模块别名或目录别名
        alias: {
          src: paths.appSrc,
          components: paths.appComponents, // 将路径放到path.js里统一管理，更加推荐
          xx: path.resolve(__dirname, 'src/lib/xx.js'), // 给某个模块配置别名
        },
      },
      ...
    }
    ```