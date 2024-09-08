<template>
  <div class="role-container">
    <div class="left-wrapper">
      <div v-for="(item,index) in roleList" :key="item.roleId" class="role-item" :class="{active: activeIndex===index}" @click="menuChange(index)">
        <div class="role-info">
          <svg-icon :icon-class="activeIndex===index?'user-active':'user'" class="icon" />
          {{ item.roleName }}
        </div>
        <div class="more">
          <el-dropdown>
            <span class="el-dropdown-link">
              <svg-icon icon-class="more" />
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="toEdit(item.roleId)">编辑角色</el-dropdown-item>
              <el-dropdown-item @click.native="delRole(item.roleId)">删除</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
      <el-button class="addBtn" size="mini" @click="$router.push('/sys/addRole')">
        添加角色
      </el-button>
    </div>
    <div class="right-wrapper">
      <el-tabs v-model="activeName">
        <el-tab-pane label="功能权限" name="tree">
          <div class="tree-wrapper">
            <div v-for="item in treeList" :key="item.id" class="tree-item">
              <div class="tree-title"> {{ item.title }} </div>
              <el-tree
                ref="tree"
                :data="item.children"
                :props="defaultProps"
                :default-expand-all="true"
                show-checkbox
                node-key="id"
              /> <!--默认展开所有节点-->
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane :label="`成员列表(${total})`" name="member">
          <div class="user-wrapper">
            <el-table
              :data="userList"
              style="width: 100%"
            >
              <el-table-column
                type="index"
                width="250"
                label="序号"
              />
              <el-table-column
                prop="name"
                label="员工姓名"
              />
              <el-table-column
                prop="userName"
                label="登录账号"
              />
            </el-table>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import { getRoleListAPI } from '@/api/role'
import { delRoleUserAPI, getRoleDetailAPI, getRoleUserAPI, getTreeListAPI } from '@/api/system'
export default {
  name: 'Role',
  data() {
    return {
      activeName: 'tree',
      roleList: [],
      // 存储当前点击的是哪个菜单
      activeIndex: 0,
      // 存储权限列表
      treeList: [],
      defaultProps: {
        children: 'children',
        label: 'title'
      },
      params: {
        page: 1,
        pageSize: 10
      },
      total: 0,
      userList: []
    }
  },
  // 对内同步，对外异步。
  async mounted() {
    await this.getRoleList()
    await this.getTreeList()
    this.menuChange(0)
  },

  methods: {
    delRole(roleId) {
      this.$confirm('是否确认删除当前角色?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        await delRoleUserAPI(roleId)
        await this.getRoleList()
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      })
    },
    toEdit(id) {
      this.$router.push(`/sys/addRole?id=${id}`)
    },
    // 获取所有的权限列表
    async getTreeList() {
      const res = await getTreeListAPI()
      this.treeList = res.data
      this.addDisabledProp(this.treeList)
    },
    addDisabledProp(treeList) {
      treeList.forEach(item => {
        item.disabled = true
        if (item.children) {
          this.addDisabledProp(item.children)
        }
      })
    },
    async getRoleDetail(roleId) {
      const res = await getRoleDetailAPI(roleId)
      const perms = res.data.perms
      const treeComponentList = this.$refs.tree
      treeComponentList.forEach((tree, index) => {
        tree.setCheckedKeys(perms[index])
      })
    },
    menuChange(index) {
      this.activeIndex = index
      // 获取角色id
      const roleId = this.roleList[index].roleId
      // 获取角色对应的权限列表
      this.getRoleDetail(roleId)
      // 获取角色对应的用户列表
      this.getRoleUserList(roleId)
    },
    async getRoleUserList(roleId) {
      const res = await getRoleUserAPI(roleId)
      this.total = res.data.total
      this.userList = res.data.rows
      console.log(res)
    },
    async  getRoleList() {
      const res = await getRoleListAPI()
      this.roleList = res.data
    }
  }
}
</script>

<style scoped lang="scss">
.role-container {
  display: flex;
  font-size: 14px;
  background-color: #fff;
  padding:20px;
  .left-wrapper {
    width: 200px;
    border-right: 1px solid #e4e7ec;
    padding: 4px;
    text-align: center;

    .role-item {
      position: relative;
      height: 56px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 20px;
      cursor: pointer;

      &.active {
        background: #edf5ff;
        color: #4770ff;
      }
    }

    .role-info {
      display: flex;
      align-items: center;

      .icon {
        margin-right: 10px;
      }
    }

    .more {
      display: flex;
      align-items: center;
    }
    .addBtn{
      width: 100%;
      margin-top: 20px;
    }
  }

  .right-wrapper {
    flex: 1;

    .tree-wrapper {
      display: flex;
      justify-content: space-between;

      .tree-item {
        flex: 1;
        border-right: 1px solid #e4e7ec;
        padding: 0px 4px;
        text-align: center;
        .tree-title {
          background: #f5f7fa;
          text-align: center;
          padding: 10px 0;
          margin-bottom: 12px;
        }
      }
    }

    ::v-deep .el-tabs__nav-wrap {
      padding-left: 20px;
    }

    .user-wrapper{
      padding:20px;
    }
  }
}
</style>
