import { Message } from 'element-ui'

export default function ({ $axios, redirect }) {
  $axios.defaults.baseURL = 'http://localhost:7001/api';

  $axios.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token')
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
      if (err?.response?.status === 401) {
        localStorage.removeItem('token')
        Message.error('登录状态已过期失效')
        redirect('/')
      }
      return Promise.reject(err)
    }
  )
}
