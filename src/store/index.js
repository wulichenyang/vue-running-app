import Vue from 'vue'
import Vuex from 'vuex'
import trip from '@/store/modules/trip'
import loading from '@/store/modules/loading'
import history from '@/store/modules/history'
import user from '@/store/modules/user'
import VuexPersistence from 'vuex-persist'

// 持久化存储 Vuex
const vuexLocal = new VuexPersistence({
  storage: window.localStorage
})

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    trip,
    loading,
    history,
    user
  },
  plugins: [vuexLocal.plugin]
})
