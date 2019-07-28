import Vue from 'vue'
import Router from 'vue-router'
import { Toast } from 'mand-mobile'
import cookie from './utils/cookie'
import { access_token } from './configs'
// import Home from '@/views/Home.vue'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      // component: Home,
      redirect: '/trip'
    },
    {
      path: '/trip',
      name: 'trip',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "xxx" */ '@/views/Trip.vue'),
      children: [{
        path: 'map/:tripWay',
        name: 'map',
        component: () => import( /* webpackChunkName: "xxx" */'@/components/TripDetail/TripDetail.vue'),
      }]
    },
    {
      path: '/traffic',
      name: 'traffic',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "xxx" */ '@/views/Traffic.vue')
    },
    {
      path: '/history',
      name: 'history',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "xxx" */ '@/views/History.vue'),
      children: [{
        path: 'detail',
        name: 'historyDetail',
        component: () => import( /* webpackChunkName: "xxx" */'@/components/HistoryDetail/HistoryDetail.vue'),
      }]
    },
    {
      path: '/user',
      name: 'user',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "xxx" */ '@/views/User.vue'),
      children: [{
        path: 'detail',
        name: 'userDetail',
        component: () => import( /* webpackChunkName: "xxx" */'@/components/User/UserDetail.vue'),
      },
      {
        path: 'trend',
        name: 'userTrend',
        component: () => import( /* webpackChunkName: "xxx" */'@/components/User/UserTrend.vue'),
      },
      {
        path: 'analysis',
        name: 'userAnalysis',
        component: () => import( /* webpackChunkName: "xxx" */'@/components/User/UserAnalysis.vue'),
      },
      {
        path: 'edit',
        name: 'userInfoEditor',
        component: () => import( /* webpackChunkName: "xxx" */'@/components/User/UserInfoEditor.vue'),
      },
      ]
    },
    {
      path: '/login',
      name: 'login',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "xxx" */ '@/views/Login.vue')
    },
    {
      path: '/signup',
      name: 'signup',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "xxx" */ '@/views/Signup.vue')
    }

  ]
})
// TODO: logout
// 导航守卫，非登录状态先登录
router.beforeEach((to, from, next) => {
  let token = cookie.getCookie(access_token)
  // let username = cookie.getCookie('vue_running_username')
  // 登录验证 路由改变时刷新cookie中的token过期时间 30天
  if (!token && (to.name !== 'login' && to.name !== 'signup')) {
    Toast.succeed('请登录', 1000)
    next({ path: '/login' })
    return
  } else {
    // 刷新token在cookie里的时间
    cookie.setCookie(access_token, token, 24 * 30) // 30天
    // cookie.setCookie('username', username, 24 * 30)
    next()
  }
})

export default router