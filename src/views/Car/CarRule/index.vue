<template>
  <div class="rule-container">
    <div class="create-container">
      <el-button type="primary" @click="addFeeRule">增加停车计费规则</el-button>
      <el-button @click="exportExcel">导出Excel</el-button>
    </div>
    <!-- 表格区域 -->
    <div class="table">
      <el-table :data="ruleList" style="width: 100%">
        <el-table-column label="序号" type="index" :index="indexMethod" />
        <el-table-column label="计费规则编号" prop="ruleNumber" />
        <el-table-column label="计费规则名称" prop="ruleName" />
        <el-table-column label="免费时长(分钟)" prop="freeDuration" />
        <el-table-column label="收费上限(元)" prop="chargeCeiling" />
        <el-table-column label="计费方式" prop="chargeType">
          <template #default="{row}">
            {{ formateChargeType(row.chargeType) }}
          </template>
        </el-table-column>
        <el-table-column label="计费规则" prop="ruleNameView" />
        <el-table-column label="操作" fixed="right" width="120">
          <template #default="scope">
            <el-button size="mini" type="text" @click="editRule(scope.row.id)">编辑</el-button>
            <el-button size="mini" type="text" @click="delRule(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--必须的配置项 total  page-size  总页数= 总条数/页容量-->
      <!-- 必须配置的事件 @current-change -->
      <div class="pager" style="margin-top:10px;float:right">
        <el-pagination
          layout="prev, pager, next"
          :total="total"
          :page-size="pageSize"
          @current-change="handleChange"
        />
      </div>
    </div>
    <AddRule ref="addRule" :dialog-visible.sync="dialogVisible" @getList="getRuleList" />
  </div>
</template>

<script>
import { getRuleListAPI, deleteRuleAPI } from '@/api/rule'
import { utils, writeFileXLSX } from 'xlsx'
import AddRule from '@/views/Car/CarRule/components/AddRule.vue'
export default {
  name: 'Building',
  components: {
    AddRule
  },
  data() {
    return {
      page: 1,
      pageSize: 2,
      ruleList: [],
      total: 0,
      dialogVisible: false,
      ruleId: 0
    }
  },
  created() {
    this.getRuleList()
  },
  methods: {
    editRule(id) {
      this.dialogVisible = true
      this.$refs.addRule.getParkingRule(id)
      this.$refs.addRule.title = '修改规则'
    },
    // 删除规则
    delRule(id) {
      this.$confirm('您确定要删除该规则吗？', '温馨提示').then(async() => {
        await deleteRuleAPI(id)
        this.$message.success('删除成功')
        if (this.ruleList.length === 1 && this.params.page > 1) {
          this.params.page--
        }
        await this.getRuleList()
      }).catch(() => {})
    },
    // 添加计费规则
    addFeeRule() {
      this.dialogVisible = true
      this.$refs.addRule.title = '添加规则'
    },
    // 格式化收费类型
    formateChargeType(chargeType) {
      const Map = {
        duration: '时长收费',
        turn: '按次收费',
        partition: '分段收费'
      }
      return Map[chargeType]
    },
    // 导出excel
    async exportExcel() {
      const res = await getRuleListAPI({ page: this.page, pageSize: this.pageSize })
      // 要求导出的字段名
      const tableHeaderKeys = ['ruleNumber', 'ruleName', 'freeDuration']
      const list = res.data.rows.map(item => {
        // 创建一个新对象来存数据
        const obj = {}
        tableHeaderKeys.forEach(key => {
          obj[key] = item[key]
        })
        return obj
      })
      // 要导出的标头
      const tableHeaderValues = ['计费规则编号', '计费规则名称', '免费时长(分钟)']
      // 创建一个新的工作簿
      const workbook = utils.book_new()
      // 创建一个工作表 要求一个对象数组格式
      const worksheet = utils.json_to_sheet(list)
      // 把工作表添加到工作簿  Data为工作表名称
      utils.book_append_sheet(workbook, worksheet, 'Data')
      // 改写表头
      utils.sheet_add_aoa(worksheet, [tableHeaderValues], { origin: 'A1' })
      // 导出方法进行导出
      writeFileXLSX(workbook, 'SheetJSVueAoO.xlsx')
    },
    indexMethod(row) {
      return (this.page - 1) * this.pageSize + row + 1
    },
    // 点击不同页码
    handleChange(val) {
      // console.log(val)
      this.page = val
      this.getRuleList()
    },
    // 获取计费列表
    async getRuleList() {
      const res = await getRuleListAPI({ page: this.page, pageSize: this.pageSize })
      this.ruleList = res.data.rows
      this.total = res.data.total
    }
  }
}
</script>

<style lang="scss" scoped>
.rule-container {
  padding: 20px;
  background-color: #fff;
}

.search-container {
  display: flex;
  align-items: center;
  border-bottom: 1px solid rgb(237, 237, 237, .9);
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
</style>
