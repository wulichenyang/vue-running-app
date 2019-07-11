import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import registerComponents from './utils/registerComponents'
// import mandMobile from 'mand-mobile'

Vue.use(registerComponents)
Vue.config.productionTip = false

// Vue.use(mandMobile)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
