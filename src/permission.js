import router from '@/router'
import store from '@/store'
router.beforeEach((to, from, next) => {
  // to跳转的路由
  // from从哪个路由跳转
  // next()放行 重定向next(路径)
  const token = store.state.user.token
  if (token) { // 如果有token
    if (to.path === '/login') {
      next('/')
    } else {
      next()
    }
  } else { // 如果没有token
    if (to.path === '/login' || to.path === '/404') {
      next()
    } else {
      next('/login')
    }
  }
})
