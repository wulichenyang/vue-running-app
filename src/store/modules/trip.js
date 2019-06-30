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
      dispatch(types.ADD_LOADING)
      try {
        let res = await userApi.getUser()
        // Success
        if(res.code === 0) {
          commit(types.SET_USER, {user: res.data.user})
        } else { // Failed
          dispatch(types.FETCHING_ERROR, {msg: '用户'})
        }
        
        dispatch(types.SUB_LOADING)
      } catch(e) { // Error
        dispatch(types.FETCHING_ERROR, {msg: '用户'})
        dispatch(types.SUB_LOADING)
      }
    },
    async getDistance({commit, dispatch}) {
      dispatch(types.ADD_LOADING)
      try {
        let res = await tripApi.getDistance()
        // Success
        if(res.code === 0) {
          commit(types.SET_DISTANCE, {distance: res.data.distance})
        } else { // Failed
          dispatch(types.FETCHING_ERROR, {msg: '里程'})
        }
        
        dispatch(types.SUB_LOADING)
      } catch(e) { // Error
        dispatch(types.FETCHING_ERROR, {msg: '里程'})
        dispatch(types.SUB_LOADING)
      }
    }
  }
}