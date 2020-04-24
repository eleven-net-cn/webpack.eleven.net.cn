## 常见性能优化

1. [speed-measure-webpack-plugin](https://github.com/stephencookdev/speed-measure-webpack-plugin) 分析 webpack 编译过程中，各个 plugin、loader 等耗费的时间

    示例

    ```js
    const SpeedMeasurePlugin = require('speed-measure-webpack-plugin')
    const timestamp = require('time-stamp')
    
    const smp = new SpeedMeasurePlugin({
        // 默认通过 console.log 在终端直接输出
        // 如果配置此项，可以将内容输出在指定目录（目录需先手动创建好）下的指定文件（文件会自动创建）
        outputTarget: path.resolve(__dirname, `../log`, `performance_${timestamp('YYYYMMDD_HH:mm:ss')}.log`)
    })
    webpackConfig = smp.wrap(webpackConfig) // webpackConfig 是你原先的 webpack 配置
    ```

2. [webpack-monitor](https://github.com/webpackmonitor/webpackmonitor) 分析打包产物。

    示例

    ```js
    const WebpackMonitor = require('webpack-monitor')
    const timestamp = require('time-stamp')
    const { version } = require('../package')

    ...
    plugins: [
        // http://webpackmonitor.com/
        new WebpackMonitor({
            target: `../monitor/stats_v${version}_${timestamp('YYYYMMDD_HH:mm:ss')}.json`, // 输出的JSON统计文件的路径（相对于构建目录）
            launch: false, // 是否启动分析面板
            // capture: true, // 如果当前版本与先前版本不同，则捕获当前版本的统计信息
            // port: 3030, // 启动时为Webpack Monitor仪表板提供服务的端口
        }),
    ],
    ...
    ```

3. [webpack-bundle-analyzer](https://www.npmjs.com/package/webpack-bundle-analyzer) 分析打包产物

    示例

    ```js
    const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')

    ...
    plugins: [
        new BundleAnalyzerPlugin({
            ...
        }),
    ]
    ...
    ```

3. 使用happypack来优化，多进程运行编译，参考文档：

    1. [webpack 优化之 HappyPack 实战](https://www.jianshu.com/p/b9bf995f3712)
    2. [happypack 原理解析](https://yq.aliyun.com/articles/67269)

4. 使用[cache-loader](https://www.webpackjs.com/loaders/cache-loader/)缓存编译结果

5. [DllPlugin](https://segmentfault.com/a/1190000015489489)拆分基础包