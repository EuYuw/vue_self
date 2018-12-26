/**
 * user store
 */

import {userAPI} from "@/api/api";

const user = {
  namespaced: true,
  //创建基本状态
  state: {
    current: null,
    accessArr: []
  },
  //创建改变state的方法 同步
  mutations: {
    saveLogin(state, data) {
      state.current = JSON.stringify(data);
    },
    saveAccess(state, data){
      state.accessArr = data;
    },
    clearLogin(state) {
      state.current = null;
      state.accessArr = [];
    }
  },
  //创建驱动mutactions执行的actions 可异步
  actions: {
    getLoginUser({commit}){
      return new Promise((resolve, reject) => {
        userAPI.loginUser().then(res => {
          res && commit('saveLogin', res);
          resolve(res);
        }).catch(error => {
          reject(error);
        });
      });
    },
    getAccess({commit}) {
      return new Promise((resolve, reject) => {
        userAPI.getListFun().then(res => {
          commit('saveAccess', res);
          resolve(res);
        }).catch(error => {
          reject(error);
        });
      });
    },
    logout({commit}){
      return new Promise((resolve, reject) => {
        userAPI.logout().then(() => {
          commit('clearLogin');
          resolve();
        }).catch(error => {
          reject(error);
        });
      });
    }
  }
}

export default user


