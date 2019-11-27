## [webpack-dev-server](https://www.webpackjs.com/configuration/dev-server/)

1. 安装依赖包  

    ```bash
    yarn add webpack-dev-server -D
    ```

2. 常用配置  

    ```js
    devServer: {
      contentBase: path.join(__dirname, 'static'),    // 告诉服务器从哪里提供内容(默认当前工作目录)
      openPage: 'views/index.html',  // 指定默认启动浏览器时打开的页面
      index: 'views/index.html',  // 指定首页位置
      watchContentBase: true, // contentBase下文件变动将reload页面(默认false)
      host: 'localhost', // 默认localhost,想外部可访问用'0.0.0.0'
      port: 8080, // 默认8080
      inline: true, // 可以监控js变化
      hot: true, // 热启动
      open: true, // 启动时自动打开浏览器（指定打开chrome，open: 'Google Chrome'）
      compress: true, // 一切服务都启用gzip 压缩
      disableHostCheck: true, // true：不进行host检查
      quiet: false,
      https: false,
      clientLogLevel: 'none',
      stats: { // 设置控制台的提示信息
        chunks: false,
        children: false,
        modules: false,
        entrypoints: false, // 是否输出入口信息
        warnings: false,
        performance: false, // 是否输出webpack建议（如文件体积大小）
      },
      historyApiFallback: {
        disableDotRule: true,
      },
      watchOptions: {
        ignored: /node_modules/, // 略过node_modules目录
      },
      proxy: { // 接口代理（这段配置更推荐：写到package.json，再引入到这里）
        "/api-dev": {
          "target": "http://api.test.xxx.com",
          "secure": false,
          "changeOrigin": true,
          "pathRewrite": { // 将url上的某段重写（例如此处是将 api-dev 替换成了空）
            "^/api-dev": ""
          }
        }
      },
      before(app) { },
    }
    ```

    > 根据目录结构的不同，contentBase、openPage 参数要配置合适的值，否则运行时应该不会立刻访问到你的首页; 同时要注意你的 publicPath，静态资源打包后生成的路径是一个需要思考的点，这与你的目录结构有关。

3. package.json 添加运行命令

    ```bash
    "scripts": {
      "dev": "cross-env BUILD_ENV=development webpack-dev-server --mode development --colors --profile"
    }
    ```

    > 不同操作系统传递参数的形式不一样，cross-env 可以抹平这个平台差异。

4. 实用技巧：

    1. dev-server 的代码通常在内存中，但也可以写入硬盘，产出实体文件：

        ```js
        {
          writeToDisk: true,
        }
        ```

        通常可以用于代理映射文件调试，编译时会产出许多带 hash 的js 文件，不带 hash 的文件同样**也是实时编译的**。

    2. 有的时候，启动服务时，想要默认使用本地的 ip 地址打开：

        ```js
        {
          disableHostCheck: true, // true：不进行host检查
          // useLocalIp: true, // 建议不在这里配置
          // host: '0.0.0.0', // 建议不在这里配置
        }
        ```

        同时还需要将 host 配置为 `0.0.0.0`，这个配置建议在 scripts 命令中追加，而非在配置中写死，否则将来不想要这种方式往回改折腾，取巧一点，配个新命令：

        ```js
        "dev-ip": "yarn run dev --host 0.0.0.0 --useLocalIp",
        ```

    3. 有时启动的时候希望是指定的调试域名，例如：`local.test.baidu.com`：

        ```js
        {
          open: true,
          public: 'local.test.baidu.com:8080', // 需要带上端口
          port: 8080,
        }
        ```

        同时需要将 `127.0.0.1` 修改为指定的 host，可以借助 iHost 等工具去修改，各个工具大同小异，格式如下：

        ```js
        127.0.0.1 local.test.baidu.com
        ```
        
        服务启动后将自动打开 `local.test.baidu.com:8080` 访问

    4. dev-server 调试时，启动 gzip 压缩：

        ```js
        {
          compress: true,
        }
        ```