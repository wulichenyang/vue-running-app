import * as types from '../mutation-types'

export default {
  state: {
    historyDetail: {}
  },
  getters: {
    historyDetail: state => state.historyDetail
  },

  mutations: {
    [types.SET_HISTORY_DETAIL](state, { historyDetail }) {
      state.historyDetail = historyDetail
    },
    [types.RESET_HISTORY](state) {
      state.historyDetail = {}
    },
  },
  actions: {
    setHistoryDetail({ commit, dispatch }, historyDetail) {
      dispatch('addLoading')
      commit(types.SET_HISTORY_DETAIL, { historyDetail })
      dispatch('subLoading')
    },
  }
}