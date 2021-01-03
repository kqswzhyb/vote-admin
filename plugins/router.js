export default ({ app, store, $axios }) => {
  app.router.beforeEach(async (to, form, next) => {
    if (process.client) {
      const token = store.state.token || window.localStorage.getItem('token')
      if (token) {
        if (!store.state.token) {
          store.commit('setToken', token)
        }
        if (Object.keys(store.state.info).length === 1) {
          await store.dispatch('getUserInfo', $axios)
          // store.dispatch('common/getDic');
          next({ ...to, replace: true })
        }
        if (to.path === '/') {
          next('/admin')
        }
      } else {
        if (to.path !== '/') {
          next('/')
        }
      }
    }
    next()
  })
}
