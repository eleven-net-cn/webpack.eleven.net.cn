为懒人准备的 Webpack 搭建最佳实践，可以直接用于生产。这里单纯只做 webpack 构建、打包、代码的组织等，关于 React、Vue 等配置并不复杂，可以在需要时添加。随着 webpack 版本的迭代，会将最新的特性加入，持续更新...... 有空就写一点 ~,~

示例源码：[https://github.com/eleven-net-cn/webpack-template](https://github.com/eleven-net-cn/webpack-template)

## 版本

```js
webpack 4 + babel 7
```

## Yarn 和 NPM 的选择？

1. 项目使用 Yarn，相对于 NPM：速度快、可离线安装、锁定版本、扁平化等更多优点。
2. 如果需要从 npm 切换到 yarn，或者从 yarn 切换到 npm，请整体移除`node_modules`目录，及 yarn.lock/package-lock.json 文件，因 yarn 和 npm 两者的策略不同，导致相同的`package.json`列表安装后的`node_modules`结构是不同的（虽然这并不会引发 bug，但建议在切换时清除后重新`install`）。
