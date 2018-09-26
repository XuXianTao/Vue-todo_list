const path = require('path')
// 非js的静态资源打包,在webpack4.x失效,改用mini-css-extract-plugin
/**
* 通过cross-env可以实现不同平台的命令兼容
* process.env可以从命令中获取变量
*/
const isDev = process.env.NODE_ENV === 'development'

const config = {
  mode: process.env.NODE_ENV,
  target: 'web',
  // 入口文件，在webpack中默认entry => ./src
  // 单入口是entry: {main: ''} 的简写
  // 分离第三方库entry:{app: '', vendors: ''}
  // 多页面使用entry:{pageOne: '', pageTwo: '', pageThree: ''}
  // entry的路径key值会作为output的[name]，产生的chunk个数与key值个数相等，默认只有一个
  entry: path.join(__dirname, '../client/index.js'),
  // 输出，默认path路径为./dist
  // 对于多个输入文件应该使用占位符比如filename: '[name].js'来确保每个输出文件有唯一的名称
  output: {
    // filename: 'bundle.[hash:8].js',
    // 正式环境用chunckhash hash ，但是在开发环境不能用chunkhash hash不然dev会报错
    // [hash]在修改任何一个文件的时候所有的[hash]值都改变，[chunkhash]只对修改了的文件的[chunkhash]才会改变
    // 对于被引用的文件，如果使用了[chunkhash]在修改内容的时候引用的文件名不变会导致仍然引用之前的导出缓存，所以应该使用[contenthash]实现非覆盖发布（要额外使用ExtractTextPlugin.extract实现分离） 
    filename: 'bundle.[chunkhash:8].js',
    path: path.join(__dirname, '../dist')
  },
  // 可以在module下配置模式mode: 'development'| 'production' =>等价于process.env.NODE_ENV = 'development'|'production' 并启用额外的plugin插件
  // 如果是通过NODE_ENV设置模式则不会自动设置module下的mode
  module: {
    // webpack本身只理解js，对于其他类型文件需要利用loader转化为webpack能够处理的有效模块，然后就可以对其进行处理打包
    // 起作用的时间主要实在require()/import的时候判断文件类型
    // 转化的loader有两个属性， test->转换的文件， use->转换应该使用的loader
    // 对于loader也有字符串的使用形式'babel-loader?fakeoption=true!eslint-loader',处理顺序从右向左,loader之间用！隔开，loader与options用？隔开
    rules: [
      {
        test: /\.vue$/,
        // vue-loader 
        loaders: 'vue-loader'
      },
      // React，vue2开始支持
      {
        test:/\.jsx$/,
        loader: 'babel-loader'
      },
      {
        test:/\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(gid|jpg|jpeg|png|svg)$/,
        use: [
          {
            loader: 'url-loader',//在file loader基础上->base64
            options: {
              limit: 1024,
              name: 'resources/[path][name]-[hash:8].[ext]'
            }
          }
        ]
      }
    ]
  }
}

module.exports = config
