## [externals](https://webpack.js.org/configuration/externals/#externals) 打包时排除某些模块

webpack提供的 externals，可以在打包时将该模块移除（即不打包到最终的代码里），以减小包的体积，被移除的该模块独立通过 CDN 在页面通过 script 标签引入。

仅做实际应用的介绍，更深入的解读推荐读这一篇：[webpack externals 深入理解](https://segmentfault.com/a/1190000012113011)。

1. 以 jQuery 为例，演示最常见的用途。

    1. 我们的代码中是这样书写的 jQuery 代码：

        ```js
        import $ from 'jquery'

        $('.my-element').animate(/* ... */)
        ```

    2. 在 webpack 的编译配置里添加如下配置：

        ```js
        module.exports = {
          ...
          output: {
            ...
          },
          externals: {
            // webpack 默认是通过全局变量来提供 jQuery，这里的 jQuery 等价于  root jQuery
            // https://webpack.js.org/configuration/externals/#externals
            jquery: "jQuery"
          },
          ...
        }
        ```

        在运行打包以后，应用中的 jquery 包即被替换为全局变量 `window.jQuery`。

        打包后的结果大概是下面的样子。

        ```js
        ({
          0: function(...) {
              var jQuery = require(1);
              /* ... */
          },
          1: function(...) {
            // 很明显这里是把window.jQuery赋值给了module.exports
            // 因此我们便可以使用require来引入了。
            module.exports = jQuery;
          },
            /* ... */
        });
        ```

    3. 使用你打包产出的代码，需要预先准备 jQuery 环境，即：script 标签引入。

        ```html
        <!-- 示例 -->
        <script src="https://cdn.staticfile.org/jquery/3.4.1/jquery.min.js"></script>
        ```

        不引入会怎样？当然就会报错：$ 对象找不到啦！

    **总结**
    
    某些知名的库，如：jQuery、React、Vue、Echarts 等，都有提供 CDN 的方式访问，就可以通过 externals 来缩减自己的项目代码体积。
    
    这样使用的意义：
    
      1. 从 CDN 访问速度会更快一些;
      
      2. 版本长期不变动，用户仅第一次访问需要下载，后续访问直接从本地读取，速度能提升;

    当然，如果你已经通过拆分 vendor 包，来做了基础包的缓存工作，那么就不是十分需要这么做了。通常，更建议将项目依赖的多个库，集中打包到 vendor，保持长期不变动，充分发挥浏览器缓存的作用。

2. 应用中的某个包，在编译时排除，并指定别的包替换它。

    uni-app 的小程序项目，实际使用到了这个功能，截取作为示例供参考。

    ```js
    externals: [
      function(context, request, callback) { // 版本不同，此处的函数参数与 babel 官网上的参数形式有区别
        /**
         * 1、在 uni-app 里，使用各家小程序的原生组件时，编译工具的处理方式是：将对应目录下的原生组件直接 copy 过去；
         * 2、因为这样的机制，衍生了一个问题：
         *  a.类似 @xmly/lite-login_wx 这个微信小程序原生组件，它提供的 request 等模块，本身是期望开发者发送请求时使用，解决携带喜马拉雅登录 cookie 的问题，但 uni-app 的编译机制，
         *  b.会导致 copy 过去的微信小程序原生组件是一个实例，而 import { request } from '@xmly/lite-login_wx/lib/index' 导入的模块，在 uni-app 编译时，被再次编译，在构建产物里是另一个实例，
         *  c.进而导致了 bug（request 带不上 cookie！）
         * 3、为了解决以上问题，通过 externals 略过导入 request 模块不打包到产物里，并修改引用路径，问题得到解决！
         */
        if (/^@xmly\/lite-login_wx\/lib\/index$/.test(request)){
          // 这里是将 @xmly/lite-login_wx 这个包，替换成了本地（编译后的代码）的另一个路径下的包
          return callback(null, 'commonjs ' + '../wxcomponents/@xmly/lite-login_wx/lib/index')
        }
        callback()
      }
    ],
    ```