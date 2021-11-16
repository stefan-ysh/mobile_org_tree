// module.exports = {
//   lintOnSave: false,
//   publicPath: "",
//   productionSourceMap: false
// };
module.exports = {
    // 选项...
    /* 部署应用包的基本URL */
    publicPath: './',
    lintOnSave: false,
    publicPath: "",
    productionSourceMap: false,
    /* 当运行 vue-cli-service build 时生成的生产环境构建文件的目录 defalut: dist */
    outputDir: './dist',
    //可根据不同环境打包不同地址
    //outputDir: process.env.NODE_ENV == 'production' ?
    // '../../../../dist-mobile/product/course' : process.env.NODE_ENV == 'stage' ?
    // '../../../../dist-mobile/stage/course' : process.env.NODE_ENV == 'qa' ?
    //'../../../../dist-mobile/qa/course' : '../../../../dist-mobile/run/course',

    /* 放置生成的静态文件目录（js css img） */
    assetsDir: 'static',

    /* 指定生成的index.html 输出路径 相对 default: index.html */
    indexPath: 'index.html',

    /* 指定生成文件名中包含hash default: true */
    filenameHashing: true,

    // 所有 webpack-dev-server 的选项都支持。
    devServer: {
        host: '0.0.0.0',
        port: 8888, // 端口号
        https: false,
        open: false, //配置自动启动浏览器

        // 配置多个代理
        proxy: {
            '/api': {
                target: process.env.VUE_APP_BASE_URL, // 代理服务器路径
                // target: 'http://192.168.200.155:3000/', // 代理服务器路径
                changeOrigin: true,
                pathRewrite: {
                    '^/api': '', // 去掉接口地址中的api字符串
                },
            },
        },
    },
}