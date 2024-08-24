import Vue from 'vue'
import 'normalize.css/normalize.css'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import '@/styles/index.scss' // global css

import App from './App'

import store from './store'

import router from './router'
// 导入permission.js
// import除了可以导入模块，还可以执行js文件
import './permission'

// 注册svg
import '@/icons'
// 把element-ui中导出的所有组件 注册成全局组件
Vue.use(ElementUI)

// 关闭生产环境提示 即控制台提示
Vue.config.productionTip = false

// vue实例化
// 注入router和store实例，方便在项目中使用 this.$router和this.$store
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
