## 配置 node express 服务

> 某些时候可能希望本地访问打包后的资源，可以配置一个 node express 服务完成。当然，你也可以通过它代理接口，mock数据（虽然不必如此）。

1.  新建 prod.server.js 文件，放到 package.json 同级目录

    ```js
    let express = require('express')
    let compression = require('compression')

    let app = express()
    let port = 9898

    app.use(compression())
    app.use(express.static('./static/'))

    module.exports = app.listen(port, function(err) {
      if (err) {
        console.log(err)
        return
      }
      console.log('Listening at http://localhost:' + port + '\n')
    })
    ```

2.  运行命令

    ```bash
    node prod.server.js
    ```

3.  访问路径
    ```bash
    localhost:9898/views/
    ```