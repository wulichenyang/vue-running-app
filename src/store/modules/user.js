import * as types from '../mutation-types'
import * as userApi from '../../api/user'

export default {
  state: {
    user: null,
    editing: null,
  },
  getters: {
    user: state => state.user,
    editing: state => state.editing,
  },

  mutations: {
    [types.SET_USER](state, { user }) {
      state.user = user
    },
    [types.SET_USER_EDITING](state, { editing }) {
      state.editing = editing
    },
    [types.RESET_USER](state) {
      state.user = null
      state.editing = null
    },
  },
  actions: {
    async getUser({ commit, dispatch }) {
      dispatch('addLoading')
      try {
        let res = await userApi.getUser()
        // Success
        if (res.code === 0) {
          console.log(res)
          commit(types.SET_USER, { user: res.data.user })
          dispatch('subLoading')
          return true
        } else { // Failed
          dispatch('fetchingError', { msg: '用户' })
          dispatch('subLoading')
          return false
        }
      } catch (e) { // Error
        dispatch('fetchingError', { msg: '用户' })
        dispatch('subLoading')
        return false
      }
    },
    setUserEditing({ commit }, editing) {
      commit(types.SET_USER_EDITING, { editing })
    },
    // 登出时清空所有vuex信息
    clearAllInfo({ commit }) {
      commit(types.RESET_LOADING)
      commit(types.RESET_USER)
      commit(types.RESET_TRIP)
      commit(types.RESET_HISTORY)
    }
  }
}