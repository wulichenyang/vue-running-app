import Vue from 'vue'
import Router from 'vue-router'
import { Toast } from 'mand-mobile'
import cookie from './utils/cookie'

// import Home from './views/Home.vue'

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
      component: () => import(/* webpackChunkName: "xxx" */ './views/Trip.vue')
    },
    {
      path: '/traffic',
      name: 'traffic',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "xxx" */ './views/Traffic.vue')
    },
    {
      path: '/history',
      name: 'history',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "xxx" */ './views/History.vue')
    },
    {
      path: '/user',
      name: 'user',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "xxx" */ './views/User.vue')
    },
    {
      path: '/login',
      name: 'login',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "xxx" */ './views/Login.vue')
    },
    {
      path: '/signup',
      name: 'signup',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "xxx" */ './views/Signup.vue')
    }

  ]
})

// 导航守卫，非登录状态先登录
router.beforeEach((to, from, next) => {
  let token = cookie.getCookie('vue_running_token')
  let username = cookie.getCookie('vue_running_username')
  // 登录验证 路由改变时刷新cookie中的token过期时间 0.2小时
  if (!token && (to.name !== 'login' && to.name !== 'signup')) {
    Toast.succeed('请登录', 1000)
    next({ path: '/login' })
    return
  } else {
    // 刷新token在cookie里的时间
    cookie.setCookie('token', token, 0.005)
    cookie.setCookie('username', username, 0.005)
    next()
  }
})

export default router