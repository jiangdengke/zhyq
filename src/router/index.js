import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'
import asyncRoutes from '@/router/asyncRoutes'

export const routes = [
  // 添加角色
  {
    path: '/sys/addRole',
    component: () => import('@/views/System/Role/AddRole.vue')
  },
  {
    path: '/enterpriseAdd',
    component: () => import('@/views/Park/Enterprise/add')
  },
  {
    path: '/car/cardAdd',
    component: () => import('@/views/Car/CarCard/add')
  },
  {
    path: '/login',
    component: () => import('@/views/Login/index'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/workbench'
  },
  {
    path: '/workbench',
    component: Layout,
    children: [{
      path: '',
      component: () => import('@/views/Workbench/index'),
      meta: { title: '工作台', icon: 'el-icon-data-board' }
    }]
  },
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  }
]

// 创建路由实例
const createRouter = () => new Router({
  // mode: 'history', // require service support
  mode: 'history',
  scrollBehavior: () => ({ y: 0 }),
  // routes: [...routes, ...asyncRoutes]
  routes: [...routes]

})

const router = createRouter()

// 重置路由方法
export function resetRouter() {
  // 得到一个全新的router实例对象
  const newRouter = createRouter()
  // 使用新的路由记录覆盖掉老的路由记录
  router.matcher = newRouter.matcher
}

export default router
