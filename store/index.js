import createLogger from '@/plugins/logger'
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
  getUserInfo({ commit, state }, axios) {
    return new Promise((resolve) => {
      axios.get('/user/info').then((res) => {
        if (res.data.code === '0') {
          commit('setInfo', res.data.data)
          resolve(res.data.data)
        } else {
          this.$message.error(res.data.message)
        }
      })
    })
  },
}

let plugins = process.env.NODE_ENV !== 'production' ? [createLogger()] : []
export { state, getters, mutations, actions, plugins }
