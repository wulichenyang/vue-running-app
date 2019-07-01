import * as types from '../mutation-types'
import { Toast } from 'mand-mobile'
export default {
  state: {
    // Loading
    loading: 0,

    // Notice Bar
    ifNotice: false,
    noticeInfo: '',
  },
  getters: {
    isLoading: state => state.loading > 0,
    ifNotice: state => state.ifNotice,
    noticeInfo: state => state.noticeInfo
  },

  mutations: {
    // Loading
    [types.ADD_LOADING](state) {
      state.loading = state.loading + 1
    },
    [types.SUB_LOADING](state) {
      state.loading = state.loading - 1
    },
    [types.FETCHING_ERROR](state, { msg }) {
      Toast.failed(`获取${msg}信息失败`)
    },
    
    // Notice Bar
    [types.UPDATE_NOTICE_BAR](state, { msg }) {
      state.noticeInfo = msg
    },
    [types.NOTICE_ON](state) {
      state.ifNotice = true
    },
    [types.NOTICE_OFF](state) {
      state.ifNotice = false
    },
    [types.CLEAR_NOTICE_BAR](state) {
      state.noticeInfo = ''
    }
  },
  actions: {
    // Loading
    addLoading({ commit }) {
      commit(types.ADD_LOADING)
    },
    subLoading({ commit }) {
      commit(types.SUB_LOADING)
    },
    fetchingError({ commit }, { msg }) {
      commit(types.FETCHING_ERROR, { msg })
    },

    // Notice Bar
    updateNoticeBar({ commit }, { msg }) {
      commit(types.NOTICE_ON)
      commit(types.UPDATE_NOTICE_BAR, { msg })
      setTimeout(() => {
        commit(types.NOTICE_OFF)
        commit(types.CLEAR_NOTICE_BAR)
      }, 2000)
    }
  }
}