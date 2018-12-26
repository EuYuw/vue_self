/**
 *  axios
 * Created by wy on 2018/11/12 0012.
 */
import axios from 'axios';
//import qs from 'qs';
import router from '../router/router'
import {Message} from 'element-ui';

axios.defaults.timeout = 10000; //超时终止请求
axios.defaults.baseURL = ''; //配置请求地址
//axios.defaults.withCredentials = true;

if (process.env.NODE_ENV === 'development') {
  axios.defaults.baseURL = '';
} else if (process.env.NODE_ENV === 'production') {
  axios.defaults.baseURL = '';
}

//http request 拦截器
axios.interceptors.request.use(
  config => {
    return config;
  },
  error => {
    Message({
      message: error.message,
      type: 'error'
    });
    return Promise.reject(error);
  });

//http response 拦截器
axios.interceptors.response.use(
  response => {
    if (response.status === 200) {
      return response.data;
    } else {
      throw '' + response.statusText;
    }
  },
  error => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          Message({
            message: '身份过期或未登录',
            type: 'error'
          });
          router.push({path: '/login'});
          break;
        case 400:
          Message({
            message: '请求参数错误',
            type: 'error'
          });
          break;
        case 403:
          Message({
            message: '拒绝访问',
            type: 'warning'
          });
          break;
        case 404:
          Message({
            message: '请求资源路径错误',
            type: 'error'
          });
          break;
        case 504:
          Message({
            message: '连接服务超时或服务未启动',
            type: 'error'
          });
          break;
        default:
          break;
      }
    }
    if (error.code === "ECONNABORTED") {
      Message({
        message: '请求超时',
        type: 'error'
      });
    }
    return Promise.reject(error);
  });

/**
 * 封装get方法
 * @param url
 * @param data
 * @returns {Promise}
 */

export function get(url, params = {}) {
  return new Promise((resolve, reject) => {
    axios.get(url, {
      params: params
    }).then(response => {
      resolve(response);
    }).catch(err => {
      reject(err);
    })
  })
}

/**
 * 封装post请求
 * @param url
 * @param data
 * @returns {Promise}
 */

export function post(url, data = {}) {
  return new Promise((resolve, reject) => {
    axios.post(url, data)
      .then(response => {
        resolve(response);
      })
      .catch(err => {
        reject(err);
      })
  })
}

/**
 * 封装patch请求
 * @param url
 * @param data
 * @returns {Promise}
 */

export function patch(url, data = {}) {
  return new Promise((resolve, reject) => {
    axios.patch(url, data)
      .then(response => {
        resolve(response);
      })
      .catch(err => {
        reject(err);
      })
  })
}

/**
 * 封装put请求
 * @param url
 * @param data
 * @returns {Promise}
 */

export function put(url, data = {}) {
  return new Promise((resolve, reject) => {
    axios.put(url, data)
      .then(response => {
        resolve(response);
      }).catch(err => {
      reject(err);
    });
  })
}
