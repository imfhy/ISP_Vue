<template>
  <div id="main-box">
    <el-card>
      <el-row>
        <el-col :span="16">
          <div>
            <el-button type="primary" @click="addDataDialog">
              <i class="el-icon-plus" />添加
            </el-button>
            <el-button type="danger" @click="deleteData">
              <i class="el-icon-delete" />删除
            </el-button>
            <el-button @click="importDataDialog">
              <i class="el-icon-upload2" />导入
            </el-button>
            <el-button @click="exportDataDialog">
              <i class="el-icon-download" />导出
            </el-button>
          </div>
        </el-col>
        <el-col :span="8">
          <div style="float: right;">
            <el-tooltip class="item" effect="dark" content="刷新表格" placement="top">
              <el-button
                size="small"
                icon="el-icon-refresh"
                circle
                @click="refreshTableData"
              />
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="查看说明" placement="top">
              <el-button
                size="small"
                icon="el-icon-warning-outline"
                circle
                @click="helpTips"
              />
            </el-tooltip>
          </div>
        </el-col>
      </el-row>
      <div class="table-box">
        <el-table
          id="mytable"
          v-loading="loading"
          :data="table_data"
          :header-cell-style="{background:'#eef1f6',color:'#606266', padding: '3px'}"
          :cell-style="{padding: '3px'}"
          stripe
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55" />
          <el-table-column prop="line" label="线别" width="120" sortable />
          <el-table-column prop="package_line" label="包装线" width="120" sortable />
          <el-table-column prop="machine_name" label="机种名" sortable />
          <el-table-column prop="board" label="板号" sortable />
          <el-table-column prop="process" label="制程面" width="120" sortable />
          <el-table-column prop="date" label="日期" width="120" sortable />
          <el-table-column prop="job_quantity" label="工单量" width="120" sortable />
          <el-table-column prop="total_points" label="总点数" width="160" sortable />
          <el-table-column width="110" fixed="right" label="操作">
            <template slot-scope="scope">
              <el-button
                type="primary"
                size="mini"
                icon="el-icon-edit"
                circle
                @click="handleModify(scope.$index, scope.row)"
              />
              <el-button
                type="danger"
                size="mini"
                icon="el-icon-delete"
                circle
                @click="handleDelete(scope.$index, scope.row)"
              />
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          background
          :hide-on-single-page="true"
          :page-size="pageSize"
          :current-page="currentPage"
          layout="total, prev, pager, next, jumper"
          :total="total_num"
          style="margin-top: 16px;"
          @current-change="handlePageChange"
        />
      </div>
    </el-card>
    <el-dialog
      v-el-drag-dialog
      :title="dialogTitle"
      :visible.sync="dataDialogVisible"
      width="60%"
      :before-close="handleFormClose"
      @dragDialog="handleDrag"
    >
      <el-card class="card-form" shadow="never">
        <el-form ref="$form" :model="model" label-position="left" size="small">
          <el-row :gutter="20" type="flex" justify="start" align="top" tag="div">
            <el-col :span="8" :offset="0" :push="0" :pull="0" tag="div">
              <el-form-item :rules="rules.date" prop="date" label="日期">
                <el-date-picker v-model="model.date" placeholder="请选择" format="yyyy-MM-dd" :style="{width: '100%'}" />
              </el-form-item>
            </el-col>
            <el-col :span="8" :offset="0" :push="0" :pull="0" tag="div">
              <el-form-item :rules="rules.line" prop="line" label="线别">
                <el-input v-model="model.line" placeholder="请输入" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="8" :offset="0" :push="0" :pull="0" tag="div">
              <el-form-item :rules="rules.package_line" prop="package_line" label="包装线">
                <el-input v-model="model.package_line" placeholder="请输入" clearable />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20" type="flex" justify="start" align="top" tag="div">
            <el-col :span="8" :offset="0" :push="0" :pull="0" tag="div">
              <el-form-item :rules="rules.product_type" prop="product_type" label="产品类型">
                <el-input v-model="model.product_type" placeholder="请输入" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="8" :offset="0" :push="0" :pull="0" tag="div">
              <el-form-item :rules="rules.machine_name" prop="machine_name" label="机种名">
                <el-input v-model="model.machine_name" placeholder="请输入" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="8" :offset="0" :push="0" :pull="0" tag="div">
              <el-form-item :rules="rules.board" prop="board" label="板号">
                <el-input v-model="model.board" placeholder="请输入" clearable />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20" type="flex" justify="start" align="top" tag="div">
            <el-col :span="8" :offset="0" :push="0" :pull="0" tag="div">
              <el-form-item :rules="rules.single_hand_insert_points" prop="single_hand_insert_points" label="单板手插点数">
                <el-input-number v-model="model.single_hand_insert_points" placeholder="请输入" :style="{width: '100%'}" />
              </el-form-item>
            </el-col>
            <el-col :span="8" :offset="0" :push="0" :pull="0" tag="div">
              <el-form-item :rules="rules.total_points" prop="total_points" label="总点数">
                <el-input-number v-model="model.total_points" placeholder="请输入" :style="{width: '100%'}" />
              </el-form-item>
            </el-col>
            <el-col :span="8" :offset="0" :push="0" :pull="0" tag="div">
              <el-form-item :rules="rules.process" prop="process" label="制程面">
                <el-input v-model="model.process" placeholder="请输入" clearable />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20" type="flex" justify="start" align="top" tag="div">
            <el-col :span="8" :offset="0" :push="0" :pull="0" tag="div">
              <el-form-item :rules="rules.job_ix" prop="job_ix" label="工单号">
                <el-input v-model="model.job_ix" placeholder="请输入" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="8" :offset="0" :push="0" :pull="0" tag="div">
              <el-form-item :rules="rules.job_quantity" prop="job_quantity" label="工单量">
                <el-input-number v-model="model.job_quantity" placeholder="请输入" :style="{width: '100%'}" />
              </el-form-item>
            </el-col>
            <el-col :span="8" :offset="0" :push="0" :pull="0" tag="div">
              <el-form-item :rules="rules.CT" prop="CT" label="CT">
                <el-input-number v-model="model.CT" placeholder="请输入" :style="{width: '100%'}" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20" type="flex" justify="start" align="top" tag="div">
            <el-col :span="8" :offset="0" :push="0" :pull="0" tag="div">
              <el-form-item :rules="rules.completed_quantity" prop="completed_quantity" label="产出片数">
                <el-input-number v-model="model.completed_quantity" placeholder="请输入" :style="{width: '100%'}" />
              </el-form-item>
            </el-col>
            <el-col :span="8" :offset="0" :push="0" :pull="0" tag="div">
              <el-form-item :rules="rules.connecting_plates" prop="connecting_plates" label="联片数">
                <el-input-number v-model="model.connecting_plates" placeholder="请输入" :style="{width: '100%'}" />
              </el-form-item>
            </el-col>
            <el-col :span="8" :offset="0" :push="0" :pull="0" tag="div">
              <el-form-item :rules="rules.single_points" prop="single_points" label="单板点数">
                <el-input-number v-model="model.single_points" placeholder="请输入" :style="{width: '100%'}" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20" type="flex" justify="start" align="top" tag="div">
            <el-col :span="8" :offset="0" :push="0" :pull="0" tag="div">
              <el-form-item :rules="rules.production_time" prop="production_time" label="生产时间">
                <el-input-number v-model="model.production_time" placeholder="请输入" :style="{width: '100%'}" />
              </el-form-item>
            </el-col>
            <el-col :span="8" :offset="0" :push="0" :pull="0" tag="div">
              <el-form-item :rules="rules.first_plate_time" prop="first_plate_time" label="首片时间">
                <el-input-number v-model="model.first_plate_time" placeholder="请输入" :style="{width: '100%'}" />
              </el-form-item>
            </el-col>
            <el-col :span="8" :offset="0" :push="0" :pull="0" tag="div">
              <el-form-item :rules="rules.setup_time" prop="setup_time" label="切换时间">
                <el-input-number v-model="model.setup_time" placeholder="请输入" :style="{width: '100%'}" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20" type="flex" justify="start" align="top" tag="div">
            <el-col :span="8" :offset="0" :push="0" :pull="0" tag="div">
              <el-form-item :rules="rules.wait_material_time" prop="wait_material_time" label="物料等待时间">
                <el-input-number v-model="model.wait_material_time" placeholder="请输入" :style="{width: '100%'}" />
              </el-form-item>
            </el-col>
            <el-col :span="8" :offset="0" :push="0" :pull="0" tag="div">
              <el-form-item :rules="rules.small_stop_time" prop="small_stop_time" label="小停止时间">
                <el-input-number v-model="model.small_stop_time" placeholder="请输入" :style="{width: '100%'}" />
              </el-form-item>
            </el-col>
            <el-col :span="8" :offset="0" :push="0" :pull="0" tag="div">
              <el-form-item :rules="rules.downtime" prop="downtime" label="设备故障时间">
                <el-input-number v-model="model.downtime" placeholder="请输入" :style="{width: '100%'}" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20" type="flex" justify="start" align="top" tag="div">
            <el-col :span="8" :offset="0" :push="0" :pull="0" tag="div">
              <el-form-item :rules="rules.program_adjustment_time" prop="program_adjustment_time" label="程序调整时间">
                <el-input-number v-model="model.program_adjustment_time" placeholder="请输入" :style="{width: '100%'}" />
              </el-form-item>
            </el-col>
            <el-col :span="8" :offset="0" :push="0" :pull="0" tag="div">
              <el-form-item :rules="rules.process_adjustment_time" prop="process_adjustment_time" label="工艺调整时间">
                <el-input-number v-model="model.process_adjustment_time" placeholder="请输入" :style="{width: '100%'}" />
              </el-form-item>
            </el-col>
            <el-col :span="8" :offset="0" :push="0" :pull="0" tag="div">
              <el-form-item :rules="rules.power_failed_time" prop="power_failed_time" label="停气停电">
                <el-input-number v-model="model.power_failed_time" placeholder="请输入" :style="{width: '100%'}" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20" type="flex" justify="start" align="top" tag="div">
            <el-col :span="8" :offset="0" :push="0" :pull="0" tag="div">
              <el-form-item :rules="rules.clear_mantissa_time" prop="clear_mantissa_time" label="清尾数">
                <el-input-number v-model="model.clear_mantissa_time" placeholder="请输入" :style="{width: '100%'}" />
              </el-form-item>
            </el-col>
            <el-col :span="8" :offset="0" :push="0" :pull="0" tag="div">
              <el-form-item :rules="rules.wait_spares_time" prop="wait_spares_time" label="待备件时间">
                <el-input-number v-model="model.wait_spares_time" placeholder="请输入" :style="{width: '100%'}" />
              </el-form-item>
            </el-col>
            <el-col :span="8" :offset="0" :push="0" :pull="0" tag="div">
              <el-form-item :rules="rules.substitute_material_time" prop="substitute_material_time" label="代用料时间">
                <el-input-number v-model="model.substitute_material_time" placeholder="请输入" :style="{width: '100%'}" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20" type="flex" justify="start" align="top" tag="div">
            <el-col :span="6" :offset="0" :push="0" :pull="0" tag="div">
              <el-form-item :rules="rules.factory" prop="factory" label="工厂别">
                <el-input v-model="model.factory" placeholder="请输入" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="6" :offset="0" :push="0" :pull="0" tag="div">
              <el-form-item :rules="rules.package_product_type" prop="package_product_type" label="包装产品类型">
                <el-input v-model="model.package_product_type" placeholder="请输入" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="6" :offset="0" :push="0" :pull="0" tag="div">
              <el-form-item :rules="rules.SMT_product_type" prop="SMT_product_type" label="SMT产品类型">
                <el-input v-model="model.SMT_product_type" placeholder="请输入" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="6" :offset="0" :push="0" :pull="0" tag="div">
              <el-form-item :rules="rules.setup_type" prop="setup_type" label="切换类型">
                <el-input v-model="model.setup_type" placeholder="请输入" clearable />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20" type="flex" justify="start" align="top" tag="div">
            <el-col :span="6" :offset="0" :push="0" :pull="0" tag="div">
              <el-form-item :rules="rules.CREATED_BY" prop="CREATED_BY" label="创建人">
                <el-input v-model="model.CREATED_BY" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="6" :offset="0" :push="0" :pull="0" tag="div">
              <el-form-item :rules="rules.CREATED_TIME" prop="CREATED_TIME" label="创建时间">
                <el-input v-model="model.CREATED_TIME" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="6" :offset="0" :push="0" :pull="0" tag="div">
              <el-form-item :rules="rules.UPDATED_BY" prop="UPDATED_BY" label="修改人">
                <el-input v-model="model.UPDATED_BY" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="6" :offset="0" :push="0" :pull="0" tag="div">
              <el-form-item :rules="rules.UPDATED_TIME" prop="UPDATED_TIME" label="修改时间">
                <el-input v-model="model.UPDATED_TIME" disabled />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-card>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleFormClose">关闭</el-button>
        <el-button v-if="dialogBtnType === true" type="primary" @click="addData">添加</el-button>
        <el-button v-else-if="dialogBtnType === false" type="primary" @click="modifyData">确认修改</el-button>
      </span>
    </el-dialog>

    <el-dialog
      v-el-drag-dialog
      title="表格说明"
      :visible.sync="helpDialogVisible"
      width="60%"
      @dragDialog="handleDrag"
    >
      <span>关于表格的各种说明可以写在这</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="helpDialogVisible = false">关闭</el-button>
      </span>
    </el-dialog>

    <el-dialog
      v-el-drag-dialog
      title="导入数据"
      :visible.sync="importDialogVisible"
      width="60%"
      :before-close="handleImportClose"
      @dragDialog="handleDrag"
    >
      <p style="font-size:16px;margin-bottom: 16px;">
        导入数据格式示例如下（仅支持.xlsx文件，列名需保持名称一致）：
      </p>
      <el-table
        :data="tableDataExample"
        :header-cell-style="{background:'#eef1f6',color:'#606266'}"
        :cell-style="setCellColor"
        border
      >
        <el-table-column prop="date" label="日期" width="110" />
        <el-table-column prop="line" label="线别" width="110" />
        <el-table-column prop="package_line" label="包装线" width="110" />
        <el-table-column prop="product_type" label="产品类型" width="110" />
        <el-table-column prop="machine_name" label="机种名" width="160" />
        <el-table-column prop="board" label="板号" width="180" />
        <el-table-column prop="job_ix" label="工单号" width="110" />
        <el-table-column prop="job_quantity" label="工单量" width="110" />
        <el-table-column prop="completed_quantity" label="产出片数" width="110" />
        <el-table-column prop="connecting_plates" label="联片数" width="110" />
        <el-table-column prop="CT" label="CT" width="110" />
        <el-table-column prop="production_time" label="生产时间" width="110" />
        <el-table-column prop="first_plate_time" label="首片时间" width="110" />
        <el-table-column prop="setup_time" label="切换时间" width="110" />
        <el-table-column prop="wait_material_time" label="物料等待时间" width="110" />
        <el-table-column prop="small_stop_time" label="小停止时间" width="110" />
        <el-table-column prop="downtime" label="设备故障时间" width="110" />
        <el-table-column prop="program_adjustment_time" label="程序调整时间" width="110" />
        <el-table-column prop="process_adjustment_time" label="工艺调整时间" width="110" />
        <el-table-column prop="power_failed_time" label="停气停电" width="110" />
        <el-table-column prop="clear_mantissa_time" label="清尾数" width="110" />
        <el-table-column prop="wait_spares_time" label="待备件时间" width="110" />
        <el-table-column prop="substitute_material_time" label="代用料时间" width="110" />
        <el-table-column prop="total_points" label="总点数" width="110" />
        <el-table-column prop="process" label="制程面" width="110" />
        <el-table-column prop="factory" label="工厂别" width="110" />
        <el-table-column prop="package_product_type" label="包装产品类型" width="110" />
        <el-table-column prop="SMT_product_type" label="SMT产品类型" width="110" />
        <el-table-column prop="setup_type" label="切换类型" width="110" />
        <el-table-column prop="single_hand_insert_points" label="单板手插点数" width="110" />
      </el-table>
      <el-row>
        <el-col :span="8">
          <el-radio-group v-model="importMode" style="margin-top: 26px;">
            <el-radio label="add">追加数据</el-radio>
            <el-radio label="replace">替换数据</el-radio>
          </el-radio-group>
        </el-col>
        <el-col :span="16">
          <div style="display: flex;margin-top: 16px;margin-bottom: 16px;">
            <el-upload
              ref="upload"
              name="file"
              class="upload-demo"
              accept=".xlsx"
              action=""
              :on-change="handleChange"
              :auto-upload="false"
              :show-file-list="true"
              :file-list="uploadFileList"
            >
              <el-button slot="trigger" type="primary" style="margin-left: 10px;">
                <i class="el-icon-upload" />
                上传文件
              </el-button>
            </el-upload>
          </div>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleImportClose">关闭</el-button>
        <el-button type="primary" @click="confirmImport">确认导入</el-button>
      </span>
    </el-dialog>

    <el-dialog
      v-el-drag-dialog
      title="导出数据"
      :visible.sync="exportDialogVisible"
      :before-close="handleExportClose"
      width="45%"
      @dragDialog="handleDrag"
    >
      <el-row>
        <span>导出文件格式：</span>
        <el-radio-group v-model="exportRadio">
          <el-radio label="xlsx">.xlsx</el-radio>
        </el-radio-group>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleExportClose">关闭</el-button>
        <el-button type="primary" @click="exportData">确认导出</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import XLSX from 'xlsx'
import { mapGetters } from 'vuex'
import { Loading } from 'element-ui'
import elDragDialog from '@/directive/el-drag-dialog'
import { GetTableData, AddData, ModifyData, DeleteData, HandleDelete, ExportData, ImportData } from '@/api/DayConfig/ProductionReportData'
import { LineOptions } from '@/utils/items'
export default {
  name: 'ProductionReportData',
  directives: { elDragDialog },
  data() {
    return {
      loading: true, // 表格加载动画
      importLoading: {
        text: '拼命导入中...',
        background: 'rgba(0, 0, 0, 0.5)'
      }, // 导入动画
      exportLoading: {
        text: '拼命导出中...',
        background: 'rgba(0, 0, 0, 0.5)'
      }, // 导出动画
      loadingInstance: null,
      table_data: [], // 表格数据
      tableDataExample: [
        {
          date: '2022-09-26',
          line: 'SP08B',
          package_line: 'CL02',
          single_hand_insert_points: 0,
          total_points: 0,
          process: 'T',
          product_type: 'MNTPWPC',
          machine_name: 'PLKW261XQW1SMT',
          board: '715GA790P02004003R',
          job_ix: '6022099',
          job_quantity: 88,
          CT: 48,
          completed_quantity: 88,
          connecting_plates: 1,
          single_points: 355,
          production_time: 163,
          first_plate_time: 11,
          setup_time: 10,
          wait_material_time: 0,
          small_stop_time: 0,
          downtime: 0,
          program_adjustment_time: 0,
          process_adjustment_time: 0,
          power_failed_time: 0,
          clear_mantissa_time: 0,
          wait_spares_time: 0,
          substitute_material_time: 0,
          factory: '10',
          package_product_type: '电源板',
          SMT_product_type: 'PWPC',
          setup_type: '整单换料'
        }, {
          time: '(必填)',
          date: '(必填)',
          line: '(必填)',
          package_line: '(必填)',
          single_hand_insert_points: '(选填)',
          total_points: '(必填)',
          process: '(必填)',
          product_type: '(必填)',
          machine_name: '(必填)',
          board: '(必填)',
          job_ix: '(必填)',
          job_quantity: '(必填)',
          CT: '(必填)',
          completed_quantity: '(必填)',
          connecting_plates: '(必填)',
          single_points: '(必填)',
          production_time: '(必填)',
          first_plate_time: '(必填)',
          setup_time: '(必填)',
          wait_material_time: '(必填)',
          small_stop_time: '(必填)',
          downtime: '(必填)',
          program_adjustment_time: '(必填)',
          process_adjustment_time: '(必填)',
          power_failed_time: '(必填)',
          clear_mantissa_time: '(必填)',
          wait_spares_time: '(必填)',
          substitute_material_time: '(必填)',
          factory: '(必填)',
          package_product_type: '(必填)',
          SMT_product_type: '(必填)',
          setup_type: '(必填)'
        }
      ], // 示例的表格数据
      dialogTitle: '', // 表单dialog标题
      dataDialogVisible: false, // 表单dialog显示
      dialogBtnType: true, // 表单dialog按钮 true为添加按钮 false为保存按钮
      helpDialogVisible: false, // 帮助提示dialog
      scopeIndex: '', // 表格行数index
      scopeRow: '', // 表格行数据
      importDialogVisible: false, // 导入数据dialog
      exportDialogVisible: false, // 导出dialog
      importType: false, // false为替换数据 true为添加数据
      uploadFileName: '', // 上传的文件名
      uploadFileList: [], // 上传的文件列表
      uploadFile: null, // 上传的文件
      importMode: 'add', // 导入方式选择:追加或替换（方便以后扩展）
      exportRadio: 'xlsx', // 导出格式选择（方便以后扩展）
      isClick: false, // 是否点击了保存或者提交
      // 表单相关数据
      forms: ['$form'],
      model: {
        id: '',
        date: '',
        line: '',
        package_line: '',
        single_hand_insert_points: 0,
        total_points: 0,
        process: '',
        product_type: '',
        machine_name: '',
        board: '',
        job_ix: '',
        job_quantity: 0,
        CT: 0,
        completed_quantity: 0,
        connecting_plates: 0,
        single_points: 0,
        production_time: 0,
        first_plate_time: 0,
        setup_time: 0,
        wait_material_time: 0,
        small_stop_time: 0,
        downtime: 0,
        program_adjustment_time: 0,
        process_adjustment_time: 0,
        power_failed_time: 0,
        clear_mantissa_time: 0,
        wait_spares_time: 0,
        substitute_material_time: 0,
        factory: '',
        package_product_type: '',
        SMT_product_type: '',
        setup_type: '',
        CREATED_BY: '',
        CREATED_TIME: '',
        UPDATED_BY: '',
        UPDATED_TIME: ''
      },
      // 修改前的表单内容，用于对比表单前后的变化（应用：关闭前提示修改未保存）
      modelOriginal: {
        id: '',
        date: '',
        line: '',
        package_line: '',
        single_hand_insert_points: 0,
        total_points: 0,
        process: '',
        product_type: '',
        machine_name: '',
        board: '',
        job_ix: '',
        job_quantity: 0,
        CT: 0,
        completed_quantity: 0,
        connecting_plates: 0,
        single_points: 0,
        production_time: 0,
        first_plate_time: 0,
        setup_time: 0,
        wait_material_time: 0,
        small_stop_time: 0,
        downtime: 0,
        program_adjustment_time: 0,
        process_adjustment_time: 0,
        power_failed_time: 0,
        clear_mantissa_time: 0,
        wait_spares_time: 0,
        substitute_material_time: 0,
        factory: '',
        package_product_type: '',
        SMT_product_type: '',
        setup_type: '',
        CREATED_BY: '',
        CREATED_TIME: '',
        UPDATED_BY: '',
        UPDATED_TIME: ''
      },
      rules: {
        date: [{
          required: true,
          message: '日期不能为空',
          trigger: 'blur'
        }],
        line: [{
          required: true,
          message: '线别不能为空',
          trigger: 'blur'
        }],
        package_line: [{
          required: true,
          message: '包装线不能为空',
          trigger: 'blur'
        }],
        single_hand_insert_points: [],
        total_points: [{
          required: true,
          message: '总点数不能为空',
          trigger: 'blur'
        }],
        process: [{
          required: true,
          message: '制程面不能为空',
          trigger: 'blur'
        }],
        product_type: [{
          required: true,
          message: '产品类型不能为空',
          trigger: 'blur'
        }],
        machine_name: [{
          required: true,
          message: '机种名不能为空',
          trigger: 'blur'
        }],
        board: [{
          required: true,
          message: '板号不能为空',
          trigger: 'blur'
        }],
        job_ix: [{
          required: true,
          message: '工单号不能为空',
          trigger: 'blur'
        }],
        job_quantity: [{
          required: true,
          message: '工单量不能为空',
          trigger: 'blur'
        }],
        CT: [{
          required: true,
          message: 'CT不能为空',
          trigger: 'blur'
        }],
        completed_quantity: [{
          required: true,
          message: '产出片数不能为空',
          trigger: 'blur'
        }],
        connecting_plates: [{
          required: true,
          message: '联片数不能为空',
          trigger: 'blur'
        }],
        single_points: [{
          required: true,
          message: '单板点数不能为空',
          trigger: 'blur'
        }],
        production_time: [{
          required: true,
          message: '生产时间不能为空',
          trigger: 'blur'
        }],
        first_plate_time: [{
          required: true,
          message: '首片时间不能为空',
          trigger: 'blur'
        }],
        setup_time: [],
        wait_material_time: [{
          required: true,
          message: '物料等待时间不能为空',
          trigger: 'blur'
        }],
        small_stop_time: [{
          required: true,
          message: '小停止时间不能为空',
          trigger: 'blur'
        }],
        downtime: [{
          required: true,
          message: '设备故障时间不能为空',
          trigger: 'blur'
        }],
        program_adjustment_time: [{
          required: true,
          message: '程序调整时间不能为空',
          trigger: 'blur'
        }],
        process_adjustment_time: [{
          required: true,
          message: '工艺调整时间不能为空',
          trigger: 'blur'
        }],
        power_failed_time: [{
          required: true,
          message: '停气停电不能为空',
          trigger: 'blur'
        }],
        clear_mantissa_time: [{
          required: true,
          message: '清尾数不能为空',
          trigger: 'blur'
        }],
        wait_spares_time: [{
          required: true,
          message: '待备件时间不能为空',
          trigger: 'blur'
        }],
        substitute_material_time: [{
          required: true,
          message: '代用料时间不能为空',
          trigger: 'blur'
        }],
        factory: [{
          required: true,
          message: '工厂别不能为空',
          trigger: 'blur'
        }],
        package_product_type: [{
          required: true,
          message: '包装产品类别不能为空',
          trigger: 'blur'
        }],
        SMT_product_type: [{
          required: true,
          message: 'SMT产品类型不能为空',
          trigger: 'blur'
        }],
        setup_type: [{
          required: true,
          message: '切换类型不能为空',
          trigger: 'blur'
        }]
      },
      line_name_data: LineOptions, // 维护线别
      // 分页相关
      total_num: 0, // 总共有多少条数据(后端返回)
      currentPage: 1, // 当前在第几页
      pageSize: 30, // 每页多少条数据
      dataTableSelections: [] // 表格选中的数据
    }
  },
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  created() {
    this.getTableData(this.currentPage, this.pageSize)
  },
  mounted() {
    // this.getTableData(this.currentPage, this.pageSize)
  },
  methods: {
    // dialog可拖拽
    handleDrag() {
      // this.$refs.select.blur()
    },
    // 示例表格行颜色
    setCellColor({ row, column, rowIndex, columnIndex }) {
      if (rowIndex === 1 && columnIndex <= 28) {
        return 'color: #F56C6C;font-weight: bold;'
      } else if (rowIndex === 1 && columnIndex > 2) {
        return 'color: #E6A23C;font-weight: bold;'
      }
      return ''
    },
    // 分页
    handlePageChange(val) {
      this.currentPage = val
      this.getTableData(val, this.pageSize) // 翻页
    },
    // 分页展示表格数据
    getTableData(currentPage, pageSize) {
      this.loading = true
      const data = { 'current_page': currentPage, 'page_size': pageSize }
      GetTableData(data).then(res => {
        if (res.code === 20000) {
          this.table_data = res.table_data
          this.total_num = res.total_num
          this.loading = false
        }
      })
    },
    // 刷新表格数据
    refreshTableData(isAddData = false) {
      if (isAddData) { // 如果是导入/添加/点击刷新按钮，刷新时返回第一页
        this.currentPage = 1
        this.getTableData(1, this.pageSize)
      } else { // 否则只刷新当前页
        this.getTableData(this.currentPage, this.pageSize)
      }
    },
    // 添加数据
    addDataDialog() {
      this.dialogTitle = '添加数据'
      this.dialogBtnType = true
      this.dataDialogVisible = true
      this.isClick = false
    },
    // 添加数据
    addData() {
      this.isClick = true
      const data = this.model
      data['user_name'] = this.name
      this.$refs['$form'].validate((valid) => {
        if (valid) {
          AddData(data).then(res => {
            if (res.code === 20000) {
              this.$notify({
                title: '添加成功',
                message: '成功添加 1 条数据',
                type: 'success'
              })
              setTimeout(() => {
                this.closeFormDialog()
              }, 1000)
              this.refreshTableData(true)
            }
          })
        } else {
          this.$message({
            type: 'error',
            message: '提交失败，请按照要求填写数据！'
          })
        }
      })
    },
    // 获取表格勾选数据
    handleSelectionChange(val) {
      this.dataTableSelections = val
    },
    // 删除所有表格勾选的数据
    deleteData() {
      const dataLength = this.dataTableSelections.length
      if (dataLength === 0) {
        this.$message({
          type: 'warning',
          message: '请至少选中一条数据'
        })
        return
      }
      const idList = []
      for (let i = 0; i < dataLength; i++) {
        idList.push(this.dataTableSelections[i].id)
      }
      this.$confirm('确定要删除选中的 ' + dataLength + ' 条数据？', '提示', {
        confirmButtonText: '确定删除',
        cancelButtonText: '取消',
        confirmButtonClass: 'btnDanger',
        type: 'warning'
      }).then(() => {
        const data = { 'id_list': idList, 'user_name': this.name }
        DeleteData(data).then(res => {
          if (res.code === 20000) {
            this.$notify({
              title: '删除成功',
              message: '成功删除选中的 ' + dataLength + ' 条数据',
              type: 'success'
            })
            this.refreshTableData() // 刷新表格数据
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消删除'
        })
      })
    },
    // 修改数据
    handleModify(index, row) {
      // 修改dialog
      this.dialogTitle = '修改数据'
      this.dialogBtnType = false
      this.scopeIndex = index
      this.scopeRow = row
      // 显示表单数据
      for (const key in this.model) {
        this.model[key] = row[key]
      }
      // 保存原来的表单数据，用于对比变化
      for (const key in this.modelOriginal) {
        this.modelOriginal[key] = this.model[key]
      }
      // 显示dialog
      this.dataDialogVisible = true
      this.isClick = false
    },
    // 编辑数据发送到后端保存
    modifyData() {
      if (!this.checkFormChange()) {
        this.$message({
          type: 'info',
          message: '数据未修改，无需提交'
        })
        return
      }
      this.isClick = true
      const data = this.model
      data['user_name'] = this.name
      this.$refs['$form'].validate((valid) => {
        if (valid) {
          ModifyData(data).then(res => {
            if (res.code === 20000) {
              this.$notify({
                title: res.message,
                message: '数据已修改',
                type: 'success'
              })
              this.refreshTableData()
            }
          })
        } else {
          this.$message({
            type: 'error',
            message: '提交失败，请按照要求填写数据！'
          })
        }
      })
    },
    // 检测表单数据是否发生变化，用于提示
    checkFormChange() {
      let isChange = false
      for (const key in this.model) {
        if (this.model[key] !== this.modelOriginal[key]) {
          isChange = true
          break
        }
      }
      return isChange
    },
    // 表单dialog关闭前提示
    handleFormClose() {
      if (this.checkFormChange() && !this.isClick) {
        this.$confirm('数据未提交，确定要关闭窗口？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.closeFormDialog()
        }).catch(() => {

        })
      } else {
        this.closeFormDialog()
      }
    },
    // 关闭表单dialog的一些操作
    closeFormDialog() {
      this.dataDialogVisible = false
      for (const key in this.model) {
        var isNum = /^[0-9]+.?[0-9]*/
        if (isNum.test(this.model[key])) { // 数字要初始化为0
          this.model[key] = 0
          this.modelOriginal[key] = 0
        } else {
          this.model[key] = ''
          this.modelOriginal[key] = ''
        }
      }
      this.$refs['$form'].clearValidate() // 清除表单验证的文字提示信息
    },
    // 表格中删除数据
    handleDelete(index, row) {
      this.$confirm('确定要删除该数据？', '提示', {
        confirmButtonText: '确定删除',
        cancelButtonText: '取消',
        confirmButtonClass: 'btnDanger',
        type: 'warning'
      }).then(() => {
        const data = {}
        data['id'] = row.id
        data['line'] = row.line
        data['board'] = row.board
        data['date'] = row.date
        data['user_name'] = this.name
        HandleDelete(data).then(res => {
          if (res.code === 20000) {
            this.$notify({
              title: '删除成功',
              message: '该数据已删除',
              type: 'success'
            })
            this.refreshTableData()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消删除'
        })
      })
    },
    // Excel导入到数据库
    importDataDialog() {
      this.importDialogVisible = true
    },
    // 确认导入
    confirmImport() {
      if (this.importMode === 'replace') {
        this.$confirm('此操作将会清空所有原有内容, 确定要进行替换操作？', '提示', {
          confirmButtonText: '确定替换',
          cancelButtonText: '取消',
          confirmButtonClass: 'btnDanger',
          type: 'warning'
        }).then(() => {
          this.importData()
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消导入'
          })
        })
      } else {
        this.importData()
      }
    },
    // 导入数据
    importData() {
      this.loadingInstance = Loading.service(this.importLoading)
      const form = new FormData()
      form.append('file', this.uploadFile)
      form.append('file_name', this.uploadFileName)
      form.append('user_name', this.name)
      form.append('import_mode', this.importMode)
      ImportData(form).then(res => {
        if (res.code === 20000) {
          this.$alert('本次共导入了 ' + res.data_count + ' 条数据', res.message, {
            confirmButtonText: '确定',
            type: 'success'
          })
          this.loadingInstance.close() // 清除动画
          // 1秒后自动关闭窗口
          setTimeout(() => {
            this.handleImportClose()
          }, 2000)
          this.refreshTableData(true)
        }
      }).catch(err => {
        this.loadingInstance.close() // 清除动画
        this.$alert(err, '错误', {
          confirmButtonText: '确定',
          type: 'error'
        })
      })
    },
    // 导入数据窗口关闭
    handleImportClose() {
      this.importDialogVisible = false
      // 清理已上传文件
      this.$refs.upload.clearFiles()
      this.uploadFileName = ''
      this.uploadFile = null
    },
    // 获取上传文件
    handleChange(file, fileList) {
      if (fileList.length > 0) {
        this.uploadFileList = [fileList[fileList.length - 1]] // 选择最后一次选择文件
        this.uploadFileName = this.uploadFileList[0].name // 更新文件名
        this.uploadFile = this.uploadFileList[0].raw // 更新文件
      }
    },
    // 数据库导出到Excel
    exportDataDialog() {
      this.exportDialogVisible = true
    },
    // 确认导出
    exportData() {
      this.loadingInstance = Loading.service(this.exportLoading)
      ExportData().then(res => {
        if (res.code === 20000) {
          const dataCount = res.data_count
          const sheetData = res.table_data
          const fields = res.fields
          const tableName = res.table_name
          const fields_display = res.fields_display
          const newData = [fields_display, ...sheetData]
          const sheet = XLSX.utils.json_to_sheet(newData, { header: fields, skipHeader: true })
          const wb = XLSX.utils.book_new()
          XLSX.utils.book_append_sheet(wb, sheet, tableName)
          XLSX.writeFile(wb, tableName + '.xlsx')
          this.$notify({
            title: '导出成功',
            message: '本次共导出了 ' + dataCount + ' 条数据',
            type: 'success'
          })
          this.loadingInstance.close() // 清除动画
          // 1秒后自动关闭窗口
          setTimeout(() => {
            this.handleExportClose() // 导出后自动关闭窗口
          }, 1000)
        }
      }).catch(err => {
        this.loadingInstance.close() // 清除动画
        this.$alert(err, '错误', {
          confirmButtonText: '确定',
          type: 'error'
        })
      })
    },
    // 导入数据窗口关闭
    handleExportClose() {
      this.exportDialogVisible = false
    },
    // 帮助提示按钮
    helpTips() {
      this.helpDialogVisible = true
    }
  }
}
</script>
<style lang="scss" scoped>
  @import '../../assets/css/DayConfig/ProductionReportData.scss';
</style>
<style>
.btnDanger{
  background-color: #F56C6C !important;
  border-color: #F56C6C !important;
}
.btnDanger:hover{
  background-color: #f04747 !important;
  border-color: #f04747 !important;
}
.el-pagination {
    text-align: center;
}

.upload-demo {
  display: flex;
 }
.el-list-enter-active,
.el-list-leave-active {
  transition: none;
}
.el-list-enter,
.el-list-leave-active {
  opacity: 0;
}
.el-upload-list {
  height: 40px;
 }

.el-table .warning-row {
  color: #E6A23C;
}
.card-form .el-card__body{
    padding: 20px;
}
</style>
