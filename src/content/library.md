## webpack打包js库

> 通常打包js库会选择 rollup，但是 webpack 同样可以做到，如果是需要对 css、图片等有较多应用的 js 库，webpack 会有更多优势。

1. 配置

    ```js
    module.exports = {
      ...
      entry: {
        sdk: 'xxxxxxx.js',
      },
      output: {
        ...
        library: '[name]', // 被挂载到全局对象（window、global）上的变量名称
        libraryTarget: 'umd', // 模块规范，umd 包含全部模块规范
        libraryExport: 'default', // 导出的对象，默认是 default
        umdNamedDefine: true, // 会对 UMD 的构建过程中的 AMD 模块进行命名，否则就使用匿名的 define
      },
      ...
    }
    ```

    > [umd](https://github.com/umdjs/umd) —— 打包出所有环境都可以使用的包  

2. 代码里导出

    ```js
    export default {
      a: xxxx,
      b: xxxx,
      c: xxxx,
    }
    ```

3. build打包后的js，将支持import、requrie导入，script标签引入，可以通过window.sdk使用等：
    
    ```js
    // import
    import { a, b, c } from '........js'

    // require
    const anything = require('........js')

    // window
    window.sdk
    window.sdk.a

    // node
    global.sdk
    global.sdk.a
    ```

4. 参考文档：  
    1. [怎样打包一个library？](https://webpack.docschina.org/guides/author-libraries)
    2. [一次打包暴露多个库](https://github.com/webpack/webpack/tree/master/examples/multi-part-library)