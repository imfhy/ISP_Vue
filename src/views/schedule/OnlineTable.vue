<template>
  <div class="box-onlinetable">
    <el-card class="card-control">
      <el-alert
        title="提示信息"
        type="info"
        :closable="false"
        :color="progress_color"
      />
      <div class="control-buuton">
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
            <i class="el-icon-upload2" />上传表格
          </el-button>
        </el-upload>
        <el-button type="primary">
          <i class="el-icon-circle-check" />检查
        </el-button>
        <el-button type="primary" @click="analysisDialog">
          <i class="el-icon-monitor" />分析
        </el-button>
        <el-button type="primary" @click="downloadLuckyExcel">
          <i class="el-icon-download" />下载
        </el-button>
        <el-button>
          <i class="el-icon-position" />接口更新
        </el-button>
        <el-button>
          <i class="el-icon-position" />推送排程
        </el-button>
        <div class="history">
          <el-select v-model="value" clearable placeholder="选择历史排程">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <el-button type="primary">
            获取
          </el-button>
        </div>
      </div>
    </el-card>
    <el-card class="card-luckysheet">
      <div id="luckysheet" class="my-luckysheet" />
    </el-card>
    <el-dialog
      title="分析排程"
      :visible.sync="analysisDialogVisible"
      width="60%"
      :before-close="handleCloseAnalysis"
      class="dialog-analysis"
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
              <span>任务进度</span>
            </div>
            <el-progress
              :text-inside="true"
              :stroke-width="16"
              :percentage="70"
              :color="progressColor"
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
              title="分析完成|100%"
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
              title="生成表格完成|100%"
              type="info"
              :closable="false"
            />
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card class="ana-res-card" shadow="hover">
            <div slot="header" class="clearfix">
              <span class="ana-res-text">分析结果</span>
              <div class="ana-history">
                <el-select v-model="value_ana_time" placeholder="查看历史分析结果" style="width: 200px%;" size="small">
                  <el-option
                    v-for="item in options_analysis_data"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
                <el-button style="margin-left: 5px;" type="info" size="small" @click="getAnaSelectData">
                  获取
                </el-button>
                <el-button style="margin-left: 5px;" size="small" @click="getAnaSelectItem">
                  刷新列表
                </el-button>
              </div>
            </div>
            <p style="font-weight:bold;line-height: 90%;">{{ schedule_time }}-{{ schedule_mode }}
              <span style="font-weight:normal;">{{ ana_time }}</span>
            </p>
            <p style="line-height:160%">
              是否可行解：{{ enable }}<br>
              目标值：{{ obj_value }}<br>
              逾期：{{ overdue }}<br>
              停顿：{{ idle }}<br>
              线平衡：{{ line_balance }}<br>
              三天总点数：{{ points }}<br>
            </p>
          </el-card>
        </el-col>
      </el-row>
      <el-card class="ana-tip-card" shadow="hover">
        <div slot="header" class="clearfix">
          <span>提示信息</span>
        </div>
      </el-card>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeAnalysis">
          关闭
        </el-button>
        <el-button type="primary" @click="beginAnalysis">
          开始分析
        </el-button>
        <el-button type="primary" @click="generateAnaExcel">
          生成表格
        </el-button>
        <el-button type="primary" @click="statisticsSchedule">
          获取量化
        </el-button>
        <el-button type="primary" @click="downloadAnaExcel">
          下载表格
        </el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="量化结果"
      :visible.sync="statisticsDialogVisible"
      width="60%"
      :before-close="handleCloseStatistics"
    >
      <span slot="footer" class="dialog-footer">
        <el-button @click="statisticsDialogVisible = false">
          关闭
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import LuckyExcel from 'luckyexcel'
import XLSX from 'xlsx'
export default {
  data() {
    return {
      uploadFileName: '', // 上传的文件名
      uploadFiles: [], // 上传的文件列表（限制1个）
      analysisDialogVisible: false, // 分析排程dialog显示
      statisticsDialogVisible: false, // 量化结果dialog显示
      stepNow: 0, // 分析排程进行到第几步
      progressColor: '#02bafd', // 进度条颜色
      scheduleResult: [{
        obj_value: '1210.30',
        idle_value: '22.30',
        overdue_value: '63.30',
        enable: '可行',
        line_balance: '23.30'
      }] // 排程结果数据
    }
  },
  mounted() {
    this.initLuckysheet()
  },
  methods: {
    // 初始化luckysheet
    initLuckysheet() {
      var options = {
        container: 'luckysheet',
        lang: 'zh',
        showinfobar: false // 不显示luckysheet图标
      }
      window.luckysheet.create(options)
    },
    // 上传文件
    loadExcelFile(file, fileList) {
      if (fileList.length > 0) {
        this.uploadFiles = fileList = [fileList[fileList.length - 1]] // 选择最后一次选择文件
        this.uploadFileName = this.uploadFiles[0].name // 更新文件名
      }
      // this.uploadFiles = fileList
      const excelFile = fileList[0].raw // 获取文件流
      LuckyExcel.transformExcelToLucky(excelFile, function(exportJson, luckysheetfile) {
        window.luckysheet.create({
          container: 'luckysheet',
          showinfobar: false,
          data: exportJson.sheets,
          title: exportJson.info.name,
          userInfo: exportJson.info.name.creator,
          lang: 'zh',
          hook: { // 冻结首行，添加钩子，初始化后冻结首行
            workbookCreateAfter: function() {
              window.luckysheet.setHorizontalFrozen(false)
            }
          }
        })
      })
    },
    // 分析排程dialog
    analysisDialog() {
      this.analysisDialogVisible = true
    },
    // 关闭分析排程
    closeAnalysis() {
      this.analysisDialogVisible = false
    },
    // 开始分析
    beginAnalysis() {

    },
    // 生成表格
    generateAnaExcel() {

    },
    // 下载表格
    downloadAnaExcel() {

    },
    // 分析排程进度条
    getAnaProgress() {

    },
    // 清空分析排程进度条
    clearAnaProgress() {

    },
    // 获取分析排程历史选择项
    getAnaSelectItem() {

    },
    // 获取历史分析结果
    getAnaSelectData() {

    },
    // 显示分析排程结果
    showAnaData() {

    },
    // 量化结果
    statisticsSchedule() {
      this.statisticsDialogVisible = true
    },
    // 是否关闭分析排程
    handleCloseAnalysis() {

    },
    // 是否关闭量化结果
    handleCloseStatistics() {

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
    }
  }
}
</script>
<style lang="scss" scoped>
  @import '../../assets/css/onlinetable.scss';
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
</style>
