# vue-running-app

## 跑步记录、地图路线

```

基于高德地图的行程记录网站

功能：

    - 支持记录行程数据、保存行程路线，查看消耗卡路里；

    - 实时计算当前速度、路程；

    - 查询起止节点推荐路径、推荐具体乘车信息

    - 查询用户个人历史出行信息记录、出行历史可视化分析信息；
    
    - 登录和修改用户个人信息、修改头像

```

## 功能列表

### 用户页面

- [x] 行程页面
- [x] 搜索路线
- [x] 历史行程
- [x] 历史详情
- [x] 个人主页
- [x] 出行趋势（私人出行历程趋势、交通出行历程趋势）
- [x] 数据分析（出行方式分布、出行/交通历程对比）
- [x] 用户详情
- [x] 头像修改
- [x] 用户设置
- [x] 用户密码
- [ ] 个人主页其他项目


## 效果展示

### 行程记录
<img src="https://github.com/wulichenyang/vue-running-app/blob/master/screenshots/run.gif" width="320" height="619"/>

### 路线查询、历史出行记录
<img src="https://github.com/wulichenyang/vue-running-app/blob/master/screenshots/search.gif" width="320" height="619"/>

### 用户信息、可视化分析查询
<img src="https://github.com/wulichenyang/vue-running-app/blob/master/screenshots/profile.gif" width="320" height="619"/>


## 数据交互接口规范
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

### 代理请求
- 本项目server在前端根目录，上传的头像保存在/public/img/avatar内部，具体部署server时，需修改server里保存头像的路径，修改删除路径，并反向代理前端图片头像的引用路径到server运行端口下

- 普通请求代理到： http://localhost:3838
