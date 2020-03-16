> 正常如果有多个入口，需要在 entry 中，以对象形式将所有入口都配置一遍，html 模版目录也需要 new 很多个 HtmlWebpackPlugin 来配置对应的页面模版，是否可以自动扫描? 无论多少个入口，只管新建，而不用管理入口配置？可以的！

1. 安装 node 模块 glob ( 扫描文件就靠它了 )

    ```bash
    yarn add glob -D
    ```

    ```js
    const glob = require('glob')
    ```

2. 自动扫描获取入口文件、html 模版（统一放在 utils.js 文件里）

    ```js
    const fs = require('fs')
    const path = require('path')
    const glob = require('glob')
    const appDirectory = fs.realpathSync(process.cwd())
    
    /**
     * 获取文件
     * @param {String} filesPath 文件目录
     * @returns {Object} 文件集合(文件名: 文件路径)
     */
    const getFiles = filesPath => {
      let files = glob.sync(filesPath)
      let obj = {}
      let filePath, basename, extname

      for (let i = 0; i < files.length; i++) {
        filePath = files[i]
        extname = path.extname(filePath) // 扩展名 eg: .html
        basename = path.basename(filePath, extname) // 文件名 eg: index
        // eg: { index: '/src/views/index/index.js' }
        obj[basename] = path.resolve(appDirectory, filePath)
      }
      return obj
    }

    /**
     * 打包入口
     *  1.允许文件夹层级嵌套;
     *  2.入口js的名称不允许重名;
     */
    const entries = getFiles('src/views/**/*.js')

    /**
     * 页面的模版
     *  1.允许文件夹层级嵌套;
     *  2.html的名称不允许重名;
     */
    const templates = getFiles('src/views/**/*.html')

    /**
     * 获取entry入口，为了处理在某些时候，entry入口会加 polyfill等:
     *  1.允许文件夹层级嵌套;
     *  2.入口的名称不允许重名;
     *
     * @returns {Object} entry 入口列表(对象形式)
     */
    const getEntries = () => {
      let entry = {}

      for (let name in entries) {
        entry[name] = entries[name]
      }
      return entry
    }
    ```

3. webpack 打包入口

    ```js
    module.exports = {
      entry: utils.getEntries(),
    }
    ```

4. html 模版自动引入打包资源（区分 dev 和 prod 环境，配置不同，同样抽离到 utils.js 文件更好一些）

    ```js
    const HtmlWebpackPlugin = require('html-webpack-plugin')

    /**
     * 生成webpack.config.dev.js的plugins下new HtmlWebpackPlugin()配置
     * @returns {Array} new HtmlWebpackPlugin()列表
     */
    const getHtmlWebpackPluginsDev = () => {
      let htmlWebpackPlugins = []
      let setting = null

      for (let name in templates) {
        setting = {
          filename: `${name}.html`,
          template: templates[name],
          inject: false, // js插入的位置，true/'head'/'body'/false
        }

        // (仅)有入口的模版自动引入资源
        if (name in getEntries()) {
          setting.chunks = [name]
          setting.inject = true
        }
        htmlWebpackPlugins.push(new HtmlWebpackPlugin(setting))
        setting = null
      }

      return htmlWebpackPlugins
    }

    /**
     * 生成webpack.config.prod.js的plugins下new HtmlWebpackPlugin()配置
     * @returns {Array} new HtmlWebpackPlugin()列表
     */
    const getHtmlWebpackPluginsProd = () => {
      let htmlWebpackPlugins = []
      let setting = null

      for (let name in templates) {
        setting = {
          filename: `${name}.html`,
          template: templates[name],
          minify: {
            removeComments: true,
            collapseWhitespace: true,
            removeRedundantAttributes: true,
            useShortDoctype: true,
            removeEmptyAttributes: true,
            removeStyleLinkTypeAttributes: true,
            keepClosingSlash: true,
            minifyJS: true,
            minifyCSS: true,
            minifyURLs: true,
          },
          inject: false, // js插入的位置，true/'head'/'body'/false
        }

        // (仅)有入口的模版自动引入资源
        if (name in getEntries()) {
          setting.chunks = ['manifest', 'vendor', 'common', name]
          setting.inject = true
        }
        htmlWebpackPlugins.push(new HtmlWebpackPlugin(setting))
        setting = null
      }

      return htmlWebpackPlugins
    }
    ```

5. 将 html-webpack-plugin 解构放到 plugins 里
    ```js
    const utils = require('./utils')
    
    ...
    plugins: { // dev
      ...utils.getHtmlWebpackPluginsDev(),
    },
    ...

    ...
    plugins: { // build
      ...utils.getHtmlWebpackPluginsProd(),
    },
    ...
    ```

6. 完整的 [utils.js](https://github.com/Eleven90/webpack-template/blob/master/build/utils.js)