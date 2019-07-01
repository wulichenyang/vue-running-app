import * as types from '../mutation-types'
import * as tripApi from '../../api/trip'
import * as userApi from '../../api/user'

export default {
  state: {
    user: null,
    distance: null,
  },
  getters: {
    user: state => state.user,
    distance: state=> state.distance
  },

  mutations: {
    [types.SET_USER](state, {user}) {
      state.user = user
    },
    [types.SET_DISTANCE](state, {distance}) {
      state.distance = distance
    }
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
        } else { // Failed
          dispatch('fetchingError', {msg: '用户'})
        }
        
        dispatch('subLoading')
      } catch(e) { // Error
        dispatch('fetchingError', {msg: '用户'})
        dispatch('subLoading')
      }
    },
    async getDistance({commit, dispatch}) {
      dispatch('addLoading')
      try {
        let res = await tripApi.getDistance()
        // Success
        if(res.code === 0) {
          commit(types.SET_DISTANCE, {distance: res.data.distance})
        } else { // Failed
          dispatch('fetchingError', {msg: '里程'})
        }
        
        dispatch('subLoading')
      } catch(e) { // Error
        dispatch('fetchingError', {msg: '里程'})
        dispatch('subLoading')
      }
    }
  }
}