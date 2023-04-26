// const { defineConfig } = require('@vue/cli-service')
// module.exports = defineConfig({
//   transpileDependencies: true,
//   configureWebpack: {
//     devServer: {
//       proxy: {
//         '^/api': {
//           target: 'http://localhost:3000',
//           changeOrigin: true,
//           pathRewrite: {
//             '^/api': ''
//           },
//           headers: {
//             'Access-Control-Allow-Origin': '*',
//             'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
//             'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
//           }
//         }
//       }
//     }
//   }
// })

module.exports = {
    devServer: {
        proxy: {
            '/api': {
                target: 'https://blog.csdn.net/', //接口域名（你请求的第三方接口）
                changeOrigin: true,             //是否跨域 （虚拟的站点需要更管origin）
                ws: true,                       //是否代理 websockets
                secure: false,                   //是否https接口
                pathRewrite: {                  //路径重置
                    '^/api': ''
                }
            }
        }
    }
};
