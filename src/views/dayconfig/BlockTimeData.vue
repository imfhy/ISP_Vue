<template>
  <div class="main-box">
    <el-card>
      <el-row>
        <el-col :span="16">
          <div>
            <el-button type="primary" @click="addDataDialog">
              <i class="el-icon-plus" />添加
            </el-button>
            <el-button type="danger" @click="deleteData">
              <i class="el-icon-delete" />删除
            </el-button>
            <el-button @click="importExcelData">
              <i class="el-icon-upload2" />导入
            </el-button>
            <el-button @click="exportToExcel">
              <i class="el-icon-download" />导出
            </el-button>
          </div>
        </el-col>
        <el-col :span="8">
          <div style="float: right;">
            <el-tooltip class="item" effect="dark" content="刷新表格" placement="top">
              <el-button
                size="small"
                icon="el-icon-refresh"
                circle
                @click="refreshTableData"
              />
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="查看帮助" placement="top">
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
      <div class="table-box">
        <el-table
          id="mytable"
          v-loading="loading"
          :data="table_data"
          :header-cell-style="{background:'#eef1f6',color:'#606266', padding: '3px'}"
          :cell-style="{padding: '3px'}"
          max-height="1000px"
          stripe
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            type="selection"
            width="55"
          />
          <el-table-column
            prop="line_name"
            label="维护线体"
            width="110"
            sortable
          />
          <el-table-column
            prop="start_time"
            label="开始时间"
            sortable
          />
          <el-table-column
            prop="end_time"
            label="结束时间"
            sortable
          />
          <el-table-column
            prop="lock_time"
            label="锁定时间节点"
            sortable
          />
          <el-table-column
            prop="flag"
            label="手动修改锁定时间"
            width="200"
          >
            <template slot-scope="scope">
              <el-tag v-if="scope.row.flag === true" size="small">开启</el-tag>
              <el-tag v-else-if="scope.row.flag === false" size="small" type="danger">关闭</el-tag>
            </template>
          </el-table-column>
          <el-table-column width="110" fixed="right" label="操作">
            <template slot-scope="scope">
              <el-button
                type="primary"
                size="mini"
                icon="el-icon-edit"
                circle
                @click="handleEditDialog(scope.$index, scope.row)"
              />
              <el-button
                type="danger"
                size="mini"
                icon="el-icon-delete"
                circle
                @click="handleDelete(scope.$index, scope.row)"
              />
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          background
          :hide-on-single-page="true"
          :page-size="pageSize"
          :current-page="currentPage"
          layout="total, prev, pager, next, jumper"
          :total="page_total_num"
          style="margin-top: 16px;"
          @size-change="handleSizeChange"
          @current-change="handlePageChange"
        />
      </div>
    </el-card>
    <el-dialog
      v-el-drag-dialog
      :title="dialogTitle"
      :visible.sync="dataDialogVisible"
      width="60%"
      :before-close="handleClose"
      @dragDialog="handleDrag"
    >
      <el-form ref="$form" :model="model" label-position="left" size="small">
        <el-row :gutter="20" type="flex" justify="start" align="top" tag="div">
          <el-col :span="8" :offset="0" :push="0" :pull="0" tag="div">
            <el-form-item :rules="rules.line_name" prop="line_name" label="维护线体">
              <el-select v-model="model.line_name" placeholder="请选择" :style="{width: '100%'}">
                <el-option v-for="(item) in line_name_data" :key="item.value" :label="item.label" :value="item.value" :disabled="!!item.disabled" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8" :offset="0" :push="0" :pull="0" tag="div">
            <el-form-item :rules="rules.start_time" prop="start_time" label="开始时间">
              <el-date-picker v-model="model.start_time" type="datetime" placeholder="请选择" format="yyyy-MM-dd HH:mm:ss" :style="{width: '100%'}" />
            </el-form-item>
          </el-col>
          <el-col :span="8" :offset="0" :push="0" :pull="0" tag="div">
            <el-form-item :rules="rules.end_time" prop="end_time" label="结束时间">
              <el-date-picker v-model="model.end_time" type="datetime" placeholder="请选择" format="yyyy-MM-dd HH:mm:ss" :style="{width: '100%'}" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" type="flex" justify="start" align="top" tag="div">
          <el-col :span="8" :offset="0" :push="0" :pull="0" tag="div">
            <el-form-item :rules="rules.flag" prop="flag" label="手动修改锁定时间">
              <el-switch v-model="model.flag" />
            </el-form-item>
          </el-col>
          <el-col :span="16" :offset="0" :push="0" :pull="0" tag="div">
            <el-form-item :rules="rules.lock_time" prop="lock_time" label="锁定时间节点">
              <el-date-picker v-model="model.lock_time" type="datetime" placeholder="请选择" format="yyyy-MM-dd HH:mm:ss" :style="{width: '100%'}" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" type="flex" justify="start" align="top" tag="div">
          <el-col :span="6" :offset="0" :push="0" :pull="0" tag="div">
            <el-form-item :rules="rules.CREATED_BY" prop="CREATED_BY" label="创建人">
              <el-input v-model="model.CREATED_BY" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="6" :offset="0" :push="0" :pull="0" tag="div">
            <el-form-item :rules="rules.CREATED_TIME" prop="CREATED_TIME" label="创建时间">
              <el-input v-model="model.CREATED_TIME" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="6" :offset="0" :push="0" :pull="0" tag="div">
            <el-form-item :rules="rules.UPDATED_BY" prop="UPDATED_BY" label="修改人">
              <el-input v-model="model.UPDATED_BY" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="6" :offset="0" :push="0" :pull="0" tag="div">
            <el-form-item :rules="rules.UPDATED_TIME" prop="UPDATED_TIME" label="修改时间">
              <el-input v-model="model.UPDATED_TIME" disabled />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">关闭</el-button>
        <el-button v-if="dialogBtnType === true" type="primary" @click="addData">添加</el-button>
        <el-button v-else-if="dialogBtnType === false" type="primary" @click="saveData">保存</el-button>
      </span>
    </el-dialog>

    <el-dialog
      v-el-drag-dialog
      title="帮助"
      :visible.sync="helpDialogVisible"
      width="60%"
      @dragDialog="handleDrag"
    >
      <span>各种提示信息可以写在这</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="helpDialogVisible = false">关闭</el-button>
      </span>
    </el-dialog>

    <el-dialog
      v-el-drag-dialog
      title="导入数据"
      :visible.sync="importDialogVisible"
      width="60%"
      @dragDialog="handleDrag"
    >
      <p style="font-size:18px;margin-bottom: 16px;">
        导入数据格式如下（仅支持.xlsx格式）：
      </p>
      <el-table
        :data="tableDataExa"
        :header-cell-style="{background:'#eef1f6',color:'#606266'}"
        :cell-style="{padding: '2'}"
        border
      >
        <el-table-column
          prop="line_name"
          label="维护线体"
          width="110"
        />
        <el-table-column
          prop="start_time"
          label="开始时间"
        />
        <el-table-column
          prop="end_time"
          label="结束时间"
        />
        <el-table-column
          prop="lock_time"
          label="锁定时间"
        />
        <el-table-column
          prop="flag"
          label="手动修改锁定时间"
          width="200"
        />
      </el-table>
      <el-row>
        <el-col :span="8">
          <el-radio-group v-model="importRadio" style="margin-top: 26px;">
            <el-radio :label="3">替换数据</el-radio>
            <el-radio :label="6">追加数据</el-radio>
          </el-radio-group>
        </el-col>
        <el-col :span="16">
          <div style="display: flex;margin-top: 16px;margin-bottom: 16px;">
            <el-input style="width: 200px;" placeholder="未上传文件" :value="uploadFileName" />
            <el-upload
              ref="upload"
              class="upload-demo"
              action=""
              :limit="1"
              :on-change="handleChange"
              :on-progress="handleProgress"
              :on-success="handleSuccess"
              :auto-upload="false"
              :show-file-list="false"
            >
              <el-button slot="trigger" type="primary" style="margin-left: 10px;">
                <i class="el-icon-upload" />
                上传文件
              </el-button>
            </el-upload>
          </div>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="importDialogVisible = false">关闭</el-button>
        <el-button type="primary" @click="confirmImport">确认导入</el-button>
      </span>
    </el-dialog>

    <el-dialog
      v-el-drag-dialog
      title="导出数据"
      :visible.sync="exportDialogVisible"
      width="45%"
      @dragDialog="handleDrag"
    >
      <el-row>
        <span>导出数据格式：</span>
        <el-radio-group v-model="exportRadio">
          <el-radio :label="3">.xlsx</el-radio>
        </el-radio-group>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="exportDialogVisible = false">关闭</el-button>
        <el-button type="primary" @click="confirmExport">确认导出</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import elDragDialog from '@/directive/el-drag-dialog'
import { GetTableData, AddData, SaveData, DeleteData, HandleDelete, ConfirmImport, ConfirmExport } from '@/api/dayconfig/BlockTimeData'
import { LineOptions } from '@/utils/items'
export default {
  directives: { elDragDialog },
  data() {
    return {
      loading: true, // 表格加载动画
      table_data: [], // 表格数据
      tableDataExa: [
        {
          line_name: 'SM01',
          start_time: '	2022-10-01 08:00:00',
          end_time: '2022-10-05 08:00:00',
          lock_time: '2022-09-28 11:01:00',
          flag: 't'
        }
      ], // 示例的表格数据
      dialogTitle: '', // 表单dialog标题
      dataDialogVisible: false, // 表单dialog显示
      dialogBtnType: true, // 表单dialog按钮 true为添加按钮 false为保存按钮
      helpDialogVisible: false, // 帮助提示dialog
      scopeIndex: '', // 表格行数index
      scopeRow: '', // 表格行数据
      importDialogVisible: false, // 导入数据dialog
      exportDialogVisible: false, // 导出dialog
      importType: false, // false为替换数据 true为添加数据
      uploadFileName: '', // 上传的文件名
      importRadio: 3, // 导入方式选择（方便以后扩展）
      exportRadio: 3, // 导出格式选择（方便以后扩展）
      // 表单相关数据
      forms: ['$form'],
      model: {
        id: '',
        line_name: '',
        start_time: '',
        end_time: '',
        flag: false,
        lock_time: '',
        CREATED_BY: '',
        CREATED_TIME: '',
        UPDATED_BY: '',
        UPDATED_TIME: ''
      },
      // 用于检测表单前后的变化（关闭前提示是否保存）
      modelOriginal: {
        id: '',
        line_name: '',
        start_time: '',
        end_time: '',
        flag: false,
        lock_time: '',
        CREATED_BY: '',
        CREATED_TIME: '',
        UPDATED_BY: '',
        UPDATED_TIME: ''
      },
      rules: {
        line_name: [{
          required: true,
          message: '维护线体不能为空',
          trigger: 'change'
        }],
        start_time: [{
          required: true,
          message: '开始时间不能为空',
          trigger: 'change'
        }],
        end_time: [{
          required: true,
          message: '结束时间不能为空',
          trigger: 'change'
        }],
        flag: [],
        lock_time: [],
        CREATED_BY: [],
        CREATED_TIME: [],
        UPDATED_BY: [],
        UPDATED_TIME: []
      },
      line_name_data: LineOptions, // 维护线别
      // 分页相关
      page_total_num: 0, // 总共有多少条数据(后端返回)
      currentPage: 1, // 当前在第几页
      pageSize: 50, // 每页多少条数据
      dataTableSelections: [] // 表格选中的数据
    }
  },
  mounted() {
    this.getTableData(this.currentPage, this.pageSize)
  },
  methods: {
    // dialog可拖拽
    handleDrag() {
      this.$refs.select.blur()
    },
    // 分页
    handlePageChange(val) {
      this.currentPage = val
      this.getTableData(val, this.pageSize) // 翻页
    },
    // 分页
    handleSizeChange(val) {
      this.pageNum = val
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
    // 刷新表格数据
    refreshTableData() {
      this.getTableData(1, this.pageSize)
    },
    // 添加数据
    addDataDialog() {
      this.dialogTitle = '添加数据'
      this.dialogBtnType = true
      this.dataDialogVisible = true
    },
    // 添加数据
    addData() {
      const data = { 'rowData': this.scopeRow, 'index': this.scopeIndex }
      AddData(data).then(res => {
        if (res.code === 20000) {
          this.$notify({
            title: '添加成功',
            message: '成功添加 1 条数据',
            type: 'success'
          })
        }
      })
    },
    // 获取表格勾选数据
    handleSelectionChange(val) {
      this.dataTableSelections = val
    },
    // 删除所有表格勾选的数据
    deleteData() {
      const dataLength = this.dataTableSelections.length
      if (dataLength === 0) {
        this.$message({
          type: 'warning',
          message: '请至少选中一条数据'
        })
        return
      }
      const idList = []
      for (let i = 0; i < dataLength; i++) {
        idList.push(this.dataTableSelections[i].id)
      }
      this.$confirm('请确定是否要删除掉这些数据?', '提示', {
        confirmButtonText: '确定删除',
        cancelButtonText: '取消',
        confirmButtonClass: 'btnDanger',
        type: 'warning'
      }).then(() => {
        const data = { 'id_list': idList }
        DeleteData(data).then(res => {
          if (res.code === 20000) {
            this.$notify({
              title: '删除成功',
              message: '成功删除选中的 ' + dataLength + ' 条数据',
              type: 'success'
            })
            this.refreshTableData() // 刷新表格数据
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消删除'
        })
      })
    },
    // 修改数据
    handleEditDialog(index, row) {
      // 修改dialog
      this.dialogTitle = '修改数据'
      this.dialogBtnType = false
      this.scopeIndex = index
      this.scopeRow = row
      // 显示表单数据
      this.model.id = row.id
      this.model.line_name = row.line_name
      this.model.start_time = row.start_time
      this.model.end_time = row.end_time
      this.model.flag = row.flag
      this.model.lock_time = row.lock_time
      this.model.CREATED_BY = row.CREATED_BY
      this.model.CREATED_TIME = row.CREATED_TIME
      this.model.UPDATED_BY = row.UPDATED_BY
      this.model.UPDATED_TIME = row.UPDATED_TIME
      // 保存原来的表单数据，用于对比变化
      for (const key in this.modelOriginal) {
        this.modelOriginal[key] = this.model[key]
      }
      // 显示dialog
      this.dataDialogVisible = true
    },
    // 编辑数据发送到后端保存
    saveData() {
      const data = { 'rowData': this.scopeRow, 'index': this.scopeIndex }
      SaveData(data).then(res => {
        if (res.code === 20000) {
          this.$notify({
            title: '修改成功',
            message: '数据已修改',
            type: 'success'
          })
        }
      })
    },
    // 检测表单数据是否发生变化，用于提示
    checkFormChange() {
      let isChange = false
      for (const key in this.model) {
        console.log(this.model[key], this.modelOriginal[key])
        if (this.model[key] !== this.modelOriginal[key]) {
          isChange = true
          break
        }
      }
      return isChange
    },
    // 表单dialog关闭前提示
    handleClose() {
      if (this.checkFormChange()) {
        this.$confirm('修改的数据未保存，请确定是否要关闭窗口？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.closeFormDialog()
        }).catch(() => {

        })
      } else {
        this.closeFormDialog()
      }
    },
    // 关闭表单dialog的一些操作
    closeFormDialog() {
      this.dataDialogVisible = false
      this.model = {
        id: '',
        line_name: '',
        start_time: '',
        end_time: '',
        flag: false,
        lock_time: '',
        CREATED_BY: '',
        CREATED_TIME: '',
        UPDATED_BY: '',
        UPDATED_TIME: ''
      }
      this.modelOriginal = {
        id: '',
        line_name: '',
        start_time: '',
        end_time: '',
        flag: false,
        lock_time: '',
        CREATED_BY: '',
        CREATED_TIME: '',
        UPDATED_BY: '',
        UPDATED_TIME: ''
      }
    },
    // 表格中删除数据
    handleDelete(index, row) {
      this.$confirm('请确定是否要删除该数据?', '提示', {
        confirmButtonText: '确定删除',
        cancelButtonText: '取消',
        confirmButtonClass: 'btnDanger',
        type: 'warning'
      }).then(() => {
        HandleDelete(row.id).then(res => {
          if (res.code === 20000) {
            this.$notify({
              title: '删除成功',
              message: '该数据已删除',
              type: 'success'
            })
            this.refreshTableData()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消删除'
        })
      })
    },
    // Excel导入到数据库
    importExcelData() {
      this.importDialogVisible = true
      this.confirmImport()
    },
    // 确认导入
    confirmImport() {
      const form = new FormData()
      form.append('file', this.uploadFile.raw)
      ConfirmImport(form).then(res => {
        if (res.code === 20000) {
          this.$notify({
            title: '导入成功',
            message: '成功替换/追加 n 条数据',
            type: 'success'
          })
        }
      })
    },
    handleChange() {

    },
    handleProgress() {

    },
    handleSuccess() {

    },
    // 数据库导出到Excel
    exportToExcel() {
      this.exportDialogVisible = true
    },
    // 确认导出
    confirmExport() {
      ConfirmExport().then(res => {
        if (res.code === 20000) {
          this.$notify({
            title: '导出成功',
            message: '成功导出 n 条数据',
            type: 'success'
          })
        }
      })
    },
    // 帮助提示按钮
    helpTips() {
      this.helpDialogVisible = true
    }
  }
}
</script>
<style lang="scss" scoped>
  @import '../../assets/css/dayconfig/BlockTimeData.scss';
</style>
<style>
.btnDanger{
  background-color: #a52a2a !important;
  border-color: #a52a2a !important;
}
.btnDanger:hover{
  background-color: #c24848 !important;
  border-color: #c24848 !important;
}
.el-pagination {
    text-align: center;
}
</style>
