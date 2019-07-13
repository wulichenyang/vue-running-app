const path = require('path')

function resolve(dir) {
  return path.join(__dirname, './', dir)
}

module.exports = {
  chainWebpack: config => {
    // 为src下文件配别名，不使用相对路径
    // config.resolve.alias
    //   .set('@', resolve('src'))
    //   .set('assets', resolve('src/assets'))
    //   .set('components', resolve('src/components'))
    //   .set('views', resolve('src/views'))
    //   .set('icons', resolve('src/icons'))
    //   .set('router', resolve('src/router'))
    //   .set('utils', resolve('src/utils'))
    //   .set('style', resolve('src/style'))

    /** 设置处理svg的router，使svg可直接用名称调用，无需路径 */
    // file-loader，并且把路径指定为在img文件夹下，但我们的 svg 并不在 img 文件夹，
    // 而且svg-sprite-loader已经自带了file-loader的功能，所以，我们可以在我们自定义
    // 的vue.config.js文件下将rule(svg)清除：
    // config.module.rule('svg').uses.clear()
    config.module.rules.delete("svg");
    // svg rule loader
    config.module
      .rule('svg')
      .uses.clear()
    config.module
      .rule('svg1')
      .test(/\.svg$/)
      .use('svg-sprite')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()
      .include
      .add(resolve('src/icons'))
      .end()

  },

  publicPath: '/',

  /* 开发环境代理 */
  devServer: {
    proxy: {
      '/running-api-v1': {
        target: 'http://localhost:3838',
        ws: true,
        changeOrigin: true //是否跨域
      }
    }
  }
}