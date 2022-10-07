<template>
  <div>
    <el-row style="">
      <el-col :span="8">
        <el-card class="quick-action">
          <div slot="header" class="clearfix">
            <span>快捷操作</span>
          </div>
        </el-card>
      </el-col>
      <el-col :span="16">
        <el-card class="calendar-card">
          <el-calendar v-model="value">
            <template slot="dateCell" slot-scope="{data}">
              {{ data.day.split('-').slice(1).join('-') }}
              <div v-for="item in scheduleData" :key="item" style="width:100%;">
                <el-tag v-if="(item.workingDay).indexOf(data.day.split('-').slice(2).join('-'))!=-1" type="success">
                  {{ item.yu }}√
                </el-tag>
                <el-tag v-if="(item.workingDay).indexOf(data.day.split('-').slice(2).join('-'))!=-1" type="danger" style="margin-left: 5px;">
                  {{ item.zheng }}×
                </el-tag>
              </div>
            </template>
          </el-calendar>
        </el-card>
      </el-col>
    </el-row>
    <el-card style="margin: 16px;">
      <div slot="header" class="clearfix">
        <span>历史排程数据变化趋势图</span>
        <el-button style="float: right; padding: 3px 0" type="text" @click="drawCharts">刷新图</el-button>
      </div>
      <div id="scheduleCharts" style="width: 100%; height: 420px" />
    </el-card>
  </div>
</template>
<script>
import * as echarts from 'echarts'
import { GetChartsData } from '@/api/Home'
export default {
  data() {
    return {
      date_list: [],
      obj_value_list: [],
      overdue_value_list: [],
      idle_value_list: [],
      line_balance_list: [],
      group_count_list: [],
      run_time_list: [],
      value: '',

      scheduleData: [
        {
          workingDay: '02',
          yu: '预排',
          zheng: '正排'
        },
        {
          workingDay: '03',
          yu: '预排',
          zheng: '正排'
        },
        {
          workingDay: '04',
          yu: '预排',
          zheng: '正排'
        },
        {
          workingDay: '05',
          yu: '预排',
          zheng: '正排'
        },
        {
          workingDay: '06',
          yu: '预排',
          zheng: '正排'
        },
        {
          workingDay: '07',
          yu: '预排',
          zheng: '正排'
        }
      ]
    }
  },
  created() {
    // this.getChartsData()
  },
  mounted() {
    this.drawCharts()
  },
  methods: {
    // 画图
    drawCharts() {
      this.getChartsData()
      // 等待2秒获取数据
      setTimeout(() => {
        this.initScheduleEcharts()
      }, 1000)
    },
    getChartsData() {
      GetChartsData().then(res => {
        if (res.code === 20000) {
          this.date_list = res.date_list
          this.obj_value_list = res.obj_value_list
          this.overdue_value_list = res.overdue_value_list
          this.idle_value_list = res.idle_value_list
          this.line_balance_list = res.line_balance_list
          this.group_count_list = res.group_count_list
          this.run_time_list = res.run_time_list
        }
      })
    },
    initScheduleEcharts() {
      var app = {}

      var chartDom = document.getElementById('scheduleCharts')
      var myChart = echarts.init(chartDom)
      var option

      const posList = [
        'left',
        'right',
        'top',
        'bottom',
        'inside',
        'insideTop',
        'insideLeft',
        'insideRight',
        'insideBottom',
        'insideTopLeft',
        'insideTopRight',
        'insideBottomLeft',
        'insideBottomRight'
      ]
      app.configParameters = {
        rotate: {
          min: -90,
          max: 90
        },
        align: {
          options: {
            left: 'left',
            center: 'center',
            right: 'right'
          }
        },
        verticalAlign: {
          options: {
            top: 'top',
            middle: 'middle',
            bottom: 'bottom'
          }
        },
        position: {
          options: posList.reduce(function(map, pos) {
            map[pos] = pos
            return map
          }, {})
        },
        distance: {
          min: 0,
          max: 100
        }
      }
      app.config = {
        rotate: 90,
        align: 'left',
        verticalAlign: 'middle',
        position: 'insideBottom',
        distance: 15,
        onChange: function() {
          const labelOption = {
            rotate: app.config.rotate,
            align: app.config.align,
            verticalAlign: app.config.verticalAlign,
            position: app.config.position,
            distance: app.config.distance
          }
          myChart.setOption({
            series: [
              {
                label: labelOption
              },
              {
                label: labelOption
              },
              {
                label: labelOption
              },
              {
                label: labelOption
              },
              {
                label: labelOption
              }
            ]
          })
        }
      }
      const labelOption = {
        show: true,
        position: app.config.position,
        distance: app.config.distance,
        align: app.config.align,
        verticalAlign: app.config.verticalAlign,
        rotate: app.config.rotate,
        formatter: '{c}  {name|{a}}',
        fontSize: 12,
        rich: {
          name: {}
        }
      }
      option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {
          data: ['目标值', '逾期', '停顿', '线平衡', '分组数']
        },
        toolbox: {
          show: true,
          orient: 'vertical',
          left: 'right',
          top: 'center',
          feature: {
            mark: { show: true },
            dataView: { show: true, readOnly: false },
            magicType: { show: true, type: ['line', 'bar', 'stack'] },
            restore: { show: true },
            saveAsImage: { show: true }
          }
        },
        xAxis: [
          {
            type: 'category',
            axisTick: { show: false },
            data: this.date_list // 日期
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: '目标值',
            type: 'bar',
            barGap: 0,
            label: labelOption,
            emphasis: {
              focus: 'series'
            },
            data: this.obj_value_list
          },
          {
            name: '逾期',
            type: 'bar',
            label: labelOption,
            emphasis: {
              focus: 'series'
            },
            data: this.overdue_value_list
          },
          {
            name: '停顿',
            type: 'bar',
            label: labelOption,
            emphasis: {
              focus: 'series'
            },
            data: this.idle_value_list
          },
          {
            name: '线平衡',
            type: 'bar',
            label: labelOption,
            emphasis: {
              focus: 'series'
            },
            data: this.line_balance_list
          },
          {
            name: '分组数',
            type: 'bar',
            label: labelOption,
            emphasis: {
              focus: 'series'
            },
            data: this.group_count_list
          }
        ]
      }
      option && myChart.setOption(option)
    }
  }
}
</script>
<style lang="scss" scoped>

</style>
<style >
#scheduleCharts{
  margin-top: 10px;
}
.quick-action{
  margin-top: 16px;
  margin-left: 16px;
  margin-right: 16px;
  height: 500px;
}
.calendar-card{
  margin-top: 16px;
  margin-right: 16px;
  height: 500px;
}
.calendar-card .el-card__body{
    padding: 0px;
}
.el-calendar-table .el-calendar-day{
  height: 60px;
}
</style>
