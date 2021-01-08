export default function ({ store, redirect, route }) {
  if (
    process.client &&
    !store.state.allMenus.some((v) => v.path === route.path)
  ) {
    redirect('/404')
  }
}
