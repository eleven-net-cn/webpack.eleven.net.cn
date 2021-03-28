为懒人准备的 webpack 模版，可以直接用于生产。这里单纯只做 webpack 构建、打包、代码的组织等，关于 React、Vue 等配置并不复杂，可以在需要时添加。随着 webpack 版本的迭代，会将最新的特性加入，持续更新...... 有空就写一点 ~,~

源码：[https://github.com/eleven-net-cn/webpack-template](https://github.com/eleven-net-cn/webpack-template)

## 版本

```js
webpack 4 + babel 7
```

## Yarn 和 NPM 的选择？

1. 项目使用 Yarn，相对于 NPM：速度快、可离线安装、锁定版本、扁平化等更多优点。
2. 如果需要从 npm 切换到 yarn，或者从 yarn 切换到 npm，请整体移除`node_modules`目录，及 yarn.lock/package-lock.json 文件，因 yarn 和 npm 两者的策略不同，导致相同的`package.json`列表安装后的`node_modules`结构是不同的（虽然这并不会引发 bug，但建议在切换时清除后重新`install`）。

## Yarn 常用命令

```js
yarn / yarn install                 // 安装全部（package.json）依赖包 —— npm install

yarn run [dev]                      // 启动scripts命令

yarn add [pkgName]                  // 安装依赖包（默认安装到dependencies下） —— npm install [pkgName]
yarn add [pkgName]@[version]        // 安装依赖包，指定版本 —— npm install [pkgName]@[version]
yarn add [pkgName] -D               // 安装依赖包，指定到devDependencies —— npm install [pkgName] -D
yarn remove [pkgName]               // 卸载依赖包 —— npm uninstall [pkgName]

yarn upgrade [pkgName]              // 升级依赖包 —— npm update [pkgName]
yarn upgrade [pkgName]@[version]    // 升级依赖包，指定版本
```

## 参考文档

1. [yarn 中文网](https://yarnpkg.com/zh-Hans/)
2. [yarn 安装](https://yarnpkg.com/zh-Hans/) —— 预警：如果本机已经安装过`NodeJS`，使用`brew`安装`yarn`时，推荐使用`brew install yarn --without-node`命令，否则可能导致其它 bug。
3. [yarn 命令](https://yarnpkg.com/zh-Hans/docs/usage)
4. [yarn 和 npm 命令对比](https://yarn.bootcss.com/docs/migrating-from-npm/#toc-cli-commands-comparison)
