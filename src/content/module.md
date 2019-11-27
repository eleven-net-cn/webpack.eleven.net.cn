## [如何在 webpack 中引入未模块化的库，如：Zepto](https://blog.csdn.net/sinat_17775997/article/details/70495891)

> script-loader 把我们指定的模块 JS 文件转成纯字符串，exports-loader 将需要的 js 对象 module.exports 导出，以支持 import 或 require 导入。

1.  安装依赖包

    ```bash
    yarn add script-loader exports-loader -D
    ```

2.  配置

    ```js
    {
      test: require.resolve('zepto'),
      loader: 'exports-loader?window.Zepto!script-loader'
    }
    ```

    > 以上是正常处理一个 _"可以 npm 安装，但又不符合 webpack 模块化规范"_ 的库，例如其它库 XX，处理后可以直接 import xx from XX 后使用; 但是，zepto 有点特殊，默认 npm 安装的包或者从 github clone 的包，都是仅包含 5 个模块，其它如常用的 touch 模块是未包含的，想要正常使用还需做得更多。

3.  怎样拿到一个包含更多模块的 zepto 包 ？

    a) [打包出一个包含更多需要模块的 zepto 包 ](https://www.cnblogs.com/czf-zone/p/4433657.html)  
     从 github clone 官方的包下来, 找到名为 make 的文件 ( 在 package.json 同级目录 ),， 用记事本打开，找到这一行 `modules = (env['MODULES'] || 'zepto event ajax form ie').split(' ')`，应该是在第 41 行，手动修改加入你想要引入的模块，然后保存;

    b) 在 make 文件同级目录 => 右键打开终端或 git bash => 敲 yarn add 安装 zepto 源码需要的 node 包 ( 这里你应当是已经已安装过 nodejs 了，如果没有，安装好后再做这一步 )，等待安装结束.

    c) 在刚才打开的 终端/git bash 敲命令 npm run-script dist，如果没有报错，你应该在这个打开的文件夹里可以看到生成了一个文件夹 dist，打开它，包含新模块的 zepto 包就在这了，Over !

4.  拿到新的 zepto 包后，建议放到自己的 src 下 lib 目录( 第三方工具包目录 )，不再通过 npm 的方式去安装和更新 zepto 了 ( _因为将来 npm update 后的 zepto 又将缺少模块，将来别人也会出现误操作_ )；现在开始对这个放在 lib 目录下的 zepto.min.js 进行处理：

    1. 通过 script-loader、exports-loader 转成符合 webpack 模块化规范的包

        ```js
        {
          // # require.resolve()是nodejs用来查找模块位置的方法,返回模块的入口文件
          test: require.resolve('./src/js/lib/zepto.min.js'),
          loader: 'exports-loader?window.Zepto!script-loader'
        }
        ```

    2. 给模块配置别名

        ```js
        resolve: {
          alias: {
              'zepto': path.resolve(__dirname, './src/js/lib/zepto.min.js')
          }
        }
        ```

    3. 自动加载模块，不再到处 import 或 require

        ```js
        new webpack.ProvidePlugin({
          $: 'zepto',
          Zepto: 'zepto',
        })
        ```

    4. 大功告成，现在使用 zepto 跟你使用 jquery 或其它 node 包是一样的开发体验了！

    > 以上，演示的是对于一个第三方库( 不能 npm 安装，也不符合 webpack 模块规范 )，如何去处理，达到和正常 npm 安装一样的开发体验，仅就 zepto 来说，npm 库有符合 webpack 规范的不同版本 ([zepto-webpack](https://www.npmjs.com/package/zepto-webpack)，或 [zepto-modules](https://www.npmjs.com/package/zepto-modules))，有需要可以试试。平时意图使用某个包，先去[NPM 官网](https://www.npmjs.com/)搜一搜比较好。