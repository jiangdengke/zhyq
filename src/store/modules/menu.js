import { getProfileAPI } from '@/api/user'
import { resetRouter, routes } from '@/router/index'

export default {
  namespaced: true,
  state: {
    permissions: [], // 权限标识
    menuList: []// 路由规则
  },
  mutations: {
    setPermission(state, permissions) {
      state.permissions = permissions
    },
    // 修改路由规则
    setMenuList(state, asyncRoutes) {
      state.menuList = [...routes, ...asyncRoutes]
    },
    // 清空路由规则
    clearMenuList(state) {
      state.menuList = []
      resetRouter()
    }
  },
  actions: {
    async getUserPermission(store) {
      const res = await getProfileAPI()
      store.commit('setPermission', res.data.permissions)
      return res.data.permissions
    }
  },
  getters: {}
}
