## 常见性能优化

1. [speed-measure-webpack-plugin](https://github.com/stephencookdev/speed-measure-webpack-plugin) 分析 webpack 编译过程中，各个 plugin、loader 等耗费的时间

    示例

    ```js
    const SpeedMeasurePlugin = require('speed-measure-webpack-plugin')
    ```

    ```js
    const smp = new SpeedMeasurePlugin({
        // 默认通过 console.log 在终端直接输出
        // 如果配置此项，可以将内容输出在指定目录（目录需先手动创建好）下的指定文件（文件会自动创建）
        outputTarget: path.resolve(__dirname, `../log`, `performance.${new Date().getTime()}.log`)
    })
    webpackConfig = smp.wrap(webpackConfig) // webpackConfig 是你原先的 webpack 配置
    ```

2. [webpack-monitor](https://github.com/webpackmonitor/webpackmonitor) 分析打包产物。

    示例

    ```js
    const WebpackMonitor = require('webpack-monitor')
    ```

    ```js
    ...
    plugins: [
        // http://webpackmonitor.com/
        new WebpackMonitor({
        launch: false, // -> default 'false'
        // capture: true, // -> default 'true'
        // port: 3030,
        }),
    ],
    ...
    ```

3. 使用happypack来优化，多进程运行编译，参考文档：

    1. [webpack 优化之 HappyPack 实战](https://www.jianshu.com/p/b9bf995f3712)
    2. [happypack 原理解析](https://yq.aliyun.com/articles/67269)

4. 使用[cache-loader](https://www.webpackjs.com/loaders/cache-loader/)缓存编译结果

5. [DllPlugin](https://segmentfault.com/a/1190000015489489)拆分基础包