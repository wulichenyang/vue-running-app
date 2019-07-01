import * as types from '../mutation-types'
import { Toast } from 'mand-mobile'
export default {
  state: {
    loading: []
  },
  getters: {
    isLoading: state => state.loading.length > 0,
  },

  mutations: {
    [types.ADD_LOADING](state) {
      state.loading = [
        ...state.loading,
        1
      ]
    },
    [types.SUB_LOADING](state) {
      state.loading = state.loading.slice(1)
    },
    [types.FETCHING_ERROR](state, { msg }) {
      Toast.failed(`获取${msg}信息失败`)
    }
  },
  actions: {
    addLoading({ commit }) {
      commit(types.ADD_LOADING)
    },
    subLoading({ commit }) {
      commit(types.SUB_LOADING)
    },
    fetchingError({ commit }, { msg }) {
      commit(types.FETCHING_ERROR, { msg })
    }
  }
}