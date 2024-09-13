// 放置全局自定义指令
import Vue from 'vue'
import store from '@/store'
Vue.directive('permission', {
  // el: 使用自定义指令的DOM元素
  // binding: 对象，包含自定义指令的信息。binding.value可以接收到外部传过来的值
  inserted(el, binding, vnode) {
    const perms = store.state.menu.permissions
    console.log('perms' + perms)
    // 拿到标签中的权限标识，判断在没在vuex中存储的permissions中，如果在，就显示，如果不在，就隐藏
    if (!perms.includes(binding.value)) {
      // el.style.display = 'none'
      // 通过把dom元素移除来实现隐藏
      el.remove()
    }
    console.log(el)
    console.log(binding)
  }
}
)
