<template>
  <div class="main-box">
    <el-card>
      <el-row>
        <el-col :span="20">
          <el-select v-model="typeValue" placeholder="搜索操作类型" clearable>
            <el-option
              v-for="item in typeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <el-input
            v-model="userValue"
            placeholder="搜索用户名"
            prefix-icon="el-icon-search"
            style="width: 200px;margin-left: 10px;"
            clearable
          />
          <el-input
            v-model="tableValue"
            placeholder="搜索操作对象"
            prefix-icon="el-icon-search"
            style="width: 200px;margin-left: 10px;"
            clearable
          />
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
          prop="user_name"
          label="用户名"
          width="150"
          sortable
        />
        <el-table-column
          prop="table_name"
          label="操作对象"
          width="180"
          sortable
        />
        <el-table-column
          prop="action"
          label="操作"
          sortable
        />
        <el-table-column
          prop="action_type"
          label="操作类型"
          width="120"
          sortable
        >
          <template slot-scope="scope">
            <el-tag v-if="scope.row.action_type === 'add'" size="small">添加</el-tag>
            <el-tag v-else-if="scope.row.action_type === 'delete'" size="small" type="danger">删除</el-tag>
            <el-tag v-else-if="scope.row.action_type === 'edit'" size="small" type="success">修改</el-tag>
            <el-tag v-else-if="scope.row.action_type === 'import'" size="small" type="info">导入</el-tag>
            <el-tag v-else-if="scope.row.action_type === 'export'" size="small" type="info">导出</el-tag>
            <el-tag v-else-if="scope.row.action_type === 'run'" size="small" type="warning">运行</el-tag>
            <el-tag v-else size="small" type="info">其它</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="action_time"
          label="操作日期"
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
import { GetTableData, SearchData } from '@/api/logging/History'
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
        value: 'add',
        label: '添加'
      }, {
        value: 'delete',
        label: '删除'
      }, {
        value: 'edit',
        label: '修改'
      }, {
        value: 'import',
        label: '导入'
      }, {
        value: 'export',
        label: '导出'
      }, {
        value: 'run',
        label: '运行'
      }, {
        value: 'other',
        label: '其它'
      }],
      tableValue: '', // 搜索表名
      typeValue: '', // 搜索类型
      userValue: '' // 搜索用户
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
      if (this.typeValue === '' && this.userValue === '' && this.tableValue === '') {
        this.$message({
          type: 'warning',
          message: '请至少输入一个关键词'
        })
        return
      }
      const data = { 'typeValue': this.typeValue, 'userValue': this.userValue, 'tableValue': this.tableValue }
      SearchData(data).then(res => {
        if (res.code === 20000) {
          this.$notify({
            title: res.message_title,
            message: res.message,
            type: res.type
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
