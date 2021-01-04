export default ({ app, store, $axios }) => {
  app.router.beforeEach(async (to, form, next) => {
    if (store.state.token) {
      if (Object.keys(store.state.info).length === 1) {
        await store.dispatch('getUserInfo', $axios)
      }
      if (to.path === '/') {
        next('/admin')
      }
    } else {
      if (to.path !== '/') {
        next('/')
      }
    }
    next()
  })
}
