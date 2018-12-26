import Vue from 'vue'
import Router from 'vue-router'
const homeVue = () => import('../view/home')
const homeWel = () => import('../view/homeWel')
const loginVue = () => import('../view/login')
const cluster = () => import('../view/cluster/clusterIndex')
const node = () => import('../view/node/nodeIndex')
const disk = () => import('../view/disk/diskIndex')
const deviceChunk = () => import('../view/deviceChunk/deviceChunkIndex')
const host = () => import('../view/host/hostIndex')
const page404 = () => import('../view/error/page404')

Vue.use(Router);

export const constRouterMap = [
  {
    path: '/login',
    name: 'login',
    component: loginVue
  },
  {
    path: '/',
    redirect: 'login',
  },
  {
    path: '/page404',
    component: page404
  },
  {
    path: '/home',
    component: homeVue,
    meta: {
      auth: true
    },
    children: [
      {
        path: '',
        component: homeWel,
        meta: {
          auth: true
        }
      }
    ]
  }
];

export default new Router({
  routes: constRouterMap,
  scrollBehavior: () => ({ y: 0 })
});

export const asyncRouterMap = [
  {
    path: '/dataStorage',
    name: '数据存储',
    code: 'dataStorage',
    component: homeVue,
    icon: 'iconfont icon-liebiao',
    show: true,
    children: [
      {
        path: 'cluster',
        name: '集群管理',
        code: 'cluster',
        component: cluster,
        icon: 'iconfont icon-zuzhiqunzu',
        show: true,
        meta: {
          auth: true
        }
      },
      {
        path: 'node',
        name: '节点管理',
        code: 'node',
        component: node,
        icon: 'iconfont icon-jiedianguanli',
        show: true,
        meta: {
          auth: true
        }
      },
      {
        path: 'disk',
        name: '磁盘管理',
        code: 'disk',
        component: disk,
        icon: 'iconfont icon-icon_baocun',
        show: true,
        meta: {
          auth: true
        }
      },
      {
        path: 'deviceChunk',
        name: '设备块管理',
        code: 'deviceChunk',
        component: deviceChunk,
        icon: 'iconfont icon-yingjian',
        show: true,
        meta: {
          auth: true
        }
      },
      {
        path: 'host',
        name: '主机管理',
        code: 'host',
        component: host,
        icon: 'iconfont icon-shebeizhuangtai',
        show: true,
        meta: {
          auth: true
        }
      }
    ]
  }
];



