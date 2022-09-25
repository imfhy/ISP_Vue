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
                :data="tableData"
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
            :color="progress_color"
          />
          <el-alert
            title="预测模型完成训练|100%"
            type="info"
            :closable="false"
            :color="progress_color"
          />
          <el-progress
            :text-inside="true"
            :stroke-width="16"
            :percentage="70"
            :color="progress_color"
            class="my-progress"
          />
          <el-alert
            title="预处理完成|100%"
            type="info"
            :closable="false"
            :color="progress_color"
          />
          <el-progress
            :text-inside="true"
            :stroke-width="16"
            :percentage="70"
            :color="progress_color"
            class="my-progress"
          />
          <el-alert
            title="初始解完成:230组|100%"
            type="info"
            :closable="false"
            :color="progress_color"
          />
          <el-progress
            :text-inside="true"
            :stroke-width="16"
            :percentage="70"
            :color="progress_color"
            class="my-progress"
          />
          <el-alert
            title="输出完成(可下载)|100%"
            type="info"
            :closable="false"
            :color="progress_color"
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
                :color="progress_color"
              />
              <div class="box-button">
                <el-date-picker
                  v-model="train_date"
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
                :color="progress_color"
              />
              <div class="box-button">
                <el-row>
                  <el-col :span="8">
                    <el-upload
                      ref="upload"
                      class="upload-demo"
                      action="http://localhost:8080/api/preprocess/schedule/check_input_excel/"
                      :limit="1"
                      :on-change="handleChange"
                      :on-progress="handleProgress"
                      :on-success="handleSuccess"
                      :auto-upload="false"
                      :show-file-list="false"
                    >
                      <el-button type="primary" plain @click="trainModel">
                        <i class="el-icon-circle-check" />
                        检查排程表格
                      </el-button>
                    </el-upload>
                  </el-col>
                  <el-col :span="8">
                    <el-button type="primary" plain @click="trainModel">
                      <i class="el-icon-monitor" />
                      计算排程表格
                    </el-button>
                  </el-col>
                  <el-col :span="8">
                    <el-button type="primary" plain @click="trainModel">
                      <i class="el-icon-warning-outline" />
                      终止深度搜索
                    </el-button>
                  </el-col>
                </el-row>
              </div>
              <div class="box-button">
                <el-row>
                  <el-col :span="8">
                    <el-button type="primary" plain @click="trainModel">
                      <i class="el-icon-download" />
                      下载最新排程
                    </el-button>
                  </el-col>
                  <el-col :span="8">
                    <el-button type="primary" plain @click="trainModel">
                      <i class="el-icon-download" />
                      下载无程序表
                    </el-button>
                  </el-col>
                  <el-col :span="8">
                    <el-button type="primary" plain @click="trainModel">
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
                :color="progress_color"
              />
              <div class="box-button">
                <el-date-picker
                  v-model="train_date"
                  type="date"
                  placeholder="下载历史日志"
                  :size="size"
                />
                <el-button type="primary" plain style="margin-top:2px;margin-left: 8px;" @click="trainModel">
                  <i class="el-icon-download" />
                  下载历史日志
                </el-button>
              </div>
              <el-alert
                title="下载相关"
                type="info"
                :closable="false"
                :color="progress_color"
              />
              <div class="box-button">
                <el-row>
                  <el-col :span="8">
                    <el-button type="primary" plain @click="trainModel">
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
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: [{
        obj_value: '1210.30',
        idle_value: '22.30',
        overdue_value: '63.30',
        enable: '可行',
        line_balance: '23.30'
      }],
      tableData_2: [{
        date: '2022年09月25日-预排'
      }],
      tableData_3: [{
        date: '00 时 30 分 27 秒'
      }],
      progress_color: '#02bafd'
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
</style>

