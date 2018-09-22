const path = require('path')
const HTMLPlugin = require('html-webpack-plugin')//自动将js作为html插入
const webpack = require('webpack')
const VueLoaderPlugin = require('vue-loader/lib/plugin');
// 非js的静态资源打包,在webpack4.x失效,华勇mini-css-extract-plugin
//const ExtractPlugin = require('extract-text-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

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
  entry: path.join(__dirname, 'src/index.js'),
  // 输出，默认path路径为./dist
  // 对于多个输入文件应该使用占位符比如filename: '[name].js'来确保每个输出文件有唯一的名称
  output: {
    // filename: 'bundle.[hash:8].js',
    // 正式环境用chunckhash hash ，但是在开发环境不能用chunkhash hash不然dev会报错
    // [hash]在修改任何一个文件的时候所有的[hash]值都改变，[chunkhash]只对修改了的文件的[chunkhash]才会改变
    // 对于被引用的文件，如果使用了[chunkhash]在修改内容的时候引用的文件名不变会导致仍然引用之前的导出缓存，所以应该使用[contenthash]实现非覆盖发布（要额外使用ExtractTextPlugin.extract实现分离） 
    filename: 'bundle.[hash:8].js',
    path: path.join(__dirname, 'dist')
  },
  // 可以在module下配置模式mode: 'development'| 'production' =>等价于process.env.NODE_ENV = 'development'|'production' 并启用额外的plugin插件
  // 如果是通过NODE_ENV设置模式则不会自动设置module下的mode
  module: {
    // webpack本身只理解js，对于其他类型文件需要利用loader转化为webpack能够处理的有效模块，然后就可以对其进行处理打包
    // 起作用的时间主要实在require()/import的时候判断文件类型
    // 转化的loader有两个属性， test->转换的文件， use->转换应该使用的loader
    rules: [
      {
        test: /\.vue$/,
        // vue-loader 
        loaders: 'vue-loader'
      },
      {
        test:/\.jsx$/,
        loader: 'babel-loader'
      },
      {
        test: /\.(gid|jpg|jpeg|png|svg)$/,
        use: [
          {
            loader: 'url-loader',//在file loader基础上->base64
            options: {
              limit: 1024,
              name: '[name]-aaa.[ext]'
            }
          }
        ]
      }
    ]
  },
  // 插件可以用户执行比loader更广范围的任务，包括打包优化，压缩，重定义环境变量
  plugins: [
    new VueLoaderPlugin(),
    //process.env.NODE_ENV = "development"
    new webpack.DefinePlugin({
      'processs.env': {
        NODE_ENV: isDev ? '"development"' : '"production"'
      }
    }), //给webpack 和代码进行环境判断，在js代码可以引用到
    new HTMLPlugin()
  ]
}

if (isDev) {
  config.module.rules.push(
    {
      test: /\.styl/,
      // 流水线执行，从下往上执行，可同步可异步
      use: [
        // style-loader， 给css文件加上<style>标签
        'style-loader',
        // 解析@import和url()，默认压缩，可以额外设置options：配置属性
        'css-loader',
        {
          // autoprefixer等css插件都是postcss的功能
          loader: 'postcss-loader',
          options: {
            sourceMap: true//调用stylus已经生成的source-map加快速度
          }
        },
        'stylus-loader' // loader往上扔
      ]
    }
  )
  config.devtool = '#cheap-module-eval-source-map' // 调试映射，还有其他模式但有效率低等问题
  config.devServer = {
    port: 8000,
    host: '0.0.0.0', // 可以支持局域网内访问
    overlay: {
      errors: true,
    },
    historyFallback: {

    },//映射入口
    hot: true, //热刷新，每次修改只选让当前页面组件
    open: true //自动打开浏览器
  }
  config.plugins.push(
    new webpack.HotModuleReplacementPlugin(), //热加载，不刷新直接刷新页面
    new webpack.NoEmitOnErrorsPlugin()
  )
} else {
  config.entry = {
    app: path.join(__dirname, 'src/index.js'),
    // vue,vue-router等第三方框架单独打包
    vendor: ['vue']
  }
  config.output.filename = '[name].[chunkhash:8].js'
  // 生产环境建议使用extract-text-webpack-plugin提取css可以并行加载css/js资源
  config.module.rules.push(
    {
      test: /\.styl/,
      use: [
        MiniCssExtractPlugin.loader,
        'css-loader',
        {
          loader: 'postcss-loader',
          options: {
            sourceMap: true
          }
        },
        'stylus-loader'
      ]
    }
  )
  config.plugins.push(
    // 根据输入文件内容得到hash
    new MiniCssExtractPlugin({
      filename:'styles.[contenthash:8].css'
    }),
    // 要求name与entry入口的vendor键名相同，这样内部文件可以单独打包
    // 在webpack
    new webpack.optimize.splitChunks({
      name: 'vendor'
    })
  )
}

module.exports = config
