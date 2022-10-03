<template>
  <div class="main-box">
    <el-card>
      <el-row>
        <el-col :span="20">
          <el-select v-model="typeValue" placeholder="选择LEVEL" clearable>
            <el-option
              v-for="item in typeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <el-button
            type="primary"
            icon="el-icon-search"
            style="margin-left: 10px;"
            @click="searchData"
          >
            搜索
          </el-button>
        </el-col>
        <el-col :span="4">
          <div style="float: right;">
            <el-tooltip class="item" effect="dark" content="刷新表格" placement="top">
              <el-button
                size="small"
                icon="el-icon-refresh"
                circle
                @click="refreshTableData"
              />
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="查看说明" placement="top">
              <el-button
                size="small"
                icon="el-icon-warning-outline"
                circle
                @click="helpTips"
              />
            </el-tooltip>
          </div>
        </el-col>
      </el-row>
      <el-table
        v-loading="loading"
        :data="table_data"
        style="width: 100%;margin-top: 16px;"
        :header-cell-style="{background:'#eef1f6',color:'#606266', padding: '3px'}"
        :cell-style="{padding: '3px'}"
        max-height="1000px"
        stripe
      >
        <el-table-column
          prop="msg"
          label="MESSAGE"
          width="360"
        />
        <el-table-column
          prop="trace"
          label="TRACEBACK"
        />
        <el-table-column
          prop="level"
          label="LEVEL"
          width="100"
        >
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level === 30" size="small" type="warning">Warning</el-tag>
            <el-tag v-else-if="scope.row.level === 40" size="small" type="danger">Error</el-tag>
            <el-tag v-else size="small" type="info">Info</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="logger_name"
          label="LOGGER NAME"
          width="160"
        />
        <el-table-column
          prop="create_datetime"
          label="DATETIME"
          width="230"
          sortable
        />
      </el-table>
      <el-pagination
        background
        :hide-on-single-page="true"
        :page-size="pageSize"
        :current-page="currentPage"
        layout="total, prev, pager, next, jumper"
        :total="page_total_num"
        style="margin-top: 16px;"
        @current-change="handlePageChange"
      />
    </el-card>
  </div>
</template>

<script>
import { GetTableData, SearchData } from '@/api/logging/Loggingdb'
export default {
  data() {
    return {
      loading: true, // 表格加载动画
      table_data: [], // 表格数据
      // 分页相关
      page_total_num: 0,
      pageSize: 50,
      currentPage: 1,
      // 搜索类型
      typeOptions: [{
        value: 'Warning',
        label: 'Warning'
      }, {
        value: 'Error',
        label: 'Error'
      }],
      levelValue: '' // 搜索level
    }
  },
  created() {
    this.getTableData(this.currentPage, this.pageSize)
  },
  methods: {
    // 分页
    handlePageChange(val) {
      this.currentPage = val
      this.getTableData(val, this.pageSize) // 翻页
    },
    // 分页展示表格数据
    getTableData(currentPage, pageSize) {
      this.loading = true
      const data = { 'current_page': currentPage, 'page_size': pageSize }
      GetTableData(data).then(res => {
        if (res.code === 20000) {
          this.table_data = res.table_data
          this.page_total_num = res.page_total_num
          this.loading = false
        }
      })
    },
    // 搜索 搜索结果怎么分页TODO
    searchData() {
      const data = { 'typeValue': this.typeValue, 'userValue': this.userValue, 'tableValue': this.tableValue }
      SearchData(data).then(res => {
        if (res.code === 20000) {
          this.$message({
            type: res.type,
            message: res.message
          })
          this.table_data = res.table_data
          this.page_total_num = res.page_total_num
          this.loading = false
        }
      })
    },
    // 刷新表格
    refreshTableData() {
      this.getTableData(1, this.pageSize)
    },
    // 帮助
    helpTips() {

    }
  }
}
</script>

<style lang="scss" scoped>
  @import '../../assets/css/logging/History.scss';
</style>
<style>
.el-pagination {
    text-align: center;
}
</style>
