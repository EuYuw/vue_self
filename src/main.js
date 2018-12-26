// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import 'babel-polyfill'
import store from './store/store'
import router from './router/router'
import ElementUI from 'element-ui'
import {Message, Loading} from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import es6Promise from 'es6-promise';//ie promise兼容
/*import NProgress from 'nprogress'
import 'nprogress/nprogress.css'*/
import './style/common.css'
import './style/iconfont.css'

es6Promise.polyfill();
Vue.config.productionTip = false;
Vue.prototype.$message = Message;
Vue.prototype.$loading = Loading;
Vue.use(ElementUI);

router.beforeEach((to, from, next) => {
  /*NProgress.start();*/
  if(to.path === '/login'){
    next();
  }else{
    const userGet = store.getters.userCurrent;
    if(to.meta.auth || (JSON.parse(sessionStorage.getItem('routerAuth')).pathArr).indexOf(to.path) !== -1){//如果存在meta auth或者当前路由path等于sessionStorage routerAuth
      if(userGet){//是否存在current login user
        if (store.getters.accessArr.length === 0) {//是否获取过权限列表
          store.dispatch('user/getAccess').then(res => {
            store.dispatch('permission/createNewRouter', res).then(() => {
              router.addRoutes(store.getters.willAddRouter);
              next(to.path); // hack方法 确保addRoutes已完成
            });
          }).catch(err => {
            console.log(err);
          });
        } else {
          next();
        }
      }else{
        store.dispatch('user/getLoginUser').then(res => {//不存在current login user，则尝试去获取
          if(res){
            next(to.path);
          }else{
            next('/login');
          }
          /*NProgress.done();*/
        }).catch(err => {
          console.log(err);
        });
      }
    }else{
      next();
    }
  }
});

router.afterEach((to) => {
  if(to.meta.hasOwnProperty('auth')){//动态路由刷新后 meta字段信息丢失，用sessionStorage存储
    if(sessionStorage.getItem('routerAuth')){
      let newPathJson = JSON.parse(sessionStorage.getItem('routerAuth'));
      if(newPathJson.pathArr.indexOf(to.path) === -1){
        newPathJson.pathArr.push(to.path);
        sessionStorage.setItem('routerAuth', JSON.stringify(newPathJson))
      }
    }else{
      let pathArr = [to.path];
      let pathArrJson = {
        pathArr: pathArr
      };
      sessionStorage.setItem('routerAuth', JSON.stringify(pathArrJson));
    }
  }
  /*NProgress.done();*/
});

/* VUE APP START */
new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app');
