/**
 *  permission store
 */
import {constRouterMap, asyncRouterMap} from '@/router/router'

const permission = {
  namespaced: true,
  state: {
    routers: constRouterMap,
    willAddRouter: []
  },
  mutations: {
    createRouter(state, routerArr) {
      state.willAddRouter = routerArr;
      state.routers = constRouterMap.concat(routerArr);
    },
    resetRouter(state) {
      state.routers = constRouterMap;
      state.willAddRouter = [];
    }
  },
  actions: {
    createNewRouter({commit}, data) {
      return new Promise(resolve => {
        let listFun = ['dataStorage' ,'node', 'disk', 'host', 'cluster', 'deviceChunk'];//测试数据，正式赋值为data
        const newRouter = asyncRouterMap.filter(v =>{
          if(listFun.indexOf(v.code) === -1){
            return false;
          }else{
            if(v.children && v.children.length > 0){
              v.children = v.children.filter(child => {
                if(listFun.indexOf(child.code) === -1){
                  return false;
                }else{
                  return child;
                }
              });
            }
            return v;
          }
        });
        commit('createRouter', newRouter);
        resolve();
      })
    }
  }
};
export default permission
