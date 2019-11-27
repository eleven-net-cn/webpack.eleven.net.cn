> 某些时候，应用中依赖了某些模块，但希望将这些模块独立通过CDN引入，以减小包的体积，所以不必将这些模块打包，例如：jQuery。  
> 特定场景下，这个功能会有用武之地！webpack提供了 externals 可以来配置，打包时将此模块排除，且不用修改其它任何代码。

```js
module.exports = {
  ...
  output: {
    ...
  },
  externals: {
    jquery: "jQuery"
  },
  ...
}
```