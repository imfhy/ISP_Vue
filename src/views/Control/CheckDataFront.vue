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
    importPushSchedule() {
      const tip = '数据未检查或检查未通过，无法导入推送！' + `<br/>` + '注意：检查无误后才可以导入推送排程！' + `<br/>` + '（如果检查出现错误，请在原Excel文件中修改后重新上传）'
      if (this.checkSuccess === false) {
        this.$alert(tip, '警告', {
          confirmButtonText: '确定',
          dangerouslyUseHTMLString: true,
          customClass: 'checkAlertBox',
          type: 'warning'
        })
        return
      }
      if (this.checkCount > 1) {
        const tip2 = '未在原Excel文件中修改错误，无法导入推送！' + `<br/>` + '提示：请在原Excel文件修改错误并重新上传后再次检查！'
        this.$alert(tip2, '警告', {
          confirmButtonText: '确定',
          dangerouslyUseHTMLString: true,
          customClass: 'checkAlertBox',
          type: 'warning'
        })
        return
      }
      this.$confirm('确定要导入排程并进行推送？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.continueImportPushSchedule()
        // this.pushDialogVisible = true
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消导入'
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
      SmtUnscheduled().then(res => {
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
      SmtPrescheduled().then(res => {
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
      SmtScheduled().then(res => {
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
      AiUnscheduled().then(res => {
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
      AiPrescheduled().then(res => {
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
      AiScheduled().then(res => {
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
        SaveApiCustweekSelfcreate().then(res => {
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
      if (this.checkSuccess === false) {
        this.$confirm('数据未检查，确定要开始分析排程?', '提示', {
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
        console.log('analysis done')
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

    // 自定义提示，弹框提示并同步修改el-alert组件的内容
    checkAlert(title, info, type) {
      this.$alert(info, title, {
        confirmButtonText: '确定',
        type: type,
        callback: action => {
          if (title === '今日排程' || title === '未上排程') {
            this.alertTitle = title + '：' + info
          } else {
            this.alertTitle = info
          }
          this.alertType = type
        }
      })
    },
    // 检查
    checkData() {
      this.checkCount += 1 // 检查次数+1
      window.luckysheet.exitEditMode() // 退出编辑模式
      // 表格为空
      if (!window.luckysheet.getCellValue(0, 0)) {
        this.checkAlert('警告', '未检测到数据!', 'warning')
        return
      }
      // 上传格式错误
      if (window.luckysheet.getAllSheets()[0].name !== '今日排程' && window.luckysheet.getAllSheets()[1].name !== '未上排程') {
        this.checkAlert('错误', '请检查上传的数据的是否正确！', 'error')
        return
      }
      // 今日排程Sheet：第2行一定要为空行，且第3行一定有数据（为了方便后续的检查）
      if (window.luckysheet.getCellValue(1, this.lock_state_idx, { order: 0 }) || !window.luckysheet.getCellValue(2, this.lock_state_idx, { order: 0 })) {
        this.checkAlert('错误', '空行错误，要求第2行有且仅有一个空行!', 'error')
        return
      }
      for (let idx = 0; idx < 2; idx++) {
        const sheet_name = window.luckysheet.getAllSheets()[idx].name
        const acu_max_row = this.get_acu_max_row(idx) // 有数据的最后行数
        const max_row = this.get_max_row(idx) // Sheet最大行数
        // 获取需求日列表
        const requiredate_dic = {}
        for (let i = 2; i < acu_max_row; i++) {
          const tmp_val = window.luckysheet.getCellValue(i, this.require_date_idx, { type: 'v', order: idx })
          if (tmp_val) {
            requiredate_dic[i + 1] = tmp_val
          } else {
            requiredate_dic[i + 1] = ''
          }
        }
        // 开始检查
        this.clear_color(max_row, idx) // 检查之前清理掉错误的背景色
        if (sheet_name === '今日排程') {
          // 获取锁定状态列
          const lock_state_list = [] // 存放锁定状态
          let tmp_lock_dic = {}
          for (let i = 2; i < acu_max_row; i++) {
            const tmp_val = window.luckysheet.getCellValue(i, this.lock_state_idx, { order: idx })
            if (tmp_val) {
              tmp_lock_dic[i + 1] = tmp_val // 字典 key：所在行号 value：锁定状态
            } else {
              lock_state_list.push(tmp_lock_dic)
              tmp_lock_dic = {}
            }
          }
          lock_state_list.push(tmp_lock_dic) // push最后一个字典
          // 获取排线线别、排线顺序、存放线别分隔行
          const line_list = [] // 存放排线线别
          const line_order_list = [] // 存放排线顺序
          const line_dic = {} // 所有线别字典，用于检查空行
          const line_count = [] // 排线类别数目
          let tmp_line = '' // 排线线别
          let tmp_line_order = 0 // 排线线别顺序
          let tmp_line_dic = {} // 排线线别 key:行数 value：排线线别
          let tmp_line_order_dic = {} // 排线线别顺序
          let ahead_line = window.luckysheet.getCellValue(2, this.line_idx, { order: idx }).substring(0, 4) // 前一种排线线别
          line_count.push(ahead_line)
          for (let i = 2; i < acu_max_row; i++) {
            let tmp_val = window.luckysheet.getCellValue(i, this.line_idx, { order: idx })
            if (tmp_val) {
              if (tmp_val.length > 4) {
                let tmp_list = []
                tmp_val = tmp_val.replace('，', ',') // 防止输入中文的逗号
                tmp_list = tmp_val.split(',')
                tmp_line = tmp_list[0]
                tmp_line_order = Number(tmp_list[1])
              } else {
                tmp_line = tmp_val
                tmp_line_order = -1
              }
              tmp_line_dic[i + 1] = tmp_line
              tmp_line_order_dic[i + 1] = tmp_line_order
              line_dic[i + 1] = tmp_line
              if (tmp_line !== ahead_line) { // 线别种类数目
                line_count.push(tmp_line)
                ahead_line = tmp_line
              }
            } else {
              line_list.push(tmp_line_dic)
              line_order_list.push(tmp_line_order_dic)
              tmp_line_dic = {} // 清空字典
              tmp_line_order_dic = {}
            }
          }
          const line_count_set = new Set(line_count) // 用Set去重，得到排线类别
          const line_array = Array.from(line_count_set) // 转为数组，用于判断长度
          line_list.push(tmp_line_dic) // push最后一个字典
          line_order_list.push(tmp_line_order_dic)
          const error_0000 = this.check_todaysheet_blank_line(line_dic, line_array.length, acu_max_row)
          if (error_0000.length > 0) {
            if (error_0000[0]['row'] === -1) {
              this.check_data_alert('提示', '请检查不同线别之间是否有空行隔开！', 'error')
            } else {
              this.check_error_print('今日排程', '行为多余空行', 'error', error_0000, idx)
            }
            return
          }
          const error_1000 = this.check_todaysheet_lock_state_format(lock_state_list)
          if (error_1000.length > 0) {
            this.check_error_print('今日排程", "行锁定状态命名错误', 'error', error_1000, idx)
            return
          }
          const error_2000 = this.check_todaysheet_line_format(line_list)
          if (error_2000.length > 0) {
            this.check_error_print('今日排程', '行排线线别命名错误', 'error', error_2000, idx)
            return
          }
          const error_2001 = this.check_todaysheet_same_line(line_list)
          if (error_2001.length > 0) {
            this.check_error_print('今日排程', '行排线线别错误', 'error', error_2001, idx)
            return
          }
          const error_1001 = this.check_todaysheet_exist_notschedule(lock_state_list)
          if (error_1001.length > 0) {
            this.check_error_print('今日排程', '行锁定状态错误,出现未上排程,已自动修正为未锁定', 'error', error_1001, idx)
            return
          }
          const error_1002 = this.check_todaysheet_lock_state_order(lock_state_list)
          if (error_1002.length > 0) {
            this.check_error_print('今日排程', '行锁定状态错误，未锁定后存在已锁定', 'error', error_1002, idx)
            return
          }
          const error_2002 = this.check_todaysheet_line_order(line_order_list)
          if (error_2002.length > 0) {
            this.check_error_print('今日排程', '行排线线别顺序错误', 'error', error_2002, idx)
            return
          }
        } else if (sheet_name === '未上排程') {
          // 获取锁定状态
          const lock_state_dic = {}
          for (let i = 1; i < acu_max_row; i++) {
            const tmp_val = window.luckysheet.getCellValue(i, this.lock_state_idx, { order: idx })
            if (tmp_val) {
              lock_state_dic[i + 1] = tmp_val
            } else {
              lock_state_dic[i + 1] = '' // 表示空行
            }
          }
          // 获取排线线别
          const line_dic = {}
          for (let i = 1; i < acu_max_row; i++) {
            const tmp_val = window.luckysheet.getCellValue(i, this.line_idx, { order: idx })
            if (tmp_val) {
              line_dic[i + 1] = tmp_val
            } else {
              line_dic[i + 1] = '' // 表示空行
            }
          }
          const error_1000_ = this.check_notschedule_lock_state_format(lock_state_dic)
          if (error_1000_.length > 0) {
            this.check_error_print('未上排程', '行锁定状态命名错误,已自动修正为“未上排程”', 'error', error_1000_, idx)
            return
          }
          const error_2000_ = this.check_notschedule_line_format(line_dic)
          if (error_2000_.length > 0) {
            this.check_error_print('未上排程', '行排线线别命名错误,已自动修正为“未排”', 'error', error_2000_, idx)
            return
          }
          const error_0000_ = this.check_notschedule_blank_line(lock_state_dic)
          if (error_0000_.length > 0) {
            this.check_error_print('未上排程', '行为多余空行', 'error', error_0000_, idx)
            return
          }
        }
        const error_4000 = this.checck_require_date_format(requiredate_dic, idx) // 格式化日期
        if (error_4000.length > 0) {
          this.check_error_print(sheet_name, '行日期格式错误，已自动修正为YYYY-MM-DD格式[Error 4-000]', 'error', error_4000, idx)
          return
        }
      }
      this.checkAlert('提示', '检查完成，未发现错误', 'success')
      this.checkSuccess = true
    },

    // 获取最大表格最大行数（包括首行），参数:0:"今日排程" or 1:'未上排程'
    get_max_row(idx) {
      const allSheetData = window.luckysheet.getAllSheets()[idx].data
      return allSheetData.length
    },
    // 获取最大列数
    get_max_col(idx) {
      const allSheetData = window.luckysheet.getAllSheets()[idx].data
      return allSheetData[0].length
    },
    // 获取Sheet中存在数据的最后一行
    get_acu_max_row(idx) {
      const max_row = this.get_max_row(idx)
      for (let i = max_row - 1; i > 0; i--) {
        const tmp_val = window.luckysheet.getCellValue(i, this.lock_state_idx, { order: idx })
        if (tmp_val) {
          return i + 1
        }
      }
    },
    // 今日排程：检查锁定状态命名是否有误，返回错误行号[Error 1-000]
    check_todaysheet_lock_state_format(lock_state_list) {
      const error_row_list = [] // 存放错误的行号
      for (let i = 0; i < lock_state_list.length; i++) {
        for (const key in lock_state_list[i]) {
          const tmp_dic = {}
          if (!this.locked_list.includes(lock_state_list[i][key]) && !this.unlocked_list.includes(lock_state_list[i][key])) {
            tmp_dic['row'] = key
            tmp_dic['col'] = this.lock_state_idx
            error_row_list.push(tmp_dic)
          }
        }
      }
      return error_row_list
    },
    // 今日排程：检查排线线别命名是否有误[Error 2-000]
    check_todaysheet_line_format(line_list) {
      const error_row_list = []
      for (let i = 0; i < line_list.length - 1; i++) {
        for (const key in line_list[i]) {
          const tmp_dic = {}
          if (!this.allLineList.includes(line_list[i][key])) {
            tmp_dic['row'] = key
            tmp_dic['col'] = this.line_idx
            error_row_list.push(tmp_dic)
          }
        }
      }
      return error_row_list
    },
    // 今日排程：锁定状态中出现“未上排程”标签，将锁定状态自动修正为“未锁定”[Error 1-001]
    check_todaysheet_exist_notschedule(lock_state_list) {
      const error_row_list = []
      for (let i = 0; i < lock_state_list.length; i++) {
        for (const key in lock_state_list[i]) {
          const tmp_dic = {}
          if (lock_state_list[i][key] === '未上排程') {
            tmp_dic['row'] = key
            tmp_dic['col'] = this.lock_state_idx
            error_row_list.push(tmp_dic)
            window.luckysheet.setCellValue(Number(key) - 1, this.lock_state_idx, '未锁定', { order: 0 })
          }
        }
      }
      return error_row_list
    },
    // 今日排程：检查每个线别的已锁定是否在未锁定状态之前[Error 1-002]
    check_todaysheet_lock_state_order(lock_state_list) {
      const error_row_list = []
      for (let i = 0; i < lock_state_list.length; i++) {
        let lock_end_flag = 0 // lock_end_flag=1表示一种线别的锁定遍历结束
        for (const key in lock_state_list[i]) {
          const tmp_dic = {}
          if (lock_end_flag === 0 && this.unlocked_list.includes(lock_state_list[i][key])) { // 锁定状态结束
            lock_end_flag = 1
          } else if (lock_end_flag === 1 && this.locked_list.includes(lock_state_list[i][key])) { // 未锁定中存在锁定
            tmp_dic['row'] = key
            tmp_dic['col'] = this.lock_state_idx
            error_row_list.push(tmp_dic)
          }
        }
      }
      return error_row_list
    },
    // 今日排程：未排序线别为已锁定[error:1003]
    heck_todaysheet_disorder_is_locked(lock_state_list, line_order_list) {
      const error_row_list = []
      for (let i = 0; i < line_order_list.length; i++) {
        const tmp_dic = {}
        if (line_order_list[i] === ' ') {
          continue
        }
        if (line_order_list[i] === -1 && this.locked_list.includes(lock_state_list[i])) {
          tmp_dic['row'] = i + 1
          tmp_dic['col'] = this.line_idx
          error_row_list.push(tmp_dic)
        }
      }
      return error_row_list
    },

    // 今日排程：检查分隔以内的线别是否均相同[Error 2-001]
    check_todaysheet_same_line(line_list) {
      const error_row_list = [] // 存放错误的行号
      for (let i = 0; i < line_list.length; i++) {
        let max_line
        let max_count = 0
        const tmp_dic = {}
        for (const key in line_list[i]) {
          const tmp_val = line_list[i][key]
          tmp_dic[tmp_val] === undefined ? tmp_dic[tmp_val] = 1 : tmp_dic[tmp_val]++
          if (tmp_dic[tmp_val] > max_count) {
            max_count = tmp_dic[tmp_val]
            max_line = tmp_val
          }
        }
        if (Object.keys(tmp_dic).length > 1) { // 大于1说明有2种以上的线别
          for (var key in line_list[i]) {
            const error_dic = {}
            if (line_list[i][key] !== max_line) {
              error_dic['row'] = key
              error_dic['col'] = this.line_idx
              error_row_list.push(error_dic)
            }
          }
        }
      }
      return error_row_list
    },
    // 今日排程：检查排线线别的顺序[Error 2-002]
    check_todaysheet_line_order(line_order_list) {
      const error_row_list = []
      for (let i = 0; i < line_order_list.length - 1; i++) {
        let first_flag = 0 // 第一个不为1直接错误
        let order_end_flag = 0 // 有序号的部分结束
        for (var key in line_order_list[i]) {
          const tmp_dic = {}
          // 是否按照1,2,3,...,n的顺序
          if (first_flag === 0 && line_order_list[i][key] !== 1) { // 保证线别第一个为1
            tmp_dic['row'] = key
            tmp_dic['col'] = this.line_idx
            error_row_list.push(tmp_dic)
            return error_row_list
          } else if (first_flag < 1) {
            first_flag = 1
            continue
          }
          if (line_order_list[i][key] !== -1) {
            if (line_order_list[i][Number(key) - 1] + 1 !== line_order_list[i][key]) {
              tmp_dic['row'] = key
              tmp_dic['col'] = this.line_idx
              error_row_list.push(tmp_dic)
            }
          } else if (line_order_list[i][key] === -1) {
            order_end_flag = 1
          }
          // 没有序号的线别后面又出现有序号的线别
          if (order_end_flag === 1 && line_order_list[i][key] > -1) {
            tmp_dic['row'] = key
            tmp_dic['col'] = this.line_idx
            error_row_list.push(tmp_dic)
          }
        }
      }
      return error_row_list
    },
    // 今日排程：检查空行，线别之间有两行以上的空行为错误，并且同一线别之间不能有空行[Error 0-000]
    check_todaysheet_blank_line(line_dic, line_count, acu_max_row) {
      let blank_row_count = 0
      let blank_idx = 0
      const tmp_dic = {}
      const error_row_list = []
      for (let i = 2; i < acu_max_row; i++) {
        const tmp_val = window.luckysheet.getCellValue(i, this.lock_state_idx, { order: 0 })
        if (tmp_val) {
          blank_idx = 0
          tmp_dic[i + 1] = 1
        } else {
          blank_idx -= 1
          blank_row_count += 1
          tmp_dic[i + 1] = blank_idx
        }
      }
      // 检查分隔空行是否大于1行、以及检查一种线别内是否存在空行
      if (blank_row_count + 1 > line_count) {
        for (const key in tmp_dic) {
          const error_dic = {}
          if (tmp_dic[key] < -1) {
            error_dic['row'] = key
            error_dic['col'] = this.lock_state_idx
            error_row_list.push(error_dic)
          } else if (tmp_dic[key] === -1 && line_dic[Number(key) - 1] === line_dic[Number(key) + 1]) {
            error_dic['row'] = key
            error_dic['col'] = this.lock_state_idx
            error_row_list.push(error_dic)
          }
        }
        // 线别之间没有空行隔开则错误
      } else if (blank_row_count + 1 < line_count) {
        const error_dic = {}
        error_dic['row'] = -1
        error_dic['col'] = -1
        error_row_list.push(error_dic)
      }
      return error_row_list
    },

    // 未上排程：锁定状态不是“未上排程”时，将锁定状态自动修正为“未上排程”，排线线别修正为“未排”[Error 1-000]
    check_notschedule_lock_state_format(lock_state_list) {
      const error_row_list = []
      for (const key in lock_state_list) {
        const tmp_dic = {}
        if (lock_state_list[key] === '') {
          continue
        } else if (lock_state_list[key] !== '未上排程') {
          tmp_dic['row'] = key
          tmp_dic['col'] = this.lock_state_idx
          error_row_list.push(tmp_dic)
          window.luckysheet.setCellValue(Number(key) - 1, this.lock_state_idx, '未上排程', { order: 1 })
          window.luckysheet.setCellValue(Number(key) - 1, this.line_idx, '未排', { order: 1 })
        }
      }
      return error_row_list
    },

    // 未上排程：排线线别不是“未排”时，将排线线别自动修正为“未排”[Error 2-000]
    check_notschedule_line_format(line_dic) {
      const error_row_list = []
      for (const key in line_dic) {
        const tmp_dic = {}
        if (line_dic[key] === '') {
          continue
        } else if (line_dic[key] !== '未排') {
          tmp_dic['row'] = key
          tmp_dic['col'] = this.line_idx
          error_row_list.push(tmp_dic)
          window.luckysheet.setCellValue(Number(key) - 1, this.lock_state_idx, '未上排程', { order: 1 })
          window.luckysheet.setCellValue(Number(key) - 1, this.line_idx, '未排', { order: 1 })
        }
      }
      return error_row_list
    },

    // 未上排程：检查空行，数据之间不能有空行[Error 0-000]
    check_notschedule_blank_line(line_dic) {
      const error_row_list = []
      let begin_flag = 0 // 开始有数据
      for (const key in line_dic) {
        const tmp_dic = {}
        if (begin_flag === 0 && line_dic[key]) {
          begin_flag = 1
        } else if (begin_flag === 1 && line_dic[key] === '') { // 空行
          tmp_dic['row'] = key
          tmp_dic['col'] = this.lock_state_idx
          error_row_list.push(tmp_dic)
        }
      }
      return error_row_list
    },

    // 将日期格式yyyy-mm-dd hh:mm:ss改为yyyy-mm-dd[error:4000]
    checck_require_date_format(requiredate_dic, idx) {
      const error_row_list = []
      for (const key in requiredate_dic) {
        const tmp_dic = {}
        if (requiredate_dic[key] === '') {
          continue
        } else {
          const tmp = Number(requiredate_dic[key])
          if (!isNaN(tmp)) { // 如果不能转为数字，则返回NaN
            const right_date = this.require_date_days_to_format(requiredate_dic[key], '-')
            tmp_dic['row'] = key
            tmp_dic['col'] = this.require_date_idx
            error_row_list.push(tmp_dic)
            window.luckysheet.setCellValue(Number(key) - 1, this.require_date_idx, right_date, { order: idx }) // 自动修正
          }
        }
      }
      return error_row_list
    },

    // 将Excel中的天数转化为日期
    require_date_days_to_format(number, format = '-') {
      // 如果numb为空则返回空字符串
      if (!number) {
        return ''
      }
      const time = new Date(new Date('1900-1-1').getTime() + (number - 1) * 3600 * 24 * 1000)
      const year = time.getFullYear() + ''
      const month = time.getMonth() + 1 + ''
      const date = time.getDate()
      if (format && format.length === 1) {
        return year + format + (month < 10 ? '0' + month : month) + format + (date < 10 ? '0' + date : date)
      }
      return year + (month < 10 ? '0' + month : month) + (date < 10 ? '0' + date : date)
    },

    // 给所有错误的单元格染色sheet_idx：0为今日排程，1为未上排程
    set_error_color(error_list, sheet_idx) {
      for (let i = 0; i < error_list.length; i++) {
        const row = error_list[i].row
        const col = error_list[i].col
        window.luckysheet.setCellFormat(row - 1, col, 'bg', '#fc7171', { order: sheet_idx })
      }
    },

    // 检查无误后给已染色为'#fc7171'的单元格染为白色
    clear_color(max_row, idx) {
      // 锁定状态
      for (let row = 1; row < max_row; row++) {
        if (window.luckysheet.getCellValue(row, this.lock_state_idx, { type: 'bg', order: idx }) === '#fc7171') {
          window.luckysheet.setCellFormat(row, this.lock_state_idx, 'bg', 'null', { order: idx })
        }
      }
      // 排线线别
      for (let row = 1; row < max_row; row++) {
        // 如果有必要写背景颜色的判断，应该统一为该文件的全局来控制静态
        // 或者简化为不管颜色什么，都清空
        if (window.luckysheet.getCellValue(row, this.line_idx, { type: 'bg', order: idx }) === '#fc7171') {
          window.luckysheet.setCellFormat(row, this.line_idx, 'bg', 'null', { order: idx })
        }
      }
    },
    // 将所有错误的行号转为一个字符串
    error_row_to_str(error_list) {
      let error_str = ''
      for (let i = 0; i < error_list.length; i++) {
        error_str = error_str + error_list[i].row + ','
      }
      return error_str.substring(0, error_str.length - 1)
    },

    // 检查的提示 sheet名、提示信息、错误的行和列、sheet索引
    check_error_print(title, info, type, error_list, idx) {
      const error_row = this.error_row_to_str(error_list)
      this.set_error_color(error_list, idx)
      this.checkAlert(title, error_row + info, type)
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
        this.checkAlert('警告', '未检测到数据!', 'warning')
        return
      }
      // 上传格式错误
      if (window.luckysheet.getAllSheets()[0].name !== '今日排程' && window.luckysheet.getAllSheets()[1].name !== '未上排程') {
        this.checkAlert('错误', '请检查上传的数据的是否正确！', 'error')
        return
      }
      // 今日排程Sheet：第2行一定要为空行，且第3行一定有数据（为了方便后续的检查）
      if (window.luckysheet.getCellValue(1, this.lock_state_idx, { order: 0 }) || !window.luckysheet.getCellValue(2, this.lock_state_idx, { order: 0 })) {
        this.checkAlert('错误', '空行错误，要求第2行有且仅有一个空行!', 'error')
        return
      }
      const checkLoading = {
        text: '拼命检查中...',
        background: 'rgba(0, 0, 0, 0.5)'
      }
      this.loadingInstance = Loading.service(checkLoading)
      const wb = this.getSheetJs(false) // luckysheet获取sheet，并且转化为SheetJS的格式
      const blob = this.workbook2blob(wb) // SheetJS转化为文件流
      const form = new FormData()
      form.append('file', blob)
      await CheckData(form).then(res => {
        if (res.message_type === 'warning') {
          this.$alert(res.message, '检查结果', {
            customClass: 'checkAlertBox',
            dangerouslyUseHTMLString: true,
            confirmButtonText: '确定',
            type: 'warning'
          })
        } else {
          this.$alert(res.message, '检查结果', {
            confirmButtonText: '确定',
            type: 'success'
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
