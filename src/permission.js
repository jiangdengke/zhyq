import router from '@/router'
import store from '@/store'
import asyncRoutes from '@/router/asyncRoutes'
// 获取一级权限标识
function getFirstRouterPermission(permission) {
  const firstPermArr = permission.map(item => {
    return item.split(':')[0]
  })
  // console.log('一级权限标识', firstPermArr)
  // // 去重
  // console.log('去重', Array.from(new Set(firstPermArr)))
  return Array.from(new Set(firstPermArr))
}
// 获取二级权限标识
function getSecondRouterPermission(permission) {
  const secondPermArr = permission.map(item => {
    const arr = item.split(':')
    return `${arr[0]}:${arr[1]}`
  })
  // console.log('二级权限标识', secondPermArr)
  return Array.from(new Set(secondPermArr))
}
// 根据一级二级权限标识，筛选出对应的路由
function getRoutes(firstRouterPermission, secondRouterPermission, asyncRoutes) {
  // 判断当前登录人是不是管理员，如果是管理员，就不用筛选了
  if (firstRouterPermission.includes('*')) {
    return asyncRoutes
  }
  const firstRoutes = asyncRoutes.filter(item => firstRouterPermission.includes(item.permission))
  // console.log('一级路由', firstRoutes)
  const secondRoutes = firstRoutes.map(item => {
    return {
      ...item,
      children: item.children.filter(child => secondRouterPermission.includes(child.permission))
    }
  })
  // console.log('二级路由', secondRoutes)
  return secondRoutes
}
router.beforeEach(async(to, from, next) => {
  // to跳转的路由
  // from从哪个路由跳转
  // next()放行 重定向next(路径)
  const token = store.state.user.token
  if (token) { // 如果有token
    if (to.path === '/login') {
      next('/')
    } else {
      next()
      //  1.拿到用户的权限信息
      const permission = await store.dispatch('menu/getUserPermission')
      // console.log(permission)
      // 2.根据权限标识，筛选出对应的一级路由的标识
      const firstRouterPermission = getFirstRouterPermission(permission)
      // console.log('一级权限标识', firstRouterPermission)
      // 3.根据权限标识，筛选出对应的二级路由的标识
      const secondRouterPermission = getSecondRouterPermission(permission)
      // console.log('二级权限标识', secondRouterPermission)
      // 4.根据权限标识，动态添加路由
      // console.log(asyncRoutes)
      const routes = getRoutes(firstRouterPermission, secondRouterPermission, asyncRoutes)
      // console.log('动态路由', routes)
      // 5.将动态路由添加到路由表,展示到左侧
      // 5.1先把筛选之后的路由添加到路由对象中（跳转）
      routes.forEach(item => {
        router.addRoute(item)
      })
      // 5.2将筛选之后的路由添加到vuex中（渲染）
      store.commit('menu/setMenuList', routes)
    }
  } else { // 如果没有token
    if (to.path === '/login' || to.path === '/404') {
      next()
    } else {
      next('/login')
    }
  }
})
