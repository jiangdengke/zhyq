<template>
  <div class="login_body">
    <div class="bg" />
    <div class="box">
      <div class="title">智慧园区-登录</div>
      <!-- 表单校验四要素 -->
      <!-- 1.el-form :model 对应的值是表单对应的数据对象 -->
      <!-- 2.el-form :rules 对应校验规则 -->
      <!-- 3.el-form-item prop 表示要校验哪个字段 -->
      <!-- 4.表单元素（el-input，el-checkbox） v-model-->
      <el-form ref="form" :model="loginForm" :rules="rules">
        <el-form-item
          label="账号"
          prop="username"
        >
          <el-input v-model="loginForm.username" />
        </el-form-item>

        <el-form-item
          label="密码"
          prop="password"
        >
          <!--          show-password 表示密码框右侧有一个显示密码的按钮-->
          <el-input v-model="loginForm.password" show-password />
        </el-form-item>

        <el-form-item prop="remember">
          <el-checkbox v-model="remeberMe">记住我</el-checkbox>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" class="login_btn" @click="handleLogin">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { FORM_KEY } from '@/constants/KEY'
export default {
  name: 'Login',
  data() {
    return {
      loginForm: {
        username: '',
        password: ''
      },
      remeberMe: false,
      rules: {
        username: [
          // trigger: 'blur' 表示失去焦点时触发校验， 'change' 表示值改变时触发校验
          { required: true, message: '用户名不可为空', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '密码不可为空', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    // 从localStorage中获取数据
    const from_key = localStorage.getItem(FORM_KEY)
    if (from_key) {
      const { username, password } = JSON.parse(from_key)
      this.loginForm.username = username
      this.loginForm.password = password
      this.remeberMe = true
    }
  },
  methods: {
    handleLogin() {
      this.$refs.form.validate(async(valid) => {
        if (valid) {
          // 下面一行是异步操作,需要加上await保证异步操作执行完毕，再执行后面的跳转
          await this.$store.dispatch('user/loginAction', this.loginForm)
          if (this.remeberMe) {
            localStorage.setItem(FORM_KEY, JSON.stringify(this.loginForm))
          } else {
            localStorage.removeItem(FORM_KEY)
          }
          // 实现哪个页面退出的，登录成功后就跳转到哪个页面
          /**
           * route和router的区别
           * route是当前路由对象，包含了当前路由的一些信息，例如：name、path、meta、params、query等
           * router是VueRouter的实例对象，包含了路由的一些方法，例如：push、replace、go等
           */
          if (this.$route.query.redirect) {
            console.log(this.$route.query.redirect)
            await this.$router.push(this.$route.query.redirect)
          } else {
            await this.$router.push('/')
          }
        } else {
          this.$message.error('用户名或密码不可为空')
          console.log('error submit!!')
        }
      })
    }
  }
}

</script>

<style scoped lang="scss">
  .login_body {
    display: flex;
  }
  .bg {
    width: 60vw;
    height: 100vh;
    background: url('~@/assets/login-bg.svg') no-repeat;
    background-position: right top;
    background-size: cover;
  }
  .box {
    margin: 200px 10% 0;
    flex: 1;
    .title {
      padding-bottom: 76px;
      font-size: 26px;
      font-weight: 500;
      color: #1e2023;
    }
    ::v-deep() {
      .ant-form-item {
        display: flex;
        margin-bottom: 62px;
        flex-direction: column;
      }
      .ant-form-item-label label {
        font-size: 16px;
        color: #8b929d;
      }
      .ant-input,
      .ant-input-password {
        border-radius: 8px;
      }
    }
  }
  .login_btn{
    width: 100%;
  }
</style>
