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
          v-model="uploadFileName"
          placeholder="未上传文件"
          :disabled="true"
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
        <el-button type="primary">
          <i class="el-icon-monitor" />分析
        </el-button>
        <el-button type="primary">
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
  </div>
</template>
<script>
import LuckyExcel from 'luckyexcel'
export default {
  data() {
    return {
      uploadFileName: '',
      uploadFiles: []
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
        this.file_name = this.uploadFiles[0].name // 更新文件名
      }
      // this.uploadFiles = fileList
      var excel_file = fileList[0].raw // 获取文件流
      LuckyExcel.transformExcelToLucky(excel_file, function(exportJson, luckysheetfile) {
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
    }
  }
}
</script>
<style lang="scss" scoped>
  @import '../../assets/css/onlinetable.scss';
</style>
<style>
.box-onlinetable .el-card__body{
    padding: 0px;
}
</style>
