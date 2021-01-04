import createLogger from '@/plugins/logger'
import { Message } from 'element-ui'

const state = () => ({
  token: '',
  menu: 'show',
  info: {
    nickname: '',
  },
})

const getters = {
  token: (state) => state.token,
  menu: (state) => state.menu,
  info: (state) => state.info,
}

const mutations = {
  setToken(state, data) {
    state.token = data
  },
  setMenu(state, data) {
    state.menu = data
  },
  setInfo(state, data) {
    state.info = data
  },
}

const actions = {
  nuxtServerInit({ commit }, { req, res, app }) {
    const token = app.$cookies.get('token')
    if (token) {
      commit('setToken', token)
    }
  },
  getUserInfo({ commit, state }, axios) {
    return new Promise((resolve) => {
      axios.get('/user/info').then((res) => {
        if (res.data.code === '0') {
          commit('setInfo', res.data.data)
          resolve(res.data.data)
        } else {
          Message.error(res.data.message)
          commit('setToken', '')
        }
      })
    })
  },
}

let plugins =
  process.env.NODE_ENV !== 'production' && process.client
    ? [createLogger()]
    : []
export { state, getters, mutations, actions, plugins }
