<template>
  <div class="building-container">
    <!-- 搜索区域 -->
    <div class="search-container">
      <div class="search-label">企业名称：</div>
      <el-input v-model="params.name" clearable placeholder="请输入内容" class="search-main" @clear="doSearch" />
      <el-button type="primary" @click="doSearch">查询</el-button>
    </div>
    <div class="create-container">
      <el-button type="primary" @click="$router.push('/enterpriseAdd')">添加企业</el-button>
    </div>

    <!-- 表格区域 -->
    <div class="table">
      <el-table style="width: 100%" :data="exterpriseList" @expand-change="expandHandle" >
        <el-table-column type="expand">
          <template #default="{row}">
            <el-table :data="row.rentList">
              <el-table-column label="租赁楼宇" width="320" prop="buildingName" />
              <el-table-column label="租赁起始时间" prop="startTime" /><el-table-column label="合同状态">
              <template #default="scope">
                <el-tag :type="formatInfoType(scope.row.status)">
                  {{ formartStatus(scope.row.status) }}
                </el-tag>
              </template>
            </el-table-column>
              <el-table-column label="操作" width="180">
                <template #default="scope">
                  <el-button size="mini" type="text" :disabled="scope.row.status === 3" @click="outRent(scope.row.id)">退租</el-button>
                  <el-button size="mini" type="text" :disabled="scope.row.status !== 3" @click="delRent(scope.row.id)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-table-column>
        <el-table-column type="index" label="序号" :index="indexMethod" />
        <el-table-column label="企业名称" width="320" prop="name" />
        <el-table-column label="联系人" prop="contact" />
        <el-table-column
          label="联系电话"
          prop="contactNumber"
        />
        <el-table-column label="操作">
          <template #default="scope">
            <el-button size="mini" type="text" @click="addRent(scope.row.id)">添加合同</el-button>
            <el-button size="mini" type="text">查看</el-button>
            <el-button size="mini" type="text" @click="toEditPage(scope.row.id)">编辑</el-button>
            <el-button size="mini" type="text" @click="delEnterprise(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog
      title="添加合同"
      :visible="rentDialogVisible"
      width="580px"
      @close="closeDialog"
    >
      <!-- 表单区域 -->
      <div class="form-container">
        <el-form ref="addForm" :model="rentForm" :rules="rentRules" label-position="top">
          <el-form-item label="租赁楼宇" prop="buildingId">
            <el-select v-model="rentForm.buildingId" placeholder="请选择">
              <el-option
                v-for="item in buildList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="租赁起止日期" prop="rentTime">
            <el-date-picker
              v-model="rentForm.rentTime"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd"
            />
          </el-form-item>
          <el-form-item label="租赁合同" prop="contractId">
            <el-upload
              ref="upload"
              action="#"
              :http-request="uploadHandle"
              :before-upload="beforeUpload"
              :limit="1"
              :on-exceed="onExceed"
              :on-remove="onRemove"
            >
              <el-button size="small" type="primary" plain>上传合同文件</el-button>
              <div slot="tip" class="el-upload__tip">支持扩展名：.doc .docx .pdf, 文件大小不超过5M</div>
            </el-upload>
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <el-button size="mini" @click="closeDialog">取 消</el-button>
        <el-button size="mini" type="primary" @click="confirmAdd">确 定</el-button>
      </template>
    </el-dialog>

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
</template>
<script>
import {
  createRentAPI,
  delEnterpriseAPI, delRentAPI,
  getEnterpriseListAPI,
  getRentBuildListAPI,
  getRentListAPI, outRentAPI,
  uploadAPI
} from '@/api/enterprise'
export default {
  name: 'Building',
  data() {
    return {
      buildList: [],
      rentForm: {
        buildingId: null, // 楼宇id
        contractId: null, // 合同id
        contractUrl: '', // 合同Url
        enterpriseId: null, // 企业名称
        type: 0, // 合同类型
        rentTime: [] // 合同时间
      },
      rentRules: {
        buildingId: [
          { required: true, message: '请选择楼宇', trigger: 'change' }
        ],
        rentTime: [
          { required: true, message: '请选择租赁日期', trigger: 'change' }
        ],
        contractId: [
          { required: true, message: '请上传合同文件', trigger: 'change' }
        ]
      },
      rentDialogVisible: false,
      exterpriseList: [],
      params: {
        page: 1,
        pageSize: 5,
        name: '' // 增加字段name
      },
      total: 0,
      rentList: []
    }
  },
  mounted() {
    this.getExterpriseList()
  },
  methods: {
    // 删除合同
    delRent(id) {
      this.$confirm('确认删除此合同吗吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        // 1. 调用接口
        await delRentAPI(id)
        // 2. 重新拉取列表
        await this.getExterpriseList()
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消删除'
        })
      })
    },
    // 格式化tag类型
    formatInfoType(status) {
      const MAP = {
        0: 'warning',
        1: 'success',
        2: 'info',
        3: 'danger'
      }
      // return 格式化之后的中文显示
      return MAP[status]
    },
    formartStatus(type) {
      const TYPEMAP = {
        0: '待生效',
        1: '生效中',
        2: '已到期',
        3: '已退租'
      }
      return TYPEMAP[type]
    },
    outRent(rentId) {
      this.$confirm('确认退租吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        // 1. 调用接口
        await outRentAPI(rentId)
        // 2. 重新拉取列表
        this.getEnterpriseList()
        this.$message({
          type: 'success',
          message: '退租成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消退租'
        })
      })
    },
    // 3. 只有展开时获取数据并绑定
    async expandHandle(row, rows) {
      console.log('展开或关闭', row, rows)
      const isExpend = rows.find(item => item.id === row.id)
      if (isExpend) {
        const res = await getRentListAPI(row.id)
        console.log(res)
        // eslint-disable-next-line require-atomic-updates
        row.rentList = res.data
      }
    },
    onRemove() {
      this.rentForm.contractId = ''
      this.rentForm.contractUrl = ''
      this.$refs.addForm.validateField('contractId')
    },
    confirmAdd() {
      this.$refs.addForm.validate(async valid => {
        if (valid) {
          const { buildingId, contractId, contractUrl, enterpriseId, type } = this.rentForm
          console.log(this.rentForm.rentTime[0])
          await createRentAPI({
            buildingId, contractId, contractUrl, enterpriseId, type,
            startTime: this.rentForm.rentTime[0],
            endTime: this.rentForm.rentTime[1]
          })
          // 更新列表
          await this.getExterpriseList()
          // 关闭弹框
          this.closeDialog()
        }
      })
    },
    onExceed() {
      this.$message.warning('文件上传个数 超出限制')
    },
    // 上传前的校验
    beforeUpload(file) {
      const typeList = [
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/msword',
        'application/pdf']
      const fileType = typeList.includes(file.type)
      const isLt5M = file.size / 1024 / 1024 < 5
      if (fileType && isLt5M) {
        return true
      } else {
        this.$message.warning('上传文件不符合要求，请重新上传')
        return false
      }
    },
    // 上传合同
    async uploadHandle(fileData) {
      // 1. 处理FormData
      const { file } = fileData
      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', 'contract')
      // 2. 上传并赋值
      const res = await uploadAPI(formData)
      const { id, url } = res.data
      this.rentForm.contractId = id
      this.rentForm.contractUrl = url

      this.$refs.addForm.validateField('contractId')
    },
    // 添加合同
    async addRent(id) {
      this.rentDialogVisible = true
      this.rentForm.enterpriseId = id
      const res = await getRentBuildListAPI()
      this.buildList = res.data
    },
    // 关闭弹框
    closeDialog() {
      this.rentDialogVisible = false
      // 怎么去清空？
      // resetFields 只能清空绑定了prop的表单域
      // 清空 校验提示
      this.$refs.addForm.resetFields()
      // 清空表单中数据
      this.rentForm = {
        buildingId: null,
        startTime: '',
        endTime: '',
        contractUrl: '',
        contractId: null,
        type: 0,
        enterpriseId: null,
        rentTime: []
      }
      this.$refs.upload.clearFiles()
    },
    delEnterprise(id) {
      this.$confirm('确认删除该企业吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        const res = await delEnterpriseAPI(id)
        console.log(res)
        // if (this.list.length === 1 && this.params.page > 1) {
        //   this.params.page--
        // }
        await this.getExterpriseList()
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      })
    },
    toEditPage(id) {
      // console.log(id)
      this.$router.push({
        path: '/enterpriseAdd',
        query: {
          id
        }
      })
    },
    // 准备查询后调方法
    doSearch() {
      this.params.page = 1
      this.getExterpriseList()
    },
    // 计算序号
    indexMethod(index) {
      return (this.params.page - 1) * this.params.pageSize + index + 1
    },
    handleSizeChange(val) {
      this.params.pageSize = val
      this.getExterpriseList()
    },
    handleCurrentChange(val) {
      this.params.page = val
      this.getExterpriseList()
    },
    async getExterpriseList() {
      const res = await getEnterpriseListAPI(this.params)
      this.exterpriseList = res.data.rows.map((item) => {
        return {
          ...item,
          rentList: [] // 每一行补充存放合同的列表
        }
      })
      console.log(this.exterpriseList)
      this.total = res.data.total
    }
  }
}
</script>
<style lang="scss" scoped>
.department-container {
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
