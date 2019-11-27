## 常见性能优化

1. 使用happypack来优化，多进程运行编译，参考文档：
    1. [webpack 优化之 HappyPack 实战](https://www.jianshu.com/p/b9bf995f3712)
    2. [happypack 原理解析](https://yq.aliyun.com/articles/67269)


2. 使用[cache-loader](https://www.webpackjs.com/loaders/cache-loader/)缓存编译结果

3. [DllPlugin](https://segmentfault.com/a/1190000015489489)拆分基础包