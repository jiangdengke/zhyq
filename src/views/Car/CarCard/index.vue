<template>
  <div class="card-container">
    <!-- 搜索区域 -->
    <div class="search-container">
      <span class="search-label">车牌号码：</span>
      <el-input v-model="params.carNumber" clearable placeholder="请输入内容" class="search-main" />
      <span class="search-label">车主姓名：</span>
      <el-input v-model="params.personName" clearable placeholder="请输入内容" class="search-main" />
      <span class="search-label">状态：</span>
      <el-select v-model="params.cardStatus">
        <el-option v-for="item in statusList" :key="item.value" :label="item.text" :value="item.value" />
      </el-select>
      <el-button type="primary" class="search-btn" @click="getCardList">查询</el-button>
    </div>
    <!-- 新增删除操作区域 -->
    <div class="create-container">
      <el-button type="primary" @click="$router.push('/car/cardAdd')">添加月卡</el-button>
      <el-button @click="delCartList">批量删除</el-button>
    </div>
    <!-- 表格区域 -->
    <div class="table">
      <el-table
        style="width: 100%"
        :data="list"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          type="selection"
          width="55"
        >        </el-table-column>
          <el-table-column type="index" label="序号" :index="indexMethod" />
          <el-table-column label="车主名称" prop="personName" />
          <el-table-column label="联系方式" prop="phoneNumber" />
          <el-table-column label="车牌号码" prop="carNumber" />
          <el-table-column label="车辆品牌" prop="carBrand" />
          <el-table-column label="剩余有效天数" prop="totalEffectiveDate" />
          <el-table-column label="状态" prop="cardStatus" :formatter="formatterStatus" />
          <el-table-column label="操作" fixed="right" width="180">
            <template #default="scope">
              <el-button size="mini" type="text">续费</el-button>
              <el-button size="mini" type="text">查看</el-button>
              <el-button size="mini" type="text" @click="editCard(scope.row.id)">编辑</el-button>
              <el-button size="mini" type="text" @click="delCard(scope.row.id)">删除</el-button>
            </template>
          </el-table-column>

      </el-table>
    </div>
    <div class="page-container">
      <!-- currpage-page: 表示当前页码 -->
      <!-- page-sizes：可选择的每页的页容量 -->
      <!-- page-size: 当前页的页容量 page-size的值通常和page-sizes的第一个值保持一致-->
      <!-- layout：表示 分页的样式 -->
      <!-- total：表示一共有多少条 -->
      <!-- size-change：页容量发生变化时，会触发 这个事件 -->
      <!-- current-change：页码发生变化是，会触发这个事件 -->
      <el-pagination
        :current-page="params.page"
        :page-sizes="[2, 4, 6, 8]"
        :page-size="params.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <!-- 添加楼宇 -->
    <el-dialog
      title="添加楼宇"
      width="580px"
    >
      <!-- 表单接口 -->
      <div class="form-container">
        <!-- <el-form ref="addForm" :model="addForm" :rules="addFormRules">
          <el-form-item label="楼宇名称" prop="name">
            <el-input v-model="addForm.name" />
          </el-form-item>
          <el-form-item label="楼宇层数" prop="floors">
            <el-input v-model="addForm.floors" />
          </el-form-item>
          <el-form-item label="在管面积" prop="area">
            <el-input v-model="addForm.area" />
          </el-form-item>
          <el-form-item label="物业费" prop="propertyFeePrice">
            <el-input v-model="addForm.propertyFeePrice" />
          </el-form-item>
        </el-form> -->
      </div>
      <template #footer>
        <el-button size="mini">取 消</el-button>
        <el-button size="mini" type="primary">确 定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { getCardListAPI } from '@/api/card'
import { deleteCardAPI } from '@/api/card'

export default {
  name: 'Card',
  data() {
    return {
      params: {
        page: 1,
        pageSize: 2,
        carNumber: '',
        personName: '',
        cardStatus: null
      },
      list: [],
      total: 0,
      statusList: [
        { text: '全部', value: null },
        { text: '可用', value: 0 },
        { text: '已过期', value: 1 }
      ], // 已选择列表
      selectedCarList: []
    }
  },
  created() {
    this.getCardList()
  },
  methods: {
    delCartList() {
      if (this.selectedCarList.length <= 0) {
        this.$message.warning('还未选中要删除的数据')
        return
      }
      this.$confirm('此操作将永久删除选择的月卡, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        // 处理id
        const idList = this.selectedCarList.map(item => item.id)
        await deleteCardAPI(idList.join(','))
        await this.getCardList()
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch((error) => {
        console.log(error)
      })
    },
    handleSelectionChange(rowList) {
      console.log(rowList)
      this.selectedCarList = rowList
    },
    // 删除逻辑
    delCard(id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        await deleteCardAPI(id)
        if (this.list.length === 1 && this.params.page > 1) {
          this.params.page = 1
        }
        await this.getCardList()
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch((error) => {
        console.log(error)
      })
    },
    editCard(id) {
      this.$router.push({
        path: '/car/cardAdd',
        query: {
          id
        }
      })
    },
    // 计算序号
    indexMethod(index) {
      return (this.params.page - 1) * this.params.pageSize + index + 1
    },
    handleSizeChange(val) {
      this.params.pageSize = val
      this.getCardList()
    },
    handleCurrentChange(val) {
      this.params.page = val
      this.getCardList()
    },
    // 获取月卡列表
    async getCardList() {
      console.log(this.params)
      const res = await getCardListAPI(this.params)
      this.list = res.data.rows
      this.total = res.data.total
      console.log(res)
    },
    // 格式化状态
    formatterStatus(row, column, cellValue, index) {
      return cellValue === 0 ? '可用' : '不可用'
    }
  }
}
</script>

<style lang="scss" scoped>
.card-container {
  padding: 20px;
  background-color: #fff;
}

.search-container {
  display: flex;
  align-items: center;
  border-bottom: 1px solid rgb(237, 237, 237, .9);
  padding-bottom: 20px;
  .search-main {
    width: 220px;
    margin-right: 10px;
  }
  .search-btn{
    margin-left:20px;
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
