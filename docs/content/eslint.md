1. 安装依赖

    ```bash
    yarn add eslint eslint-loader eslint-friendly-formatter babel-eslint -D
    ```  

    > eslint-friendly-formatter，指定终端中输出eslint提示信息的格式。  

2. 增加配置

    ```js
    {
        test: /\.js$/,
        enforce: 'pre',
        loader: 'eslint-loader',
        include: [paths.appSrc],
        exclude: [
          /node_modules/,
        ],
        options: {
          formatter: require('eslint-friendly-formatter'),
        },
      },
    ```

3. `package.json`文件同级增加文件`.eslintrc.js`

    ```js
    module.exports = {
        "root": true, 
        "parserOptions": {
            "sourceType": "module",
        },
        "parser": "babel-eslint", // eslint未支持的js新特性先进行转换
        "env": {
            "browser": true,
            "es6": true,
            "node": true,
            "shared-node-browser": true,
            "commonjs": true,
        },
        "globals": {    // 设置全局变量（false：不允许重写；）
            "BUILD_ENV": false,
        },
        "extends": "eslint:recommended", // 使用官方推荐规则，使用其他规则，需要先install，再指定。
        "rules": {
            // 定义检查规则
        }
    }
    ```

    **配置项含义：**  
    - root 限定配置文件的使用范围
    - parser 指定eslint的解析器
    - parserOptions 设置解析器选项
    - extends 指定eslint规范
    - plugins 引用第三方的插件
    - env   指定代码运行的宿主环境
    - rules 启用额外的规则或覆盖默认的规则
    - globals 声明在代码中的自定义全局变量

4. [ESLint官方的rules列表](https://cn.eslint.org/docs/rules/)

5. 如果有需要跳过检查的文件/文件夹，有两种途径可以实现：

    1. 新建`.eslintignore`文件

        ```md
        /node_modules
        ```

    2. 直接在文件、代码里加标识，详细请看：[官方文档的忽略规则](https://cn.eslint.org/docs/user-guide/configuring#disabling-rules-with-inline-comments)

6. 参考文档
    1. [webpack引入eslint详解](https://www.jianshu.com/p/33597b663481)
    2. [babel-eslint](https://www.jianshu.com/p/72169a86990f)