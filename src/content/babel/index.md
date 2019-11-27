## Babel 7 转码

> 这是最新的 babel 配置，和网上的诸多教程可能有不同，可以自行测试验证有效性。

1. 基础依赖包

   ```js
   yarn add babel-loader@8 @babel/core -D
   ```

   > 从 babel7 开始，所有的官方插件和主要模块，都放在了 @babel 的命名空间下。从而可以避免在 npm 仓库中 babel 相关名称被抢注的问题。

2. 在 package.json 同级添加.babelrc 配置文件，先空着。

   ```js
   {
     "presets": [],  // 预设
     "plugins": []   // 插件
   }
   ```

3. package.json 文件可以声明需要支持到的浏览器版本

   1. package.json 中声明的 browserslist 可以影响到 babel、postcss，babel 是优先读取.babelrc 文件中@babel/preset-env 的 targets 属性，未定义会读取 package.json 中的 browserslist。  
      为了统一，在 package.json 中定义。

   2. package.json 中定义（推荐）

      ```json
      "browserslist": [
        "> 1%",
        "last 2 versions",
        "not ie <= 8"
      ],
      ```

      > 更多定义格式请查看：[browserslist](https://github.com/browserslist/browserslist)

   3. .babelrc 中定义（不推荐）
      ```js
      {
        "presets": [
          [
            "@babel/preset-env",
            {
              "targets": {
                "chrome": "58",
                "ie": "11"
              }
            }
          ]
        ]
      }
      ```