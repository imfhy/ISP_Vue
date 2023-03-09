<template>
  <div class="box-onlinetable">
    <el-card class="card-control">
      <!-- <el-alert
        :title="alertTitle"
        :type="alertType"
        :closable="false"
        style="margin-bottom: 10px;"
      /> -->
      <el-alert
        title="提示信息"
        :type="alertType"
        :closable="false"
        style="margin-bottom: 10px;"
      >
        <template slot="title">
          <div id="alertMessage">
            <div>提示信息</div>
          </div>
        </template>
      </el-alert>
      <el-row>
        <el-col :span="18">
          <div class="control-button">
            <el-input
              :value="uploadFileName"
              placeholder="未上传文件"
            />
            <el-upload
              ref="upload"
              class="upload-demo"
              action="alert"
              accept=".xlsx"
              :show-file-list="false"
              :auto-upload="false"
              :file-list="uploadFiles"
              :on-change="loadExcelFile"
            >
              <el-button slot="trigger" type="primary">
                <i class="el-icon-upload2" />上传排程
              </el-button>
            </el-upload>
            <div>
              <el-button type="primary" @click="checkDataBackend">
                <i class="el-icon-circle-check" />检查
              </el-button>
              <el-button type="primary" @click="analysisDialog">
                <i class="el-icon-monitor" />分析
              </el-button>
              <el-button type="primary" @click="downloadLuckyExcel">
                <i class="el-icon-download" />下载
              </el-button>
              <!-- <el-button>
                <i class="el-icon-position" />接口更新
              </el-button> -->
              <el-button type="apiBtn" @click="pushSchedule">
                分析后推送
              </el-button>
              <el-button type="apiBtn" @click="importPushSchedule">
                导入后推送
              </el-button>
            </div>
            <!-- <div class="history">
              <el-select v-model="selectFileName" clearable placeholder="选择历史排程">
                <el-option
                  v-for="item in options_history_excel"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
              <el-button type="primary" @click="getHistoryExcelData">
                获取
              </el-button>
            </div> -->
          </div>
        </el-col>
        <el-col :span="6">
          <div style="float: right;margin-right:10px;">
            <el-tooltip class="item" effect="dark" content="仅支持今日排程Sheet" placement="top">
              <el-button type="cutBtn" @click="cut">
                <i class="el-icon-scissors" />剪切
              </el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="仅支持今日排程Sheet" placement="top">
              <el-button type="cutBtn" @click="insertCut">
                <i class="el-icon-scissors" />插入剪切
              </el-button>
            </el-tooltip>
          </div>
        </el-col>
      </el-row>
    </el-card>
    <el-card class="card-luckysheet">
      <div id="luckysheet" class="my-luckysheet" />
    </el-card>
    <el-dialog
      v-el-drag-dialog
      title="分析排程"
      :visible.sync="analysisDialogVisible"
      width="60%"
      :before-close="handleCloseAnalysis"
      class="dialog-analysis"
      :close-on-click-modal="false"
      @dragDialog="handleDrag"
    >
      <el-steps :active="stepNow" finish-status="success" simple>
        <el-step title="检查表格" />
        <el-step title="开始分析" />
        <el-step title="生成表格" />
        <el-step title="下载表格/获取量化" />
      </el-steps>
      <el-row :gutter="0">
        <el-col :span="12">
          <el-card class="ana-card" shadow="hover">
            <div slot="header" class="clearfix">
              <span>分析进度</span>
            </div>
            <el-progress
              :text-inside="true"
              :stroke-width="16"
              :percentage="percentage_1"
              :color="progressColor"
              class="layui-progress-bar-ol"
              style="margin-top: 0px;"
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
              class="layui-progress-bar-ol"
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
              class="layui-progress-bar-ol"
            />
            <el-alert
              style="color: #303133;"
              :title="progress_text_3"
              type="info"
              center
              :closable="false"
            />
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card class="ana-res-card" shadow="hover">
            <div slot="header" class="clearfix">
              <span class="ana-res-text">分析结果</span>
              <div class="ana-history">
                <el-select v-model="selectAnaTime" placeholder="查看历史分析结果" style="width: 200px%;" size="mini">
                  <el-option
                    v-for="item in options_history_analysis"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
                <el-button style="margin-left: 5px;" type="info" size="mini" @click="getHistoryAnaData">
                  获取
                </el-button>
                <el-tooltip class="item" effect="dark" content="刷新列表" placement="top">
                  <el-button style="margin-left: 5px;" size="mini" @click="getHistoryAnaItem">
                    <i class="el-icon-refresh" />
                  </el-button>
                </el-tooltip>
              </div>
            </div>
            <p style="font-weight:bold;line-height: 90%;">{{ schedule_time }}-{{ schedule_mode }}
              <span style="font-weight:normal;">{{ ana_time }}</span>
            </p>
            <p style="line-height:160%">
              是否可行解：{{ feasible }}<br>
              目标值：{{ obj_value }}<br>
              逾期：{{ overdue_value }}<br>
              停顿：{{ idle_value }}<br>
              线平衡：{{ line_balance }}<br>
              三天总点数：{{ three_days_points }}<br>
            </p>
          </el-card>
        </el-col>
      </el-row>
      <el-card class="ana-tip-card" shadow="hover">
        <div slot="header" class="clearfix">
          <span>提示信息</span>
        </div>
        <br>{{ anaErrMessage }}
      </el-card>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCloseAnalysis">
          关 闭
        </el-button>
        <el-button type="primary" :disabled="beginAnaBtn" @click="beginAnalysis">
          开始分析
        </el-button>
        <el-button type="primary" :disabled="generateAnaBtn" @click="generateAnaExcel">
          生成表格
        </el-button>
        <el-button type="primary" :disabled="statisticsBtn" @click="statisticsSchedule">
          获取量化
        </el-button>
        <el-button type="primary" :disabled="downloadAnaBtn" @click="downloadAnaExcel">
          下载表格
        </el-button>
      </span>
    </el-dialog>
    <el-dialog
      :title="statisticsTitle"
      :visible.sync="statisticsDialogVisible"
      width="60%"
      :before-close="handleCloseStatistics"
      class="statistics-dialog"
    >
      <el-tabs>
        <el-tab-pane label="量化结果1">
          <el-table
            id="table1"
            v-loading="loading_table1"
            :data="tableData_1"
            :header-cell-style="{background:'#eef1f6',color:'#606266'}"
            height="460"
            border
          >
            <el-table-column
              prop="line"
              label="线体"
            />
            <el-table-column
              prop="points_type"
              label="点数类别"
            />
            <el-table-column
              prop="points"
              label="点数"
            />
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="量化结果2">
          <el-table
            id="table2"
            v-loading="loading_table2"
            :data="tableData_2"
            :header-cell-style="{background:'#eef1f6',color:'#606266'}"
            height="460"
            border
          >
            <el-table-column
              prop="type"
              label="量化类型"
            />
            <el-table-column
              prop="hours"
              label="量化结果(小时)"
            />
            <el-table-column
              prop="days"
              label="量化结果(天)"
            />
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="量化结果3">
          <el-table
            id="table3"
            v-loading="loading_table3"
            :data="tableData_3"
            :header-cell-style="{background:'#eef1f6',color:'#606266'}"
            height="460"
            border
          >
            <el-table-column
              prop="type"
              label="量化类型"
            />
            <el-table-column
              prop="points"
              label="值"
            />
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="量化结果4">
          <el-table
            id="table4"
            v-loading="loading_table4"
            :data="tableData_4"
            :header-cell-style="{background:'#eef1f6',color:'#606266'}"
            height="460"
            border
          >
            <el-table-column
              prop="line"
              label="线体"
            />
            <el-table-column
              prop="time"
              label="线体完工时间"
            />
          </el-table>
        </el-tab-pane>
      </el-tabs>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCloseStatistics">
          关 闭
        </el-button>
        <el-button type="primary" @click="exportStatisticsExcel">
          导出Excel
        </el-button>
        <el-tooltip class="item" effect="dark" :content="saveApiCustweekSelfcreateTip" placement="top">
          <el-button type="primary" @click="post_statistics">
            推送量化结果
          </el-button>
        </el-tooltip>
      </span>
    </el-dialog>

    <el-dialog
      v-el-drag-dialog
      title="推送排程"
      :visible.sync="pushDialogVisible"
      width="520px"
      :before-close="handlePushClose"
      @dragDialog="handleDrag"
    >
      <el-alert
        title="推送主板"
        type="info"
        :closable="false"
        style="margin-top: 10px;margin-bottom: 10px;"
      />
      <el-row style="text-align: center;">
        <el-col :span="24">
          <el-tooltip class="item" effect="dark" :content="smtUnscheduledTip" placement="top">
            <el-button type="apiBtn" @click="post_unscheduled">
              推送SMT未排
            </el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" :content="smtPrescheduledTip" placement="top">
            <el-button type="apiBtn" @click="post_pre_scheduled">
              推送SMT预排
            </el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" :content="smtScheduledTip" placement="top">
            <el-button type="apiBtn" @click="post_scheduled">
              推送SMT正排
            </el-button>
          </el-tooltip>
        </el-col>
      </el-row>
      <el-alert
        title="推送AI"
        type="info"
        :closable="false"
        style="margin-top: 10px;margin-bottom: 10px;"
      />
      <el-row style="text-align: center;">
        <el-col :span="24">
          <el-tooltip class="item" effect="dark" :content="aiUnscheduledTip" placement="top">
            <el-button type="apiBtn" style="padding-left: 28px;padding-right: 28px" disabled @click="post_ai_unscheduled">
              推送AI未排
            </el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" :content="aitPrescheduledTip" placement="top">
            <el-button type="apiBtn" style="padding-left: 28px;padding-right: 28px" disabled @click="post_ai_pre_scheduled">
              推送AI预排
            </el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" :content="aitScheduledTip" placement="top">
            <el-button type="apiBtn" style="padding-left: 28px;padding-right: 28px" disabled @click="post_ai_scheduled">
              推送AI正排
            </el-button>
          </el-tooltip>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handlePushClose">
          关闭
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { Loading } from 'element-ui'
import LuckyExcel from 'luckyexcel'
import FileSaver from 'file-saver'
import XLSX from 'xlsx'
import elDragDialog from '@/directive/el-drag-dialog'
import { AnalysisExcel, GenerateAnaExcel, DownloadAnaExcel, ClearAnaProgress, GetAnaProgress,
  GetHistoryAnaItem, GetHistoryAnaData, GetHistoryExcelItem, GetHistoryExcelData,
  StatisticsSchedule, SmtUnscheduled, SmtPrescheduled, SmtScheduled, AiUnscheduled,
  AiPrescheduled, AiScheduled, GetRunFlag, ImportPushSchedule, SaveApiCustweekSelfcreate,
  CheckData
} from '@/api/Control/OnlineTable'
import { lineOptions, lockedList, unLockedList } from '@/utils/items'
export default {
  name: 'OnlineTable',
  directives: { elDragDialog },
  data() {
    return {
      pushLoading: {
        text: '推送中，请稍等...',
        background: 'rgba(0, 0, 0, 0.5)'
      }, // 导入排程动画
      loadingInstance: null, // 动画实例
      uploadFile: null, // 上传的文件
      uploadFileName: '', // 上传的文件名
      uploadFiles: [], // 上传的文件列表（限制1个）
      analysisDialogVisible: false, // 分析排程dialog显示
      statisticsTitle: '量化结果', // 量化的dialog名称
      statisticsDialogVisible: false, // 量化结果dialog显示
      stepNow: 0, // 分析排程进行到第几步
      anaErrMessage: '', // 分析排程错误提示
      progressColor: '#02bafd', // 进度条颜色
      checkSuccess: false, // 是否检查数据
      schedule_time: '', // 排程时间
      schedule_mode: '', // 正排或预排
      ana_time: '', // 分析排程的时间
      feasible: '', // 是否可行
      obj_value: '', // 目标值
      overdue_value: '', // 逾期
      idle_value: '', // 停顿
      line_balance: '', // 线平衡
      three_days_points: '', // 三天总点数
      options_history_analysis: [], // 历史分析结果
      options_history_excel: [], // 历史Excel
      selectFileName: '', // 选中的历史Excel文件名
      selectAnaTime: '', // 根据选中的分析时间获取历史分析结果
      beginAnaBtn: false, // 开始分析禁用按钮
      generateAnaBtn: true, // 生成表格禁用按钮
      statisticsBtn: true, // 获取量化禁用按钮
      downloadAnaBtn: true, // 下载表格禁用按钮
      ana_progress_refresh: null, // 分析排程刷新进度条
      ana_error_refresh: null, // 分析排程刷新提示信息
      // 分析排程进度条相关
      percentage_1: 0,
      percentage_2: 0,
      percentage_3: 0,
      progress_text_1: '预处理|未开始',
      progress_text_2: '分析|未开始',
      progress_text_3: '输出表格|未开始',
      progressCount: 0,
      // 量化结果
      tableData_1: [],
      tableData_2: [],
      tableData_3: [],
      tableData_4: [],
      loading_table1: true,
      loading_table2: true,
      loading_table3: true,
      loading_table4: true,
      pushDialogVisible: false, // 推送排程接口
      smtUnscheduledTip: '未推送',
      smtPrescheduledTip: '未推送',
      smtScheduledTip: '未推送',
      aiUnscheduledTip: '未推送',
      aitPrescheduledTip: '未推送',
      aitScheduledTip: '未推送',
      // 检查相关
      alertTitle: '提示信息',
      alertType: 'info', // success error warning info
      locked_list: lockedList,
      unlocked_list: unLockedList,
      allLineList: lineOptions,
      // 剪切数据
      cutRangeData: null,
      // 导入后直接推送排程
      isAnalysis: false, // 是否分析排程
      checkCount: 0, // 检查次数（如果是导入直接推送，只允许检查一次）
      lock_state_idx: 1, // 锁定状态列数
      require_date_idx: 5, // 需求日列数
      line_idx: 2, // 排线线别列数

      saveApiCustweekSelfcreateTip: '未推送' // 是否推送量化结果

    }
  },
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  created() {
    // this.getHistoryExcelItem()
  },
  mounted() {
    this.initLuckysheet()
  },
  methods: {
    // dialog可拖拽
    handleDrag() {
      // this.$refs.select.blur()
    },
    // 初始化luckysheet
    initLuckysheet() {
      const options = {
        container: 'luckysheet',
        lang: 'zh',
        column: 52, // 列数
        showinfobar: false // 不显示luckysheet图标
      }
      window.luckysheet.create(options)
    },
    // 剪切操作
    cut() {
      this.cutRangeData = window.luckysheet.getRangeValue() // 获取到选取数据
      window.luckysheet.deleteRange('up') // 删除选区，下方单元格向上移动
    },
    insertCut() {
      const data = window.luckysheet.getRangeWithFlatten()
      const index_row = data[0]['r']
      window.luckysheet.insertRow(index_row, { number: this.cutRangeData.length }) // 增加行(行数为选取的行数)
      window.luckysheet.setRangeShow([{ row: [index_row, index_row + this.cutRangeData.length - 1], column: [0, 51] }])
      window.luckysheet.setRangeValue(this.cutRangeData) // 将数据插入选取
    },
    // 导入后直接推送排程（不通过分析）
    async importPushSchedule() {
      if (this.uploadFileName === '') {
        this.$message({
          type: 'warning',
          message: '未上传文件'
        })
        return
      }
      const checkLoading = {
        text: '数据检查中...',
        background: 'rgba(0, 0, 0, 0.5)'
      }
      this.loadingInstance = Loading.service(checkLoading)
      const form = new FormData()
      form.append('file', this.uploadFile)
      await CheckData(form).then(res => {
        this.showAlertMessage(res.data_list, res.message_type)
        this.$confirm(res.message, '检查结果', {
          customClass: 'checkAlertBox',
          dangerouslyUseHTMLString: true,
          confirmButtonText: '进行分析排程',
          cancelButtonText: '取消',
          type: res.message_type
        }).then(() => {
          this.continueImportPushSchedule()
          // this.pushDialogVisible = true
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消分析'
          })
        })
        this.loadingInstance.close()
      }).catch(err => {
        this.loadingInstance.close() // 清除动画
        this.$alert('检查出现错误：' + err, '错误', {
          confirmButtonText: '确定',
          type: 'error'
        })
      })
    },
    // 导入推送接口
    async continueImportPushSchedule() {
      const importLoading = {
        text: '导入并分析排程中，请稍等...',
        background: 'rgba(0, 0, 0, 0.5)'
      }
      this.loadingInstance = Loading.service(importLoading)
      const form = new FormData()
      form.append('file', this.uploadFile)
      form.append('file_name', this.uploadFileName)
      form.append('user_name', this.name)
      await ImportPushSchedule(form).then(res => {
        this.loadingInstance.close()
        this.pushDialogVisible = true
        this.$alert(res.message, '导入成功', {
          confirmButtonText: '确定',
          type: 'success'
        })
      }).catch(err => {
        this.loadingInstance.close() // 清除动画
        this.$alert(err, '错误', {
          confirmButtonText: '确定',
          type: 'error'
        })
      })
    },
    handleImportPushClose() {
      this.importPushDialogVisible = false
    },
    // 以下函数都是推送排程相关
    pushSchedule() {
      if (this.isAnalysis === true) {
        this.pushDialogVisible = true
      } else {
        this.$alert('未完成分析排程，无法进行推送！', '警告', {
          confirmButtonText: '确定',
          type: 'warning'
        })
      }
    },
    handlePushClose() {
      this.pushDialogVisible = false
    },
    post_unscheduled() {
      this.loadingInstance = Loading.service(this.pushLoading)
      const form = {
        'user_name': this.name
      }
      SmtUnscheduled(form).then(res => {
        if (res.code === 20000) {
          this.$alert(res.message, '推送排程成功', {
            confirmButtonText: '确定',
            type: 'success'
          })
          this.smtUnscheduledTip = '已推送'
        } else {
          this.$alert('推送失败', '错误', {
            confirmButtonText: '确定',
            type: 'error'
          })
        }
        this.loadingInstance.close() // 清除动画
      }).catch(err => {
        this.loadingInstance.close() // 清除动画
        this.$alert(err, '错误', {
          confirmButtonText: '确定',
          type: 'error'
        })
      })
    },
    post_pre_scheduled() {
      this.loadingInstance = Loading.service(this.pushLoading)
      const form = {
        'user_name': this.name
      }
      SmtPrescheduled(form).then(res => {
        if (res.code === 20000) {
          this.$alert(res.message, '推送排程成功', {
            confirmButtonText: '确定',
            type: 'success'
          })
          this.smtPrescheduledTip = '已推送'
        } else {
          this.$alert('推送失败', '错误', {
            confirmButtonText: '确定',
            type: 'error'
          })
        }
        this.loadingInstance.close() // 清除动画
      }).catch(err => {
        this.loadingInstance.close() // 清除动画
        this.$alert(err, '错误', {
          confirmButtonText: '确定',
          type: 'error'
        })
      })
    },
    post_scheduled() {
      this.loadingInstance = Loading.service(this.pushLoading)
      const form = {
        'user_name': this.name
      }
      SmtScheduled(form).then(res => {
        if (res.code === 20000) {
          this.$alert(res.message, '推送排程成功', {
            confirmButtonText: '确定',
            type: 'success'
          })
          this.smtScheduledTip = '已推送'
        } else {
          this.$alert('推送失败', '错误', {
            confirmButtonText: '确定',
            type: 'error'
          })
        }
        this.loadingInstance.close() // 清除动画
      }).catch(err => {
        this.loadingInstance.close() // 清除动画
        this.$alert(err, '错误', {
          confirmButtonText: '确定',
          type: 'error'
        })
      })
    },
    post_ai_unscheduled() {
      this.loadingInstance = Loading.service(this.pushLoading)
      const form = {
        'user_name': this.name
      }
      AiUnscheduled(form).then(res => {
        if (res.code === 20000) {
          this.$alert(res.message, '推送排程成功', {
            confirmButtonText: '确定',
            type: 'success'
          })
          this.aiUnscheduledTip = '已推送'
        } else {
          this.$alert('推送失败', '错误', {
            confirmButtonText: '确定',
            type: 'error'
          })
        }
        this.loadingInstance.close() // 清除动画
      }).catch(err => {
        this.loadingInstance.close() // 清除动画
        this.$alert(err, '错误', {
          confirmButtonText: '确定',
          type: 'error'
        })
      })
    },
    post_ai_pre_scheduled() {
      this.loadingInstance = Loading.service(this.pushLoading)
      const form = {
        'user_name': this.name
      }
      AiPrescheduled(form).then(res => {
        if (res.code === 20000) {
          this.$alert(res.message, '推送排程成功', {
            confirmButtonText: '确定',
            type: 'success'
          })
          this.aiPrescheduledTip = '已推送'
        } else {
          this.$alert('推送失败', '错误', {
            confirmButtonText: '确定',
            type: 'error'
          })
        }
        this.loadingInstance.close() // 清除动画
      }).catch(err => {
        this.loadingInstance.close() // 清除动画
        this.$alert(err, '错误', {
          confirmButtonText: '确定',
          type: 'error'
        })
      })
    },
    post_ai_scheduled() {
      this.loadingInstance = Loading.service(this.pushLoading)
      const form = {
        'user_name': this.name
      }
      AiScheduled(form).then(res => {
        if (res.code === 20000) {
          this.$alert(res.message, '推送排程成功', {
            confirmButtonText: '确定',
            type: 'success'
          })
          this.aiScheduledTip = '已推送'
        } else {
          this.$alert('推送失败', '错误', {
            confirmButtonText: '确定',
            type: 'error'
          })
        }
        this.loadingInstance.close() // 清除动画
      }).catch(err => {
        this.loadingInstance.close() // 清除动画
        this.$alert(err, '错误', {
          confirmButtonText: '确定',
          type: 'error'
        })
      })
    },
    // 推送量化结果
    post_statistics() {
      this.$confirm('提示', {
        title: '提示',
        message: '确定要推送量化结果？',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const pushLoading = {
          text: '推送中，请稍等...',
          background: 'rgba(0, 0, 0, 0.5)'
        } // 导入排程动画
        this.loadingInstance = Loading.service(pushLoading)
        const form = {
          'user_name': this.name
        }
        SaveApiCustweekSelfcreate(form).then(res => {
          if (res.code === 20000) {
            this.$alert(res.message, '推送量化结果成功', {
              confirmButtonText: '确定',
              type: 'success'
            })
            this.saveApiCustweekSelfcreateTip = '已推送'
          } else {
            this.$alert('推送失败', '错误', {
              confirmButtonText: '确定',
              type: 'error'
            })
          }
          this.loadingInstance.close() // 清除动画
        }).catch(err => {
          this.loadingInstance.close() // 清除动画
          this.$alert(err, '错误', {
            confirmButtonText: '确定',
            type: 'error'
          })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消推送'
        })
      })
    },
    // 上传文件
    loadExcelFile(file, fileList) {
      const fileName = file.name
      if (!fileName.includes('预排') && !fileName.includes('正排')) {
        const tip = '上传的文件名未指明预排/正排，请修改后重新上传！！' + `<br/>` + '（注：文件名中需要包含正排或预排）'
        this.$alert(tip, '错误', {
          confirmButtonText: '确定',
          dangerouslyUseHTMLString: true,
          type: 'error'
        })
        return
      }
      if (!fileName.includes('主板') && !fileName.includes('小板')) {
        const tip = '上传的文件名未指明主板/小板，请修改后重新上传！' + `<br/>` + '（注：文件名中需要包含主板/小板，例如：0901主板预排结果）'
        this.$alert(tip, '错误', {
          confirmButtonText: '确定',
          dangerouslyUseHTMLString: true,
          type: 'error'
        })
        return
      }
      if (fileList.length > 0) {
        this.uploadFiles = fileList = [fileList[fileList.length - 1]] // 选择最后一次选择文件
        this.uploadFileName = this.uploadFiles[0].name // 更新文件名
        this.uploadFile = this.uploadFiles[0].raw // 更新文件
      }
      const excelFile = fileList[0].raw // 获取文件流
      LuckyExcel.transformExcelToLucky(excelFile, function(exportJson, luckysheetfile) {
        window.luckysheet.create({
          container: 'luckysheet',
          showinfobar: false,
          data: exportJson.sheets,
          title: exportJson.info.name,
          userInfo: exportJson.info.name.creator,
          column: 52, // 列数
          lang: 'zh',
          hook: { // 冻结首行，添加钩子，初始化后冻结首行
            workbookCreateAfter: function() {
              window.luckysheet.setHorizontalFrozen(false)
            }
          }
        })
      })
      this.checkSuccess = false // 重置检查
      this.checkCount = 0 // 重置检查次数
      this.isAnalysis = false // 重置检查分析排程
      this.resetAlertMessage() // 重置上方Alert提示信息
    },
    // 分析排程dialog
    analysisDialog() {
      this.analysisDialogVisible = true
      this.beginAnaBtn = false
      this.generateAnaBtn = true
      // this.clearAnaProgress()
      this.getHistoryAnaItem()
      this.progressCount = 0
      if (this.checkSuccess === true) {
        this.stepNow = 1
      }
    },
    // 关闭分析排程
    closeAnalysis() {
      this.analysisDialogVisible = false
      this.clearListenProgress()
    },
    // 开始分析
    beginAnalysis() {
      // 表格为空
      if (!window.luckysheet.getCellValue(0, 0)) {
        this.$message({
          type: 'warning',
          message: '未检测到数据，无法分析排程'
        })
        return
      }
      // 上传格式错误
      if (window.luckysheet.getAllSheets()[0].name !== '今日排程' && window.luckysheet.getAllSheets()[1].name !== '未上排程') {
        this.$message({
          type: 'warning',
          message: '排程表格Sheet命名错误，无法分析排程'
        })
        return
      }
      if (this.alertType !== 'success') {
        this.$confirm('数据检查未通过，确定要开始分析排程?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.beforeAnalysis()
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消分析'
          })
        })
      } else {
        this.beforeAnalysis()
      }
    },
    // 计算前判断是否在跑排程
    beforeAnalysis() {
      const confirmText = ['目前正在计算排程，确定要分析排程？', '注意：此操作将会同时影响计算排程和分析排程！']
      const newDatas = []
      const h = this.$createElement
      for (const i in confirmText) {
        newDatas.push(h('p', null, confirmText[i]))
      }
      // if (this.checkSuccess === false) {
      //   this.$message({
      //     type: 'error',
      //     message: '数据未检查，无法开始分析！'
      //   })
      //   return
      // }
      GetRunFlag().then(res => {
        if (res.run_flag === 1) {
          this.$confirm('警告', {
            title: '警告',
            message: h('div', null, newDatas),
            confirmButtonText: '确定分析',
            cancelButtonText: '取消',
            confirmButtonClass: 'btnDanger',
            type: 'warning'
          }).then(() => {
            this.beginAnalysis()
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '取消分析'
            })
          })
        } else {
          this.analysisExcel()
        }
      })
    },
    // 分析排程
    analysisExcel() {
      this.clearAnaProgress() // 清空进度条
      this.resetShowAnaData() // 重置所有显示信息
      const wb = this.getSheetJs(false) // luckysheet获取sheet，并且转化为SheetJS的格式
      const blob = this.workbook2blob(wb) // SheetJS转化为文件流
      const form_data = new FormData() // 新建表单
      form_data.append('files', blob) // 在线表格文件流
      form_data.append('file_name', this.uploadFileName) // 在线表格文件流
      form_data.append('user_name', this.name) // 在线表格文件流
      this.$message({
        type: 'success',
        message: '开始分析'
      })
      this.listenProgress()
      this.stepNow = 2
      AnalysisExcel(form_data).then(res => {
        this.isAnalysis = true // 分析完成
      }).catch(err => {
        this.$alert(err, '错误', {
          confirmButtonText: '确定',
          type: 'error'
        })
      })
    },
    // 生成表格
    generateAnaExcel() {
      this.$message({
        type: 'success',
        message: '开始生成表格,预计需要1~2分钟'
      })
      this.stepNow = 3
      this.generateAnaBtn = true
      GenerateAnaExcel().then(res => {
        console.log('generate done')
      }).catch(err => {
        this.$alert(err, '错误', {
          confirmButtonText: '确定',
          type: 'error'
        })
      })
    },
    // 下载表格
    downloadAnaExcel() {
      DownloadAnaExcel().then(res => {
        this.stepNow = 4
        this.$message({
          type: 'success',
          message: '开始下载'
        })
        this.downloadFile(res)
      }).catch(err => {
        console.log(err)
        this.$message({
          type: 'error',
          message: '下载请求出错'
        })
      })
    },
    // 监听进度条
    listenProgress() {
      this.ana_progress_refresh = setInterval(() => { // 每隔2秒监听进度条
        setTimeout(this.getAnaProgress(), 0)
      }, 2000)
    },
    // 取消监听进度条
    clearListenProgress() {
      clearInterval(this.ana_progress_refresh)
      this.ana_progress_refresh = null
    },
    // 分析排程进度条
    getAnaProgress() {
      GetAnaProgress().then(res => {
        this.percentage_1 = res.p0
        this.percentage_2 = res.p1
        this.percentage_3 = res.p2
        this.progress_text_1 = res.p0text
        this.progress_text_2 = res.p1text
        this.progress_text_3 = res.p2text
        const run_flag = res.run_flag
        if (run_flag === -1) {
          this.clearListenProgress()
          this.$message({
            type: 'error',
            message: '分析出错'
          })
          this.anaErrMessage = '分析出错：' + res.ana_err_message
        } else if (run_flag === 1 && res.p2 > 0 && this.progressCount === 0) {
          this.$message({
            type: 'success',
            message: '分析完毕，可以生成表格'
          })
          this.stepNow = 2
          // 分析完毕，可以点击生成表格的按钮
          this.generateAnaBtn = false
          this.progressCount = 1
          // 显示分析排程的结果
          this.showAnaData(res, 0)
        } else if (run_flag === 2) {
          // 生成表格后就不再监听进度条
          this.clearListenProgress()
          this.$message({
            type: 'success',
            message: '生成表格完毕，可以下载表格和获取量化'
          })
          // 生成表格完毕，可以下载
          this.downloadAnaBtn = false
          this.statisticsBtn = false
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 清空分析排程进度条
    clearAnaProgress() {
      ClearAnaProgress().then(res => {
        console.log(res.message)
      }).catch(err => {
        console.log(err)
        this.$message({
          type: 'error',
          message: '清空进度条请求出错'
        })
      })
    },
    // 显示分析排程结果
    showAnaData(res, flag) {
      if (flag === 0) {
        this.ana_time = '(最新分析结果)'
      } else {
        let time = this.selectAnaTime
        const time_date = time.substring(0, 10)
        const time_time = time.substring(11).replaceAll('-', ':')
        time = time_date + ' ' + time_time
        this.ana_time = '(分析时间：' + time + ')'
      }
      this.schedule_mode = res.new_mode
      this.schedule_time = res.new_time
      this.feasible = res.new_feasible_str
      this.obj_value = res.new_obj_value
      this.overdue_value = res.new_overdue_value
      this.idle_value = res.new_real_idle_value
      this.line_balance = res.new_line_balance_value
      this.three_days_points = res.new_three_days_points
    },
    // 重置分析排程显示信息
    resetShowAnaData() {
      // 清空进度条
      this.percentage_1 = 0
      this.percentage_2 = 0
      this.percentage_3 = 0
      this.progress_text_1 = '预处理|未开始'
      this.progress_text_2 = '分析|未开始'
      this.progress_text_3 = '输出表格|未开始'
      // 开始分析，禁用按钮按钮
      this.beginAnaBtn = true
      this.generateAnaBtn = true
      this.downloadAnaBtn = true
      this.statisticsBtn = true
      // 清空上一份排程结果
      this.schedule_time = ''
      this.schedule_mode = ''
      this.ana_time = ''
      this.feasible = ''
      this.obj_value = ''
      this.overdue_value = ''
      this.idle_value = ''
      this.line_balance = ''
      this.three_days_points = ''
      // 清空错误提示
      this.anaErrMessage = ''
    },
    // 获取分析排程历史选择项
    getHistoryAnaItem() {
      this.options_history_analysis = []
      GetHistoryAnaItem().then(res => {
        const data = res.Items
        for (const key in data) {
          const temp = {}
          const first_name = data[key]['first']
          const second_name = data[key]['second']
          temp['value'] = second_name
          temp['label'] = first_name + '-' + second_name
          this.options_history_analysis.push(temp)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 获取历史分析结果
    getHistoryAnaData() {
      GetHistoryAnaData({ 'time': this.selectAnaTime }).then(res => {
        this.showAnaData(res, 1)
        this.$message({
          type: 'success',
          message: '获取成功'
        })
      }).catch(err => {
        console.log(err)
        this.$message({
          type: 'error',
          message: '获取失败'
        })
      })
    },
    // 获取历史Excel选择项
    getHistoryExcelItem() {
      this.options_history_excel = []
      GetHistoryExcelItem().then(res => {
        const data = res.Items
        for (const key in data) {
          const temp = {}
          temp['value'] = data[key]
          temp['label'] = data[key]
          this.options_history_excel.push(temp)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 获取历史Excel TODO
    getHistoryExcelData() {
      GetHistoryExcelData({ 'file_name': this.selectFileName }).then(res => {
        this.$message({
          type: 'success',
          message: '获取成功'
        })
        this.checkSuccess = false // 重置检查
      }).catch(err => {
        console.log(err)
        this.$message({
          type: 'error',
          message: '获取失败'
        })
      })
    },
    updateSheet(exportJson, luckysheetfile) {
      if (exportJson.sheets == null || exportJson.sheets.length === 0) {
        alert('加载失败!')
        return
      }
      window.luckysheet.destroy()
      window.luckysheet.create({
        container: 'luckysheet',
        showinfobar: false,
        data: exportJson.sheets,
        title: exportJson.info.name,
        userInfo: exportJson.info.name.creator,
        lang: 'zh',
        row: 60, // 初始化行数
        column: 16, // 列数
        hook: {
          workbookCreateAfter: function() {
            window.luckysheet.setHorizontalFrozen(false, { order: 0 }) // 冻结首行
            window.luckysheet.setHorizontalFrozen(false, { order: 1 })
          }
        }
      })
    },
    // 量化结果 TODO
    statisticsSchedule() {
      if (this.uploadFileName !== '') {
        this.statisticsTitle = '量化结果 - ' + this.uploadFileName
      } else {
        this.statisticsTitle = '量化结果'
      }
      this.statisticsDialogVisible = true
      this.stepNow = 4
      StatisticsSchedule().then(res => {
        this.$message({
          type: 'success',
          message: '量化成功'
        })
        this.tableData_1 = res.table_data1
        this.tableData_2 = res.table_data2
        this.tableData_3 = res.table_data3
        this.tableData_4 = res.table_data4
        this.loading_table1 = false
        this.loading_table2 = false
        this.loading_table3 = false
        this.loading_table4 = false
      })
    },
    // 量化结果导出到Excel TODO
    exportStatisticsExcel() {
      var xlsxParam = {
        raw: true
      } // 转换成excel时，使用原始的格式，这样导出的时候数字过长不会变成科学计数法
      const workbook = XLSX.utils.book_new()
      // 添加多个sheet页
      const ws1 = XLSX.utils.table_to_sheet(document.querySelector('#table1'), xlsxParam)
      XLSX.utils.book_append_sheet(workbook, ws1, 'table1')
      const ws2 = XLSX.utils.table_to_sheet(document.querySelector('#table2'), xlsxParam)
      XLSX.utils.book_append_sheet(workbook, ws2, 'table2')
      const ws3 = XLSX.utils.table_to_sheet(document.querySelector('#table3'), xlsxParam)
      XLSX.utils.book_append_sheet(workbook, ws3, 'table3')
      const ws4 = XLSX.utils.table_to_sheet(document.querySelector('#table4'), xlsxParam)
      XLSX.utils.book_append_sheet(workbook, ws4, 'table4')
      const wbout = XLSX.write(workbook, {
        bookType: 'xlsx',
        bookSST: true,
        type: 'array'
      })
      try {
        FileSaver.saveAs(
          new Blob([wbout], {
            type: 'application/octet-stream;charset=utf-8"'
          }), '量化结果.xlsx')
      } catch (e) {
        if (typeof console !== 'undefined') console.log(e, wbout)
      }
      return wbout
    },
    // 是否关闭分析排程
    handleCloseAnalysis() {
      this.$confirm('确定关闭分析排程窗口？', '提示', {
        type: 'warning',
        confirmButtonText: '确认',
        cancelButtonText: '取消'
      }).then(_ => {
        this.analysisDialogVisible = false
      }).catch(_ => {})
    },
    // 是否关闭量化结果
    handleCloseStatistics() {
      this.$confirm('确认关闭量化窗口？', '提示', {
        type: 'warning',
        confirmButtonText: '确认',
        cancelButtonText: '取消'
      }).then(_ => {
        this.statisticsDialogVisible = false
      }).catch(_ => {})
    },
    // 下载luckysheet中的数据到Excel
    downloadLuckyExcel() {
      this.getSheetJs(true)
    },
    // 将字符串转ArrayBuffer
    s2ab(str) {
      const buf = new ArrayBuffer(str.length)
      const view = new Uint8Array(buf)
      for (let i = 0; i !== str.length; ++i) view[i] = str.charCodeAt(i) & 0xff
      return buf
    },
    // 将workbook转换成bolb
    workbook2blob(workbook) {
      const wbOpts = {
        bookType: 'xlsx',
        // 是否生成Shared String Table，官方解释是，如果开启生成速度会下降，但在低版本IOS设备上有更好的兼容性
        bookSST: false,
        type: 'binary'
      }
      const wbOut = XLSX.write(workbook, wbOpts)
      return new Blob([this.s2ab(wbOut)], { type: 'application/octer-stream' })
    },
    // luckysheet 的 data 转化为 SheetJS的数据
    sheetDataToJs(downOriginData) {
      const arr = [] // 所有的单元格数据组成的二维数组
      let cellValue = null
      let max_row = downOriginData.length // 默认行长度
      let max_col = downOriginData[0].length // 默认列长度
      // 根据锁定状态列来判断数据有多少条
      for (let col = downOriginData[0].length; col > 0; col--) {
        if (downOriginData[0][col] != null) {
          max_col = col + 1
          break
        }
      }
      // 根据表头来判断数据有多少条
      for (let row = downOriginData.length; row > 0; row--) {
        if (downOriginData[row] != null) {
          max_row = row + 1
          break
        }
      }
      // 获取二维数组
      for (let row = 0; row < max_row; row++) {
        const arrRow = [] // 一行数据
        for (let col = 0; col < max_col; col++) {
        // 等号赋值并且判断是否存在值
          if (downOriginData[row][col]) {
            cellValue = downOriginData[row][col]
          } else {
            cellValue = { m: '', v: '' }
          }
          let is_exist = true
          let text_val
          // 获取带有换行的文本
          try {
            text_val = cellValue.ct.s[0].v
          } catch (err) {
            is_exist = false
          }
          if (is_exist) {
            arrRow.push(text_val)
          } else if (cellValue.ct != null && cellValue.ct.t === 'd') {
            // m 是展示值
            arrRow.push(cellValue.m)
          } else {
            // v是实际值
            arrRow.push(cellValue.v)
          }
        }
        arr.push(arrRow)
      }
      // 通过SheetJs将数据转化为excel格式数据
      const opts = {
        cellDates: false,
        cellStyles: true
      }
      return XLSX.utils.aoa_to_sheet(arr, opts)
    },
    // 返回当前sheet的数据，并转化为SheetJS格式
    getSheetJs(download_flag) {
      const today_schedule_name = '今日排程'
      const unschedule_name = '未上排程'
      let today_schedule_sheet = null
      let unschedule_sheet = null
      const allSheetData = window.luckysheet.getAllSheets()
      for (let i = 0; i < allSheetData.length; i++) {
        if (allSheetData[i].name === today_schedule_name) {
          today_schedule_sheet = allSheetData[i]
        } else if (allSheetData[i].name === unschedule_name) {
          unschedule_sheet = allSheetData[i]
        }
      }
      const sheets = {}
      if (today_schedule_sheet) {
        sheets[[today_schedule_name]] = Object.assign({}, this.sheetDataToJs(today_schedule_sheet.data))
      }
      if (unschedule_sheet) {
        sheets[[unschedule_name]] = Object.assign({}, this.sheetDataToJs(unschedule_sheet.data))
      }

      const workbook = {
        SheetNames: [today_schedule_name, unschedule_name],
        Sheets: sheets
      }
      if (download_flag === false) {
        return workbook
      } else {
        // 直接下载当前sheet的数据
        const fileName = '在线表格'
        XLSX.writeFile(workbook, fileName + '.xlsx')
      }
    },
    // 从后端下载表格
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
    // 显示Alert提示信息
    showAlertMessage(data_list, message_type) {
      if (data_list.length > 0) {
        this.alertType = message_type
        // 删除上一次的提示信息
        const alert_div = document.getElementById('alertMessage')
        while (alert_div.hasChildNodes()) { // 当div下还存在子节点时 循环继续
          alert_div.removeChild(alert_div.firstChild)
        }
        for (var i = 0; i < data_list.length; i++) {
          // 显示提示信息
          const div_text = document.createElement('div')
          div_text.innerHTML = data_list[i]
          alert_div.appendChild(div_text) // 将标签插入到指定标签中
        }
      }
    },
    // 重置Alert提示信息
    resetAlertMessage() {
      this.alertType = 'info'
      const alert_div = document.getElementById('alertMessage')
      while (alert_div.hasChildNodes()) { // 当div下还存在子节点时 循环继续
        alert_div.removeChild(alert_div.firstChild)
      }
      const div_text = document.createElement('div')
      div_text.innerHTML = '提示信息'
      alert_div.appendChild(div_text) // 将标签插入到指定标签中
    },
    // 后端数据检查
    async checkDataBackend() {
      this.checkCount += 1 // 检查次数+1
      window.luckysheet.exitEditMode() // 退出编辑模式
      // 表格为空
      if (!window.luckysheet.getCellValue(0, 0)) {
        this.$message({
          type: 'warning',
          message: '未检测到数据'
        })
        this.showAlertMessage(['未检测到数据'], 'warning')
        return
      }
      // 上传格式错误
      if (window.luckysheet.getAllSheets()[0].name !== '今日排程' && window.luckysheet.getAllSheets()[1].name !== '未上排程') {
        this.$message({
          type: 'warning',
          message: '排程表格Sheet命名错误，无法进行检查'
        })
        this.showAlertMessage(['排程表格Sheet命名错误，无法进行检查'], 'error')
        return
      }
      const checkLoading = {
        text: '数据检查中...',
        background: 'rgba(0, 0, 0, 0.5)'
      }
      this.loadingInstance = Loading.service(checkLoading)
      const wb = this.getSheetJs(false) // luckysheet获取sheet，并且转化为SheetJS的格式
      const blob = this.workbook2blob(wb) // SheetJS转化为文件流
      const form = new FormData()
      form.append('file_name', this.uploadFileName)
      form.append('file', blob)
      await CheckData(form).then(res => {
        if (res.message_type === 'success') {
          this.$alert(res.message, '检查结果', {
            confirmButtonText: '确定',
            type: 'success'
          })
        } else {
          this.$alert(res.message, '检查结果', {
            customClass: 'checkAlertBox',
            dangerouslyUseHTMLString: true,
            confirmButtonText: '确定',
            type: res.message_type
          })
        }
        this.showAlertMessage(res.data_list, res.message_type)
        this.loadingInstance.close()
      }).catch(err => {
        this.loadingInstance.close() // 清除动画
        this.$alert('检查出现错误：' + err, '错误', {
          confirmButtonText: '确定',
          type: 'error'
        })
      })
    }
  }
}
</script>
<style lang="scss" scoped>
  @import '../../assets/css/Control/OnlineTable.scss';
</style>
<style>
.card-control .el-card__body{
    padding: 0px;
}
.card-luckysheet .el-card__body{
    padding: 0px;
}
.dialog-analysis .el-card__body{
    padding: 10px;
}
.ana-res-card .el-card__header{
  padding: 10px;
}

.my-table .el-table th.is-leaf{
  border: none;
}
.my-table .el-table td{
  border: none;
}
.my-table  .el-table::before{
  height: 0;
}
.statistics-dialog .el-card__body{
    padding: 0px;
}
.btnDanger{
  background-color: #F56C6C !important;
  border-color: #F56C6C !important;
}
.btnDanger:hover{
  background-color: #f04747 !important;
  border-color: #f04747 !important;
}
.layui-progress-bar-ol{
    margin-top: 10px;
}
.layui-progress-bar-ol .el-progress-bar__inner:before {
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
}
</style>
