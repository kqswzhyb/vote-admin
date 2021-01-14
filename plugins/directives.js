import Vue from 'vue'
import moment from 'moment'//导入文件

export default function ({ store, app }) {
  Vue.prototype.$moment = moment;//赋值使用

  moment.locale('zh-cn');//需要汉化
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
