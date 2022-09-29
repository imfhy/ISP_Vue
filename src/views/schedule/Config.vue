<template>
  <div id="main">
    <el-card>
      <div>
        <el-descriptions class="margin-top" title="排程配置" :column="4" :size="size" label-style="font-weight:bold;" border>
          <template slot="extra">
            <el-button size="small">
              <i class="el-icon-refresh-left" /> 返回上一次配置
            </el-button>
          </template>
          <template slot="extra">
            <el-button type="primary" size="small" @click="editDataDialog">
              <i class="el-icon-edit" /> 修改
            </el-button>
          </template>
          <el-descriptions-item label="排程日期" :span="2">{{ schedule_date }}</el-descriptions-item>
          <el-descriptions-item label="开始排程时间" :span="2">{{ schedule_time }}</el-descriptions-item>

          <el-descriptions-item label="overdue权重">{{ overdue_weight }}</el-descriptions-item>
          <el-descriptions-item label="idle权重">{{ idle_weight }}</el-descriptions-item>
          <el-descriptions-item label="Line balance权重">{{ line_balance_weight }}</el-descriptions-item>
          <el-descriptions-item label="大工单线权重">{{ big_line_weight }}</el-descriptions-item>
          <el-descriptions-item label="锁定时间节点内的idle权重" :span="4">{{ lock_time_idle_weight }}</el-descriptions-item>

          <el-descriptions-item label="是否开启全部包装放假">
            <el-tag v-if="pack_holiday_flag === true" size="small">开启</el-tag>
            <el-tag v-else-if="pack_holiday_flag === false" size="small" type="danger">关闭</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="是否开启部分包装线放假">
            <el-tag v-if="packline_holiday_flag === true" size="small">开启</el-tag>
            <el-tag v-else-if="packline_holiday_flag === false" size="small" type="danger">关闭</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="放假区间" :span="2">{{ pack_holiday_interval_str }}</el-descriptions-item>

          <el-descriptions-item label="默认无法识别需求日期">{{ default_unknown_require_day }}</el-descriptions-item>
          <el-descriptions-item label="大小穿插时间">{{ large_small_punctuated }}</el-descriptions-item>
          <el-descriptions-item label="repair_mode">{{ repair_mode }}</el-descriptions-item>
          <el-descriptions-item label="未上排程状态">{{ unschedule_state_str }}</el-descriptions-item>
          <el-descriptions-item label="n天需求日期参数">{{ threshold_duedate }}</el-descriptions-item>
          <el-descriptions-item label="n天物料到达时间参数">{{ threshold_release }}</el-descriptions-item>
          <el-descriptions-item label="LED额外切换时间" :span="2">{{ led_extra_setup_time }}</el-descriptions-item>

          <el-descriptions-item label="维护时间约束">
            <el-tag v-if="block_time_rule === true" size="small">开启</el-tag>
            <el-tag v-else-if="block_time_rule === false" size="small" type="danger">关闭</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="上下板间隔约束">
            <el-tag v-if="buffer_time_rule === true" size="small">开启</el-tag>
            <el-tag v-else-if="buffer_time_rule === false" size="small" type="danger">关闭</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="排白班约束">
            <el-tag v-if="day_shift_time_rule === true" size="small">开启</el-tag>
            <el-tag v-else-if="day_shift_time_rule === false" size="small" type="danger">关闭</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="程序约束">
            <el-tag v-if="program_as_material_rule === true" size="small">开启</el-tag>
            <el-tag v-else-if="program_as_material_rule === false" size="small" type="danger">关闭</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="第一单不约束">
            <el-tag v-if="skip_first_group_rule === true" size="small">开启</el-tag>
            <el-tag v-else-if="skip_first_group_rule === false" size="small" type="danger">关闭</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="排xx白班约束">
            <el-tag v-if="force_day_shift_time_rule === true" size="small">开启</el-tag>
            <el-tag v-else-if="force_day_shift_time_rule === false" size="small" type="danger">关闭</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="排xx夜班约束" :span="2">
            <el-tag v-if="force_night_shift_time_rule === true" size="small">开启</el-tag>
            <el-tag v-else-if="force_night_shift_time_rule === false" size="small" type="danger">关闭</el-tag>
          </el-descriptions-item>

          <el-descriptions-item label="SM13下板新机种每班产能点数，单位为万" :span="2">{{ sm13_buttom_new_machine_predict }}</el-descriptions-item>
          <el-descriptions-item label="SM21上板产能点数预测界限，单位为点" :span="2">{{ sm21_top_led_threshold }}</el-descriptions-item>
          <el-descriptions-item label="SM21上板小于界限产能点数，单位为万" :span="2">{{ sm21_top_le_predict }}</el-descriptions-item>
          <el-descriptions-item label="SM21上板大于界限产能点数，单位为万" :span="2">{{ sm21_top_gt_predict }}</el-descriptions-item>

          <el-descriptions-item label="是否执行分组">
            <el-tag v-if="need_dispatch === true" size="small">开启</el-tag>
            <el-tag v-else-if="need_dispatch === false" size="small" type="danger">关闭</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="是否执行repair">
            <el-tag v-if="need_repair === true" size="small">开启</el-tag>
            <el-tag v-else-if="need_repair === false" size="small" type="danger">关闭</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="是否执行tabu">
            <el-tag v-if="use_tabu === true" size="small">开启</el-tag>
            <el-tag v-else-if="use_tabu === false" size="small" type="danger">关闭</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="是否执行插入锁定">
            <el-tag v-if="use_insert_lock === true" size="small">开启</el-tag>
            <el-tag v-else-if="use_insert_lock === false" size="small" type="danger">关闭</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="是否开启并行" :span="2">
            <el-tag v-if="use_parallel === true" size="small">开启</el-tag>
            <el-tag v-else-if="use_parallel === false" size="small" type="danger">关闭</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="开放搜索解" :span="2">
            <el-tag v-if="deep_search === true" size="small">开启</el-tag>
            <el-tag v-else-if="deep_search === false" size="small" type="danger">关闭</el-tag>
          </el-descriptions-item>

          <el-descriptions-item label="输入的列" :span="4">{{ input_col }}</el-descriptions-item>
          <el-descriptions-item label="导出的列" :span="4">{{ output_col }}</el-descriptions-item>
          <el-descriptions-item label="导出线体顺序" :span="4">{{ output_line_order }}</el-descriptions-item>

          <el-descriptions-item label="创建人">{{ CREATED_BY }}</el-descriptions-item>
          <el-descriptions-item label="创建时间">{{ CREATED_TIME }}</el-descriptions-item>
          <el-descriptions-item label="修改人">{{ UPDATED_BY }}</el-descriptions-item>
          <el-descriptions-item label="修改时间">{{ UPDATED_TIME }}</el-descriptions-item>
        </el-descriptions>
      </div>
    </el-card>
    <el-dialog
      title="修改排程配置"
      :visible.sync="dialogVisible"
      width="70%"
      :before-close="handleClose"
    >
      <el-card class="card-form" shadow="never">
        <el-form ref="$form" :model="model" label-position="left" size="small">
          <el-row :gutter="20" type="flex" justify="start" align="top" tag="div">
            <el-col :span="8" :offset="0" :push="0" :pull="0" tag="div">
              <el-form-item :rules="rules.schedule_time" prop="schedule_time" label="开始排程时间">
                <el-time-picker v-model="model.schedule_time" placeholder="请选择" :style="{width: '100%'}" />
              </el-form-item>
            </el-col>
            <el-col :span="8" :offset="0" :push="0" :pull="0" tag="div">
              <el-form-item :rules="rules.overdue_weight" prop="overdue_weight" label="overdue权重">
                <el-input v-model="model.overdue_weight" placeholder="请输入" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="8" :offset="0" :push="0" :pull="0" tag="div">
              <el-form-item :rules="rules.idle_weight" prop="idle_weight" label="idle权重">
                <el-input v-model="model.idle_weight" placeholder="请输入" clearable />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20" type="flex" justify="start" align="top" tag="div">
            <el-col :span="8" :offset="0" :push="0" :pull="0" tag="div">
              <el-form-item :rules="rules.line_balance_weight" prop="line_balance_weight" label="line balance权重">
                <el-input v-model="model.line_balance_weight" placeholder="请输入" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="8" :offset="0" :push="0" :pull="0" tag="div">
              <el-form-item :rules="rules.big_line_weight" prop="big_line_weight" label="大工单线权重">
                <el-input v-model="model.big_line_weight" placeholder="请输入" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="8" :offset="0" :push="0" :pull="0" tag="div">
              <el-form-item :rules="rules.lock_time_idle_weight" prop="lock_time_idle_weight" label="锁定时间节点内的idle权重">
                <el-input v-model="model.lock_time_idle_weight" placeholder="请输入" clearable />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20" type="flex" justify="start" align="top" tag="div">
            <el-col :span="4" :offset="0" :push="0" :pull="0" tag="div">
              <el-form-item :rules="rules.pack_holiday_flag" prop="pack_holiday_flag" label="全部包装放假">
                <el-switch v-model="model.pack_holiday_flag" />
              </el-form-item>
            </el-col>
            <el-col :span="4" :offset="0" :push="0" :pull="0" tag="div">
              <el-form-item :rules="rules.packline_holiday_flag" prop="packline_holiday_flag" label="部分包装线放假">
                <el-switch v-model="model.packline_holiday_flag" />
              </el-form-item>
            </el-col>
            <el-col :span="16" :offset="0" :push="0" :pull="0" tag="div">
              <el-form-item :rules="rules.pack_holiday_interval_str" prop="pack_holiday_interval_str" label="全部包装放假日期">
                <el-date-picker v-model="model.pack_holiday_interval_str" type="daterange" start-placeholder="请选择" end-placeholder="请选择" format="yyyy-MM-dd" :style="{width: '100%'}" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20" type="flex" justify="start" align="top" tag="div">
            <el-col :span="8" :offset="0" :push="0" :pull="0" tag="div">
              <el-form-item :rules="rules.default_unknown_require_day" prop="default_unknown_require_day" label="默认无法识别需求日期">
                <el-input v-model="model.default_unknown_require_day" placeholder="请输入" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="8" :offset="0" :push="0" :pull="0" tag="div">
              <el-form-item :rules="rules.threshold_duedate" prop="threshold_duedate" label="n天需求日期参数">
                <el-input v-model="model.threshold_duedate" placeholder="请输入" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="8" :offset="0" :push="0" :pull="0" tag="div">
              <el-form-item :rules="rules.threshold_release" prop="threshold_release" label="n天物料到达时间参数">
                <el-input v-model="model.threshold_release" placeholder="请输入" clearable />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20" type="flex" justify="start" align="top" tag="div">
            <el-col :span="8" :offset="0" :push="0" :pull="0" tag="div">
              <el-form-item :rules="rules.unschedule_state_str" prop="unschedule_state_str" label="未上排程状态">
                <el-input v-model="model.unschedule_state_str" placeholder="请输入" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="8" :offset="0" :push="0" :pull="0" tag="div">
              <el-form-item :rules="rules.large_small_punctuated" prop="large_small_punctuated" label="大小穿插时间">
                <el-input v-model="model.large_small_punctuated" placeholder="请输入" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="8" :offset="0" :push="0" :pull="0" tag="div">
              <el-form-item :rules="rules.repair_mode" prop="repair_mode" label="repair_mode">
                <el-input v-model="model.repair_mode" placeholder="请输入" clearable />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20" type="flex" justify="start" align="top" tag="div">
            <el-col :span="12" :offset="0" :push="0" :pull="0" tag="div">
              <el-form-item :rules="rules.sm13_buttom_new_machine_predict" prop="sm13_buttom_new_machine_predict" label="SM13下板新机种每班产能点数，单位为万">
                <el-input v-model="model.sm13_buttom_new_machine_predict" placeholder="请输入" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="12" :offset="0" :push="0" :pull="0" tag="div">
              <el-form-item :rules="rules.sm21_top_led_threshold" prop="sm21_top_led_threshold" label="SM21上板产能点数预测界限，单位为点">
                <el-input v-model="model.sm21_top_led_threshold" placeholder="请输入" clearable />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20" type="flex" justify="start" align="top" tag="div">
            <el-col :span="8" :offset="0" :push="0" :pull="0" tag="div">
              <el-form-item :rules="rules.sm21_top_le_predict" prop="sm21_top_le_predict" label="SM21上板小于界限产能点数，单位为万">
                <el-input v-model="model.sm21_top_le_predict" placeholder="请输入" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="8" :offset="0" :push="0" :pull="0" tag="div">
              <el-form-item :rules="rules.sm21_top_gt_predict" prop="sm21_top_gt_predict" label="SM21上板大于界限产能点数，单位为万">
                <el-input v-model="model.sm21_top_gt_predict" placeholder="请输入" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="8" :offset="0" :push="0" :pull="0" tag="div">
              <el-form-item :rules="rules.led_extra_setup_time" prop="led_extra_setup_time" label="LED额外切换时间">
                <el-input v-model="model.led_extra_setup_time" placeholder="请输入" clearable />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20" type="flex" justify="start" align="top" tag="div">
            <el-col :span="6" :offset="0" :push="0" :pull="0" tag="div">
              <el-form-item :rules="rules.block_time_rule" prop="block_time_rule" label="维护时间约束">
                <el-switch v-model="model.block_time_rule" />
              </el-form-item>
            </el-col>
            <el-col :span="6" :offset="0" :push="0" :pull="0" tag="div">
              <el-form-item :rules="rules.buffer_time_rule" prop="buffer_time_rule" label="上下板间隔约束">
                <el-switch v-model="model.buffer_time_rule" />
              </el-form-item>
            </el-col>
            <el-col :span="6" :offset="0" :push="0" :pull="0" tag="div">
              <el-form-item :rules="rules.day_shift_time_rule" prop="day_shift_time_rule" label="排白班约束">
                <el-switch v-model="model.day_shift_time_rule" />
              </el-form-item>
            </el-col>
            <el-col :span="6" :offset="0" :push="0" :pull="0" tag="div">
              <el-form-item :rules="rules.program_as_material_rule" prop="program_as_material_rule" label="程序约束">
                <el-switch v-model="model.program_as_material_rule" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20" type="flex" justify="start" align="top" tag="div">
            <el-col :span="6" :offset="0" :push="0" :pull="0" tag="div">
              <el-form-item :rules="rules.skip_first_group_rule" prop="skip_first_group_rule" label="第一单不约束">
                <el-switch v-model="model.skip_first_group_rule" />
              </el-form-item>
            </el-col>
            <el-col :span="6" :offset="0" :push="0" :pull="0" tag="div">
              <el-form-item :rules="rules.force_day_shift_time_rule" prop="force_day_shift_time_rule" label="排xx白班约束">
                <el-switch v-model="model.force_day_shift_time_rule" />
              </el-form-item>
            </el-col>
            <el-col :span="6" :offset="0" :push="0" :pull="0" tag="div">
              <el-form-item :rules="rules.force_night_shift_time_rule" prop="force_night_shift_time_rule" label="排xx夜班约束">
                <el-switch v-model="model.force_night_shift_time_rule" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20" type="flex" justify="start" align="top" tag="div">
            <el-col :span="6" :offset="0" :push="0" :pull="0" tag="div">
              <el-form-item :rules="rules.need_preprocess" prop="need_preprocess" label="是否执行预处理">
                <el-switch v-model="model.need_preprocess" />
              </el-form-item>
            </el-col>
            <el-col :span="6" :offset="0" :push="0" :pull="0" tag="div">
              <el-form-item :rules="rules.need_dispatch" prop="need_dispatch" label="是否执行分组">
                <el-switch v-model="model.need_dispatch" />
              </el-form-item>
            </el-col>
            <el-col :span="6" :offset="0" :push="0" :pull="0" tag="div">
              <el-form-item :rules="rules.need_repair" prop="need_repair" label="是否执行repair">
                <el-switch v-model="model.need_repair" />
              </el-form-item>
            </el-col>
            <el-col :span="6" :offset="0" :push="0" :pull="0" tag="div">
              <el-form-item :rules="rules.use_insert_lock" prop="use_insert_lock" label="是否执行插入锁定">
                <el-switch v-model="model.use_insert_lock" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20" type="flex" justify="start" align="top" tag="div">
            <el-col :span="6" :offset="0" :push="0" :pull="0" tag="div">
              <el-form-item :rules="rules.use_tabu" prop="use_tabu" label="是否执行tabu">
                <el-switch v-model="model.use_tabu" />
              </el-form-item>
            </el-col>
            <el-col :span="6" :offset="0" :push="0" :pull="0" tag="div">
              <el-form-item :rules="rules.use_parallel" prop="use_parallel" label="是否开启并行">
                <el-switch v-model="model.use_parallel" />
              </el-form-item>
            </el-col>
            <el-col :span="6" :offset="0" :push="0" :pull="0" tag="div">
              <el-form-item :rules="rules.deep_search" prop="deep_search" label="开放搜索解">
                <el-switch v-model="model.deep_search" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20" type="flex" justify="start" align="top" tag="div">
            <el-col :span="24" :offset="0" :push="0" :pull="0" tag="div">
              <el-form-item :rules="rules.input_col" prop="input_col" label="输入的列">
                <el-input v-model="model.input_col" placeholder="请输入" :rows="2" type="textarea" clearable />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20" type="flex" justify="start" align="top" tag="div">
            <el-col :span="24" :offset="0" :push="0" :pull="0" tag="div">
              <el-form-item :rules="rules.output_col" prop="output_col" label="导出的列">
                <el-input v-model="model.output_col" placeholder="请输入" :rows="2" type="textarea" clearable />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20" type="flex" justify="start" align="top" tag="div">
            <el-col :span="24" :offset="0" :push="0" :pull="0" tag="div">
              <el-form-item :rules="rules.output_line_order" prop="output_line_order" label="导出的线体顺序">
                <el-input v-model="model.output_line_order" placeholder="请输入" :rows="2" type="textarea" clearable />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-card>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveData = false">保 存</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      schedule_date: new Date(),
      schedule_time: '8:00',

      overdue_weight: 20.0,
      idle_weight: 1,
      line_balance_weight: 1,
      big_line_weight: 1,
      lock_time_idle_weight: 1,

      default_unknown_require_day: 3,
      threshold_duedate: 10,
      threshold_release: 5.0,
      large_small_punctuated: 1500,
      repair_mode: 1,
      unschedule_state_str: '未上排程',

      block_time_rule: true,
      buffer_time_rule: true,
      day_shift_time_rule: true,
      program_as_material_rule: true,
      skip_first_group_rule: true,
      force_day_shift_time_rule: true,
      force_night_shift_time_rule: true,

      pack_holiday_flag: true,
      packline_holiday_flag: false,
      pack_holiday_interval_str: '2022-10-01~2022-10-04',

      sm13_buttom_new_machine_predict: 45,
      sm21_top_led_threshold: 10000,
      sm21_top_le_predict: 200,
      sm21_top_gt_predict: 230,
      led_extra_setup_time: 120,

      use_tabu: true,
      need_preprocess: true,
      need_dispatch: true,
      need_repair: true,
      use_insert_lock: true,
      use_parallel: true,
      deep_search: true,

      input_col: '',
      output_col: '',
      output_line_order: '',

      CREATED_BY: 'FHY',
      CREATED_TIME: '2022-09-29 20:42:56',
      UPDATED_BY: 'FHY',
      UPDATED_TIME: '2022-09-29 20:43:56',

      dialogVisible: false,

      forms: ['$form'],
      model: {
        schedule_time: '',
        overdue_weight: '',
        idle_weight: '',
        line_balance_weight: '',
        big_line_weight: '',
        lock_time_idle_weight: '',
        pack_holiday_flag: false,
        pack_holiday_interval_str: [],
        packline_holiday_flag: false,
        led_extra_setup_time: '',
        default_unknown_require_day: '',
        threshold_duedate: '',
        threshold_release: '',
        unschedule_state_str: '',
        large_small_punctuated: '',
        repair_mode: '',
        block_time_rule: false,
        buffer_time_rule: false,
        day_shift_time_rule: false,
        program_as_material_rule: false,
        skip_first_group_rule: false,
        force_day_shift_time_rule: false,
        force_night_shift_time_rule: false,
        sm13_buttom_new_machine_predict: '',
        sm21_top_led_threshold: '',
        sm21_top_le_predict: '',
        sm21_top_gt_predict: '',
        need_preprocess: false,
        need_dispatch: false,
        need_repair: false,
        use_insert_lock: false,
        use_tabu: false,
        use_parallel: false,
        deep_search: false,
        input_col: '',
        output_col: '',
        output_line_order: ''
      },
      rules: {
        schedule_time: [{
          required: true,
          message: '开始排程时间不能为空',
          trigger: 'change'
        }],
        overdue_weight: [{
          required: true,
          message: 'overdue权重不能为空',
          trigger: 'blur'
        }, {
          type: 'float',
          message: 'overdue权重格式不正确',
          trigger: 'blur'
        }],
        idle_weight: [{
          required: true,
          message: 'idle权重不能为空',
          trigger: 'blur'
        }, {
          type: 'float',
          message: 'idle权重格式不正确',
          trigger: 'blur'
        }],
        line_balance_weight: [{
          required: true,
          message: 'line balance权重不能为空',
          trigger: 'blur'
        }, {
          type: 'float',
          message: 'line balance权重格式不正确',
          trigger: 'blur'
        }],
        big_line_weight: [{
          required: true,
          message: '大工单线权重不能为空',
          trigger: 'blur'
        }, {
          type: 'float',
          message: '大工单线权重格式不正确',
          trigger: 'blur'
        }],
        lock_time_idle_weight: [{
          required: true,
          message: '锁定时间节点内的idle权重不能为空',
          trigger: 'blur'
        }, {
          type: 'float',
          message: '锁定时间节点内的idle权重格式不正确',
          trigger: 'blur'
        }],
        pack_holiday_flag: [{
          required: true,
          message: '是否开启全部包装放假不能为空',
          trigger: 'change'
        }],
        pack_holiday_interval_str: [],
        packline_holiday_flag: [{
          required: true,
          message: '是否开启部分包装线放假不能为空',
          trigger: 'change'
        }],
        led_extra_setup_time: [{
          required: true,
          message: 'LED额外切换时间不能为空',
          trigger: 'blur'
        }, {
          type: 'float',
          message: 'LED额外切换时间格式不正确',
          trigger: 'blur'
        }],
        default_unknown_require_day: [{
          required: true,
          message: '默认无法识别需求日期不能为空',
          trigger: 'blur'
        }, {
          type: 'integer',
          message: '默认无法识别需求日期格式不正确',
          trigger: 'blur'
        }],
        threshold_duedate: [{
          required: true,
          message: 'n天需求日期参数不能为空',
          trigger: 'blur'
        }, {
          type: 'integer',
          message: 'n天需求日期参数格式不正确',
          trigger: 'blur'
        }],
        threshold_release: [{
          required: true,
          message: 'n天物料到达时间参数不能为空',
          trigger: 'blur'
        }, {
          type: 'float',
          message: 'n天物料到达时间参数格式不正确',
          trigger: 'blur'
        }],
        unschedule_state_str: [{
          required: true,
          message: '未上排程状态不能为空',
          trigger: 'blur'
        }, {
          type: 'string',
          message: '未上排程状态格式不正确',
          trigger: 'blur'
        }],
        large_small_punctuated: [{
          required: true,
          message: '大小穿插时间不能为空',
          trigger: 'blur'
        }, {
          type: 'float',
          message: '大小穿插时间格式不正确',
          trigger: 'blur'
        }],
        repair_mode: [{
          required: true,
          message: 'repair_mode不能为空',
          trigger: 'blur'
        }, {
          type: 'number',
          message: 'repair_mode格式不正确',
          trigger: 'blur'
        }],
        block_time_rule: [{
          required: true,
          message: '维护时间约束不能为空',
          trigger: 'change'
        }],
        buffer_time_rule: [{
          required: true,
          message: '上下板间隔约束不能为空',
          trigger: 'change'
        }],
        day_shift_time_rule: [{
          required: true,
          message: '排白班约束不能为空',
          trigger: 'change'
        }],
        program_as_material_rule: [{
          required: true,
          message: '程序约束不能为空',
          trigger: 'change'
        }],
        skip_first_group_rule: [{
          required: true,
          message: '第一单不约束不能为空',
          trigger: 'change'
        }],
        force_day_shift_time_rule: [{
          required: true,
          message: '排xx白班约束不能为空',
          trigger: 'change'
        }],
        force_night_shift_time_rule: [{
          required: true,
          message: '排xx夜班约束不能为空',
          trigger: 'change'
        }],
        sm13_buttom_new_machine_predict: [{
          required: true,
          message: 'SM13下板新机种每班产能点数，单位为万不能为空',
          trigger: 'blur'
        }, {
          type: 'float',
          message: 'SM13下板新机种每班产能点数，单位为万格式不正确',
          trigger: 'blur'
        }],
        sm21_top_led_threshold: [{
          required: true,
          message: 'SM21上板产能点数预测界限，单位为点不能为空',
          trigger: 'blur'
        }, {
          type: 'float',
          message: 'SM21上板产能点数预测界限，单位为点格式不正确',
          trigger: 'blur'
        }],
        sm21_top_le_predict: [{
          required: true,
          message: 'SM21上板小于界限产能点数，单位为万不能为空',
          trigger: 'blur'
        }, {
          type: 'float',
          message: 'SM21上板小于界限产能点数，单位为万格式不正确',
          trigger: 'blur'
        }],
        sm21_top_gt_predict: [{
          required: true,
          message: 'SM21上板大于界限产能点数，单位为万不能为空',
          trigger: 'blur'
        }, {
          type: 'float',
          message: 'SM21上板大于界限产能点数，单位为万格式不正确',
          trigger: 'blur'
        }],
        need_preprocess: [{
          required: true,
          message: '是否执行预处理不能为空',
          trigger: 'change'
        }],
        need_dispatch: [{
          required: true,
          message: '是否执行分组不能为空',
          trigger: 'change'
        }],
        need_repair: [{
          required: true,
          message: '是否执行repair不能为空',
          trigger: 'change'
        }],
        use_insert_lock: [{
          required: true,
          message: '是否执行插入锁定不能为空',
          trigger: 'change'
        }],
        use_tabu: [{
          required: true,
          message: '是否执行tabu不能为空',
          trigger: 'change'
        }],
        use_parallel: [{
          required: true,
          message: '是否开启并行不能为空',
          trigger: 'change'
        }],
        deep_search: [{
          required: true,
          message: '开放搜索解不能为空',
          trigger: 'change'
        }],
        input_col: [{
          required: true,
          message: '输入的列不能为空',
          trigger: 'blur'
        }, {
          type: 'array',
          message: '输入的列格式不正确',
          trigger: 'blur'
        }],
        output_col: [{
          required: true,
          message: '导出的列不能为空',
          trigger: 'blur'
        }, {
          type: 'array',
          message: '导出的列格式不正确',
          trigger: 'blur'
        }],
        output_line_order: [{
          required: true,
          message: '导出的线体顺序不能为空',
          trigger: 'blur'
        }]
      }
    }
  },
  mounted() {

  },
  methods: {
    editDataDialog() {
      this.dialogVisible = true
    }
  }
}
</script>
<style lang="scss" scoped>
    @import '../../assets/css/config.scss';
</style>
<style>
.card-form .el-card__body{
    padding: 20px;
}
</style>
