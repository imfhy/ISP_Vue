<template>
  <div class="main-box">
    <el-card>
      <el-row>
        <el-col :span="16">
          <div>
            <el-button type="primary" @click="addDataDialog">
              <i class="el-icon-plus" />增加
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
            <el-button
              size="mini"
              icon="el-icon-warning-outline"
              circle
              @click="helpTips"
            />
          </div>
        </el-col>
      </el-row>
      <div class="table-box">
        <el-table
          id="mytable"
          v-loading="loading"
          :data="table_data"
          :header-cell-style="{background:'#eef1f6',color:'#606266'}"
          :cell-style="{padding: '2'}"
          max-height="800px"
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
      </div>
    </el-card>
    <el-dialog
      v-el-drag-dialog
      :title="dialogTitle"
      :visible.sync="dataDialogVisible"
      width="70%"
      @dragDialog="handleDrag"
    >
      <span>数据表单</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dataDialogVisible = false">取消</el-button>
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
          <el-switch
            v-model="importType"
            style="margin-top: 22px;margin-bottom: 22px;"
            active-text="追加数据"
            inactive-text="替换数据"
          />
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
        <el-button @click="importDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmImport">提交</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import elDragDialog from '@/directive/el-drag-dialog' // base on element-ui
export default {
  directives: { elDragDialog },
  data() {
    return {
      loading: true, // 表格加载动画
      table_data: [
        {
          line_name: 'SM01',
          start_time: '	2022-10-1 08:00',
          end_time: '2022-10-5 08:00',
          lock_time: '2022-9-28 11:01',
          flag: false
        }
      ], // 表格数据
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
      importType: false, // false为替换数据 true为添加数据
      uploadFileName: '' // 上传的文件名
    }
  },
  mounted() {
    this.showTableData()
  },
  methods: {
    // dialog可拖拽
    handleDrag() {
      this.$refs.select.blur()
    },
    // 添加数据
    addDataDialog() {
      this.dialogTitle = '添加数据'
      this.dialogBtnType = true
      this.dataDialogVisible = true
    },
    addData() {
      this.$message({
        type: 'success',
        message: '添加成功'
      })
    },
    // 删除数据
    deleteData() {
      this.$confirm('请确定是否要删除这些数据?', '提示', {
        confirmButtonText: '确定删除',
        cancelButtonText: '取消',
        confirmButtonClass: 'btnDanger',
        type: 'warning'
      }).then(() => {
        const count = 10
        this.$message({
          type: 'success',
          message: '成功删除 ' + count + ' 条数据'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消删除'
        })
      })
    },
    // 编辑数据
    handleEditDialog(index, row) {
      this.dialogTitle = '修改数据'
      this.dialogBtnType = false
      this.dataDialogVisible = true
      this.scopeIndex = index
      this.scopeRow = row
    },
    saveData() {
      this.$message({
        type: 'success',
        message: '修改成功'
      })
    },
    // 表格中删除数据
    handleDelete() {
      this.$confirm('请确定是否要删除该数据?', '提示', {
        confirmButtonText: '确定删除',
        cancelButtonText: '取消',
        confirmButtonClass: 'btnDanger',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '成功删除该数据'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消删除'
        })
      })
    },
    // 帮助提示按钮
    helpTips() {
      this.helpDialogVisible = true
    },
    // Excel导入到数据库
    importExcelData() {
      this.importDialogVisible = true
      this.confirmImport()
    },
    confirmImport() {
      // this.$message({
      //   type: 'success',
      //   message: '导入成功'
      // })
    },
    // 数据库导出到Excel
    exportToExcel() {

    },
    // 分页展示表格数据
    showTableData() {
      this.loading = false
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
</style>
