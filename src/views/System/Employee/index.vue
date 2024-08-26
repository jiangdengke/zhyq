<template>
  <div class="employee-container">
    <!-- 搜索区域 -->
    <div class="search-container">
      <div class="search-label">员工姓名：</div>
      <el-input clearable placeholder="请输入内容" class="search-main" v-model="params.name" @clear="doSearch"/>
      <el-button type="primary" @click="doSearch">查询</el-button>
    </div>
    <div class="create-container">
      <el-dialog
        title="添加员工"
        :visible="dialogVisible"
        width="580px"
        @close="closeDialog"
      >
        <!-- 表单接口 -->
        <div class="form-container">
          <el-form ref="addForm" :model="addForm" :rules="addFormRules" label-width="80px">
            <el-form-item label="员工姓名" prop="name">
              <el-input v-model="addForm.name" />
            </el-form-item>
            <el-form-item label="登录账号" prop="userName">
              <el-input v-model="addForm.userName" />
            </el-form-item>
            <el-form-item label="联系方式" prop="phonenumber">
              <el-input v-model="addForm.phonenumber" />
            </el-form-item>

            <el-form-item label="分配角色" prop="roleId">
              <el-select
                v-model="addForm.roleId"
                placeholder="请选择角色"
                :loading="loading"
                @focus="handleFocus"
              >
                <el-option
                  v-for="item in roleList"
                  :key="item.roleId"
                  :label="item.roleName"
                  :value="item.roleId"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="员工状态" prop="status">
              <el-radio-group v-model="addForm.status">
                <el-radio :label="0">禁用</el-radio>
                <el-radio :label="1">启用</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-form>
        </div>
        <template #footer>
          <el-button size="mini" @click="cancelAdd">取 消</el-button>
          <el-button size="mini" type="primary" @click="confirmAdd">确 定</el-button>
        </template>
      </el-dialog>
      <el-button class="add-building-button" type="primary" @click="addEmployee">添加员工</el-button>
    </div>
    <!-- 表格区域 -->
    <div class="table">
      <el-table style="width: 100%" :data="employeeList">
        <el-table-column type="index" label="序号" :index="indexMethod" />
        <el-table-column label="员工姓名" width="180" prop="name" />
        <el-table-column label="登录账号" width="180" prop="userName" />
        <el-table-column label="联系方式" width="120" prop="phonenumber" />
        <el-table-column label="角色" width="120" prop="roleName" />
        <el-table-column label="状态" prop="status" :formatter="formatterStatus">
          <!--          <template #default="scope">-->
          <!--            {{ scope.row.status }}-->
          <!--          </template>-->
        </el-table-column>
        <el-table-column label="添加时间" prop="createTime" />
        <el-table-column label="操作" fixed="right" width="120">
          <template #default="scope">
            <el-button size="mini" type="text" @click="edit(scope.row)">编辑</el-button>
            <el-button size="mini" type="text" @click="delEmployee(scope.row.id)">删除</el-button>
<!--            <el-button size="mini" type="text">重置密码</el-button>-->
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="page-container">
      <el-pagination
        layout="total, prev, pager, next"
      />
    </div>
    <!--    分页-->
    <div>
      <div class="page-container">
        <el-pagination
          :current-page="params.page"
          :page-sizes="[5, 10, 15, 20]"
          :page-size="params.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { createEmployeeAPI, editEmployeeAPI, getEmployeeListAPI } from '@/api/employee'
import { delEmployeeAPI, getRoleListAPI } from '@/api/system'
export default {
  name: 'Employee',
  data() {
    return {
      loading: false, // 用于控制loading状态
      employeeList: [],
      roleList: [],
      params: {
        page: 1,
        pageSize: 10,
        name: '' // 员工姓名
      },
      addForm: {
        name: '',
        phonenumber: '',
        roleId: '',
        status: 1,
        userName: ''
      },
      addFormRules: {
        name: [
          { required: true, message: '请输入员工姓名', trigger: 'blur' }
        ],
        userName: [
          { required: true, message: '请输入登录账号', trigger: 'blur' }
        ],
        phonenumber: [
          { required: true, message: '请输入联系方式', trigger: 'blur' }
        ],
        roleId: [
          { required: true, message: '请分配角色', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '请选择员工状态', trigger: 'blur' }
        ]
      },
      total: 0,
      dialogVisible: false // 控制弹框显示隐藏

    }
  },
  mounted() {
    this.getEmployeeList()
  },
  methods: {
    doSearch() {
      // 1. 重置page为1
      this.params.page = 1
      // 2. 调用获取列表接口
      this.getEmployeeList()
    },
    async edit(row) {
      // 1. 打开弹框
      this.dialogVisible = true
      // 2. 解构必要字段
      const { id, roleId, name, userName, phonenumber, roleName, status } = row
      this.addForm = {
        id, name, userName, phonenumber, roleId, roleName, status
      }
    },
    // 格式化状态
    formatterStatus(row, column, cellValue, index) {
      return cellValue === 1 ? '启用' : '禁用'
    },
    delEmployee(id) {
      this.$confirm('删除员工后将不可登录，确认删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        await delEmployeeAPI(id)
        this.$message({
          type: 'success',
          message: '删除成功'
        })
        await this.getEmployeeList()
      })
    },
    cancelAdd() {
      this.dialogVisible = false
      this.addForm = {
        name: '',
        phonenumber: '',
        roleId: '',
        status: 1,
        userName: ''
      }
    },
    confirmAdd() {
      this.$refs.addForm.validate(async valid => {
        if (valid) {
          if (this.addForm.id) {
            console.log(111111111111111)
            await editEmployeeAPI(this.addForm)
          } else {
          // 1. 提交接口
            await createEmployeeAPI(this.addForm)
            // 清空表单
            this.addForm = {
              name: '',
              phonenumber: '',
              roleId: '',
              status: 1,
              userName: ''
            }
          }
          // 2. 获取列表
          await this.getEmployeeList()
          // 3. 关闭弹框
          this.dialogVisible = false
        }
      })
    },
    async handleFocus() {
      this.loading = true
      const res = await getRoleListAPI()
      console.log(res)
      this.roleList = res.data
      this.loading = false
    },
    addEmployee() {
      this.dialogVisible = true
    },
    closeDialog() {
      this.dialogVisible = false
    },
    async getEmployeeList() {
      const res = await getEmployeeListAPI(this.params)
      console.log(res)
      this.employeeList = res.data.rows
      this.total = res.data.total
    }, handleSizeChange(val) {
      this.params.pageSize = val
      this.getEmployeeList()
    },
    handleCurrentChange(val) {
      this.params.page = val
      this.getEmployeeList()
    },
    // 计算序号
    indexMethod(index) {
      return (this.params.page - 1) * this.params.pageSize + index + 1
    }
  }
}
</script>

<style lang="scss" scoped>
.employee-container {
  padding: 10px;
}

.search-container {
  display: flex;
  align-items: center;
  border-bottom: 1px solid rgb(237, 237, 237, .9);
;
  padding-bottom: 20px;

  .search-label {
    width: 100px;
  }

  .search-main {
    width: 220px;
    margin-right: 10px;
  }
}
.create-container{
  margin: 10px 0px;
}
.page-container{
  padding:4px 0px;
  text-align: right;
}
.form-container{
  padding:0px 80px;
}
</style>
