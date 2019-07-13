import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import registerComponents from './utils/registerComponents'
import IconSvg from '@/components/SvgIcon/index.vue';
import './icons'

Vue.use(registerComponents)
Vue.config.productionTip = false

// 全局注册svg-icon
Vue.component('svg-icon', IconSvg);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
