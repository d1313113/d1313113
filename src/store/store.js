import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
const state = {
  username: '123456'
}
const mutations = {
  setUser: (state, u) => {
    state.username = u
  }
}
const actions = {}
const getters = {}

export default new Vuex.Store({
  state,
  getters,
  mutations,
  actions
})
