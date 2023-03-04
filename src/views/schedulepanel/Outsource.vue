<template>
  <div id="main">
    <!-- <el-card class="card-info">
      <el-row>
        <el-col :span="1">
          <div class="my-icon-date">
            <i class="el-icon-date" />
          </div>
        </el-col>
        <el-col :span="4">
          <div class="card-panel-description">
            <div class="card-panel-text-upper">
              排程日期
            </div>
            <div class="card-panel-text-down">
              {{ schedule_time }}-{{ schedule_mode }}
            </div>
          </div>
        </el-col>
        <el-col :span="1">
          <div class="my-icon-timer">
            <i class="el-icon-timer" />
          </div>
        </el-col>
        <el-col :span="8">
          <div class="card-panel-description">
            <div class="card-panel-text-upper">
              排程运行时长
            </div>
            <div class="card-panel-text-down">
              {{ schedule_run_time }}
            </div>
          </div>
        </el-col>
        <el-col :span="10" style="float:right;">
          <div class="my-table">
            <el-table
              :data="schedule_result"
              style="width: 610px;"
              :border="false"
              algin="right"
              :header-cell-style="{'font-weight':'normal', 'text-align':'right'}"
              :cell-style="{'font-size':'20px', 'font-weight':'20px', 'text-align': 'right'}"
            >
              <el-table-column prop="schedule_type" label="排程类型" width="100px;" />
              <el-table-column prop="enable" label="是否可行解" width="100px;" />
              <el-table-column prop="line_balance" label="包装线平衡" width="100px;" />
              <el-table-column prop="idle_value" label="停顿(天)" width="100px;" />
              <el-table-column prop="overdue_value" label="逾期(天)" width="100px;" />
              <el-table-column prop="obj_value" label="目标值" width="110px;" />
            </el-table>
          </div>
        </el-col>
      </el-row>
    </el-card> -->
    <el-row :gutter="16" style="margin-top: 16px; margin-right: 10px;">
      <el-col :span="8">
        <el-card class="card-progress">
          <div slot="header" class="clearfix">
            <span>任务进度</span>
          </div>
          <!-- <el-progress
            :text-inside="true"
            :stroke-width="16"
            :percentage="percentage_1"
            :color="progressColor"
            class="layui-progress-bar"
            style="margin-top: 0px;"
            :indeterminate="true"
          />
          <el-alert
            style="color: #303133;"
            :title="progress_text_1"
            type="info"
            center
            :closable="false"
          />
          <el-progress
            :text-inside="true"
            :stroke-width="16"
            :percentage="percentage_2"
            :color="progressColor"
            class="layui-progress-bar"
          />
          <el-alert
            style="color: #303133;"
            :title="progress_text_2"
            type="info"
            center
            :closable="false"
          />
          <el-progress
            :text-inside="true"
            :stroke-width="16"
            :percentage="percentage_3"
            :color="progressColor"
            class="layui-progress-bar"
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
            :percentage="percentage_4"
            :color="progressColor"
            class="layui-progress-bar"
          />
          <el-alert
            style="color: #303133;"
            :title="progress_text_4"
            type="info"
            center
            :closable="false"
          /> -->
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
                    <el-button type="primary" plain @click="downloadFile">
                      <i class="el-icon-download" />
                      下载xx文件
                    </el-button>
                    <el-button type="success" @click="downloadAllFile">
                      <i class="el-icon-download" />
                      下载全部文件
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
      :visible.sync="dialogVisibleOutsource"
      width="60%"
      :close-on-click-modal="false"
      :before-close="handleCloseOutsource"
      @dragDialog="handleDrag"
    >
      <el-row style="margin-bottom: 10px">
        <el-col :span="8">
          <el-upload
            class="upload-demo"
            action=""
            accept=".xlsx"
            :auto-upload="false"
            multiple
            :limit="1"
            :on-exceed="handleExceed_1"
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
            accept=".xlsx"
            :auto-upload="false"
            multiple
            :limit="1"
            :on-exceed="handleExceed_1"
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
            accept=".xlsx"
            :auto-upload="false"
            multiple
            :limit="1"
            :on-exceed="handleExceed_1"
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
            accept=".xlsx"
            :auto-upload="false"
            multiple
            :limit="5"
            :on-exceed="handleExceed_5"
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
        <el-button @click="handleCloseOutsource">
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

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { Loading } from 'element-ui'
import elDragDialog from '@/directive/el-drag-dialog'
import { GetProgress, ImportFiles, GeScheduleRes, DoOutsourceDistribute, GnerateDivisions,
  ShowFilterRules, UpdateNewModels, DoFilterRules, GenerateOutput } from '@/api/schedulepanel/Outsource'
export default {
  name: 'Outsource',
  directives: { elDragDialog },
  data() {
    return {
      progressColor: '#02bafd', // 进度条颜色

      dialogVisibleOutsource: false, // 计算主板排程dialog
      importLoading: {
        text: '拼命导入中...',
        background: 'rgba(0, 0, 0, 0.5)'
      }, // 导入排程动画
      loadingInstance: null, // 动画实例

      // 进度条相关
      percentage_1: 0,
      percentage_2: 0,
      percentage_3: 0,
      percentage_4: 0,
      progress_text_1: '未开始训练预测模型|0%',
      progress_text_2: '未开始|0%',
      progress_text_3: '未开始初始解|0%',
      progress_text_4: '未开始深度搜索|0%',
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
      dialogVisibleCompute: false

    }
  },
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  created() {
    // this.listenProgress()
  },
  mounted() {
  },
  methods: {
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
        this.percentage_1 = res.p0
        this.percentage_2 = res.p1
        this.percentage_3 = res.p2
        this.percentage_4 = res.p3
        this.progress_text_1 = res.p0text
        this.progress_text_2 = res.p1text
        this.progress_text_3 = res.p2text
        this.progress_text_4 = res.p3text
        // 程序运行时间
        const start_time = res.start_time
        const end_time = res.end_time
        const time = end_time - start_time
        const second = parseInt(time % 60)
        const minute = parseInt((time / 60) % 60)
        const hour = parseInt((time / (60 * 60)) % 24)
        if (res.run_flag === -1) {
          this.clearListenProgress()
          this.schedule_run_time = '计算排程出错'
          this.$alert('计算排程出错：' + res.err_message, '错误', {
            confirmButtonText: '确定',
            type: 'error'
          })
          this.schedule_run_time = '计算排程出错，耗时：' + hour.toString() + ' 时 ' + minute.toString() + ' 分 ' + second.toString() + ' 秒'
        } else if (res.run_flag === 1) {
          this.schedule_run_time = '计算中：' + hour.toString() + ' 时 ' + minute.toString() + ' 分 ' + second.toString() + ' 秒'
        } else if (res.run_flag === 2) {
          this.clearListenProgress()
          this.schedule_run_time = '计算完毕，总耗时: ' + hour.toString() + ' 时 ' + minute.toString() + ' 分 ' + second.toString() + ' 秒'
          this.getScheduleRes() // 获取排程结果
        } else {
          this.schedule_run_time = '未开始'
        }
      })
    },
    // 计算外包dialog
    importDialog() {
      this.dialogVisibleOutsource = true
    },
    computeDialog() {
      this.dialogVisibleCompute = true
    },
    // 关闭计算主板
    handleCloseOutsource() {
      this.dialogVisibleOutsource = false
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
      await ImportFiles(this.formData).then(res => {
        this.loadingInstance.close()
        this.$message({
          message: res.message,
          type: 'success'
        })
        this.stepNow = 1
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
      if (this.stepNow !== 1) {
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
        this.$message({
          message: res.message,
          type: 'success'
        })
        this.stepNow = 2
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
      if (this.stepNow !== 2) {
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
        this.$message({
          message: res.message,
          type: 'success'
        })
        this.stepNow = 3
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
      if (this.stepNow < 3) {
        this.$message({
          message: '未更新新机种，无法显示筛选规则',
          type: 'warning'
        })
        return
      }
      const loadingMessage = {
        text: '获取中...',
        background: 'rgba(0, 0, 0, 0.5)'
      }
      this.loadingInstance = Loading.service(loadingMessage)
      ShowFilterRules().then(res => {
        this.loadingInstance.close()
        this.$message({
          message: res.message,
          type: 'success'
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
      if (this.stepNow !== 3) {
        this.$message({
          message: '请先更新新机种',
          type: 'warning'
        })
        return
      }
      const loadingMessage = {
        text: '生成分工单中...',
        background: 'rgba(0, 0, 0, 0.5)'
      }
      this.loadingInstance = Loading.service(loadingMessage)
      GnerateDivisions().then(res => {
        this.loadingInstance.close()
        this.$message({
          message: res.message,
          type: 'success'
        })
        this.stepNow = 4
      }).catch(err => {
        this.loadingInstance.close()
        this.$alert(err, '错误', {
          confirmButtonText: '确定',
          type: 'error'
        })
      })
    },
    // 计算之前的确认
    beforeDoOutsourceDistribute() {
      if (this.stepNow !== 4) {
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
      DoOutsourceDistribute(form).then(res => {
        this.loadingInstance.close()
        this.$message({
          message: res.message,
          type: 'success'
        })
        this.stepNow = 5
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
      if (this.stepNow !== 5) {
        this.$message({
          message: '计算未完成，无法输出',
          type: 'warning'
        })
        return
      }
      const loadingMessage = {
        text: '输出文件中...',
        background: 'rgba(0, 0, 0, 0.5)'
      }
      this.loadingInstance = Loading.service(loadingMessage)
      GenerateOutput().then(res => {
        this.loadingInstance.close()
        this.$message({
          message: res.message,
          type: 'success'
        })
        this.stepNow = 1
      }).catch(err => {
        this.loadingInstance.close()
        this.$alert(err, '错误', {
          confirmButtonText: '确定',
          type: 'error'
        })
      })
    },
    // 下载文件
    downloadFile() {

    },
    // 下载所有文件
    downloadAllFile() {

    }
  }
}
</script>

<style lang="scss" scoped>
  @import '../../assets/css/schedulepanel/Outsource.scss';
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

