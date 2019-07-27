import * as types from '../mutation-types'
import * as userApi from '../../api/user'

export default {
  state: {
    user: null,
  },
  getters: {
    user: state => state.user,
  },

  mutations: {
    [types.SET_USER](state, {user}) {
      state.user = user
    },
  },
  actions: {
    async getUser({commit, dispatch}) {
      dispatch('addLoading')
      try {
        let res = await userApi.getUser()
        // Success
        if(res.code === 0) {
          console.log(res)
          commit(types.SET_USER, {user: res.data.user})
          dispatch('subLoading')
          return true
        } else { // Failed
          dispatch('fetchingError', {msg: '用户'})
          dispatch('subLoading')
          return false
        }
      } catch(e) { // Error
        dispatch('fetchingError', {msg: '用户'})
        dispatch('subLoading')
        return false
      }
    },
  }
}