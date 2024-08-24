import { setToken, getToken, removeToken } from '@/utils/auth'
import { loginAPI } from '@/api/user'
export default {
  namespaced: true, // 开启命名空间
  state: {
    // 先从cookie中拿token，拿不到的时候才设置为空
    token: getToken() || ''
  },
  mutations: {
    // 这里不是递归，原因是mutitations中的方法只能通过store.commit()这种方法调用
    setToken(state, newToken) {
      state.token = newToken
      setToken(newToken)
    },
    removeToken(state) {
      // 1.清空vuex中的token
      state.token = ''
      // 2.清空cookie中的token
      removeToken()
    }
  },
  actions: {
    async loginAction(store, data) {
      const res = await loginAPI(data)
      store.commit('setToken', res.data.token)
    }
  }
}

// 使用语法：如何在组件中使用子模块的各个数据和方法
// 1.使用state中的数据
// 使用场景：如果组件中只有一处需要使用state中的数据，可以使用$store直接方法
// 如果组件中有多处需要使用state中的数据，使用辅助函数
// this.$store.state.user.xxx
/**
 *  import { mapState } from 'vuex'
 *  computed: {
 *    ...mapState('user', ['xxx'])
 *   }
 */

// 2.使用getters中的数据
// this.$store.getters['模块名/getters方法名']
/**
 * import { mapGetters } from 'vuex'
 * computed: {
 * ...mapGetters('模块名', ['getters方法名'])
}
 */

// 3.使用mutations中的方法
// this.$store.commit('模块名/mutations方法名', 参数)参数只能传一个
/**
 * import { mapMutations } from 'vuex'
 * methods: {
 * ...mapMutations('模块名', ['mutations方法名'])
}
 */

// 4.使用actions中的方法
// this.$store.dispatch('模块名/actions方法名', 参数)参数只能传一个
/**
 * import { mapActions } from 'vuex'
 * methods: {
 * ...mapActions('模块名', ['actions方法名'])
}
 */
