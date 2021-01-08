import Vue from 'vue'

export default function ({ store, app }) {
  //权限判断
  Vue.directive('permission', {
    inserted(el, binding, vnode) {

      if (
        !store.state.permissions.find((v) => v.permission === binding.value)
      ) {
        el.parentNode.removeChild(el)
      }
    },
  })
}
