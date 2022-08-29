//1 引入插件copy-webpack-plugin
const CopyWebpackPlugin = require("copy-webpack-plugin");
const path = require("path");
module.exports = {
  // 选项...
  /* 部署应用包的基本URL */
  publicPath: "./",
  lintOnSave: false,
  publicPath: "",
  productionSourceMap: false,
  /* 当运行 vue-cli-service build 时生成的生产环境构建文件的目录 defalut: dist */
  outputDir: "./dist",
  /* 放置生成的静态文件目录（js css img） */
  assetsDir: "static",

  /* 指定生成的index.html 输出路径 相对 default: index.html */
  indexPath: "index.html",

  /* 指定生成文件名中包含hash default: true */
  filenameHashing: true,

  // 所有 webpack-dev-server 的选项都支持。
  devServer: {
    host: "0.0.0.0",
    port: 8888, // 端口号
    https: false,
    open: true, //配置自动启动浏览器
  },
  configureWebpack: {
    plugins: [
      new CopyWebpackPlugin([
        {
          from: path.resolve(__dirname, "./README.md"),
          to: path.resolve(__dirname, "./npm-package"),
        },
      ]),
    ],
  },
};
