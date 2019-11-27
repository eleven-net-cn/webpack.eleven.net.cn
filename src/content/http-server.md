> 比自己配置一个 node express 服务更简洁的方式，去访问打包后的资源，可以使用 http-server 。

1. 安装依赖

   ```bash
   yarn add http-server -D
   ```

2. package.json 配置命令

   ```json
   "scripts": {
      "http-server": "http-server dist"
   }
   ```

3. 访问路径

   ```bash
   localhost:8080 或 http://127.0.0.1:8080
   ```