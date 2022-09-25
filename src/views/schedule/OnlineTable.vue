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
          v-model="input"
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
export default {
  data() {
    return {

    }
  },
  mounted() {
    this.init_luckysheet()
  },
  methods: {
    init_luckysheet() {
      var options = {
        container: 'luckysheet',
        lang: 'zh',
        showinfobar: false // 不显示luckysheet图标
      }
      window.luckysheet.create(options)
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
