import Vue from 'vue'
import Vuex from 'vuex'
import trip from '@/store/modules/trip'
import loading from '@/store/modules/loading'
import history from '@/store/modules/history'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    trip,
    loading,
    history
  }
})
