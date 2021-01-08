const whiteRoutes=['/','/login']
export default ({ app, store, $axios }) => {
  app.router.beforeEach(async (to, form, next) => {
    if (store.state.token) {
      if (Object.keys(store.state.info).length === 1) {
        await store.dispatch('getUserInfo', $axios)
      }
      if (whiteRoutes.some(v=>v===to.path)) {
        next('/admin')
      }
    } else {
      if (process.client && whiteRoutes.every(v=>v!==to.path)) {
        next('/login')
      }
    }
    next()
  })
}
