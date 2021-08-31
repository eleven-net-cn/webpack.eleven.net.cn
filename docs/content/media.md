1. css或js 中引入的图片、字体、多媒体等静态资源，统一使用 url-loader 处理。

    > 配置了 url-loader 以后，webpack 编译时可以自动将小文件转成 base64 编码，减少网络请求。如果不需要将小文件转成 base64 ，也可以用 file-loader 替换 url-loader。

    1. 安装依赖包

        > url-loader 内部会自动调用 file-loader，所以仍然需要安装。

        ```bash
        yarn add url-loader file-loader -D
        ```
    
    2. 添加配置
    
        ```js
        // 处理图片(file-loader来处理也可以，url-loader更适合图片)
        {
          test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
          loader: 'url-loader',
          options: {
            limit: 10000,
            name: 'static/assets/images/[name].[hash:7].[ext]',
          },
        },
        // 处理多媒体文件
        {
          test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
          loader: 'url-loader',
          options: {
            limit: 10000,
            name: 'static/assets/media/[name].[hash:7].[ext]',
          },
        },
        // 处理字体文件
        {
            test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
            loader: 'url-loader',
            options: {
                limit: 10000,
                name: 'static/assets/fonts/[name].[hash:7].[ext]'
            }
        },
        ```

    3. js中使用到静态资源，需要通过 import、require 导入再使用，才会被处理。

        ```js
        import img from 'xxx/xxx/123.jpg' 或 let img = require('xxx/xxx/123.jpg')
        ```

2. 对于直接在 html 页面中通过标签引入的图片或其它静态资源，即使配置了 url-loader，webpack也不会去处理它们，可以使用 [html-loader](https://www.webpackjs.com/loaders/html-loader/) 处理。

    1. 安装依赖包

        ```bash
        yarn add html-loader -D
        ```

    2. 添加配置

        ```js
        // html中引用的静态资源在这里处理,默认配置参数attrs=img:src,处理图片的src引用的资源.
        {
            test: /\.html$/,
            loader: 'html-loader',
            options: {
                // 除了img的src,还可以继续配置处理更多html引入的资源(不能在页面直接写路径,又需要webpack处理怎么办?先require再js写入).
                attrs: ['img:src', 'img:data-src', 'audio:src'],
                minimize: false,
                removeComments: true,
                collapseWhitespace: false
            }
        }
        ```

3. 静态资源的访问路径问题

    > 经过上面的处理，静态资源处理基本没有问题了，webpack 编译时将会将文件打包到你指定的生成目录，但是不同位置的路径url会是一个问题。全部通过绝对路径访问即可，在 output 下的 publicPath 填上适当的 server 端头，来保证所有静态资源文件能被访问到，具体要根据服务器部署的目录结构来做修改。

    ```js
    output: {
     path: path.resolve(__dirname, 'dist'), // 输出目录的配置，模板、样式、脚本、图片等资源的路径配置都相对于它
     publicPath: '/', // 模板、样式、脚本、图片等资源对应的server上的路径
    }
    ```