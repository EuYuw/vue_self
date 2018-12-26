const getters = {
  userCurrent: state => state.user.current,
  accessArr: state => state.user.accessArr,
  willAddRouter: state => state.permission.willAddRouter,
  permissionRouters: state => state.permission.routers,
};
export default getters
