import { Message } from 'element-ui'
import Vue from 'vue'

export default function ({ $axios, redirect, store, app }) {
  const baseURL='http://localhost:7001/api'
  const imgUrl = 'https://kurumi-1258026269.cos.ap-shanghai.myqcloud.com/'
  Vue.prototype.$baseURL= baseURL
  Vue.prototype.imgUrl= imgUrl
  $axios.defaults.baseURL = baseURL

  $axios.interceptors.request.use(
    (config) => {
      const token = app.$cookies.get('token')
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`
      }
      //在请求发出之前进行一些操作
      return config
    },
    (err) => {
      //Do something with request error
      return Promise.reject(err)
    }
  )
  //添加一个响应拦截器
  $axios.interceptors.response.use(
    (res) => {
      if (res.data.code === '1') {
        Message.error(res.data.message)
        return Promise.reject(res.data)
      }
      //在这里对返回的数据进行处理
      return res
    },
    (err) => {
      //Do something with response error
      if (err.response && err.response.status && err.response.status === 401) {
        app.$cookies.remove('token')
        store.commit('setToken', '')
        Message.error('登录状态已过期失效')
        redirect('/login')
      }
      return Promise.reject(err)
    }
  )
}
