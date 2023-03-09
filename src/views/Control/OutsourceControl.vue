<template>
  <div id="main">
    <el-row :gutter="16" style="margin-right: 10px;margin-top: 16px;">
      <el-col :span="8">
        <el-card class="card-progress">
          <div slot="header" class="clearfix">
            <span>任务进度</span>
          </div>
          <el-progress
            :text-inside="true"
            :stroke-width="16"
            :percentage="percentage_3"
            :color="progressColor"
            class="layui-progress-bar"
            style="margin-top: 0px;"
            :indeterminate="true"
          />
          <el-alert
            style="color: #303133;"
            :title="progress_text_3"
            type="info"
            center
            :closable="false"
          />
          <el-progress
            :text-inside="true"
            :stroke-width="16"
            :percentage="percentage_5"
            :color="progressColor"
            class="layui-progress-bar"
          />
          <el-alert
            style="color: #303133;"
            :title="progress_text_5"
            type="info"
            center
            :closable="false"
          />
        </el-card>
      </el-col>
      <el-col :span="16">
        <el-card class="control">
          <div slot="header" class="clearfix">
            <span>控制中心</span>
          </div>
          <el-row>
            <el-col :span="24">
              <!-- <el-alert
                title="外包计算"
                type="info"
                :closable="false"
                style="margin-bottom: 10px;"
              /> -->
              <el-steps :active="stepNow" :align-center="false" finish-status="success" simple>
                <el-step title="导入文件" />
                <el-step title="组件筛选" />
                <el-step title="更新新机种" />
                <el-step title="生成分工单" />
                <el-step title="计算排程" />
                <el-step title="输出文件" />
              </el-steps>
              <div class="box-button">
                <el-row>
                  <el-col :span="24">
                    <el-button type="primary" plain @click="importDialog">
                      1.导入输入文件
                    </el-button>
                    <el-button type="primary" plain @click="doFilterRules">
                      2.组件筛选
                    </el-button>
                    <el-button type="primary" plain @click="updateNewModels">
                      3.更新新机种
                    </el-button>
                    <el-button type="primary" plain @click="generateDivisions">
                      4.生成分工单
                    </el-button>
                    <el-button type="primary" plain @click="computeDialog">
                      5.开始计算
                    </el-button>
                    <el-button type="success" @click="generateOutput">
                      6.输出文件
                    </el-button>
                    <el-button plain @click="showFilterRules">
                      显示筛选规则
                    </el-button>
                  </el-col>
                </el-row>
              </div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-alert
                title="外包文件下载"
                type="info"
                :closable="false"
                style="margin-bottom: 10px;"
              />
              <div class="box-button">
                <el-row>
                  <el-col :span="24">
                    <!-- <el-button type="primary" plain @click="downloadFile">
                      <i class="el-icon-download" />
                      下载xx文件
                    </el-button> -->
                    <el-button type="success" @click="downloadAllFile">
                      <i class="el-icon-download" />
                      下载全部输出文件
                    </el-button>
                  </el-col>
                </el-row>
              </div>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
    </el-row>

    <el-dialog
      v-el-drag-dialog
      title="导入输入文件"
      :visible.sync="dialogVisibleImport"
      width="60%"
      :close-on-click-modal="false"
      :before-close="handleCloseImport"
      @dragDialog="handleDrag"
    >
      <el-row style="margin-bottom: 10px">
        <el-col :span="8">
          <el-upload
            class="upload-demo"
            action=""
            accept=".xlsx,.xls"
            :auto-upload="false"
            multiple
            :limit="1"
            :on-exceed="handleExceed_1"
            :on-remove="handleRemoveSummary"
            :on-change="handleChangeSummary"
            :file-list="fileListSummary"
          >
            <el-button type="primary">点击上传“业务排程汇总”</el-button>
            <div slot="tip" class="el-upload__tip">只能上传.xlsx文件，最多可上传1份</div>
          </el-upload>
        </el-col>
        <el-col :span="8">
          <el-upload
            class="upload-demo"
            action=""
            accept=".xlsx,.xls"
            :auto-upload="false"
            multiple
            :limit="1"
            :on-exceed="handleExceed_1"
            :on-remove="handleRemoveCustomer"
            :on-change="handleChangeCustomer"
            :file-list="fileListCustomer"
          >
            <el-button type="primary">点击上传“客户表”</el-button>
            <div slot="tip" class="el-upload__tip">只能上传.xlsx文件，最多可上传1份</div>
          </el-upload>
        </el-col>
        <el-col :span="8">
          <el-upload
            class="upload-demo"
            action=""
            accept=".xlsx,.xls"
            :auto-upload="false"
            multiple
            :limit="1"
            :on-exceed="handleExceed_1"
            :on-remove="handleRemoveSchedule"
            :on-change="handleChangeSchedule"
            :file-list="fileListSchedule"
          >
            <el-button type="primary">点击上传“业务排程明细”</el-button>
            <div slot="tip" class="el-upload__tip">只能上传.xlsx文件，最多可上传1份</div>
          </el-upload>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-upload
            class="upload-demo"
            action=""
            accept=".xlsx,.xls"
            :auto-upload="false"
            multiple
            :limit="5"
            :on-exceed="handleExceed_5"
            :on-remove="handleRemoveOldOrder"
            :on-change="handleChangeOldOrder"
            :file-list="fileListOldOrder"
          >
            <el-button type="primary">点击上传“旧工单”</el-button>
            <div slot="tip" class="el-upload__tip">只能上传.xlsx文件，最多可上传5份</div>
          </el-upload>
        </el-col>
      </el-row>

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" style="margin-left:10px;" @click="beforeImport">
          导入文件
        </el-button>
        <el-button @click="handleCloseImport">
          关闭
        </el-button>
      </span>
    </el-dialog>

    <el-dialog
      v-el-drag-dialog
      title="计算外包"
      :visible.sync="dialogVisibleCompute"
      width="30%"
      :close-on-click-modal="false"
      :before-close="handleCloseCompute"
      @dragDialog="handleDrag"
    >
      <el-row>
        <el-col :span="24">
          <el-radio-group v-model="componentType">
            <el-radio :label="1">SMT主板</el-radio>
            <el-radio :label="2">SMT小板</el-radio>
            <el-radio :label="3">AI</el-radio>
            <el-radio :label="4">SMT点胶</el-radio>
          </el-radio-group>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-radio-group v-model="runMode">
            <el-radio :label="1">自制优先</el-radio>
            <el-radio :label="2">外包优先</el-radio>
          </el-radio-group>
        </el-col>
      </el-row>

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="beforeDoOutsourceDistribute">
          开始计算
        </el-button>
        <el-button @click="handleCloseCompute">
          关闭
        </el-button>
      </span>
    </el-dialog>

    <el-dialog
      v-el-drag-dialog
      title="筛选规则"
      :visible.sync="dialogVisibleRules"
      width="60%"
      :close-on-click-modal="false"
      :before-close="handleCloseRules"
      @dragDialog="handleDrag"
    >
      <el-table
        id="mytable"
        :data="table_data_rules"
        :header-cell-style="{background:'#eef1f6',color:'#606266', padding: '6px'}"
        :cell-style="{padding: '3px'}"
      >
        <el-table-column prop="name" width="120" label="组件类型" />
        <el-table-column prop="reject" label="剔除规则" />
        <el-table-column prop="receive" label="保留规则" />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCloseRules">
          关闭
        </el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { Loading } from 'element-ui'
import elDragDialog from '@/directive/el-drag-dialog'
import { GetProgress, ImportFiles, GeScheduleRes, DoOutsourceDistribute, GnerateDivisions, DownloadAllFile, DownloadFile,
  ShowFilterRules, UpdateNewModels, DoFilterRules, GenerateOutput, SaveStepNow, GetBaseData } from '@/api/Control/OutsourceControl'
export default {
  name: 'OutsourceControl',
  directives: { elDragDialog },
  data() {
    return {
      progressColor: '#02bafd', // 进度条颜色

      dialogVisibleImport: false, // 计算主板排程dialog
      importLoading: {
        text: '拼命导入中...',
        background: 'rgba(0, 0, 0, 0.5)'
      }, // 导入排程动画
      loadingInstance: null, // 动画实例

      // 进度条相关
      percentage_3: 0,
      percentage_5: 0,
      progress_text_3: '未开始生成分工单|0%',
      progress_text_5: '未开始输出文件|0%',
      // 排程结果
      schedule_run_time: '未开始', // 排程时间 未开始 计算完毕，共耗时：00 时 00 分 00 秒
      schedule_time: '', // 排程时间
      schedule_mode: '', // 正排或预排
      schedule_result: [{
        schedule_type: '',
        obj_value: '',
        idle_value: '',
        overdue_value: '',
        enable: '',
        line_balance: ''
      }],
      progress_refresh: null, // 刷新进度条

      stepNow: 0, // 导航条
      fileListSummary: [], // 业务排程汇总
      fileListCustomer: [], // 客户表
      fileListSchedule: [], // 业务排程明细
      fileListOldOrder: [], // 旧工单
      componentType: 1,
      runMode: 1,
      formData: new FormData(),
      dialogVisibleCompute: false,
      dialogVisibleRules: false,
      table_data_rules: [] // 显示筛选规则

    }
  },
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  created() {
    this.listenProgress()
    this.getBaseData()
  },
  mounted() {

  },
  methods: {
    getBaseData() {
      GetBaseData().then(res => {
        this.stepNow = res.step_now
      })
    },
    // 显示筛选规则
    handleCloseRules() {
      this.dialogVisibleRules = false
    },
    // 文件超过1
    handleExceed_1(files, fileList) {
      this.$message.warning(`限制上传 1 个文件，本次上传了 ${files.length} 个文件，共上传了 ${files.length + fileList.length} 个文件`)
    },
    // 文件超过5
    handleExceed_5(files, fileList) {
      this.$message.warning(`限制上传 5 个文件，本次上传了 ${files.length} 个文件，共上传了 ${files.length + fileList.length} 个文件`)
    },
    handleChangeSummary(files, fileList) {
      var file = new File([files.raw], `Summary-${files.name}`)
      this.formData.append('files', file)
      this.fileListSummary = fileList
    },
    handleChangeCustomer(files, fileList) {
      var file = new File([files.raw], `Customer-${files.name}`)
      this.formData.append('files', file)
      this.fileListCustomer = fileList
    },
    handleChangeSchedule(files, fileList) {
      var file = new File([files.raw], `Schedule-${files.name}`)
      this.formData.append('files', file)
      this.fileListSchedule = fileList
    },
    handleChangeOldOrder(files, fileList) {
      var file = new File([files.raw], `OldOrder-${files.name}`)
      this.formData.append('files', file)
      this.fileListOldOrder = fileList
    },
    handleRemoveSummary(file, fileList) {
      for (var key of this.formData.keys()) {
        const dict = this.formData.get(key)
        if ((dict.name.indexOf(file.name) !== -1)) {
          this.formData.delete(key)
        }
      }
      this.fileListSummary = fileList
    },
    handleRemoveCustomer(file, fileList) {
      for (var key of this.formData.keys()) {
        const dict = this.formData.get(key)
        if ((dict.name.indexOf(file.name) !== -1)) {
          this.formData.delete(key)
        }
      }
      this.fileListCustomer = fileList
    },
    handleRemoveSchedule(file, fileList) {
      for (var key of this.formData.keys()) {
        const dict = this.formData.get(key)
        if ((dict.name.indexOf(file.name) !== -1)) {
          this.formData.delete(key)
        }
      }
      this.fileListSchedule = fileList
    },
    handleRemoveOldOrder(file, fileList) {
      for (var key of this.formData.keys()) {
        const dict = this.formData.get(key)
        if ((dict.name.indexOf(file.name) !== -1)) {
          this.formData.delete(key)
        }
      }
      this.fileListOldOrder = fileList
    },
    // dialog可拖拽
    handleDrag() {
      // this.$refs.select.blur()
    },
    // 监听进度条
    listenProgress() {
      this.progress_refresh = setInterval(() => { // 每隔2秒监听进度条
        setTimeout(this.getProgress(), 0)
      }, 2000)
    },
    // 取消监听进度条
    clearListenProgress() {
      clearInterval(this.progress_refresh)
      this.progress_refresh = null
    },
    handleCloseCompute() {
      this.dialogVisibleCompute = false
    },
    // 获取排程结果
    getScheduleRes() {
      GeScheduleRes().then(res => {
        if (res.code === 20000) {
          this.schedule_result = res.table_data
          this.schedule_mode = res.mode
          this.schedule_time = res.date
        }
      })
    },
    // 获取进度条
    getProgress() {
      GetProgress().then(res => {
        // 更新进度条
        this.percentage_3 = res.data.p3
        this.progress_text_3 = res.data.p3text
        this.percentage_5 = res.data.p5
        this.progress_text_5 = res.data.p5text
      })
    },
    // 计算外包dialog
    importDialog() {
      this.dialogVisibleImport = true
    },
    computeDialog() {
      this.dialogVisibleCompute = true
    },
    // 关闭计算主板
    handleCloseImport() {
      this.dialogVisibleImport = false
    },
    // 导入文件之前
    beforeImport() {
      const fileLength = this.fileListSummary.length + this.fileListCustomer.length + this.fileListSchedule.length + this.fileListOldOrder.length
      if (fileLength < 1) {
        this.$message({
          type: 'warning',
          message: '请至少上传 1 份文件后再进行导入'
        })
        return
      } else {
        this.submitUploadFile()
      }
    },
    // 导入排程
    async submitUploadFile() {
      this.loadingInstance = Loading.service(this.importLoading)
      setTimeout(() => {
        this.handleCloseImport()
      }, 1000)
      await ImportFiles(this.formData).then(res => {
        this.loadingInstance.close()
        this.$message({
          message: res.message,
          type: 'success'
        })
        SaveStepNow({ 'step_now': 1 }).then(res => {
          this.stepNow = 1
        })
      }).catch(err => {
        this.loadingInstance.close() // 清除动画
        this.$alert(err, '错误', {
          confirmButtonText: '确定',
          type: 'error'
        })
      })
    },
    // 组件筛选
    doFilterRules() {
      if (this.stepNow < 1) {
        this.$message({
          message: '请先导入输入文件',
          type: 'warning'
        })
        return
      }
      const loadingMessage = {
        text: '组件筛选中...',
        background: 'rgba(0, 0, 0, 0.5)'
      }
      this.loadingInstance = Loading.service(loadingMessage)
      DoFilterRules().then(res => {
        this.loadingInstance.close()
        this.$alert(res.message, res.message_title, {
          confirmButtonText: '确定',
          type: res.message_type
        })
        SaveStepNow({ 'step_now': 2 }).then(res => {
          this.stepNow = 2
        })
      }).catch(err => {
        this.loadingInstance.close()
        this.$alert(err, '错误', {
          confirmButtonText: '确定',
          type: 'error'
        })
      })
    },
    // 更新新机种
    updateNewModels() {
      if (this.stepNow < 2) {
        this.$message({
          message: '请先进行组件筛选',
          type: 'warning'
        })
        return
      }
      const loadingMessage = {
        text: '更新新机种中...',
        background: 'rgba(0, 0, 0, 0.5)'
      }
      this.loadingInstance = Loading.service(loadingMessage)
      UpdateNewModels().then(res => {
        this.loadingInstance.close()
        this.$alert(res.message, res.message_title, {
          confirmButtonText: '确定',
          type: res.message_type
        })
        SaveStepNow({ 'step_now': 3 }).then(res => {
          this.stepNow = 3
        })
      }).catch(err => {
        this.loadingInstance.close()
        this.$alert(err, '错误', {
          confirmButtonText: '确定',
          type: 'error'
        })
      })
    },
    // 显示筛选规则
    showFilterRules() {
      this.dialogVisibleRules = true
      const loadingMessage = {
        text: '获取中...',
        background: 'rgba(0, 0, 0, 0.5)'
      }
      this.loadingInstance = Loading.service(loadingMessage)
      ShowFilterRules().then(res => {
        this.table_data_rules = res.components
        this.loadingInstance.close()
        this.$message({
          message: res.message,
          type: res.message_type
        })
      }).catch(err => {
        this.loadingInstance.close()
        this.$alert(err, '错误', {
          confirmButtonText: '确定',
          type: 'error'
        })
      })
    },
    // 生成分工单
    generateDivisions() {
      if (this.stepNow < 3) {
        this.$message({
          message: '请先更新新机种',
          type: 'warning'
        })
        return
      }
      this.listenProgress()
      GnerateDivisions().then(res => {
        this.clearListenProgress()
        this.$alert(res.message, res.message_title, {
          confirmButtonText: '确定',
          type: res.message_type
        })
        SaveStepNow({ 'step_now': 4 }).then(res => {
          this.stepNow = 4
        })
      }).catch(err => {
        this.$alert(err, '错误', {
          confirmButtonText: '确定',
          type: 'error'
        })
      })
    },
    // 计算之前的确认
    beforeDoOutsourceDistribute() {
      if (this.stepNow < 4) {
        this.$message({
          message: '请先生成分工单',
          type: 'warning'
        })
        return
      }
      const map_1 = {
        1: 'SMT主板',
        2: 'SMT小板',
        3: 'AI',
        4: 'SMT点胶'
      }
      const map_2 = {
        1: '自制优先',
        2: '外包优先'
      }
      this.$confirm('提示', {
        title: '提示',
        message: '请确认以下配置项：' + map_1[this.componentType] + '、' + map_2[this.runMode],
        confirmButtonText: '确定',
        cancelButtonText: '重新选择',
        type: 'warning'
      }).then(() => {
        this.doOutsourceDistribute()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消计算，请重新选择配置'
        })
      })
    },
    // 开始计算
    doOutsourceDistribute() {
      const loadingMessage = {
        text: '计算中...',
        background: 'rgba(0, 0, 0, 0.5)'
      }
      this.loadingInstance = Loading.service(loadingMessage)
      const form = {}
      form['component_type'] = this.componentType // ["SMT主板", "SMT小板", "AI", "SMT点胶"]
      form['run_mode'] = this.runMode // ["自制优先", "外包优先"]
      setTimeout(() => {
        this.handleCloseCompute()
      }, 1000)
      DoOutsourceDistribute(form).then(res => {
        this.loadingInstance.close()
        this.$alert(res.message, res.message_title, {
          confirmButtonText: '确定',
          type: res.message_type
        })
        SaveStepNow({ 'step_now': 5 }).then(res => {
          this.stepNow = 5
        })
      }).catch(err => {
        this.loadingInstance.close()
        this.$alert(err, '错误', {
          confirmButtonText: '确定',
          type: 'error'
        })
      })
    },
    // 输出文件
    generateOutput() {
      if (this.stepNow < 5) {
        this.$message({
          message: '计算未完成，无法输出',
          type: 'warning'
        })
        return
      }
      this.listenProgress()
      const form = {}
      form['component_type'] = this.componentType // ["SMT主板", "SMT小板", "AI", "SMT点胶"]
      form['run_mode'] = this.runMode // ["自制优先", "外包优先"]
      GenerateOutput(form).then(res => {
        this.clearListenProgress()
        this.$message({
          message: res.message,
          type: 'success'
        })
        SaveStepNow({ 'step_now': 6 }).then(res => {
          this.stepNow = 6
        })
      }).catch(err => {
        this.$alert(err, '错误', {
          confirmButtonText: '确定',
          type: 'error'
        })
      })
    },
    // 下载文件
    downloadFile(res) {
      const link = document.createElement('a')
      const blob = new Blob([res.data])
      link.style.display = 'none'
      link.href = URL.createObjectURL(blob)
      const temp = res.headers['content-disposition'].split('attachment;filename=')[1]
      const file_name = decodeURIComponent(temp)
      link.download = file_name
      document.body.appendChild(link)
      link.click()
      URL.revokeObjectURL(link.href) // 释放URL对象
      document.body.removeChild(link)
    },
    // 下载所有文件
    downloadAllFile() {
      DownloadAllFile().then(res => {
        this.$confirm('提示', {
          title: '提示',
          message: '确定要下载全部输出文件（本次共有 ' + res.file_list.length + ' 个输出文件）？',
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          for (const key in res.file_list) {
            DownloadFile({ 'file_path': res.file_list[key] }).then(resp => {
              this.downloadFile(resp)
            }).catch(err => {
              console.log(err)
              this.$message({
                message: '下载失败，文件不存在',
                type: 'error'
              })
            })
          }
          this.$alert('本次共下载了 ' + res.file_list.length + ' 个文件', '提示', {
            confirmButtonText: '确定',
            type: 'success'
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消下载'
          })
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '../../assets/css/Control/OutsourceControl.scss';
</style>
<style>
.my-table .el-table th.is-leaf{
  border: none;
}
.my-table .el-table td{
  border: none;
}
.my-table  .el-table::before{
  height: 0;
}
.btnDanger{
  background-color: #F56C6C !important;
  border-color: #F56C6C !important;
}
.btnDanger:hover{
  background-color: #f04747 !important;
  border-color: #f04747 !important;
}
.layui-progress-bar{
  margin-top: 20px;
}
.layui-progress-bar .el-progress-bar__inner:before {
  content:"";
  width:100%;
  height:100%;
  display:block;
  background-image:repeating-linear-gradient(-45deg,rgba(255,255,255,0.3) 0,rgba(255,255,255,0.3) 12.5%,transparent 0,transparent 25%);
  background-size:40px 40px;
  animation:move 2.5s linear infinite;
}
@keyframes move {
  from {
    background-position: 40px 0;
  }
  to {
    background-position:  0;
  }
}

.checkAlertBox{
  width: 46%;
  word-break: break-all !important;
  overflow: auto;
}
</style>

