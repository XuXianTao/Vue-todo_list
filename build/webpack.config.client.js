const path = require('path')
const HTMLPlugin = require('html-webpack-plugin')//生成html,自动将js作为html插入
const webpack = require('webpack') // 用来声明plugin
const merge = require('webpack-merge') // 合并webpack配置，根据默认项合理合并
const VueLoaderPlugin = require('vue-loader/lib/plugin');
// 非js的静态资源打包,在webpack4.x失效,改用mini-css-extract-plugin
//const ExtractPlugin = require('extract-text-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
// 图片压缩imagemin-webpack-plugin
const ImageMinPlugin = require('imagemin-webpack-plugin').default;
// 每次打包前先清空指定文件夹clean-webpack-plugin
const CleanPlugin = require('clean-webpack-plugin');

const baseConfig = require('./webpack.config.base')
/**
* 通过cross-env可以实现不同平台的命令兼容
* process.env可以从命令中获取变量
*/
const isDev = process.env.NODE_ENV === 'development'

const defaultPlugins = [
  // 定义全局变量，不用每次都import
  new webpack.DefinePlugin({
    'processs.env': {
      NODE_ENV: isDev ? '"development"' : '"production"'
    }
  }), //给webpack 和代码进行环境判断，在js代码可以引用到
  // 生成入口html文件，输出的js文件自动插入到body尾部，可以通过定义参数对象(常见属性filename\template决定入口html文件与入口html文件模板)
  new HTMLPlugin(),
]

let config;

const devServer = {
  port: 8000,
  host: '0.0.0.0', // 可以支持局域网内访问
  overlay: {
    errors: true,
    warnings: true
  },
  historyFallback: {

  },//映射入口
  hot: true, //热刷新，每次修改只选让当前页面组件
  open: true //自动打开浏览器
};
baseConfig.plugins = baseConfig.plugins?baseConfig.plugins.concat(defaultPlugins):defaultPlugins;
if (isDev) {
  // 不会修改baseConfig
  config = merge(baseConfig, {
    module: {
      rules: [{
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
      }]
    },
    devtool: '#cheap-module-eval-source-map', // 调试映射，还有其他模式但有效率低等问题
    devServer,
    plugins: [
      new webpack.HotModuleReplacementPlugin(), //热加载，不刷新直接刷新页面
      new webpack.NoEmitOnErrorsPlugin()
    ]
  })
} else {
  config = merge(baseConfig, {
    entry: {
      app: path.join(__dirname, '../client/index.js'),
      // vue,vue-router等第三方框架单独打包
      // vendor: ['vue']
    },
    output: {
      // 使用chunkhash可以保证第三方的引用库在我们修改主要js的时候保持不变
      filename: '[name].[chunkhash:8].js'
    },
    module: {
      // 生产环境建议使用extract-text-webpack-plugin提取css可以并行加载css/js资源
      rules: [
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
      ]
    },
    plugins: [
      new VueLoaderPlugin(),
      //process.env.NODE_ENV = "development"

      new ImageMinPlugin({
        disable: true,
        //disable: process.env.NODE_ENV === 'development',
        test: /\.(jpg|png)$/,
        pngquant: {
          quality: '50-60',
          verbose: true
        },
        jpegtran: {
          progressive: true
        }
      }),

      new CleanPlugin(['dist']),
      // 单独输出css文件 contenthash根据输入文件内容得到hash
      new MiniCssExtractPlugin({
        filename: 'styles.[contenthash:8].css'
      }),
      // 在CommonsChunkPlugin(处理级别是chunk-代码块)要求name与entry入口的vendor键名相同，这样内部文件可以单独打包，对于多个需要单独打包的第三方库可以通过多次new CommonsChunkPlugin实现
      // 在webpack4中CommonsChunkPlugin被移除了
      // 分块打包的概念可以参考https://www.jianshu.com/p/d0bd4aed837f
    ],
    optimization: {
      // 提取被重复引用的文件，单独生成一个、多个文件，避免在多入口重复打包文件
      splitChunks: {
        // 配置需要进行模块拆分的代码块chunk
        // 配置async(默认值)只生成一个js文件，配置initial、all则会多生成一个vendors~app.js依赖于入口js
        chunks: 'all'
      }
    }
  })
}

module.exports = config
