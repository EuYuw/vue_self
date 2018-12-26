/**
 *   axios request API
 */

import {get, post} from './http';

/**  user part **/
export const userAPI = {
  login: param => {
    return post('/api/user/login', param);
  },
  loginUser: () => {
    return get('/api/user/loginUser');
  },
  getListFun: () =>{
    return get('/api/user/listFunctions');
  },
  logout: () => {
    return get('/api/user/logout');
  }
};
/**  user part **/

/**  cephNode part **/
export const cephNodeAPI = {
  add: param => {
    return post('/api/cephNode/add', param);
  },
  search: param => {
    return get('/api/cephNode/search', param);
  },
  del: param => {
    return post('/api/cephNode/delete/' + param.id);
  }
};
/**  cephNode part **/

/**  cephDisk part **/
export const cephDiskAPI = {
  add: param => {
    return post('/api/cephDisk/add', param);
  },
  search: param => {
    return get('/api/cephDisk/search', param);
  },
  del: param => {
    return post('/api/cephDisk/delete/' + param.id);
  }
};
/**  cephDisk part **/

/**  blockDevice part **/
export const blockDeviceAPI = {
  add: param => {
    return post('/api/blockDevice/add', param);
  },
  del: param => {
    return post('/api/blockDevice/delete/' + param.id);
  },
  mount: param => {
    return post('/api/blockDevice/mount', param);
  },
  search: param => {
    return get('/api/blockDevice/search', param);
  },
  umount: param => {
    return post('/api/blockDevice/umount', param);
  },
  updateSize: param => {
    return post('/api/blockDevice/updateSize', param);
  }
}
/**  blockDevice part **/

/**  cephHost part **/
export const cephHostAPI = {
  add: param => {
    return post('/api/cephClient/add', param);
  },
  search: param => {
    return get('/api/cephClient/search', param);
  },
  del: param =>{
    return post('/api/cephClient/delete/' + param.id);
  }
}
/**  cephHost part **/

/**  cephCluster part **/
export const cephClusterAPI = {
  verifyNode: param => {
    return post('/api/cephCluster/verifyNode', param)
  }
}
/**  cephCluster part **/
