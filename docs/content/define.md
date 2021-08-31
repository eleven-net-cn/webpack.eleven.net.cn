## 注入应用的全局变量

1. process.env是nodejs运行环境下的全局变量，在我们的应用代码（如src目录下的代码）中是无法直接读取到的，如果想要在应用代码中读取到process.env，或者如package.json中的数据，或其它nodejs环境中才有的变量，可以通过webpack.DefinePlugin将它们注入到应用中，将被声明为全局变量，直接读取即可。

2. 如react脚手架，是以这种方式，将所有的process.env变量，全部注入到了应用代码中，所以使用react脚手架搭建的应用，可以直接通过`process.env.`读取到环境变量。

3. 通常我们可以通过这种方式，去配置、读取系统的版本号；通过自己定义环境变量，注入到应用中，去区分编译环境。

4. 示例代码：

    ```js
    module.exports = {
      ...
      plugins: [
        // 应用中需要的process.env变量，在此注入才能使用。
        new webpack.DefinePlugin({
          BUILD_ENV: JSON.stringify(process.env.BUILD_ENV),  // 编译环境（development/test/production）
        }),
      ],
      ...
    }
    ```