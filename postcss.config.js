//在css编译完成之后调用postcss
const autoprefixer = require('autoprefixer')

module.exports = {
  // 插件执行顺序从上到下
  plugins: [
    // 支持的浏览器前缀可以从https://github.com/browserslist/browserslist#best-practices 的browserlist中找到，默认defaults
    autoprefixer
  ]
}
