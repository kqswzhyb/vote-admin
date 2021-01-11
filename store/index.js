import createLogger from '@/plugins/logger'
import { Message } from 'element-ui'
import { handleMenu, generateGetters, generateMutations } from '@/utils/util'

const state = ()=>({
  token: '',
  menu: 'show',
  info: {
    nickname: '',
  },
  menus: [],
  permissions: [],
  allMenus: [],
  dicList:{}
})

const getters = {
  ...generateGetters(state()),
}

const mutations = {
  ...generateMutations(state()),
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
          const data = res.data.data.role.roleMenu
            .filter((v) => v.menu && v.menu.id !== '1')
            .map((v) => v.menu)
          const permissions = data.filter((v) => v.type === '1')
          const menus = data.filter((v) => v.parentId === '1')
          commit('setPermissions', permissions)
          commit('setMenus', handleMenu(menus, data))
          commit('setAllMenus', data)
          delete res.data.data.role.roleMenu
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
