# vue-running-app

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn run serve
```

### Compiles and minifies for production
```
yarn run build
```

### Run your tests
```
yarn run test
```

### Lints and fixes files
```
yarn run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

## Data structure of server end
```
{
  data: {
    totalCount: 100,
    currentPage: 1,
    pageSize: 10,
    'list': [
    ],
  },
  message: '',
  code: 0/1 (0 -> success / 1 -> error)
}

```
## 注意
### 路径问题
- 如果图片引用的是:src，需要把图片放入public下img里，:src="`/img/xxx.jpg`"，webpack打包时会略过这种静态路径，把它当作静态文件，会自动在public下寻找资源，如果前端页面部署不是在域名的根目录时，需要在vue.config.js里配置publicPath，默认为'/'，即域名的根目录

- 如果图片引用是src，则只需使用相对路径引用，webpack打包时会进行hash图片处理

- 本项目server在前端根目录，上传的头像保存在/public/img/avatar内部，具体部署server时，需修改server里保存头像的路径，并反向代理前端图片头像的引用路径到server运行端口下