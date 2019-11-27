### @babel/polyfill 还是 @babel/plugin-transform-runtime ？

1. `@babel/preset-env + @babel/polyfill`可以转译语法、新 API，但存在污染全局问题；

2. `@babel/preset-env + @babel/plugin-transform-runtime + @babel/runtime-corejs2`，可按需导入，转译语法、新 API，且避免全局污染（babel7 中@babel/polyfill 是@babel/runtime-corejs2 的别名），但是检测不到‘hello‘.includes(‘h‘)这种句法；

3. @babel/polyfill 和@babel/runtime-corejs2 都使用了 core-js(v2)这个库来进行 api 的处理。  
core-js(v2)这个库有两个核心的文件夹，分别是 library 和 modules。@babel/runtime-corejs2 使用 library 这个文件夹，@babel/polyfill 使用 modules 这个文件夹。

    1. library 使用 helper 的方式，局部实现某个 api，不会污染全局变量； 
    2. modules 以污染全局变量的方法来实现 api；
    3. library 和 modules 包含的文件基本相同，最大的不同是\_export.js 这个文件：

        modules
        ```js
        // core-js/modules/_exports.js
        var global = require('./_global');
        var core = require('./_core');
        var hide = require('./_hide');
        var redefine = require('./_redefine');
        var ctx = require('./_ctx');
        var PROTOTYPE = 'prototype';

        var $export = function (type, name, source) {
          var IS_FORCED = type & $export.F;
          var IS_GLOBAL = type & $export.G;
          var IS_STATIC = type & $export.S;
          var IS_PROTO = type & $export.P;
          var IS_BIND = type & $export.B;
          var target = IS_GLOBAL ? global : IS_STATIC ? global[name] || (global[name] = {}) : (global[name] || {})[PROTOTYPE];
          var exports = IS_GLOBAL ? core : core[name] || (core[name] = {});
          var expProto = exports[PROTOTYPE] || (exports[PROTOTYPE] = {});
          var key, own, out, exp;
          if (IS_GLOBAL) source = name;
          for (key in source) {
            // contains in native
            own = !IS_FORCED && target && target[key] !== undefined;
            // export native or passed
            out = (own ? target : source)[key];
            // bind timers to global for call from export context
            exp = IS_BIND && own ? ctx(out, global) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
            // extend global
            if (target) redefine(target, key, out, type & $export.U);
            // export
            if (exports[key] != out) hide(exports, key, exp);
            if (IS_PROTO && expProto[key] != out) expProto[key] = out;
          }
        };
        global.core = core;
        // type bitmap
        $export.F = 1;   // forced
        $export.G = 2;   // global
        $export.S = 4;   // static
        $export.P = 8;   // proto
        $export.B = 16;  // bind
        $export.W = 32;  // wrap
        $export.U = 64;  // safe
        $export.R = 128; // real proto method for `library`
        module.exports = $export;
        ```

        library
        ```js
        // core-js/library/_exports.js
        var global = require('./_global');
        var core = require('./_core');
        var ctx = require('./_ctx');
        var hide = require('./_hide');
        var has = require('./_has');
        var PROTOTYPE = 'prototype';

        var $export = function (type, name, source) {
          var IS_FORCED = type & $export.F;
          var IS_GLOBAL = type & $export.G;
          var IS_STATIC = type & $export.S;
          var IS_PROTO = type & $export.P;
          var IS_BIND = type & $export.B;
          var IS_WRAP = type & $export.W;
          var exports = IS_GLOBAL ? core : core[name] || (core[name] = {});
          var expProto = exports[PROTOTYPE];
          var target = IS_GLOBAL ? global : IS_STATIC ? global[name] : (global[name] || {})[PROTOTYPE];
          var key, own, out;
          if (IS_GLOBAL) source = name;
          for (key in source) {
            // contains in native
            own = !IS_FORCED && target && target[key] !== undefined;
            if (own && has(exports, key)) continue;
            // export native or passed
            out = own ? target[key] : source[key];
            // prevent global pollution for namespaces
            exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
            // bind timers to global for call from export context
            : IS_BIND && own ? ctx(out, global)
            // wrap global constructors for prevent change them in library
            : IS_WRAP && target[key] == out ? (function (C) {
              var F = function (a, b, c) {
                if (this instanceof C) {
                  switch (arguments.length) {
                    case 0: return new C();
                    case 1: return new C(a);
                    case 2: return new C(a, b);
                  } return new C(a, b, c);
                } return C.apply(this, arguments);
              };
              F[PROTOTYPE] = C[PROTOTYPE];
              return F;
            // make static versions for prototype methods
            })(out) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
            // export proto methods to core.%CONSTRUCTOR%.methods.%NAME%
            if (IS_PROTO) {
              (exports.virtual || (exports.virtual = {}))[key] = out;
              // export proto methods to core.%CONSTRUCTOR%.prototype.%NAME%
              if (type & $export.R && expProto && !expProto[key]) hide(expProto, key, out);
            }
          }
        };
        // type bitmap
        $export.F = 1;   // forced
        $export.G = 2;   // global
        $export.S = 4;   // static
        $export.P = 8;   // proto
        $export.B = 16;  // bind
        $export.W = 32;  // wrap
        $export.U = 64;  // safe
        $export.R = 128; // real proto method for `library`
        module.exports = $export;
        ```

    4. 可以看出，library下的这个$export方法，会实现一个wrapper函数，防止污染全局变量。

    5. 例如对Promise的转译，@babel/polyfill和@babel/runtime-corejs2的转译方式差异如下：  

        ```js
        var p = new Promise();

        // @babel/polyfill
        require("core-js/modules/es6.promise");
        var p = new Promise();

        // @babel/runtime-corejs2
        var _interopRequireDefault = require("@babel/runtime-corejs2/helpers/interopRequireDefault");
        var _promise = _interopRequireDefault(require("@babel/runtime-corejs2/core-js/promise"));
        var a = new _promise.default();
        ```

    6. 从上面这个例子可以看出，对于Promise这个api，@babel/polyfill引用了core-js/modules中的es6.promise.js文件，因为是对全局变量进行处理，所以赋值语句不用做处理；@babel/runtime-corejs2会生成一个局部变量_promise，然后把Promise都替换成_promise，这样就不会污染全局变量了。

4. **综合上面的分析，得出结论：**
    1. 如果是自己的应用： `@babel/preset-env + @babel/polyfill`
        1. 根据useBuiltIns参数确定如何使用@babel/polyfill，具体参数设置总结如下：
            1. `useBuiltIns`设置为`entry`比较不错，推荐使用。  
              在js代码第一行`import '@babel/polyfill'`，或在webpack的入口entry中写入模块`@babel/polyfill`，会将browserslist环境不支持的所有垫片都导入；
              能够覆盖到`‘hello‘.includes(‘h‘)`这种句法，足够安全且代码体积不是特别大！

            2. `useBuiltIns`设置为`usage`。  
              项目里不用主动import，会自动将代码里已使用到的、且browserslist环境不支持的垫片导入；
              相对安全且打包的js体积不大，但是，通常我们转译都会排除`node_modules/`目录，如果使用到的第三方包有个别未做好ES6转译，有遇到bug的可能性，并且检测不到`‘hello‘.includes(‘h‘)`这种句法。
              代码书写规范，且信任第三方包的时候，可以使用！

            3. `useBuiltIns`设置为`false`比较不错。  
              在js代码第一行`import '@babel/polyfill'`，或在webpack的入口entry中写入模块`@babel/polyfill`，会将@babel/polyfill整个包全部导入；
              最安全，但打包体积会大一些，一般不选用。

        2. 需要安装的全部依赖：

            ```js
            yarn add babel-loader@8 @babel/core @babel/preset-env -D
            yarn add @babel/polyfill
            ```

        3. .babelrc配置文件

            ```js
            {
              "presets": [
                [
                  "@babel/preset-env",
                  {
                    "modules": false, // 推荐
                    "useBuiltIns": "entry", // 推荐
                    "corejs": 2, // 新版本的@babel/polyfill包含了core-js@2和core-js@3版本，所以需要声明版本，否则webpack运行时会报warning，此处暂时使用core-js@2版本（末尾会附上@core-js@3怎么用）
                  }
                ]
              ],
              "plugins": []
            }
            ```

    2. 如果是开发第三方类库： `@babel/preset-env + @babel/plugin-transform-runtime + @babel/runtime-corejs2`（或者，不做转码处理，提醒使用者自己做好兼容处理也可以）。

        1. 需要安装的全部依赖：

            ```js
            yarn add babel-loader@8 @babel/core @babel/preset-env @babel/plugin-transform-runtime -D
            yarn add @babel/runtime-corejs2
            ```

        2. .babelrc配置文件

            ```js
            {
              "presets": [
                [
                  "@babel/preset-env",
                  {
                    "modules": false,
                  }
                ]
              ],
              "plugins": [
                [
                  "@babel/plugin-transform-runtime",
                  {
                    "corejs": 2 // 推荐
                  }
                ]
              ]
            }
            ```

### 参考文档

1. [babel polyfill 和 runtime 浅析](https://blog.csdn.net/weixin_34163741/article/details/88015827)
2. [Babel + Webpack 配置前端项目](https://www.junorz.com/archives/689.html)