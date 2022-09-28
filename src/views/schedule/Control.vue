<template>
  <div>
    <el-card class="card-info">
      <div>
        <el-skeleton :rows="6" />
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
                2022年09月25日-预排
              </div>
            </div>
          </el-col>
          <el-col :span="1">
            <div class="my-icon-timer">
              <i class="el-icon-timer" />
            </div>
          </el-col>
          <el-col :span="4">
            <div class="card-panel-description">
              <div class="card-panel-text-upper">
                排程运行时长
              </div>
              <div class="card-panel-text-down">
                00 时 30 分 27 秒
              </div>
            </div>
          </el-col>
          <el-col :span="14" style="float:right;">
            <div class="my-table">
              <el-table
                :data="scheduleResult"
                style="width: 490px;"
                :border="false"
                algin="right"
                header-cell-style="font-weight:normal;text-align:right;"
                cell-style="font-size: 20px;font-weight:20px;text-align:right;"
              >
                <el-table-column
                  prop="enable"
                  label="是否可行解"
                  width="100px;"
                />
                <el-table-column
                  prop="obj_value"
                  label="目标值"
                  width="110px;"
                />
                <el-table-column
                  prop="idle_value"
                  label="停顿(天)"
                  width="100px;"
                />
                <el-table-column
                  prop="overdue_value"
                  label="逾期(天)"
                  width="100px;"
                />
                <el-table-column
                  prop="line_balance"
                  label="线平衡"
                  width="80px;"
                />
              </el-table>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-card>
    <el-row :gutter="16">
      <el-col :span="8">
        <el-card class="card-progress">
          <div slot="header" class="clearfix">
            <span>任务进度</span>
          </div>
          <el-progress
            :text-inside="true"
            :stroke-width="16"
            :percentage="70"
            :color="progressColor"
          />
          <el-alert
            title="预测模型完成训练|100%"
            type="info"
            :closable="false"
          />
          <el-progress
            :text-inside="true"
            :stroke-width="16"
            :percentage="70"
            :color="progressColor"
            class="my-progress"
          />
          <el-alert
            title="预处理完成|100%"
            type="info"
            :closable="false"
          />
          <el-progress
            :text-inside="true"
            :stroke-width="16"
            :percentage="70"
            :color="progressColor"
            class="my-progress"
          />
          <el-alert
            title="初始解完成:230组|100%"
            type="info"
            :closable="false"
          />
          <el-progress
            :text-inside="true"
            :stroke-width="16"
            :percentage="70"
            :color="progressColor"
            class="my-progress"
          />
          <el-alert
            title="输出完成(可下载)|100%"
            type="info"
            :closable="false"
          />
        </el-card>
      </el-col>
      <el-col :span="16">
        <el-card class="card-control">
          <div slot="header" class="clearfix">
            <span>控制中心</span>
          </div>
          <el-row :gutter="16">
            <el-col :span="12">
              <el-alert
                title="训练预测模型"
                type="info"
                :closable="false"
              />
              <div class="box-button">
                <el-date-picker
                  v-model="trainDate"
                  type="date"
                  placeholder="选择预测模型日期"
                  :size="size"
                />
                <el-button type="primary" plain style="margin-top:2px;margin-left: 8px;" @click="trainModel">
                  <i class="el-icon-pie-chart" />
                  训练预测模型
                </el-button>
              </div>
              <el-alert
                title="排程相关操作"
                type="info"
                :closable="false"
              />
              <div class="box-button">
                <el-row>
                  <el-col :span="8">
                    <el-upload
                      ref="upload"
                      class="upload-demo"
                      action="http://localhost:9527/sqyapi/preprocess/control/check_input_excel/"
                      :limit="1"
                      :on-change="handleChange"
                      :on-progress="handleProgress"
                      :on-success="handleSuccess"
                      :auto-upload="false"
                      :show-file-list="false"
                    >
                      <el-button slot="trigger" type="primary" plain>
                        <i class="el-icon-circle-check" />
                        检查排程表格
                      </el-button>
                    </el-upload>
                  </el-col>
                  <el-col :span="8">
                    <el-badge value="运行中" class="item">
                      <el-button type="primary" plain @click="computeDialog">
                        <i class="el-icon-monitor" />
                        计算排程表格
                      </el-button>
                    </el-badge>
                  </el-col>
                  <el-col :span="8">
                    <el-button type="primary" plain @click="stopTabu">
                      <i class="el-icon-warning-outline" />
                      终止深度搜索
                    </el-button>
                  </el-col>
                </el-row>
              </div>
              <div class="box-button">
                <el-row>
                  <el-col :span="8">
                    <el-button type="primary" plain @click="downloadSchedule">
                      <i class="el-icon-download" />
                      下载最新排程
                    </el-button>
                  </el-col>
                  <el-col :span="8">
                    <el-button type="primary" plain @click="downloadNoProgram">
                      <i class="el-icon-download" />
                      下载无程序表
                    </el-button>
                  </el-col>
                  <el-col :span="8">
                    <el-button type="primary" plain @click="downloadLatestLog">
                      <i class="el-icon-download" />
                      下载最新日志
                    </el-button>
                  </el-col>
                </el-row>
              </div>
            </el-col>
            <el-col :span="12">
              <el-alert
                title="下载历史日志"
                type="info"
                :closable="false"
              />
              <div class="box-button">
                <el-select v-model="selectLogValue" placeholder="选择历史日志">
                  <el-option
                    v-for="item in options_history_log"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
                <el-button type="primary" plain style="margin-top:2px;margin-left: 8px;" @click="downloadHistoryLog">
                  <i class="el-icon-download" />
                  下载历史日志
                </el-button>
              </div>
              <el-alert
                title="下载相关"
                type="info"
                :closable="false"
              />
              <div class="box-button">
                <el-row>
                  <el-col :span="8">
                    <el-button type="primary" plain @click="downloadIdleInfo">
                      <i class="el-icon-download" />
                      下载idle明细
                    </el-button>
                  </el-col>
                </el-row>
              </div>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
    </el-row>
    <el-card class="card-gantt">
      <div slot="header" class="clearfix">
        <span>甘特图</span>
      </div>
    </el-card>
    <el-dialog
      title="计算导入排程"
      :visible.sync="computeDialogVisible"
      width="50%"
      :before-close="handleClose"
    >
      <el-steps :active="stepNow" finish-status="success" simple>
        <el-step title="上传排程" />
        <el-step title="导入排程" />
        <el-step title="更新数据" />
        <el-step title="计算排程" />
      </el-steps>
      <el-row style="margin-top:10px;">
        <el-col :span="8">
          <el-input placeholder="请上传排程文件" :value="uploadFileName" />
        </el-col>
        <el-col :span="16">
          <el-upload
            ref="upload"
            class="upload-demo"
            action="http://localhost:9527/sqyapi/preprocess/control/check_input_excel/"
            :limit="1"
            :on-change="handleChange"
            :on-progress="handleProgress"
            :on-success="handleSuccess"
            :auto-upload="false"
            :show-file-list="false"
            style="margin-left: 10px;"
          >
            <el-button slot="trigger" type="primary">
              上传排程文件
            </el-button>
            <el-button type="success" style="margin-left:10px;" @click="beforeImport">
              导入文件
            </el-button>
          </el-upload>
        </el-col>
      </el-row>
      <el-alert
        title="更新排程信息"
        type="info"
        :closable="false"
        style="margin-top: 10px;margin-bottom: 10px;"
      />
      <el-row>
        <el-col :span="24">
          <el-button type="primary">
            更新钢板程序信息
          </el-button>
          <el-button type="success">
            导出检查
          </el-button>
        </el-col>
      </el-row>
      <el-alert
        title="计算排程"
        type="info"
        :closable="false"
        style="margin-top: 10px;margin-bottom: 10px;"
      />
      <el-button type="primary" @click="beforeCompute">
        开始计算排程
      </el-button>
      <span slot="footer" class="dialog-footer">
        <el-button @click="computeDialogVisible = false">
          关 闭
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { Loading } from 'element-ui'
import { TrainModel, ImportSchedule, ComputeSchedule, DownloadSchedule, DownloadLatestLog, DownloadNoProgram, GetLogSelectItem, DownloadHistoryLog, DownloadIdleInfo } from '@/api/control'
export default {
  data() {
    return {
      scheduleResult: [{
        obj_value: '1210.30',
        idle_value: '22.30',
        overdue_value: '63.30',
        enable: '可行',
        line_balance: '23.30'
      }], // 排程结果数据
      progressColor: '#02bafd', // 进度条颜色
      computeDialogVisible: false, // 计算导入排程dialog
      stepNow: 0, // 计算导入排程进行到第几步
      checkLoading: {
        text: '检查中，请稍等...',
        background: 'rgba(0, 0, 0, 0.6)'
      }, // 检查动画
      importLoading: {
        text: '导入中，请稍等...',
        background: 'rgba(0, 0, 0, 0.6)'
      }, // 导入排程动画
      loadingInstance: null, // 动画实例
      trainDate: new Date(), // 训练预测模型日期
      uploadFiles: [], // 上传的文件列表
      uploadFile: null, // 上传到文件
      fileName: '', // 文件名
      uploadFileName: '请上传排程文件', // 当前选中的文件名
      options_history_log: [], // 历史日志列表
      selectLogValue: '' // 当前选中的历史日志
    }
  },
  mounted() {
    // Loading.service(this.checkLoading)
    this.getLogSelectItem()
  },
  methods: {
    // 计算导入排程dialog弹出
    computeDialog() {
      this.computeDialogVisible = true
      this.stepNow = 0
    },
    // 文件上传钩子
    handleChange(file, fileList) {
      if (file.status === 'ready') {
        if (fileList.length > 0) {
          this.uploadFiles = fileList = [fileList[fileList.length - 1]] // 选择最后一次选择文件
          this.file_name = this.uploadFiles[0].name // 更新文件名
        }
        this.uploadFileName = file.name
        this.uploadFile = file
        this.$refs.upload.submit()
      }
    },
    // 文件上传的过程中
    handleProgress() {
      this.loadingInstance = Loading.service(this.checkLoading)
    },
    // 文件上传成功
    handleSuccess(res) {
      this.loadingInstance.close() // 清除动画
      if (res.type === 'success') {
        this.$alert(res.message, '提示', {
          confirmButtonText: '确定',
          type: 'success'
        })
      } else {
        this.$alert(res.message, '提示', {
          confirmButtonText: '确定',
          type: 'warning'
        })
      }
      this.stepNow = 1
    },
    // 终止深度搜索
    stopTabu() {
      this.$confirm('请确定是否要终止深度搜索?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '终止成功'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消终止'
        })
      })
    },
    // 训练预测模型
    trainModel() {
      TrainModel({ 'end_time': this.trainDate }).then(res => {
        if (res.code === 20000) {
          this.$message({
            message: res.message,
            type: 'success'
          })
        }
      })
    },
    // 导入前判断是否在跑排程
    beforeImport() {
      const run_flag = 1
      const confirmText = ['目前正在运行排程，请确定是否要继续导入？', '注意：此操作将会影响当前运行的排程结果！']
      const newDatas = []
      const h = this.$createElement
      for (const i in confirmText) {
        newDatas.push(h('p', null, confirmText[i]))
      }
      if (run_flag === 1) {
        this.$confirm('提示', {
          message: h('div', null, newDatas),
          confirmButtonText: '确定，仍要导入',
          cancelButtonText: '取消',
          confirmButtonClass: 'btnDanger',
          type: 'warning'
        }).then(() => {
          this.submitUploadFile()
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消导入'
          })
        })
      }
    },
    // 导入文件
    async submitUploadFile() {
      this.loadingInstance = Loading.service(this.importLoading)
      const form = new FormData()
      form.append('file', this.uploadFile.raw)
      await ImportSchedule(form).then(res => {
        if (res.code === 20000) {
          this.$message({
            message: res.message,
            type: 'success'
          })
          this.stepNow = 2
        }
      })
      this.loadingInstance.close()
    },
    // 计算前判断是否在跑排程
    beforeCompute() {
      const run_flag = 1
      const confirmText = ['目前正在运行排程，请确定是否要重新开始计算？', '注意：此操作将会中断当前的排程！']
      const newDatas = []
      const h = this.$createElement
      for (const i in confirmText) {
        newDatas.push(h('p', null, confirmText[i]))
      }
      if (run_flag === 1) {
        this.$confirm('提示', {
          message: h('div', null, newDatas),
          confirmButtonText: '确定，仍要计算',
          cancelButtonText: '取消',
          confirmButtonClass: 'btnDanger',
          type: 'warning'
        }).then(() => {
          this.submitUploadFile()
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消计算'
          })
        })
      }
    },
    // 开始计算排程
    computeSchedule() {
      ComputeSchedule().then(res => {
        if (res.code === 20000) {
          this.$message({
            message: res.message,
            type: 'success'
          })
          this.stepNow = 2
        } else {
          this.$message({
            message: '开始计算失败',
            type: 'error'
          })
        }
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
    // 下载最新排程
    downloadSchedule() {
      DownloadSchedule().then(res => {
        this.downloadFile(res)
        this.$message({
          message: '开始下载',
          type: 'success'
        })
      }).catch(err => {
        console.log(err)
        this.$message({
          message: '下载失败，该文件不存在',
          type: 'error'
        })
      })
    },
    // 下载最新日志
    downloadLatestLog() {
      DownloadLatestLog().then(res => {
        this.downloadFile(res)
        this.$message({
          message: '开始下载',
          type: 'success'
        })
      }).catch(err => {
        console.log(err)
        this.$message({
          message: '下载失败，该文件不存在',
          type: 'error'
        })
      })
    },
    // 下载无程序表
    downloadNoProgram() {
      DownloadNoProgram().then(res => {
        this.downloadFile(res)
        this.$message({
          message: '开始下载',
          type: 'success'
        })
      }).catch(err => {
        console.log(err)
        this.$message({
          message: '下载失败，该文件不存在',
          type: 'error'
        })
      })
    },
    // 获取历史日志选择器选项
    getLogSelectItem() {
      this.options_history_log = []
      GetLogSelectItem().then(res => {
        for (const key in res.log_data) {
          const temp = {}
          temp['value'] = res.log_data[key]
          temp['label'] = res.log_data[key]
          this.options_history_log.push(temp)
        }
      })
    },
    // 下载历史日志
    downloadHistoryLog() {
      DownloadHistoryLog({ 'filename': this.selectLogValue }).then(res => {
        this.downloadFile(res)
        this.$message({
          message: '开始下载',
          type: 'success'
        })
      }).catch(err => {
        console.log(err)
        this.$message({
          message: '下载失败，该文件不存在',
          type: 'error'
        })
      })
    },
    // 下载idle明细
    downloadIdleInfo() {
      DownloadIdleInfo().then(res => {
        this.downloadFile(res)
        this.$message({
          message: '开始下载',
          type: 'success'
        })
      }).catch(err => {
        console.log(err)
        this.$message({
          message: '下载失败，该文件不存在',
          type: 'error'
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '../../assets/css/control.scss';
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
  background-color: #a52a2a !important;
  border-color: #a52a2a !important;
}
.btnDanger:hover{
  background-color: #c24848 !important;
  border-color: #c24848 !important;
}
</style>

