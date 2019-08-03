import * as types from '../mutation-types'
import * as tripApi from '../../api/trip'

export default {
  state: {
    distance: null,
  },
  getters: {
    distance: state => state.distance
  },

  mutations: {
    [types.SET_DISTANCE](state, { distance }) {
      state.distance = distance
    },
    [types.RESET_TRIP](state) {
      state.distance = null;
    },
  },
  actions: {
    async getDistance({ commit, dispatch }) {
      dispatch('addLoading')
      try {
        let res = await tripApi.getDistance()
        // Success
        if (res.code === 0) {
          commit(types.SET_DISTANCE, { distance: res.data.distance })
          dispatch('subLoading')
          return true
        } else { // Failed
          dispatch('fetchingError', { msg: '里程' })
          dispatch('subLoading')
          return false
        }

      } catch (e) { // Error
        dispatch('fetchingError', { msg: '里程' })
        dispatch('subLoading')
        return false
      }
    },
    async refreshDistance({ commit, dispatch }) {
      try {
        let res = await tripApi.getDistance()
        // Success
        if (res.code === 0) {
          commit(types.SET_DISTANCE, { distance: res.data.distance })
          return true
        } else { // Failed
          dispatch('fetchingError', { msg: '里程' })
          return false
        }

      } catch (e) { // Error
        dispatch('fetchingError', { msg: '里程' })
        return false
      }
    }
  }
}