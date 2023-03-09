<template>
  <div id="main">
    <el-card class="card-info">
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
          />
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="control">
          <div slot="header" class="clearfix">
            <span>控制中心</span>
          </div>
          <el-row>
            <el-col :span="24">
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
                />
                <el-tooltip class="item" effect="dark" :content="trainDateTip" placement="top">
                  <el-button type="primary" plain style="margin-top:2px;margin-left: 8px;" @click="trainModel">
                    <i class="el-icon-pie-chart" />
                    训练预测模型
                  </el-button>
                </el-tooltip>
              </div>
              <el-alert
                title="排程相关操作"
                type="info"
                :closable="false"
              />
              <div class="box-button">
                <el-row>
                  <el-col :span="8">
                    <el-button type="primary" plain @click="computeDialogMain">
                      <i class="el-icon-monitor" />
                      计算主板排程
                    </el-button>
                  </el-col>
                  <el-col :span="8">
                    <el-button type="primary" plain @click="computeDialogSmall">
                      <i class="el-icon-monitor" />
                      计算小板排程
                    </el-button>
                  </el-col>
                  <el-col :span="8">
                    <el-button type="primary" plain @click="computeDialogBoth">
                      <i class="el-icon-monitor" />
                      计算主板小板
                    </el-button>
                  </el-col>
                </el-row>
              </div>
              <div class="box-button">
                <el-row>
                  <el-col :span="8">
                    <el-button type="stopBtn" plain @click="stopTabu">
                      <i class="el-icon-warning-outline" />
                      终止深度搜索
                    </el-button>
                  </el-col>
                  <el-col :span="8">
                    <el-button type="stopBtn" plain @click="stopSchedule">
                      <i class="el-icon-warning-outline" />
                      终止计算排程
                    </el-button>
                  </el-col>
                  <el-button type="pushBtn" plain @click="post_statistics">
                    <i class="el-icon-upload2" />
                    推送量化结果
                  </el-button>
                </el-row>
              </div>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card style="margin-right: 16px;height: 400px;">
          <el-tabs v-model="activeName" type="card">
            <el-tab-pane label="主板下载" name="main">
              <el-row>
                <el-col :span="24">
                  <el-alert
                    title="主板下载历史数据"
                    type="info"
                    :closable="false"
                  />
                  <div class="box-button">
                    <el-select v-model="selectExcelValue" placeholder="选择主板历史排程">
                      <el-option
                        v-for="item in options_history_excel"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                    <el-button type="primary" plain style="margin-top:2px;margin-left: 8px;" @click="downloadHistoryExcel">
                      <i class="el-icon-download" />
                      下载历史排程
                    </el-button>
                  </div>
                  <el-alert
                    title="主板下载最新数据"
                    type="info"
                    :closable="false"
                  />
                  <div class="box-button">
                    <el-row>
                      <el-col :span="8">
                        <el-button type="primary" plain @click="downloadSchedule">
                          <i class="el-icon-download" />
                          下载主板排程
                        </el-button>
                      </el-col>
                      <el-col :span="8">
                        <el-button type="primary" plain @click="downloadIdleInfo">
                          <i class="el-icon-download" />
                          下载idle明细
                        </el-button>
                      </el-col>
                      <el-col :span="8">
                        <el-button type="primary" plain @click="downloadStatistics">
                          <i class="el-icon-download" />
                          下载量化结果
                        </el-button>
                      </el-col>
                    </el-row>
                  </div>
                  <div class="box-button">
                    <el-row>
                      <el-col :span="8">
                        <el-button type="primary" plain @click="downloadNoProgram">
                          <i class="el-icon-download" />
                          下载无程序表
                        </el-button>
                      </el-col>
                    </el-row>
                  </div>
                </el-col>
              </el-row>
            </el-tab-pane>
            <el-tab-pane label="小板下载" name="small">
              <el-row>
                <el-col :span="24">
                  <el-alert
                    title="小板下载历史数据"
                    type="info"
                    :closable="false"
                  />
                  <div class="box-button">
                    <el-select v-model="selectExcelValue" placeholder="选择小板历史排程">
                      <el-option
                        v-for="item in options_history_excel"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                    <el-button type="primary" plain style="margin-top:2px;margin-left: 8px;" @click="downloadHistoryExcel">
                      <i class="el-icon-download" />
                      下载历史排程
                    </el-button>
                  </div>
                  <el-alert
                    title="小板下载最新数据"
                    type="info"
                    :closable="false"
                  />
                  <div class="box-button">
                    <el-row>
                      <el-col :span="8">
                        <el-button type="primary" plain @click="downloadScheduleSmall">
                          <i class="el-icon-download" />
                          下载小板排程
                        </el-button>
                      </el-col>
                      <el-col :span="8">
                        <el-button type="primary" plain @click="downloadIdleInfoSmall">
                          <i class="el-icon-download" />
                          下载idle明细
                        </el-button>
                      </el-col>
                      <el-col :span="8">
                        <el-button type="primary" plain @click="downloadStatisticsSmall">
                          <i class="el-icon-download" />
                          下载量化结果
                        </el-button>
                      </el-col>
                    </el-row>
                  </div>
                </el-col>
              </el-row>
            </el-tab-pane>
            <el-tab-pane label="日志下载" name="log">
              <el-row>
                <el-col :span="24">
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
                    title="下载最新日志"
                    type="info"
                    :closable="false"
                  />
                  <div class="box-button">
                    <el-row>
                      <el-col :span="8">
                        <el-button type="primary" plain @click="downloadLatestLog">
                          <i class="el-icon-download" />
                          下载最新日志
                        </el-button>
                      </el-col>
                    </el-row>
                  </div>
                </el-col>
              </el-row>
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-col>
    </el-row>
    <el-card class="card-gantt">
      <div slot="header" class="clearfix">
        <span>甘特图</span>
      </div>
    </el-card>

    <el-dialog
      v-el-drag-dialog
      title="计算主板和小板排程"
      :visible.sync="computeBothDialogVisible"
      width="60%"
      :close-on-click-modal="false"
      :before-close="handleCloseBoth"
      @dragDialog="handleDrag"
    >
      <el-steps :active="stepNowBoth" finish-status="success" simple>
        <el-step title="上传排程" />
        <el-step title="导入排程" />
        <el-step title="更新信息" />
        <el-step title="计算排程" />
      </el-steps>
      <el-row style="margin-top:10px;">
        <el-col :span="6">
          <el-input placeholder="请上传主板排程文件" :value="uploadFileNameMain" />
        </el-col>
        <el-col :span="4">
          <el-upload
            ref="upload"
            class="upload-demo"
            action=""
            accept=".xlsx"
            :on-change="handleChangeMain"
            :auto-upload="false"
            :show-file-list="false"
            :file-list="uploadFileListMain"
            style="margin-left: 10px;"
          >
            <el-button slot="trigger" type="primary">
              上传主板排程
            </el-button>
          </el-upload>
        </el-col>
        <!-- <el-col :span="2">
          <el-tooltip class="item" effect="dark" :content="mainUploadName" placement="top">
            <el-button style="margin-left: 20px;" @click="getUploadFileMain">
              <i class="el-icon-download" />
            </el-button>
          </el-tooltip>
        </el-col> -->
        <el-col :span="6">
          <el-input style="margin-left: 10px;" placeholder="请上传小板排程文件" :value="uploadFileNameSmall" />
        </el-col>
        <el-col :span="4">
          <el-upload
            ref="upload"
            class="upload-demo"
            action=""
            accept=".xlsx"
            :on-change="handleChangeSmall"
            :auto-upload="false"
            :show-file-list="false"
            :file-list="uploadFileListSmall"
            style="margin-left: 20px;"
          >
            <el-button slot="trigger" type="primary">
              上传小板排程
            </el-button>
          </el-upload>
        </el-col>
        <el-col :span="4">
          <el-button type="success" style="margin-left:20px;" @click="beforeImportBoth">
            导入排程
          </el-button>
        </el-col>
      </el-row>
      <el-row style="margin-top: 10px;">
        <el-button @click="exportScheduleDataMain">
          导出主板
        </el-button>
        <el-button @click="exportScheduleDataSmall">
          导出小板
        </el-button>
        <el-tooltip class="item" effect="dark" :content="mainUploadName" placement="top">
          <el-button style="margin-left: 10px;" @click="getUploadFileMain">
            获取主板上传文件
          </el-button>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" :content="smallUploadName" placement="top">
          <el-button style="margin-left: 10px;" @click="getUploadFileSmall">
            获取小板上传文件
          </el-button>
        </el-tooltip>
      </el-row>
      <el-alert
        title="更新信息"
        type="info"
        :closable="false"
        style="margin-top: 10px;margin-bottom: 10px;"
      />
      <el-row>
        <el-col :span="24">
          <el-tooltip class="item" effect="dark" :content="apsProgramMsg" placement="top">
            <el-button type="primary" @click="getApsProgram('both')">
              更新程序信息
            </el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" :content="apsMtoolMsg" placement="top">
            <el-button type="primary" @click="getApsMtool('both')">
              更新钢网信息
            </el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" :content="apsMoBaseData" placement="top">
            <el-button type="primary" @click="getApsMoBaseData('both')">
              更新齐套信息
            </el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" :content="apsMoProgData" placement="top">
            <el-button type="primary" @click="getApsMoProgData('both')">
              更新工单进度
            </el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" :content="apsDeliveryDay" placement="top">
            <el-button type="primary" @click="getApsDeliveryDay('both')">
              更新包装时间
            </el-button>
          </el-tooltip>
        </el-col>
      </el-row>
      <el-alert
        title="计算排程"
        type="info"
        :closable="false"
        style="margin-top: 10px;margin-bottom: 10px;"
      />
      <el-button type="primary" @click="beforeComputeBoth">
        开始计算排程
      </el-button>
      <span slot="footer" class="dialog-footer">
        <el-tooltip class="item" effect="dark" content="刷新上传文件时间" placement="top">
          <el-button @click="getUploadFileTime">
            <i class="el-icon-refresh" />
          </el-button>
        </el-tooltip>
        <el-button @click="handleCloseBoth">
          关闭
        </el-button>
      </span>
    </el-dialog>

    <el-dialog
      v-el-drag-dialog
      title="计算主板排程"
      :visible.sync="computeMainDialogVisible"
      width="50%"
      :close-on-click-modal="false"
      :before-close="handleCloseMain"
      @dragDialog="handleDrag"
    >
      <el-steps :active="stepNowMain" finish-status="success" simple>
        <el-step title="上传排程" />
        <el-step title="导入排程" />
        <el-step title="更新信息" />
        <el-step title="计算排程" />
      </el-steps>
      <el-row style="margin-top:10px;">
        <el-col :span="8">
          <el-input placeholder="请上传主板排程文件" :value="uploadFileNameMain" />
        </el-col>
        <el-col :span="16">
          <el-upload
            ref="upload"
            class="upload-demo"
            action=""
            accept=".xlsx"
            :on-change="handleChangeMain"
            :auto-upload="false"
            :show-file-list="false"
            :file-list="uploadFileListMain"
            style="margin-left: 10px;"
          >
            <el-button slot="trigger" type="primary">
              上传主板排程
            </el-button>
            <el-button type="success" style="margin-left:10px;" @click="beforeImportMain">
              导入排程
            </el-button>
            <el-button @click="exportScheduleDataMain">
              导出主板
            </el-button>
          </el-upload>
        </el-col>
      </el-row>
      <el-alert
        title="更新信息"
        type="info"
        :closable="false"
        style="margin-top: 10px;margin-bottom: 10px;"
      />
      <el-row>
        <el-col :span="24">
          <el-tooltip class="item" effect="dark" :content="apsProgramMsg" placement="top">
            <el-button type="primary" @click="getApsProgram('main')">
              更新程序信息
            </el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" :content="apsMtoolMsg" placement="top">
            <el-button type="primary" @click="getApsMtool('main')">
              更新钢网信息
            </el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" :content="apsMoBaseData" placement="top">
            <el-button type="primary" @click="getApsMoBaseData('main')">
              更新齐套信息
            </el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" :content="apsMoProgData" placement="top">
            <el-button type="primary" @click="getApsMoProgData('main')">
              更新工单进度
            </el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" :content="apsDeliveryDay" placement="top">
            <el-button type="primary" @click="getApsDeliveryDay('main')">
              更新包装时间
            </el-button>
          </el-tooltip>
        </el-col>
      </el-row>
      <el-alert
        title="计算排程"
        type="info"
        :closable="false"
        style="margin-top: 10px;margin-bottom: 10px;"
      />
      <el-button type="primary" @click="beforeComputeMain">
        开始计算排程
      </el-button>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCloseMain">
          关闭
        </el-button>
      </span>
    </el-dialog>

    <el-dialog
      v-el-drag-dialog
      title="计算小板排程"
      :visible.sync="computeSmallDialogVisible"
      width="50%"
      :close-on-click-modal="false"
      :before-close="handleCloseSmall"
      @dragDialog="handleDrag"
    >
      <el-steps :active="stepNowSmall" finish-status="success" simple>
        <el-step title="上传排程" />
        <el-step title="导入排程" />
        <el-step title="更新信息" />
        <el-step title="计算排程" />
      </el-steps>
      <el-row style="margin-top:10px;">
        <el-col :span="8">
          <el-input placeholder="请上传小板排程文件" :value="uploadFileNameSmall" />
        </el-col>
        <el-col :span="16">
          <el-upload
            ref="upload"
            class="upload-demo"
            action=""
            accept=".xlsx"
            :on-change="handleChangeSmall"
            :auto-upload="false"
            :show-file-list="false"
            :file-list="uploadFileListSmall"
            style="margin-left: 10px;"
          >
            <el-button slot="trigger" type="primary">
              上传小板排程
            </el-button>
            <el-button type="success" style="margin-left:10px;" @click="beforeImportSmall">
              导入排程
            </el-button>
            <el-button @click="exportScheduleDataSmall">
              导出小板
            </el-button>
          </el-upload>
        </el-col>
      </el-row>
      <el-alert
        title="更新信息"
        type="info"
        :closable="false"
        style="margin-top: 10px;margin-bottom: 10px;"
      />
      <el-row>
        <el-col :span="24">
          <el-tooltip class="item" effect="dark" :content="apsProgramMsg" placement="top">
            <el-button type="primary" @click="getApsProgram('small')">
              更新程序信息
            </el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" :content="apsMtoolMsg" placement="top">
            <el-button type="primary" @click="getApsMtool('small')">
              更新钢网信息
            </el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" :content="apsMoBaseData" placement="top">
            <el-button type="primary" @click="getApsMoBaseData('small')">
              更新齐套信息
            </el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" :content="apsMoProgData" placement="top">
            <el-button type="primary" @click="getApsMoProgData('small')">
              更新工单进度
            </el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" :content="apsDeliveryDay" placement="top">
            <el-button type="primary" @click="getApsDeliveryDay('small')">
              更新包装时间
            </el-button>
          </el-tooltip>
        </el-col>
      </el-row>
      <el-alert
        title="计算排程"
        type="info"
        :closable="false"
        style="margin-top: 10px;margin-bottom: 10px;"
      />
      <el-button type="primary" @click="beforeComputeSmall">
        开始计算排程
      </el-button>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCloseSmall">
          关闭
        </el-button>
      </span>
    </el-dialog>

    <el-dialog
      v-el-drag-dialog
      title="提示"
      :visible.sync="stopScheduleDialog"
      width="30%"
      :before-close="handleCloseStop"
      @dragDialog="handleDrag"
    >
      <p style="font-size:16px;">请在下方输入框输入<span style="color:#F56C6C;font-weight:bold;"> 确认终止 </span>后点击确定以终止排程！</p>
      <el-input v-model="stopInput" placeholder="请输入" style="width: 200px;" />
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCloseStop">取 消</el-button>
        <el-button type="primary" @click="confirmStopSchedule">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { Loading } from 'element-ui'
import elDragDialog from '@/directive/el-drag-dialog'
import { GetProgress, TrainModel, ImportSchedule, ComputeScheduleMain, DownloadSchedule, DownloadLatestLog,
  DownloadNoProgram, GetLogSelectItem, DownloadHistoryLog, DownloadIdleInfoMain, GetRunFlag, StopTabu,
  GeScheduleRes, StopSchedule, GetApsMtool, CheckData, ExportMainScheduleData, GetApsProgram, DownloadStatisticsMain,
  GetExcelSelectItem, DownloadHistoryExcel, ImportScheduleBoth, ComputeScheduleSmall, DownloadScheduleSmall,
  GetApsMoBaseData, GetApsMoProgData, DownloadUploadFileMain, DownloadUploadFileSmall,
  GetUploadFileTime, ComputeScheduleBoth, ExportSmallScheduleData, GetApsDeliveryDay, SaveApsOutPutCount,
  DownloadStatisticsSmall, DownloadIdleInfoSmall, CheckDataNew } from '@/api/Control/SchedulePanel'
export default {
  name: 'SchedulePanel',
  directives: { elDragDialog },
  data() {
    return {
      progressColor: '#02bafd', // 进度条颜色

      computeMainDialogVisible: false, // 计算主板排程dialog
      computeSmallDialogVisible: false, // 计算小板排程dialog
      computeBothDialogVisible: false, // 计算主板+小板排程dialog

      stepNowMain: 0, // 计算主板排程
      stepNowSmall: 0, // 计算主板排程
      stepNowBoth: 0, // 计算主板+小板排程

      uploadFileListMain: [], // 主板上传的文件列表
      uploadFileMain: null, // 主板上传的文件
      uploadFileNameMain: '', // 主板文件名

      uploadFileListSmall: [], // 小板上传的文件列表
      uploadFileSmall: null, // 小板上传的文件
      uploadFileNameSmall: '', // 小板文件名

      checkLoading: {
        text: '拼命检查中...',
        background: 'rgba(0, 0, 0, 0.6)'
      }, // 检查动画
      importLoading: {
        text: '拼命导入中...',
        background: 'rgba(0, 0, 0, 0.5)'
      }, // 导入排程动画
      loadingInstance: null, // 动画实例
      trainDate: new Date(), // 训练预测模型日期

      options_history_log: [], // 历史日志列表
      selectLogValue: '', // 当前选中的历史日志
      options_history_excel: [], // 历史排程列表
      selectExcelValue: '', // 当前选中的要下载的历史日志
      isImportMain: false, // 是否上传文件
      isImportMainSmall: false, // 是否上传小板
      isImportBoth: false, // 是否上传主板小板
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
      apsMtoolMsg: '未更新', // 钢网信息更新提示
      apsProgramMsg: '未更新', // 程序信息更新提示
      apsMoProgData: '未更新', // 更新工单进度提示
      apsMoBaseData: '未更新', // 更新齐套信息提示
      apsDeliveryDay: '未更新', // 更新包装时间提示
      stopScheduleDialog: false, // 终止计算排程dialog
      stopInput: '', // 确认终止
      trainDateTip: '', // 训练日期提示

      activeName: 'main',
      mainUploadName: '获取主板上传文件',
      smallUploadName: '获取小板上传文件',

      saveApsOutPutCountTip: '未推送',

      clickComputeCount: 0 // 点击计算排程的次数
    }
  },
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  created() {
    this.getLogSelectItem()
    this.getExcelSelectItem()
    this.listenProgress()
    this.getScheduleRes()
  },
  mounted() {

  },
  methods: {
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
    // 终止计算排程
    handleCloseStop() {
      this.stopScheduleDialog = false
      this.stopInput = ''
    },
    stopSchedule() {
      GetRunFlag().then(res => {
        if (res.run_flag !== 1) {
          this.$message({
            type: 'warning',
            message: '未在计算排程，无需终止！'
          })
        } else {
          this.stopScheduleDialog = true
        }
      })
    },
    confirmStopSchedule() {
      if (this.stopInput !== '确认终止') {
        this.$message({
          type: 'error',
          message: '输入错误！'
        })
      } else {
        StopSchedule(this.name).then(res => {
          if (res.code === 20000) {
            this.$alert(res.message, '提示', {
              confirmButtonText: '确定',
              type: 'success'
            })
            setTimeout(() => {
              this.handleCloseStop()
            }, 1000)
          }
        })
      }
    },
    getScheduleRes() {
      GeScheduleRes().then(res => {
        if (res.code === 20000) {
          this.schedule_result = res.table_data
          this.schedule_mode = res.mode
          this.schedule_time = res.date
          this.trainDateTip = '当前模型日期：' + res.train_date
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
    // 计算主板排程
    computeDialogMain() {
      this.computeMainDialogVisible = true
    },
    // 计算小板排程
    computeDialogSmall() {
      this.computeSmallDialogVisible = true
    },
    // 计算主板+小板
    computeDialogBoth() {
      this.computeBothDialogVisible = true
      this.getUploadFileTime()
    },
    // 关闭计算主板
    handleCloseMain() {
      this.clickComputeCount = 0
      this.computeMainDialogVisible = false
    },
    // 关闭计算小板
    handleCloseSmall() {
      this.clickComputeCount = 0
      this.computeSmallDialogVisible = false
    },
    // 关闭计算主板+小板
    handleCloseBoth() {
      this.clickComputeCount = 0
      this.computeBothDialogVisible = false
    },
    // 主板文件上传钩子
    handleChangeMain(file, fileList) {
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
      if (!fileName.includes('主板')) {
        const tip = '上传的文件名未指明是主板排程，请修改后重新上传！' + `<br/>` + '（注：文件名中需要包含主板，例如：0901主板预排）'
        this.$alert(tip, '错误', {
          confirmButtonText: '确定',
          dangerouslyUseHTMLString: true,
          type: 'error'
        })
        return
      }
      if (file.status === 'ready') {
        if (fileList.length > 0) {
          this.uploadFileListMain = [fileList[fileList.length - 1]] // 选择最后一次选择文件
          this.uploadFileNameMain = this.uploadFileListMain[0].name // 更新文件名
          this.uploadFileMain = this.uploadFileListMain[0].raw // 更新文件
        }
        this.checkDataBackend(this.uploadFileMain, this.uploadFileNameMain)
      }
    },
    // 小板文件上传钩子
    handleChangeSmall(file, fileList) {
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
      if (!fileName.includes('小板')) {
        const tip = '上传的文件名未指明是小板排程，请修改后重新上传！' + `<br/>` + '（注：文件名中需要包含小板，例如：0901小板预排）'
        this.$alert(tip, '错误', {
          confirmButtonText: '确定',
          dangerouslyUseHTMLString: true,
          type: 'error'
        })
        return
      }
      if (file.status === 'ready') {
        if (fileList.length > 0) {
          this.uploadFileListSmall = [fileList[fileList.length - 1]] // 选择最后一次选择文件
          this.uploadFileNameSmall = this.uploadFileListSmall[0].name // 更新文件名
          this.uploadFileSmall = this.uploadFileListSmall[0].raw // 更新文件
        }
        this.checkDataBackend(this.uploadFileSmall, this.uploadFileNameSmall)
      }
    },
    // 检查
    async checkData(uploadFile, uploadFileName) {
      this.loadingInstance = Loading.service(this.checkLoading)
      const form = new FormData()
      form.append('file', uploadFile)
      form.append('file_name', uploadFileName)
      await CheckData(form).then(res => {
        if (res.type === 'success') {
          this.$alert(res.message, '检查结果', {
            confirmButtonText: '确定',
            type: 'success'
          })
        } else {
          this.$alert(res.message, '检查结果', {
            customClass: 'checkAlertBox',
            dangerouslyUseHTMLString: true,
            confirmButtonText: '确定',
            type: 'warning'
          })
        }
        if (this.uploadFileNameMain !== '') {
          this.stepNowMain = 1
        } else if (this.uploadFileListSmall !== '') {
          this.stepNowSmall = 1
        } else if (this.uploadFileNameMain !== '' && this.uploadFileNameSmall !== '') {
          this.stepNowBoth = 1
        }
        this.loadingInstance.close()
      }).catch(err => {
        this.loadingInstance.close() // 清除动画
        this.$alert('检查出现异常：' + err, '错误', {
          confirmButtonText: '确定',
          type: 'error'
        })
      })
    },
    // 新版检查
    async checkDataBackend(uploadFile, uploadFileName) {
      this.loadingInstance = Loading.service(this.checkLoading)
      const form = new FormData()
      form.append('file', uploadFile)
      form.append('file_name', uploadFileName)
      await CheckDataNew(form).then(res => {
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
        if (this.uploadFileNameMain !== '') {
          this.stepNowMain = 1
        } else if (this.uploadFileListSmall !== '') {
          this.stepNowSmall = 1
        } else if (this.uploadFileNameMain !== '' && this.uploadFileNameSmall !== '') {
          this.stepNowBoth = 1
        }
        this.loadingInstance.close()
      }).catch(err => {
        this.loadingInstance.close() // 清除动画
        this.$alert('检查出现异常：' + err, '错误', {
          confirmButtonText: '确定',
          type: 'error'
        })
      })
    },
    // 获取主板上传的文件
    getUploadFileMain() {
      DownloadUploadFileMain().then(res => {
        this.uploadFileNameMain = res.file_name
        this.stepNowMain = 1
        if (this.uploadFileListMain !== '' && this.uploadFileListSmall !== '') {
          this.stepNowBoth = 1
        }
      }).catch(err => {
        console.log(err)
        this.$message({
          message: '获取失败',
          type: 'error'
        })
      })
    },
    // 获取小板上传的文件
    getUploadFileSmall() {
      DownloadUploadFileSmall().then(res => {
        this.uploadFileNameSmall = res.file_name
        this.stepNowSmall = 1
        if (this.uploadFileNameMain !== '' && this.uploadFileNameSmall !== '') {
          this.stepNowBoth = 1
        }
      }).catch(err => {
        console.log(err)
        this.$message({
          message: '获取失败',
          type: 'error'
        })
      })
    },
    // 获取文件上传时间
    getUploadFileTime() {
      GetUploadFileTime().then(res => {
        if (res.code === 20000) {
          this.mainUploadName = '获取主板上传文件' + res.main_time
          this.smallUploadName = '获取小板上传文件' + res.small_time
        }
      })
    },
    // 终止深度搜索
    stopTabu() {
      this.$confirm('确定要终止深度搜索？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        StopTabu(this.name).then(res => {
          if (res.code === 20000) {
            this.$message({
              message: res.message,
              type: 'success'
            })
          }
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
      GetRunFlag().then(res => {
        if (res.run_flag === 1) {
          this.$message({
            type: 'error',
            message: '正在计算排程，无法训练预测模型！'
          })
        } else {
          this.listenProgress()
          TrainModel({ 'end_time': this.trainDate }).then(res => {
            if (res.code === 20000) {
              this.$message({
                message: res.message,
                type: 'success'
              })
              this.trainDateTip = '当前模型日期：' + res.train_date
            }
          })
        }
      })
    },
    // 导入后更新接口更新提示
    clearUpdateMag() {
      this.apsMtoolMsg = '未更新'
      this.apsProgramMsg = '未更新'
      this.apsMoBaseData = '未更新'
      this.apsMoProgData = '未更新'
      this.apsDeliveryDay = '未更新'
    },
    // 更新步骤条
    updateApiStepMsg() {
      this.stepNowBoth = 3
      this.stepNowMain = 3
      this.stepNowSmall = 3
    },
    // 导入主板前判断是否在跑排程
    beforeImportMain() {
      if (this.uploadFileNameMain === '') {
        this.$message({
          type: 'warning',
          message: '未上传排程文件，无法导入'
        })
        return
      }
      const confirmText = ['目前正在运行排程，确定要继续导入？', '注意：此操作将会影响当前运行的排程结果！']
      const newDatas = []
      const h = this.$createElement
      for (const i in confirmText) {
        newDatas.push(h('p', null, confirmText[i]))
      }
      GetRunFlag().then(res => {
        if (res.run_flag === 1) {
          this.$confirm('警告', {
            title: '警告',
            message: h('div', null, newDatas),
            confirmButtonText: '确定，仍要导入',
            cancelButtonText: '取消',
            confirmButtonClass: 'btnDanger',
            type: 'warning'
          }).then(() => {
            this.submitUploadFile(1)
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '取消计算'
            })
          })
        } else {
          this.submitUploadFile(1)
        }
      })
    },
    // 计算主板前判断是否在跑排程
    beforeComputeMain() {
      if (this.isImportMain === false) {
        this.$message({
          type: 'warning',
          message: '未导入文件，无法计算排程'
        })
        return
      }
      if (this.clickComputeCount >= 1) {
        this.$message({
          type: 'warning',
          message: '已开始计算排程，请勿重复点击'
        })
        return
      }
      const confirmText = ['目前正在运行排程，确定要重新开始计算？', '注意：此操作将会中断当前的排程！']
      const newDatas = []
      const h = this.$createElement
      for (const i in confirmText) {
        newDatas.push(h('p', null, confirmText[i]))
      }
      GetRunFlag().then(res => {
        if (res.run_flag === 1) {
          this.$confirm('警告', {
            title: '警告',
            message: h('div', null, newDatas),
            confirmButtonText: '确定，仍要计算',
            cancelButtonText: '取消',
            confirmButtonClass: 'btnDanger',
            type: 'warning'
          }).then(() => {
            this.computeScheduleMain()
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '取消计算'
            })
          })
        } else {
          this.computeScheduleMain()
        }
      })
    },
    // 开始计算更新排程显示信息
    refreshComputeShow(res) {
      this.schedule_result = res.table_data
      this.schedule_mode = res.mode
      this.schedule_time = res.date
      this.trainDateTip = '当前模型日期：' + res.train_date
    },
    // 开始计算主板排程
    computeScheduleMain() {
      this.clickComputeCount = 1
      this.listenProgress()
      var is_click_apsMoProgData
      if (this.apsMoProgData === '已更新') {
        is_click_apsMoProgData = true
      } else {
        is_click_apsMoProgData = false
      }
      const data = {
        'file_name': this.uploadFileNameMain,
        'user_name': this.name,
        'is_click_apsMoProgData': is_click_apsMoProgData
      }
      ComputeScheduleMain(data).then(res => {
        if (res.code === 20000) {
          this.$message({
            message: res.message,
            type: 'success'
          })
          this.stepNowMain = 4
          this.refreshComputeShow(res)
        } else {
          this.$message({
            message: '开始计算失败',
            type: 'error'
          })
        }
      })
    },
    // 导入小板前判断是否在跑排程
    beforeImportSmall() {
      if (this.uploadFileNameSmall === '') {
        this.$message({
          type: 'warning',
          message: '未上传排程文件，无法导入'
        })
        return
      }
      const confirmText = ['目前正在运行排程，确定要继续导入？', '注意：此操作将会影响当前运行的排程结果！']
      const newDatas = []
      const h = this.$createElement
      for (const i in confirmText) {
        newDatas.push(h('p', null, confirmText[i]))
      }
      GetRunFlag().then(res => {
        if (res.run_flag === 1) {
          this.$confirm('警告', {
            title: '警告',
            message: h('div', null, newDatas),
            confirmButtonText: '确定，仍要导入',
            cancelButtonText: '取消',
            confirmButtonClass: 'btnDanger',
            type: 'warning'
          }).then(() => {
            this.submitUploadFile(2)
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '取消计算'
            })
          })
        } else {
          this.submitUploadFile(2)
        }
      })
    },
    // 计算小板前判断是否在跑排程
    beforeComputeSmall() {
      if (this.isImportSmall === false) {
        this.$message({
          type: 'warning',
          message: '未导入文件，无法计算排程'
        })
        return
      }
      if (this.clickComputeCount >= 1) {
        this.$message({
          type: 'warning',
          message: '已开始计算排程，请勿重复点击'
        })
        return
      }
      const confirmText = ['目前正在运行排程，确定要重新开始计算？', '注意：此操作将会中断当前的排程！']
      const newDatas = []
      const h = this.$createElement
      for (const i in confirmText) {
        newDatas.push(h('p', null, confirmText[i]))
      }
      GetRunFlag().then(res => {
        if (res.run_flag === 1) {
          this.$confirm('警告', {
            title: '警告',
            message: h('div', null, newDatas),
            confirmButtonText: '确定，仍要计算',
            cancelButtonText: '取消',
            confirmButtonClass: 'btnDanger',
            type: 'warning'
          }).then(() => {
            this.computeScheduleSmall()
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '取消计算'
            })
          })
        } else {
          this.computeScheduleSmall()
        }
      })
    },
    // 开始计算小板排程
    computeScheduleSmall() {
      this.clickComputeCount = 1
      this.listenProgress()
      var is_click_apsMoProgData
      if (this.apsMoProgData === '已更新') {
        is_click_apsMoProgData = true
      } else {
        is_click_apsMoProgData = false
      }
      const data = {
        'file_name_small': this.uploadFileNameSmall,
        'user_name': this.name,
        'is_click_apsMoProgData': is_click_apsMoProgData
      }
      ComputeScheduleSmall(data).then(res => {
        if (res.code === 20000) {
          this.$message({
            message: res.message,
            type: 'success'
          })
          this.stepNowSmall = 4
          this.refreshComputeShow(res)
        } else {
          this.$message({
            message: '开始计算失败',
            type: 'error'
          })
        }
      })
    },
    // 导入排程
    async submitUploadFile(mode) {
      this.clickComputeCount = 0
      this.loadingInstance = Loading.service(this.importLoading)
      const form = {}
      if (mode === 1) {
        form['file_name'] = this.uploadFileNameMain
      } else if (mode === 2) {
        form['file_name'] = this.uploadFileNameSmall
      } else {
        return
      }
      await ImportSchedule(form).then(res => {
        this.loadingInstance.close()
        this.$message({
          message: res.message,
          type: 'success'
        })
        if (mode === 1) {
          this.stepNowMain = 2
          this.isImportMain = true
        } else if (mode === 2) {
          this.stepNowSmall = 2
          this.isImportSmall = true
        }
        this.clearUpdateMag()
      }).catch(err => {
        this.loadingInstance.close() // 清除动画
        this.$alert(err, '错误', {
          confirmButtonText: '确定',
          type: 'error'
        })
      })
    },
    beforeImportBoth() {
      if (this.uploadFileNameMain === '' || this.uploadFileNameSmall === '') {
        this.$message({
          type: 'warning',
          message: '主板和小板的排程文件未全部上传，无法导入'
        })
        return
      }
      const confirmText = ['目前正在运行排程，确定要继续导入？', '注意：此操作将会影响当前运行的排程结果！']
      const newDatas = []
      const h = this.$createElement
      for (const i in confirmText) {
        newDatas.push(h('p', null, confirmText[i]))
      }
      GetRunFlag().then(res => {
        if (res.run_flag === 1) {
          this.$confirm('警告', {
            title: '警告',
            message: h('div', null, newDatas),
            confirmButtonText: '确定，仍要导入',
            cancelButtonText: '取消',
            confirmButtonClass: 'btnDanger',
            type: 'warning'
          }).then(() => {
            this.submitUploadFileBoth()
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '取消计算'
            })
          })
        } else {
          this.submitUploadFileBoth()
        }
      })
    },
    async submitUploadFileBoth() {
      this.clickComputeCount = 0
      this.loadingInstance = Loading.service(this.importLoading)
      const form = {
        'file_main': this.uploadFileNameMain,
        'file_small': this.uploadFileNameSmall
      }
      await ImportScheduleBoth(form).then(res => {
        this.loadingInstance.close()
        this.$message({
          message: res.message,
          type: 'success'
        })
        this.stepNowBoth = 2
        this.isImportBoth = true
        this.clearUpdateMag()
      }).catch(err => {
        this.loadingInstance.close() // 清除动画
        this.$alert(err, '错误', {
          confirmButtonText: '确定',
          type: 'error'
        })
      })
    },
    beforeComputeBoth() {
      if (this.isImportBoth === false) {
        this.$message({
          type: 'warning',
          message: '未导入文件，无法计算排程'
        })
        return
      }
      if (this.clickComputeCount >= 1) {
        this.$message({
          type: 'warning',
          message: '已开始计算排程，请勿重复点击'
        })
        return
      }
      const confirmText = ['目前正在运行排程，确定要重新开始计算？', '注意：此操作将会中断当前的排程！']
      const newDatas = []
      const h = this.$createElement
      for (const i in confirmText) {
        newDatas.push(h('p', null, confirmText[i]))
      }
      GetRunFlag().then(res => {
        if (res.run_flag === 1) {
          this.$confirm('警告', {
            title: '警告',
            message: h('div', null, newDatas),
            confirmButtonText: '确定，仍要计算',
            cancelButtonText: '取消',
            confirmButtonClass: 'btnDanger',
            type: 'warning'
          }).then(() => {
            this.computeScheduleBoth()
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '取消计算'
            })
          })
        } else {
          this.computeScheduleBoth()
        }
      })
    },
    computeScheduleBoth() {
      this.clickComputeCount = 1
      this.listenProgress()
      var is_click_apsMoProgData
      if (this.apsMoProgData === '已更新') {
        is_click_apsMoProgData = true
      } else {
        is_click_apsMoProgData = false
      }
      const data = {
        'file_name_main': this.uploadFileNameMain,
        'file_name_small': this.uploadFileNameSmall,
        'is_click_apsMoProgData': is_click_apsMoProgData,
        'user_name': this.name
      }
      ComputeScheduleBoth(data).then(res => {
        if (res.code === 20000) {
          this.$message({
            message: res.message,
            type: 'success'
          })
          this.stepNowBoth = 4
          this.refreshComputeShow(res)
        } else {
          this.$message({
            message: '开始计算失败',
            type: 'error'
          })
        }
      })
    },
    // 更新钢网信息前的提示
    getApsMtool(mode) {
      const tip = '服务器正在计算排程，无法更新信息！' + `<br/>` + '注：请在导入之后，开始计算之前更新'
      GetRunFlag().then(res => {
        if (res.run_flag === 1) {
          this.$alert(tip, '警告', {
            confirmButtonText: '确定',
            dangerouslyUseHTMLString: true,
            type: 'warning'
          })
        } else {
          this.continueGetApsMtool(mode)
        }
      })
    },
    // 更新钢网信息
    continueGetApsMtool(mode) {
      if (mode === 'main') {
        if (this.isImportMain === false) {
          this.$message({
            type: 'warning',
            message: '未导入文件，无法更新信息'
          })
          return
        }
      } else if (mode === 'small') {
        if (this.isImportSmall === false) {
          this.$message({
            type: 'warning',
            message: '未导入文件，无法更新信息'
          })
          return
        }
      } else if (mode === 'both') {
        if (this.isImportBoth === false) {
          this.$message({
            type: 'warning',
            message: '未导入文件，无法更新信息'
          })
          return
        }
      } else {
        return
      }
      this.$confirm('提示', {
        title: '提示',
        message: '确定要更新钢网信息？',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const updateLoading = {
          text: '钢网信息更新中...',
          background: 'rgba(0, 0, 0, 0.5)'
        }
        this.loadingInstance = Loading.service(updateLoading)
        GetApsMtool().then(res => {
          if (res.code === 20000) {
            this.loadingInstance.close()
            this.$alert('钢网信息更新成功！', '提示', {
              confirmButtonText: '确定',
              type: 'success'
            })
            this.apsMtoolMsg = '已更新'
            if (mode === 'main') {
              this.stepNowMain = 3
            } else if (mode === 'small') {
              this.stepNowSmall = 3
            } else if (mode === 'both') {
              this.stepNowBoth = 3
            }
          }
        }).catch(err => {
          this.loadingInstance.close() // 清除动画
          this.$alert(err, '更新信息出错', {
            confirmButtonText: '确定',
            type: 'error'
          })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消更新'
        })
      })
    },
    // 更新程序信息前的提示
    getApsProgram(mode) {
      const tip = '服务器正在计算排程，无法更新信息！' + `<br/>` + '注：请在导入之后，开始计算之前更新'
      GetRunFlag().then(res => {
        if (res.run_flag === 1) {
          this.$alert(tip, '警告', {
            confirmButtonText: '确定',
            dangerouslyUseHTMLString: true,
            type: 'warning'
          })
        } else {
          this.continueGetApsProgram(mode)
        }
      })
    },
    // 更新程序信息
    continueGetApsProgram(mode) {
      if (mode === 'main') {
        if (this.isImportMain === false) {
          this.$message({
            type: 'warning',
            message: '未导入文件，无法更新信息'
          })
          return
        }
      } else if (mode === 'small') {
        if (this.isImportSmall === false) {
          this.$message({
            type: 'warning',
            message: '未导入文件，无法更新信息'
          })
          return
        }
      } else if (mode === 'both') {
        if (this.isImportBoth === false) {
          this.$message({
            type: 'warning',
            message: '未导入文件，无法更新信息'
          })
          return
        }
      } else {
        return
      }
      this.$confirm('提示', {
        title: '提示',
        message: '确定要更新程序信息？',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const updateLoading = {
          text: '程序信息更新中...',
          background: 'rgba(0, 0, 0, 0.5)'
        }
        this.loadingInstance = Loading.service(updateLoading)
        GetApsProgram().then(res => {
          if (res.code === 20000) {
            this.loadingInstance.close()
            this.$alert('程序信息更新成功！', '提示', {
              confirmButtonText: '确定',
              type: 'success'
            })
            this.apsProgramMsg = '已更新'
            if (mode === 'main') {
              this.stepNowMain = 3
            } else if (mode === 'small') {
              this.stepNowSmall = 3
            } else if (mode === 'both') {
              this.stepNowBoth = 3
            }
          }
        }).catch(err => {
          this.loadingInstance.close() // 清除动画
          this.$alert(err, '更新信息错误', {
            confirmButtonText: '确定',
            type: 'error'
          })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消更新'
        })
      })
    },
    // 更新齐套信息前的提示
    getApsMoBaseData(mode) {
      const tip = '服务器正在计算排程，无法更新信息！' + `<br/>` + '注：请在导入之后，开始计算之前更新'
      GetRunFlag().then(res => {
        if (res.run_flag === 1) {
          this.$alert(tip, '警告', {
            confirmButtonText: '确定',
            dangerouslyUseHTMLString: true,
            type: 'warning'
          })
        } else {
          this.continueGetApsMoBaseData(mode)
        }
      })
    },
    // 更新齐套信息
    continueGetApsMoBaseData(mode) {
      if (mode === 'main') {
        if (this.isImportMain === false) {
          this.$message({
            type: 'warning',
            message: '未导入文件，无法更新信息'
          })
          return
        }
      } else if (mode === 'small') {
        if (this.isImportSmall === false) {
          this.$message({
            type: 'warning',
            message: '未导入文件，无法更新信息'
          })
          return
        }
      } else if (mode === 'both') {
        if (this.isImportBoth === false) {
          this.$message({
            type: 'warning',
            message: '未导入文件，无法更新信息'
          })
          return
        }
      } else {
        return
      }
      this.$confirm('提示', {
        title: '提示',
        message: '确定要更新齐套信息？',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const updateLoading = {
          text: '齐套信息更新中...',
          background: 'rgba(0, 0, 0, 0.5)'
        }
        this.loadingInstance = Loading.service(updateLoading)
        GetApsMoBaseData().then(res => {
          if (res.code === 20000) {
            this.loadingInstance.close()
            this.$alert('齐套信息更新成功！', '提示', {
              confirmButtonText: '确定',
              type: 'success'
            })
            this.apsMoBaseData = '已更新'
            if (mode === 'main') {
              this.stepNowMain = 3
            } else if (mode === 'small') {
              this.stepNowSmall = 3
            } else if (mode === 'both') {
              this.stepNowBoth = 3
            }
          }
        }).catch(err => {
          this.loadingInstance.close() // 清除动画
          this.$alert(err, '更新信息错误', {
            confirmButtonText: '确定',
            type: 'error'
          })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消更新'
        })
      })
    },
    // 更新工单进度前的提示
    getApsMoProgData(mode) {
      const tip = '服务器正在计算排程，无法更新信息！' + `<br/>` + '注：请在导入之后，开始计算之前更新'
      GetRunFlag().then(res => {
        if (res.run_flag === 1) {
          this.$alert(tip, '警告', {
            confirmButtonText: '确定',
            dangerouslyUseHTMLString: true,
            type: 'warning'
          })
        } else {
          this.continueGetApsMoProgData(mode)
        }
      })
    },
    // 更新工单进度
    continueGetApsMoProgData(mode) {
      if (mode === 'main') {
        if (this.isImportMain === false) {
          this.$message({
            type: 'warning',
            message: '未导入文件，无法更新信息'
          })
          return
        }
      } else if (mode === 'small') {
        if (this.isImportSmall === false) {
          this.$message({
            type: 'warning',
            message: '未导入文件，无法更新信息'
          })
          return
        }
      } else if (mode === 'both') {
        if (this.isImportBoth === false) {
          this.$message({
            type: 'warning',
            message: '未导入文件，无法更新信息'
          })
          return
        }
      } else {
        return
      }
      this.$confirm('提示', {
        title: '提示',
        message: '确定要更新工单进度？',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const updateLoading = {
          text: '工单进度更新中...',
          background: 'rgba(0, 0, 0, 0.5)'
        }
        this.loadingInstance = Loading.service(updateLoading)
        GetApsMoProgData().then(res => {
          if (res.code === 20000) {
            this.loadingInstance.close()
            this.$alert('工单进度更新成功！', '提示', {
              confirmButtonText: '确定',
              type: 'success'
            })
            this.apsMoProgData = '已更新'
            if (mode === 'main') {
              this.stepNowMain = 3
            } else if (mode === 'small') {
              this.stepNowSmall = 3
            } else if (mode === 'both') {
              this.stepNowBoth = 3
            }
          }
        }).catch(err => {
          this.loadingInstance.close() // 清除动画
          this.$alert(err, '更新信息错误', {
            confirmButtonText: '确定',
            type: 'error'
          })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消更新'
        })
      })
    },
    // 更新包装时间前的提示
    getApsDeliveryDay(mode) {
      const tip = '服务器正在计算排程，无法更新信息！' + `<br/>` + '注：请在导入之后，开始计算之前更新'
      GetRunFlag().then(res => {
        if (res.run_flag === 1) {
          this.$alert(tip, '警告', {
            confirmButtonText: '确定',
            dangerouslyUseHTMLString: true,
            type: 'warning'
          })
        } else {
          this.continueGetApsDeliveryDay(mode)
        }
      })
    },
    // 更新包装时间
    continueGetApsDeliveryDay(mode) {
      if (mode === 'main') {
        if (this.isImportMain === false) {
          this.$message({
            type: 'warning',
            message: '未导入文件，无法更新信息'
          })
          return
        }
      } else if (mode === 'small') {
        if (this.isImportSmall === false) {
          this.$message({
            type: 'warning',
            message: '未导入文件，无法更新信息'
          })
          return
        }
      } else if (mode === 'both') {
        if (this.isImportBoth === false) {
          this.$message({
            type: 'warning',
            message: '未导入文件，无法更新信息'
          })
          return
        }
      } else {
        return
      }
      this.$confirm('提示', {
        title: '提示',
        message: '确定要更新包装点时间？',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const updateLoading = {
          text: '包装点时间更新中...',
          background: 'rgba(0, 0, 0, 0.5)'
        }
        this.loadingInstance = Loading.service(updateLoading)
        GetApsDeliveryDay().then(res => {
          if (res.code === 20000) {
            this.loadingInstance.close()
            this.$alert('包装点时间更新成功！', '提示', {
              confirmButtonText: '确定',
              type: 'success'
            })
            this.apsDeliveryDay = '已更新'
            if (mode === 'main') {
              this.stepNowMain = 3
            } else if (mode === 'small') {
              this.stepNowSmall = 3
            } else if (mode === 'both') {
              this.stepNowBoth = 3
            }
          }
        }).catch(err => {
          this.loadingInstance.close() // 清除动画
          this.$alert(err, '更新信息错误', {
            confirmButtonText: '确定',
            type: 'error'
          })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消更新'
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
    // 导出主板
    exportScheduleDataMain() {
      if (!this.isImportMain && !this.isImportBoth) {
        this.$message({
          message: '未导入文件，无需导出',
          type: 'warning'
        })
        return
      }
      ExportMainScheduleData().then(res => {
        this.downloadFile(res)
        this.$message({
          message: '开始下载',
          type: 'success'
        })
      }).catch(err => {
        console.log(err)
        this.$message({
          message: '导出失败，文件不存在',
          type: 'error'
        })
      })
    },
    // 导出小板
    exportScheduleDataSmall() {
      if (!this.isImportSmall && !this.isImportBoth) {
        this.$message({
          message: '未导入文件，无需导出',
          type: 'warning'
        })
        return
      }
      ExportSmallScheduleData().then(res => {
        this.downloadFile(res)
        this.$message({
          message: '开始下载',
          type: 'success'
        })
      }).catch(err => {
        console.log(err)
        this.$message({
          message: '导出失败，文件不存在',
          type: 'error'
        })
      })
    },
    // 下载主板最新排程
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
          message: '下载失败，文件不存在',
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
          message: '下载失败，文件不存在',
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
          message: '下载失败，文件不存在',
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
    // 获取历史日志选择器选项
    getExcelSelectItem() {
      this.options_history_excel = []
      GetExcelSelectItem().then(res => {
        for (const key in res.excel_data) {
          const temp = {}
          temp['value'] = res.excel_data[key]
          temp['label'] = res.excel_data[key]
          this.options_history_excel.push(temp)
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
          message: '下载失败，文件不存在',
          type: 'error'
        })
      })
    },
    // 下载历史排程
    downloadHistoryExcel() {
      DownloadHistoryExcel({ 'filename': this.selectExcelValue }).then(res => {
        this.downloadFile(res)
        this.$message({
          message: '开始下载',
          type: 'success'
        })
      }).catch(err => {
        console.log(err)
        this.$message({
          message: '下载失败，文件不存在',
          type: 'error'
        })
      })
    },
    // 下载idle明细
    downloadIdleInfo() {
      DownloadIdleInfoMain().then(res => {
        this.downloadFile(res)
        this.$message({
          message: '开始下载',
          type: 'success'
        })
      }).catch(err => {
        console.log(err)
        this.$message({
          message: '下载失败，文件不存在',
          type: 'error'
        })
      })
    },
    // 下载量化结果
    downloadStatistics() {
      DownloadStatisticsMain().then(res => {
        this.downloadFile(res)
        this.$message({
          message: '开始下载',
          type: 'success'
        })
      }).catch(err => {
        console.log(err)
        this.$message({
          message: '下载失败，文件不存在',
          type: 'error'
        })
      })
    },
    // 下载小板最新排程
    downloadScheduleSmall() {
      DownloadScheduleSmall().then(res => {
        this.downloadFile(res)
        this.$message({
          message: '开始下载',
          type: 'success'
        })
      }).catch(err => {
        console.log(err)
        this.$message({
          message: '下载失败，文件不存在',
          type: 'error'
        })
      })
    },
    // 下载小板idle明细
    downloadIdleInfoSmall() {
      DownloadIdleInfoSmall().then(res => {
        this.downloadFile(res)
        this.$message({
          message: '开始下载',
          type: 'success'
        })
      }).catch(err => {
        console.log(err)
        this.$message({
          message: '下载失败，文件不存在',
          type: 'error'
        })
      })
    },
    // 下载小板量化结果
    downloadStatisticsSmall() {
      DownloadStatisticsSmall().then(res => {
        this.downloadFile(res)
        this.$message({
          message: '开始下载',
          type: 'success'
        })
      }).catch(err => {
        console.log(err)
        this.$message({
          message: '下载失败，文件不存在',
          type: 'error'
        })
      })
    },
    // 下载小板无程序表
    downloadNoProgramSmall() {
      DownloadNoProgram().then(res => {
        this.downloadFile(res)
        this.$message({
          message: '开始下载',
          type: 'success'
        })
      }).catch(err => {
        console.log(err)
        this.$message({
          message: '下载失败，文件不存在',
          type: 'error'
        })
      })
    },
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
        SaveApsOutPutCount(form).then(res => {
          if (res.code === 20000) {
            this.$alert(res.message, '推送量化结果成功', {
              confirmButtonText: '确定',
              type: 'success'
            })
            this.saveApsOutPutCountTip = '已推送'
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
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '../../assets/css/Control/SchedulePanel.scss';
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

