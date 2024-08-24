<template>
  <div class="app-wrapper">
    <!-- 侧边栏 -->
    <sidebar class="sidebar-container" />
    <div class="main-container">
      <!-- 导航栏 -->
      <navbar />
      <!-- 中间主体 -->
      <app-main />
    </div>
  </div>
</template>

<script>
import { Navbar, Sidebar, AppMain } from './components'

export default {
  name: 'Layout',
  components: {
    Navbar,
    Sidebar,
    AppMain
  }
}
</script>

<style lang="scss" scoped>
  @import "~@/styles/mixin.scss";
  .app-wrapper {
    @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;
    display: flex;
    overflow: hidden;
    .main-container{
      background-color: #f4f6f8;
      flex:1;
      min-width: 820px;
    }
    .sidebar-container{
      width: 260px;
      min-width: 260px;
    }
  }

</style>
