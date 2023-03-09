<template>
  <div id="main-box">
    <el-card>
      <el-row>
        <el-col :span="16">
          <div>
            <el-button type="primary" @click="addDataDialog">
              <i class="el-icon-plus" />添加
            </el-button>
            <el-button type="primary" @click="addMultiDataDialog">
              <i class="el-icon-plus" />添加多个维护
            </el-button>
            <el-button type="danger" @click="deleteData">
              <i class="el-icon-delete" />删除
            </el-button>
            <el-button type="backupBtn" @click="backupData">
              <i class="el-icon-document-copy" />备份数据
            </el-button>
            <el-button type="backupBtn" @click="recoverBackupData">
              <i class="el-icon-refresh-left" />恢复备份
            </el-button>
            <el-button type="backupBtn" @click="manageBackupData">
              <i class="el-icon-edit-outline" />备份管理
            </el-button>
            <el-button @click="importDataDialog">
              <i class="el-icon-upload2" />导入
            </el-button>
            <el-button @click="exportDataDialog">
              <i class="el-icon-download" />导出
            </el-button>
          </div>
        </el-col>
        <el-col :span="8">
          <div style="float: right;">
            <el-tooltip class="item" effect="dark" content="同步正式库维护时间表" placement="top">
              <el-button
                size="small"
                icon="el-icon-download"
                circle
                @click="beforeSyncFormalData"
              />
            </el-tooltip>
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
      <div class="table-box">
        <el-table
          id="mytable"
          v-loading="loading"
          :data="table_data"
          :header-cell-style="{background:'#eef1f6',color:'#606266', padding: '3px'}"
          :cell-style="{padding: '3px'}"
          stripe
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55" />
          <el-table-column prop="line_name" label="维护线体" width="110" sortable />
          <el-table-column prop="start_time" label="开始时间" width="180" sortable />
          <el-table-column prop="end_time" label="结束时间" width="180" sortable />
          <!-- <el-table-column prop="lock_time" label="锁定时间节点" sortable /> -->
          <el-table-column prop="lock_time" width="180" label="锁定时间节点">
            <template slot-scope="scope">
              <span v-if="scope.row.flag === true">{{ scope.row.lock_time }}</span>
              <span v-else-if="scope.row.flag === false" size="small" type="info">未开启</span>
            </template>
          </el-table-column>
          <el-table-column prop="flag" label="手动修改锁定时间" width="160">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.flag === true" size="small" type="success">开启</el-tag>
              <el-tag v-else-if="scope.row.flag === false" size="small" type="info">关闭</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="remark" label="备注" />
          <el-table-column width="110" fixed="right" label="操作">
            <template slot-scope="scope">
              <el-button
                type="primary"
                size="mini"
                icon="el-icon-edit"
                circle
                @click="handleModify(scope.$index, scope.row)"
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
          :total="total_num"
          style="margin-top: 16px;"
          @current-change="handlePageChange"
        />
      </div>
    </el-card>

    <el-dialog
      v-el-drag-dialog
      title="添加多个维护"
      :visible.sync="dialogMultiVisible"
      width="76%"
      :before-close="handleMultiClose"
      @dragDialog="handleDrag"
    >
      <el-row style="margin-bottom: 3px;">
        <el-col :span="8">
          <span>白班早下班时间区间：</span>
        </el-col>
        <el-col :span="8">
          <span>夜班早下班时间区间：</span>
        </el-col>
        <el-col :span="8">
          <span>白班保养时间区间：</span>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-date-picker
            v-model="dayTime"
            type="datetimerange"
            range-separator="至"
            start-placeholder="维护开始时间"
            end-placeholder="维护结束时间"
            style="margin-bottom: 10px;"
          />
        </el-col>
        <el-col :span="8">
          <el-date-picker
            v-model="nightTime"
            type="datetimerange"
            range-separator="至"
            start-placeholder="维护开始时间"
            end-placeholder="维护结束时间"
            style="margin-bottom: 10px;"
          />
        </el-col>
        <el-col :span="8">
          <el-date-picker
            v-model="maintainTime"
            type="datetimerange"
            range-separator="至"
            start-placeholder="维护开始时间"
            end-placeholder="维护结束时间"
            style="margin-bottom: 10px;"
          />
        </el-col>
      </el-row>
      <el-row style="margin-bottom: 3px;">
        <el-col :span="8">
          <span>自定义时间(方式一)：</span>
        </el-col>
        <el-col :span="16">
          <span>自定义时间(方式二)：</span>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-date-picker
            v-model="customTime"
            type="datetimerange"
            range-separator="至"
            start-placeholder="维护开始时间"
            end-placeholder="维护结束时间"
            style="margin-bottom: 10px;"
          />
        </el-col>
        <el-col :span="16">
          <el-date-picker
            v-model="customDateTime"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            unlink-panels
          />
          <el-time-picker
            v-model="customHourTime"
            is-range
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
          />
        </el-col>
      </el-row>
      <el-table
        :data="tableDataMulti"
        :header-cell-style="{background:'#eef1f6',color:'#606266'}"
        max-height="460"
      >
        <el-table-column prop="line_name" label="维护线体" width="100" />
        <el-table-column prop="dayTime" label="白班早下班" :render-header="renderHeaderDay">
          <template slot-scope="scope">
            <el-checkbox v-model="scope.row.dayTime">白班早下班</el-checkbox>
          </template>
        </el-table-column>
        <el-table-column prop="nightTime" label="夜班早下班" :render-header="renderHeaderNight">
          <template slot-scope="scope">
            <el-checkbox v-model="scope.row.nightTime">夜班早下班</el-checkbox>
          </template>
        </el-table-column>
        <el-table-column prop="maintainTime" label="白班保养" :render-header="renderHeaderMaintain">
          <template slot-scope="scope">
            <el-checkbox v-model="scope.row.maintainTime" style="margin-top: 5px;">白班保养</el-checkbox>
          </template>
        </el-table-column>
        <el-table-column prop="customTime" label="自定义时间(方式一)" :render-header="renderHeaderCustom">
          <template slot-scope="scope">
            <el-checkbox v-model="scope.row.customTime" style="margin-top: 5px;">自定义时间(方式一)</el-checkbox>
          </template>
        </el-table-column>
        <el-table-column prop="customTime2" label="自定义时间(方式二)" :render-header="renderHeaderCustom2">
          <template slot-scope="scope">
            <el-checkbox v-model="scope.row.customTime2" style="margin-top: 5px;">自定义时间(方式二)</el-checkbox>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleMultiClose">关闭</el-button>
        <el-button v-if="dialogBtnType === true" type="primary" @click="addMultiData">添加</el-button>
      </span>
    </el-dialog>

    <el-dialog
      v-el-drag-dialog
      :title="dialogTitle"
      :visible.sync="dataDialogVisible"
      width="60%"
      :before-close="handleFormClose"
      @dragDialog="handleDrag"
    >
      <el-form ref="$form" :model="model" label-position="left" size="small">
        <el-row :gutter="20" type="flex" justify="start" align="top" tag="div">
          <el-col :span="8" :offset="0" :push="0" :pull="0" tag="div">
            <el-form-item :rules="rules.line_name" prop="line_name" label="维护线体">
              <el-select v-model="model.line_name" placeholder="请选择" :style="{width: '100%'}">
                <el-option v-for="(item) in lineOptions" :key="item.value" :label="item.label" :value="item.value" :disabled="!!item.disabled" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8" :offset="0" :push="0" :pull="0" tag="div">
            <el-form-item :rules="rules.start_time" prop="start_time" label="开始时间">
              <el-date-picker v-model="model.start_time" value-format="yyyy-MM-dd HH:00:00" type="datetime" placeholder="请选择" format="yyyy-MM-dd HH:mm:ss" :style="{width: '100%'}" />
            </el-form-item>
          </el-col>
          <el-col :span="8" :offset="0" :push="0" :pull="0" tag="div">
            <el-form-item :rules="rules.end_time" prop="end_time" label="结束时间">
              <el-date-picker v-model="model.end_time" value-format="yyyy-MM-dd HH:00:00" type="datetime" placeholder="请选择" format="yyyy-MM-dd HH:mm:ss" :style="{width: '100%'}" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" type="flex" justify="start" align="top" tag="div">
          <el-col :span="8" :offset="0" :push="0" :pull="0" tag="div">
            <el-form-item :rules="model.lock_time ? rules.flag:[{required: false, trigger: 'blur'}]" prop="flag" label="手动修改锁定时间">
              <el-switch v-model="model.flag" />
            </el-form-item>
          </el-col>
          <el-col :span="8" :offset="0" :push="0" :pull="0" tag="div">
            <el-form-item :rules="model.flag===true ? rules.lock_time:[{required: false, trigger: 'blur'}]" prop="lock_time" label="锁定时间节点">
              <el-date-picker v-model="model.lock_time" type="datetime" placeholder="请选择" value-format="yyyy-MM-dd HH:00:00" :style="{width: '100%'}" />
            </el-form-item>
          </el-col>
          <el-col :span="8" :offset="0" :push="0" :pull="0" tag="div">
            <el-form-item :rules="rules.remark" prop="remark" label="备注">
              <el-input v-model="model.remark" />
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
        <el-button @click="handleFormClose">关闭</el-button>
        <el-button v-if="dialogBtnType === true" type="primary" @click="addDataAndContinue">添加并继续</el-button>
        <el-button v-if="dialogBtnType === true" type="primary" @click="addData">添加</el-button>
        <el-button v-else-if="dialogBtnType === false" type="primary" @click="modifyData">确认修改</el-button>
      </span>
    </el-dialog>

    <el-dialog
      v-el-drag-dialog
      title="表格说明"
      :visible.sync="helpDialogVisible"
      width="60%"
      @dragDialog="handleDrag"
    >
      <p>自动备份的备份名为当前时间</p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="helpDialogVisible = false">关闭</el-button>
      </span>
    </el-dialog>

    <el-dialog
      v-el-drag-dialog
      title="备份数据"
      :visible.sync="backupDialog"
      width="30%"
      :before-close="handleCloseBackup"
      @dragDialog="handleDrag"
    >
      <span style="font-size:16px;">请输入备份名称：</span>
      <el-input v-model="backupName" placeholder="请输入" style="width: 200px;" />
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCloseBackup">关闭</el-button>
        <el-button type="primary" @click="confirmBackup">确定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      v-el-drag-dialog
      title="恢复备份"
      :visible.sync="recoverBackupDialog"
      width="30%"
      :before-close="handleCloseRecoverBackup"
      @dragDialog="handleDrag"
    >
      <span style="font-size:16px;">请选择备份名称：</span>
      <el-select v-model="backupName" placeholder="选择备份">
        <el-option
          v-for="item in backupOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <p>（注意：恢复备份将会覆盖当前表）</p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCloseRecoverBackup">关闭</el-button>
        <el-button type="primary" @click="confirmRecoverBackup">恢复</el-button>
      </span>
    </el-dialog>

    <el-dialog
      v-el-drag-dialog
      title="备份管理"
      :visible.sync="manageBackupDialog"
      width="40%"
      :before-close="handleCloseManageBackup"
      @dragDialog="handleDrag"
    >
      <el-table
        :header-cell-style="{background:'#eef1f6', color:'#606266', padding: '3px'}"
        :cell-style="{padding: '3px'}"
        :data="backupTableData"
        max-height="400px"
        @selection-change="handleBackupSelection"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="backup_name" label="备份名称" />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCloseManageBackup">关闭</el-button>
        <el-button type="danger" @click="deleteBackupData">删除</el-button>
      </span>
    </el-dialog>

    <el-dialog
      v-el-drag-dialog
      title="导入数据"
      :visible.sync="importDialogVisible"
      width="60%"
      :before-close="handleImportClose"
      @dragDialog="handleDrag"
    >
      <p style="font-size:16px;margin-bottom: 16px;">
        （原方式导入不用看这个）导入数据格式示例如下（仅支持.xlsx文件，列名需保持名称一致）：
      </p>
      <el-table
        :data="tableDataExample"
        :header-cell-style="{background:'#eef1f6',color:'#606266'}"
        :cell-style="setCellColor"
        border
      >
        <el-table-column prop="line_name" label="维护线体" width="110" />
        <el-table-column prop="start_time" label="开始时间" />
        <el-table-column prop="end_time" label="结束时间" />
        <el-table-column prop="lock_time" label="锁定时间" />
        <el-table-column prop="flag" label="手动修改锁定时间" width="200" />
        <el-table-column prop="remark" label="备注" />
      </el-table>
      <el-row>
        <el-col :span="10">
          <el-radio-group v-model="importMode" style="margin-top: 26px;">
            <el-radio label="original">原方式导入</el-radio>
            <el-radio label="add">追加数据</el-radio>
            <el-radio label="replace">替换数据</el-radio>
          </el-radio-group>
        </el-col>
        <el-col :span="4">
          <el-checkbox v-model="autoBackup" style="margin-top:26px;">自动备份</el-checkbox>
        </el-col>
        <el-col :span="9">
          <div style="display: flex;margin-top: 16px;margin-bottom: 16px;">
            <el-upload
              ref="upload"
              name="file"
              class="upload-demo"
              accept=".xlsx"
              action=""
              :on-change="handleChange"
              :auto-upload="false"
              :show-file-list="true"
              :file-list="uploadFileList"
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
        <el-button @click="handleImportClose">关闭</el-button>
        <el-button type="primary" @click="confirmImport">确认导入</el-button>
      </span>
    </el-dialog>

    <el-dialog
      v-el-drag-dialog
      title="导出数据"
      :visible.sync="exportDialogVisible"
      :before-close="handleExportClose"
      width="45%"
      @dragDialog="handleDrag"
    >
      <el-row>
        <span>导出文件格式：</span>
        <el-radio-group v-model="exportRadio">
          <el-radio label="xlsx">.xlsx</el-radio>
        </el-radio-group>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleExportClose">关闭</el-button>
        <el-button type="primary" @click="exportData">确认导出</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import XLSX from 'xlsx'
import { mapGetters } from 'vuex'
import { Loading } from 'element-ui'
// import { Loading } from 'element-ui'
import elDragDialog from '@/directive/el-drag-dialog'
import { GetTableData, AddData, ModifyData, DeleteData, HandleDelete, AddMultiData,
  ExportData, ImportData, GetBackupName, BackupData, RecoverBackupData, DeleteBackupData,
  GetDefaultData, SyncFormalData } from '@/api/DayConfig/BlockTimeData'
// import { lineOptions, LineOptions } from '@/utils/items'
export default {
  name: 'BlockTimeData',
  directives: { elDragDialog },
  data() {
    return {
      loading: true, // 表格加载动画
      importLoading: {
        text: '拼命导入中...',
        background: 'rgba(0, 0, 0, 0.5)'
      }, // 导入动画
      loadingInstance: null,
      table_data: [], // 表格数据
      tableDataExample: [
        {
          line_name: 'SM01',
          start_time: '	2022-10-01 08:00:00',
          end_time: '2022-10-05 08:00:00',
          lock_time: '2022-09-28 11:00:00',
          flag: 'FALSE',
          remark: '停机'
        }, {
          line_name: '(必填)',
          start_time: '(必填)',
          end_time: '(必填)',
          lock_time: '(选填)',
          flag: '(选填)  FALSE为关闭/TRUE为开启',
          remark: '(选填)'
        }
      ], // 示例的表格数据
      dialogTitle: '', // 表单dialog标题
      dataDialogVisible: false, // 表单dialog显示
      dialogBtnType: true, // 表单dialog按钮 true为添加按钮 false为保存按钮
      dialogMultiVisible: false, // 添加多个维护dialog
      helpDialogVisible: false, // 帮助提示dialog
      scopeIndex: '', // 表格行数index
      scopeRow: '', // 表格行数据
      importDialogVisible: false, // 导入数据dialog
      exportDialogVisible: false, // 导出dialog
      importType: false, // false为替换数据 true为添加数据
      uploadFileName: '', // 上传的文件名
      uploadFileList: [], // 上传的文件列表
      uploadFile: null, // 上传的文件
      importMode: 'original', // 导入方式选择:追加或替换（方便以后扩展）
      exportRadio: 'xlsx', // 导出格式选择（方便以后扩展）
      isClick: false, // 是否点击了保存或者提交
      // 添加多个维护
      dayTime: [],
      nightTime: [],
      maintainTime: [],
      customTime: [],
      tableDataMulti: [],
      customDateTime: [],
      customHourTime: [],
      // 表单相关数据
      forms: ['$form'],
      model: {
        id: '',
        line_name: '',
        start_time: '',
        end_time: '',
        flag: false,
        lock_time: '',
        remark: '',
        CREATED_BY: '',
        CREATED_TIME: '',
        UPDATED_BY: '',
        UPDATED_TIME: ''
      },
      // 修改前的表单内容，用于对比表单前后的变化（应用：关闭前提示修改未保存）
      modelOriginal: {
        id: '',
        line_name: '',
        start_time: '',
        end_time: '',
        flag: false,
        lock_time: '',
        remark: '',
        CREATED_BY: '',
        CREATED_TIME: '',
        UPDATED_BY: '',
        UPDATED_TIME: ''
      },
      rules: {
        line_name: [{
          required: true,
          message: '维护线体不能为空',
          trigger: 'blur'
        }],
        start_time: [{
          required: true,
          message: '开始时间不能为空',
          trigger: 'blur'
        }],
        end_time: [{
          required: true,
          message: '结束时间不能为空',
          trigger: 'blur'
        }],
        flag: [{
          required: true,
          message: '请开启手动修改锁定时间',
          trigger: 'blur'
        }],
        lock_time: [{
          required: true,
          message: '请填写锁定时间节点',
          trigger: 'blur'
        }],
        remark: [],
        CREATED_BY: [],
        CREATED_TIME: [],
        UPDATED_BY: [],
        UPDATED_TIME: []
      },
      lineOptions: [], // 维护线别
      lineOptions_2: [],
      // 分页相关
      total_num: 0, // 总共有多少条数据(后端返回)
      currentPage: 1, // 当前在第几页
      pageSize: 200, // 每页多少条数据
      dataTableSelections: [], // 表格选中的数据
      // 备份相关
      backupOptions: [], // 恢复备份选项
      backupName: '', // 备份名
      backupDialog: false, // 备份数据dialog
      recoverBackupDialog: false, // 恢复备份dialog
      manageBackupDialog: false, // 备份管理dialog
      backupTableData: [], // 备份管理数据
      backupTableSelections: [], // 备份管理选中的数据
      autoBackup: true // 是否自动备份，默认开启
    }
  },
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  created() {
    this.getTableData(this.currentPage, this.pageSize)
    this.getDefaultData()
    this.initializeDate()
  },
  mounted() {
    // this.getTableData(this.currentPage, this.pageSize)
  },
  methods: {
    // 全选维护时间
    renderHeaderDay() {
      return (
        <div>
          <el-button size='mini' onClick={() => this.handleChooseAllDay()}>全选</el-button>
        </div>
      )
    },
    // 获取初始化数据
    getDefaultData() {
      GetDefaultData().then(res => {
        if (res.code === 20000) {
          this.lineOptions = res.data
          this.lineOptions_2 = res.data2
        }
      }).catch(() => {
        this.$message({
          type: 'error',
          message: '初始化数据出错'
        })
      })
    },
    handleChooseAllDay() {
      for (const key in this.tableDataMulti) {
        this.tableDataMulti[key].dayTime = !this.tableDataMulti[key].dayTime
      }
    },
    renderHeaderNight() {
      return (
        <div>
          <el-button size='mini' onClick={() => this.handleChooseAllNight()}>全选</el-button>
        </div>
      )
    },
    handleChooseAllNight() {
      for (const key in this.tableDataMulti) {
        this.tableDataMulti[key].nightTime = !this.tableDataMulti[key].nightTime
      }
    },
    renderHeaderMaintain() {
      return (
        <div>
          <el-button size='mini' onClick={() => this.handleChooseAllMaintain()}>全选</el-button>
        </div>
      )
    },
    handleChooseAllMaintain() {
      for (const key in this.tableDataMulti) {
        this.tableDataMulti[key].maintainTime = !this.tableDataMulti[key].maintainTime
      }
    },
    renderHeaderCustom() {
      return (
        <div>
          <el-button size='mini' onClick={() => this.handleChooseAllCustom()}>全选</el-button>
        </div>
      )
    },
    handleChooseAllCustom() {
      for (const key in this.tableDataMulti) {
        this.tableDataMulti[key].customTime = !this.tableDataMulti[key].customTime
      }
    },
    renderHeaderCustom2() {
      return (
        <div>
          <el-button size='mini' onClick={() => this.handleChooseAllCustom2()}>全选</el-button>
        </div>
      )
    },
    handleChooseAllCustom2() {
      for (const key in this.tableDataMulti) {
        this.tableDataMulti[key].customTime2 = !this.tableDataMulti[key].customTime2
      }
    },
    // dialog可拖拽
    handleDrag() {
      // // this.$refs.select.blur()
    },
    // 示例表格行颜色
    setCellColor({ row, column, rowIndex, columnIndex }) {
      if (rowIndex === 1 && columnIndex <= 2) {
        return 'color: #F56C6C;font-weight: bold;'
      } else if (rowIndex === 1 && columnIndex > 2) {
        return 'color: #E6A23C;font-weight: bold;'
      }
      return ''
    },
    // 初始化日期
    initializeDate() {
      // 初始化白班早下班时间区间
      const date_start_1 = new Date()
      const date_end_1 = new Date()
      date_start_1.setHours(16, 30, 0)
      this.dayTime.push(date_start_1)
      date_end_1.setHours(20, 0, 0)
      this.dayTime.push(date_end_1)
      // 初始化夜班早下班时间区间
      const date_start_2 = new Date()
      const date_end_2 = new Date()
      date_start_2.setDate(date_start_2.getDate() + 1)
      date_start_2.setHours(5, 30, 0)
      this.nightTime.push(date_start_2)
      date_end_2.setDate(date_end_2.getDate() + 1)
      date_end_2.setHours(8, 0, 0)
      this.nightTime.push(date_end_2)
      // 初始化白班保养时间区间
      const date_start_3 = new Date()
      const date_end_3 = new Date()
      date_start_3.setHours(8, 0, 0)
      this.maintainTime.push(date_start_3)
      date_end_3.setHours(20, 0, 0)
      this.maintainTime.push(date_end_3)
      // 初始化自定义时间(方式一)
      const date_start_4 = new Date()
      const date_end_4 = new Date()
      date_start_4.setHours(8, 0, 0)
      this.customTime.push(date_start_4)
      date_end_4.setHours(20, 0, 0)
      this.customTime.push(date_end_4)
      // 初始化自定义时间(方式二)
      const date_start_5 = new Date()
      const date_end_5 = new Date()
      date_start_5.setHours(8, 0, 0)
      this.customDateTime.push(date_start_5)
      this.customHourTime.push(date_start_5)
      date_end_5.setHours(20, 0, 0)
      this.customDateTime.push(date_end_5)
      this.customHourTime.push(date_end_5)
    },
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
          this.total_num = res.total_num
          this.loading = false
        }
      })
    },
    // 刷新表格数据
    refreshTableData(isAddData = false) {
      if (isAddData) { // 如果是导入/添加/点击刷新按钮，刷新时返回第一页
        this.currentPage = 1
        this.getTableData(1, this.pageSize)
      } else { // 否则只刷新当前页
        this.getTableData(this.currentPage, this.pageSize)
      }
    },
    // 添加数据
    addDataDialog() {
      this.dialogTitle = '添加数据'
      this.dialogBtnType = true
      this.dataDialogVisible = true
      this.isClick = false
    },
    // 添加数据
    addData() {
      this.isClick = true
      const data = this.model
      data['user_name'] = this.name
      this.$refs['$form'].validate((valid) => {
        if (valid) {
          AddData(data).then(res => {
            if (res.code === 20000) {
              this.$notify({
                title: '添加成功',
                message: '成功添加 1 条数据',
                type: 'success'
              })
              setTimeout(() => {
                this.closeFormDialog()
              }, 1000)
              this.refreshTableData(true)
            }
          })
        } else {
          this.$message({
            type: 'error',
            message: '提交失败，请按照要求填写数据！'
          })
        }
      })
    },
    // 添加数据并继续添加下一个
    addDataAndContinue() {
      this.isClick = true
      const data = this.model
      data['user_name'] = this.name
      this.$refs['$form'].validate((valid) => {
        if (valid) {
          AddData(data).then(res => {
            if (res.code === 20000) {
              this.$notify({
                title: '添加成功',
                message: '成功添加 1 条数据',
                type: 'success'
              })
              for (const key in this.model) {
                if (key === 'flag') {
                  this.model[key] = false
                  this.modelOriginal[key] = false
                } else {
                  this.model[key] = ''
                  this.modelOriginal[key] = ''
                }
              }
              this.isClick = false
              this.$refs['$form'].clearValidate() // 清除表单验证的文字提示信息
              this.refreshTableData(true)
            }
          })
        } else {
          this.$message({
            type: 'error',
            message: '提交失败，请按照要求填写数据！'
          })
        }
      })
    },
    // 添加多个线体维护
    // 创建多个维护表选项
    generateMultiTable() {
      this.tableDataMulti = []
      for (const key in this.lineOptions_2) {
        const temp = {}
        temp['line_name'] = this.lineOptions_2[key]
        temp['dayTime'] = false
        temp['nightTime'] = false
        temp['maintainTime'] = false
        temp['customTime'] = false
        temp['customTime2'] = false
        this.tableDataMulti.push(temp)
      }
    },
    addMultiDataDialog() {
      this.generateMultiTable()
      this.dialogMultiVisible = true
    },
    addMultiData() {
      const data = {
        'user_name': this.name,
        'day_time': this.dayTime,
        'night_time': this.nightTime,
        'maintain_time': this.maintainTime,
        'custom_time': this.customTime,
        'custom_date_time': this.customDateTime,
        'custom_hour_time': this.customHourTime,
        'block_time_data': this.tableDataMulti
      }
      console.log('时间数据:', data)
      AddMultiData(data).then(res => {
        if (res.code === 20000) {
          this.$notify({
            title: '添加成功',
            message: '成功添加 ' + res.count + ' 个维护数据',
            type: 'success'
          })
          this.refreshTableData(true)
        }
      })
    },
    handleMultiClose() {
      this.dialogMultiVisible = false
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
      this.$confirm('确定要删除选中的 ' + dataLength + ' 条数据？', '提示', {
        confirmButtonText: '确定删除',
        cancelButtonText: '取消',
        confirmButtonClass: 'btnDanger',
        type: 'warning'
      }).then(() => {
        const data = { 'id_list': idList, 'user_name': this.name }
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
    handleModify(index, row) {
      // 修改dialog
      this.dialogTitle = '修改数据'
      this.dialogBtnType = false
      this.scopeIndex = index
      this.scopeRow = row
      // 显示表单数据
      // 显示表单数据
      for (const key in this.model) {
        this.model[key] = row[key]
      }
      // 保存原来的表单数据，用于对比变化
      for (const key in this.modelOriginal) {
        this.modelOriginal[key] = this.model[key]
      }
      // 显示dialog
      this.dataDialogVisible = true
      this.isClick = false
    },
    // 编辑数据发送到后端保存
    modifyData() {
      if (!this.checkFormChange()) {
        this.$message({
          type: 'info',
          message: '数据未修改，无需提交'
        })
        return
      }
      this.isClick = true
      const data = this.model
      data['user_name'] = this.name
      this.$refs['$form'].validate((valid) => {
        if (valid) {
          ModifyData(data).then(res => {
            if (res.code === 20000) {
              this.$notify({
                title: res.message,
                message: '数据已修改',
                type: 'success'
              })
              this.refreshTableData()
            }
          })
        } else {
          this.$message({
            type: 'error',
            message: '提交失败，请按照要求填写数据！'
          })
        }
      })
    },
    // 以下是备份数据相关
    getBackupName() {
      GetBackupName().then(res => {
        if (res.code === 20000) {
          this.backupOptions = res.backup_options
          this.backupTableData = res.backup_table_data
        }
      })
    },
    handleCloseBackup() {
      this.backupDialog = false
      this.backupName = ''
    },
    backupData() {
      this.backupDialog = true
    },
    confirmBackup() {
      BackupData({ 'user_name': this.name, 'backup_name': this.backupName }).then(res => {
        if (res.code === 20000) {
          this.$notify({
            title: res.title,
            message: res.message,
            type: 'success'
          })
          setTimeout(() => {
            this.handleCloseBackup()
          }, 1000)
        }
      })
    },
    handleCloseRecoverBackup() {
      this.recoverBackupDialog = false
      this.backupName = ''
    },
    recoverBackupData() {
      this.getBackupName()
      this.recoverBackupDialog = true
    },
    confirmRecoverBackup() {
      RecoverBackupData({ 'backup_name': this.backupName, 'user_name': this.name }).then(res => {
        if (res.code === 20000) {
          this.$notify({
            title: res.title,
            message: res.message,
            type: 'success'
          })
          this.refreshTableData(true)
        }
      })
    },
    manageBackupData() {
      this.getBackupName()
      this.manageBackupDialog = true
    },
    handleCloseManageBackup() {
      this.manageBackupDialog = false
    },
    handleBackupSelection(val) {
      this.backupTableSelections = val
    },
    deleteBackupData() {
      const dataLength = this.backupTableSelections.length
      if (dataLength === 0) {
        this.$message({
          type: 'warning',
          message: '请至少选中一条数据'
        })
        return
      }
      const nameList = []
      for (let i = 0; i < dataLength; i++) {
        nameList.push(this.backupTableSelections[i].backup_name)
      }
      this.$confirm('确定要删除选中的 ' + dataLength + ' 个备份？', '提示', {
        confirmButtonText: '确定删除',
        cancelButtonText: '取消',
        confirmButtonClass: 'btnDanger',
        type: 'warning'
      }).then(() => {
        const data = { 'name_list': nameList, 'user_name': this.name }
        DeleteBackupData(data).then(res => {
          if (res.code === 20000) {
            this.$notify({
              title: '删除成功',
              message: '成功删除选中的 ' + dataLength + ' 个备份',
              type: 'success'
            })
            this.getBackupName()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消删除'
        })
      })
    },
    // 检测表单数据是否发生变化，用于提示
    checkFormChange() {
      let isChange = false
      for (const key in this.model) {
        if (this.model[key] !== this.modelOriginal[key]) {
          isChange = true
          break
        }
      }
      return isChange
    },
    // 表单dialog关闭前提示
    handleFormClose() {
      if (this.checkFormChange() && !this.isClick) {
        this.$confirm('数据未提交，确定要关闭窗口？', '提示', {
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
      for (const key in this.model) {
        if (key === 'flag') {
          this.model[key] = false
          this.modelOriginal[key] = false
        } else {
          this.model[key] = ''
          this.modelOriginal[key] = ''
        }
      }
      this.$refs['$form'].clearValidate() // 清除表单验证的文字提示信息
    },
    // 表格中删除数据
    handleDelete(index, row) {
      this.$confirm('确定要删除该数据？', '提示', {
        confirmButtonText: '确定删除',
        cancelButtonText: '取消',
        confirmButtonClass: 'btnDanger',
        type: 'warning'
      }).then(() => {
        const data = {}
        data['id'] = row.id
        data['line_name'] = row.line_name
        data['user_name'] = this.name
        HandleDelete(data).then(res => {
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
    importDataDialog() {
      this.importDialogVisible = true
    },
    // 确认导入
    confirmImport() {
      if (this.importMode === 'replace' || this.importMode === 'original') {
        this.$confirm('此操作将会清空所有原有内容, 确定要进行替换操作？', '提示', {
          confirmButtonText: '确定替换',
          cancelButtonText: '取消',
          confirmButtonClass: 'btnDanger',
          type: 'warning'
        }).then(() => {
          this.importData()
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消导入'
          })
        })
      } else {
        this.importData()
      }
    },
    // 导入数据
    importData() {
      // this.loadingInstance = Loading.service(this.importLoading)
      const form = new FormData()
      form.append('file', this.uploadFile)
      form.append('file_name', this.uploadFileName)
      form.append('user_name', this.name)
      form.append('import_mode', this.importMode)
      form.append('auto_backup', this.autoBackup)
      ImportData(form).then(res => {
        if (res.code === 20000) {
          this.$alert('本次共导入了 ' + res.data_count + ' 条数据', res.message, {
            confirmButtonText: '确定',
            type: 'success'
          })
          // this.loadingInstance.close() // 清除动画
          // 1秒后自动关闭窗口
          setTimeout(() => {
            this.handleImportClose()
          }, 1000)
          this.refreshTableData(true)
        }
      }).catch(err => {
        this.loadingInstance.close() // 清除动画
        this.$alert(err, '错误', {
          confirmButtonText: '确定',
          type: 'error'
        })
      })
    },
    // 导入数据窗口关闭
    handleImportClose() {
      this.importDialogVisible = false
      // 清理已上传文件
      this.$refs.upload.clearFiles()
      this.uploadFileName = ''
      this.uploadFile = null
    },
    // 获取上传文件
    handleChange(file, fileList) {
      if (fileList.length > 0) {
        this.uploadFileList = [fileList[fileList.length - 1]] // 选择最后一次选择文件
        this.uploadFileName = this.uploadFileList[0].name // 更新文件名
        this.uploadFile = this.uploadFileList[0].raw // 更新文件
      }
    },
    // 数据库导出到Excel
    exportDataDialog() {
      this.exportDialogVisible = true
    },
    // 确认导出
    exportData() {
      ExportData().then(res => {
        if (res.code === 20000) {
          const dataCount = res.data_count
          const sheetData = res.table_data
          const fields = res.fields
          const tableName = res.table_name
          const fields_display = res.fields_display
          const newData = [fields_display, ...sheetData]
          const sheet = XLSX.utils.json_to_sheet(newData, { header: fields, skipHeader: true })
          const wb = XLSX.utils.book_new()
          XLSX.utils.book_append_sheet(wb, sheet, tableName)
          XLSX.writeFile(wb, tableName + '.xlsx')
          this.$notify({
            title: '导出成功',
            message: '本次共导出了 ' + dataCount + ' 条数据',
            type: 'success'
          })
          // 1秒后自动关闭窗口
          setTimeout(() => {
            this.handleExportClose() // 导出后自动关闭窗口
          }, 1000)
        }
      })
    },
    // 测试库同步正式库的维护时间表（提示）
    beforeSyncFormalData() {
      this.$confirm('确定要同步正式库的维护时间表？', '提示', {
        confirmButtonText: '确定同步',
        cancelButtonText: '取消',
        confirmButtonClass: 'btnDanger',
        type: 'warning'
      }).then(() => {
        this.syncFormalData()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消同步'
        })
      })
    },
    // 测试库同步正式库的维护时间表
    syncFormalData() {
      const syncLoading = {
        text: '拼命同步中...',
        background: 'rgba(0, 0, 0, 0.6)'
      }
      this.loadingInstance = Loading.service(syncLoading)
      SyncFormalData().then(res => {
        if (res.code === 20000) {
          this.loadingInstance.close() // 清除动画
          this.$alert(res.message, '提示', {
            confirmButtonText: '确定',
            type: 'success'
          })
          this.refreshTableData(true)
        }
      }).catch(err => {
        this.loadingInstance.close() // 清除动画
        this.$alert(err, '错误', {
          confirmButtonText: '确定',
          type: 'error'
        })
      })
    },
    // 导入数据窗口关闭
    handleExportClose() {
      this.exportDialogVisible = false
    },
    // 帮助提示按钮
    helpTips() {
      this.helpDialogVisible = true
    }
  }
}
</script>
<style lang="scss" scoped>
  @import '../../assets/css/DayConfig/BlockTimeData.scss';
</style>
<style>
.btnDanger{
  background-color: #F56C6C !important;
  border-color: #F56C6C !important;
}
.btnDanger:hover{
  background-color: #f04747 !important;
  border-color: #f04747 !important;
}
.el-pagination {
    text-align: center;
}

.upload-demo {
  display: flex;
 }
.el-list-enter-active,
.el-list-leave-active {
  transition: none;
}
.el-list-enter,
.el-list-leave-active {
  opacity: 0;
}
.el-upload-list {
  height: 40px;
 }

.el-table .warning-row {
  color: #E6A23C;
}

</style>
