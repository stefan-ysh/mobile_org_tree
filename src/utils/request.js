//src/utils/request.js
import axios from 'axios'
// import kit from 'http://kit-url/kit-contact.1.0.0.js'
// 创建 axios 实例
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_URL, // url = base url + request url
  timeout: 10000, // request timeout
})
// console.log(process.env);
//  请求拦截器
service.interceptors.request.use(
  (config) => {
    config.headers['Content-Type'] = 'application/json;charset=UTF-8'
    config.headers['Accept'] = 'application/json'
    // config.headers['Request-From'] = 'mobile'
    let token = sessionStorage.getItem('loginToken') || null
    if (token) {
      // 如果token不为null，否则传token给后台
      config.headers['Token'] = token
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  (response) => {
    const res = response.data
    //届时根据后端返回success或者code值判断
    if (res.success === true) {
      return res
    } else {
      return res
    }
  },
  (error) => {
    //响应错误
    return Promise.reject(error)
  }
)

export default service