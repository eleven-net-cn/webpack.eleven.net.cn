> 通常使用模块，我们需要先import、require该模块，例如：react，我们需要在每个react组件中都import一次，通过webpack.ProvidePlugin，我们可以省去这种重复劳动，不必在组件中单独导入。

```js
module.exports = {
  ...
  plugins: [
    // 大量需要使用到的模块，在此处一次性注入，避免到处import/require。
    new webpack.ProvidePlugin({
      React: 'react',
      Zepto: 'zepto',
    }),
  ],
  ...
}
```