<template>
  <div id="main">
    <el-card>
      <div>
        <el-descriptions class="margin-top" title="排程配置" :column="4" :label-style="{'font-weight':'bold'}" border>
          <template slot="extra">
            <el-tooltip class="item" effect="dark" content="刷新表格" placement="top">
              <el-button
                size="small"
                icon="el-icon-refresh"
                @click="refreshTableData"
              />
            </el-tooltip>
          </template>
          <template slot="extra">
            <el-button type="primary" size="small" @click="modifyDataDialog">
              <i class="el-icon-edit-outline" /> 修改配置
            </el-button>
          </template>
          <el-descriptions-item label="排程日期" :span="2">{{ modelOriginal.schedule_date }}</el-descriptions-item>
          <el-descriptions-item label="开始排程时间" :span="2">{{ modelOriginal.schedule_time }}</el-descriptions-item>

          <el-descriptions-item label="overdue权重">{{ modelOriginal.overdue_weight }}</el-descriptions-item>
          <el-descriptions-item label="idle权重">{{ modelOriginal.idle_weight }}</el-descriptions-item>
          <el-descriptions-item label="Line balance权重">{{ modelOriginal.line_balance_weight }}</el-descriptions-item>
          <el-descriptions-item label="大工单线权重">{{ modelOriginal.big_line_weight }}</el-descriptions-item>
          <el-descriptions-item label="锁定时间节点内的idle权重" :span="4">{{ modelOriginal.lock_time_idle_weight }}</el-descriptions-item>

          <el-descriptions-item label="是否开启全部包装放假">
            <el-tag v-if="modelOriginal.pack_holiday_flag === true" size="small" type="success">开启</el-tag>
            <el-tag v-else-if="modelOriginal.pack_holiday_flag === false" size="small" type="danger">关闭</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="是否开启部分包装线放假">
            <el-tag v-if="modelOriginal.packline_holiday_flag === true" size="small" type="success">开启</el-tag>
            <el-tag v-else-if="modelOriginal.packline_holiday_flag === false" size="small" type="danger">关闭</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="全部包装放假日期" :span="2">
            <el-tag
              v-for="(val,key) in pack_holiday_interval"
              :key="key"
              style="margin-right: 5px;"
            >
              {{ val }}
            </el-tag>
          </el-descriptions-item>

          <el-descriptions-item label="默认无法识别需求日期">{{ modelOriginal.default_unknown_require_day }}天</el-descriptions-item>
          <el-descriptions-item label="大小穿插时间">{{ modelOriginal.large_small_punctuated }}秒</el-descriptions-item>
          <el-descriptions-item label="repair_mode">{{ modelOriginal.repair_mode }}</el-descriptions-item>
          <el-descriptions-item label="未上排程状态">{{ modelOriginal.unschedule_state_str }}</el-descriptions-item>
          <el-descriptions-item label="n天需求日期参数">{{ modelOriginal.threshold_duedate }}天</el-descriptions-item>
          <el-descriptions-item label="n天物料到达时间参数">{{ modelOriginal.threshold_release }}天</el-descriptions-item>
          <el-descriptions-item label="LED额外切换时间" :span="2">{{ modelOriginal.led_extra_setup_time }}秒</el-descriptions-item>

          <el-descriptions-item label="维护时间约束">
            <el-tag v-if="modelOriginal.block_time_rule === true" size="small" type="success">开启</el-tag>
            <el-tag v-else-if="modelOriginal.block_time_rule === false" size="small" type="danger">关闭</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="上下板间隔约束">
            <el-tag v-if="modelOriginal.buffer_time_rule === true" size="small" type="success">开启</el-tag>
            <el-tag v-else-if="modelOriginal.buffer_time_rule === false" size="small" type="danger">关闭</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="排白班约束">
            <el-tag v-if="modelOriginal.day_shift_time_rule === true" size="small" type="success">开启</el-tag>
            <el-tag v-else-if="modelOriginal.day_shift_time_rule === false" size="small" type="danger">关闭</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="程序约束">
            <el-tag v-if="modelOriginal.program_as_material_rule === true" size="small" type="success">开启</el-tag>
            <el-tag v-else-if="modelOriginal.program_as_material_rule === false" size="small" type="danger">关闭</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="第一单不约束">
            <el-tag v-if="modelOriginal.skip_first_group_rule === true" size="small" type="success">开启</el-tag>
            <el-tag v-else-if="modelOriginal.skip_first_group_rule === false" size="small" type="danger">关闭</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="排xx白班约束">
            <el-tag v-if="modelOriginal.force_day_shift_time_rule === true" size="small" type="success">开启</el-tag>
            <el-tag v-else-if="modelOriginal.force_day_shift_time_rule === false" size="small" type="danger">关闭</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="排xx夜班约束">
            <el-tag v-if="modelOriginal.force_night_shift_time_rule === true" size="small" type="success">开启</el-tag>
            <el-tag v-else-if="modelOriginal.force_night_shift_time_rule === false" size="small" type="danger">关闭</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="非Gaia工单赌物料到20:00">
            <el-tag v-if="modelOriginal.not_gaia_release_time_eight === true" size="small" type="success">开启</el-tag>
            <el-tag v-else-if="modelOriginal.not_gaia_release_time_eight === false" size="small" type="danger">关闭</el-tag>
          </el-descriptions-item>

          <el-descriptions-item label="SM13下板新机种每班产能点数，单位为万" :span="2">{{ modelOriginal.sm13_buttom_new_machine_predict }}万</el-descriptions-item>
          <el-descriptions-item label="SM21上板产能点数预测界限，单位为点" :span="2">{{ modelOriginal.sm21_top_led_threshold }}点</el-descriptions-item>
          <el-descriptions-item label="SM21上板小于界限产能点数，单位为万" :span="2">{{ modelOriginal.sm21_top_le_predict }}万</el-descriptions-item>
          <el-descriptions-item label="SM21上板大于界限产能点数，单位为万" :span="2">{{ modelOriginal.sm21_top_gt_predict }}万</el-descriptions-item>

          <el-descriptions-item label="是否执行分组">
            <el-tag v-if="modelOriginal.need_dispatch === true" size="small" type="success">开启</el-tag>
            <el-tag v-else-if="modelOriginal.need_dispatch === false" size="small" type="danger">关闭</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="是否执行repair">
            <el-tag v-if="modelOriginal.need_repair === true" size="small" type="success">开启</el-tag>
            <el-tag v-else-if="modelOriginal.need_repair === false" size="small" type="danger">关闭</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="是否执行tabu">
            <el-tag v-if="modelOriginal.use_tabu === true" size="small" type="success">开启</el-tag>
            <el-tag v-else-if="modelOriginal.use_tabu === false" size="small" type="danger">关闭</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="是否执行插入锁定">
            <el-tag v-if="modelOriginal.use_insert_lock === true" size="small" type="success">开启</el-tag>
            <el-tag v-else-if="modelOriginal.use_insert_lock === false" size="small" type="danger">关闭</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="是否开启并行" :span="2">
            <el-tag v-if="modelOriginal.use_parallel === true" size="small" type="success">开启</el-tag>
            <el-tag v-else-if="modelOriginal.use_parallel === false" size="small" type="danger">关闭</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="开放搜索解" :span="2">
            <el-tag v-if="modelOriginal.deep_search === true" size="small" type="success">开启</el-tag>
            <el-tag v-else-if="modelOriginal.deep_search === false" size="small" type="danger">关闭</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="小板线单面点数阈值(大于此值去SM12)">
            {{ modelOriginal.small_board_single_points_threshold }}
          </el-descriptions-item>
          <el-descriptions-item label="小板线大小工单阈值">
            {{ modelOriginal.small_board_total_points_threshold }}
          </el-descriptions-item>
          <el-descriptions-item label="后工序为AI提前时间">
            {{ modelOriginal.ai_post_process }}天
          </el-descriptions-item>
          <el-descriptions-item label="LED工单是否纳入目标函数">
            <el-tag v-if="modelOriginal.is_run_recognize_ignore_overdue_jobs === true" size="small" type="success">开启</el-tag>
            <el-tag v-else-if="modelOriginal.is_run_recognize_ignore_overdue_jobs === false" size="small" type="danger">关闭</el-tag>
          </el-descriptions-item>

          <el-descriptions-item label="大工单线线体" :span="2">{{ modelOriginal.big_lines }}</el-descriptions-item>
          <el-descriptions-item label="优先排大工单线体" :span="2">{{ modelOriginal.Big_lines_remove22 }}</el-descriptions-item>
          <el-descriptions-item label="该线体工单优先排大工单线" :span="2">{{ modelOriginal.Non_big_lines }}</el-descriptions-item>
          <el-descriptions-item label="西门子线体配置" :span="2">{{ modelOriginal.ximenzi_lines }}</el-descriptions-item>
          <el-descriptions-item label="不能绑定的线体配置" :span="2">{{ modelOriginal.cannot_binding_lines }}</el-descriptions-item>
          <el-descriptions-item label="BPR线体" :span="2">{{ modelOriginal.Four_SR_lines }}</el-descriptions-item>
          <el-descriptions-item label="安必昂不能绑定线体" :span="4">{{ modelOriginal.AX_lines }}</el-descriptions-item>

          <el-descriptions-item label="西门子特殊板宽宽度配置" :span="4">{{ modelOriginal.board_width }}毫米</el-descriptions-item>

          <el-descriptions-item label="输入的列" :span="4">{{ modelOriginal.input_col }}</el-descriptions-item>
          <el-descriptions-item label="导出的列" :span="4">{{ modelOriginal.output_col }}</el-descriptions-item>
          <el-descriptions-item label="导出线体顺序" :span="4">{{ modelOriginal.output_line_order }}</el-descriptions-item>

          <el-descriptions-item label="创建人">{{ modelOriginal.CREATED_BY }}</el-descriptions-item>
          <el-descriptions-item label="创建时间">{{ modelOriginal.CREATED_TIME }}</el-descriptions-item>
          <el-descriptions-item label="修改人">{{ modelOriginal.UPDATED_BY }}</el-descriptions-item>
          <el-descriptions-item label="修改时间">{{ modelOriginal.UPDATED_TIME }}</el-descriptions-item>
        </el-descriptions>
      </div>
    </el-card>
    <el-dialog
      v-el-drag-dialog
      :visible.sync="dialogVisible"
      title="修改排程配置"
      width="70%"
      :before-close="handleFormClose"
      @dragDialog="handleDrag"
    >
      <el-card class="card-form" shadow="never">
        <el-form ref="$form" :model="model" label-position="left" size="small">
          <el-row :gutter="20" type="flex" justify="start" align="top" tag="div">
            <el-col :span="8" :offset="0" :push="0" :pull="0" tag="div">
              <el-form-item :rules="rules.schedule_time" prop="schedule_time" label="开始排程时间">
                <el-time-picker
                  v-model="model.schedule_time"
                  value-format="HH:00:00"
                  placeholder="请选择"
                  :style="{width: '100%'}"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8" :offset="0" :push="0" :pull="0" tag="div">
              <el-form-item :rules="rules.overdue_weight" prop="overdue_weight" label="overdue权重">
                <el-input-number v-model="model.overdue_weight" placeholder="请输入" :step="0.1" :style="{width: '100%'}" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="8" :offset="0" :push="0" :pull="0" tag="div">
              <el-form-item :rules="rules.idle_weight" prop="idle_weight" label="idle权重">
                <el-input-number v-model="model.idle_weight" placeholder="请输入" :step="0.1" :style="{width: '100%'}" clearable />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20" type="flex" justify="start" align="top" tag="div">
            <el-col :span="8" :offset="0" :push="0" :pull="0" tag="div">
              <el-form-item :rules="rules.line_balance_weight" prop="line_balance_weight" label="line balance权重">
                <el-input-number v-model="model.line_balance_weight" placeholder="请输入" :step="0.1" :style="{width: '100%'}" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="8" :offset="0" :push="0" :pull="0" tag="div">
              <el-form-item :rules="rules.big_line_weight" prop="big_line_weight" label="大工单线权重">
                <el-input-number v-model="model.big_line_weight" placeholder="请输入" :step="0.1" :style="{width: '100%'}" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="8" :offset="0" :push="0" :pull="0" tag="div">
              <el-form-item :rules="rules.lock_time_idle_weight" prop="lock_time_idle_weight" label="锁定时间节点内的idle权重">
                <el-input-number v-model="model.lock_time_idle_weight" placeholder="请输入" :step="0.1" :style="{width: '100%'}" clearable />
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
                <!-- <el-date-picker v-model="model.pack_holiday_interval_str" type="daterange" start-placeholder="请选择" end-placeholder="请选择" format="yyyy-MM-dd" :style="{width: '100%'}" /> -->
                <el-date-picker
                  v-model="model.pack_holiday_interval_str"
                  type="dates"
                  placeholder="选择一个或多个放假日期"
                  :style="{width: '100%'}"
                  value-format="yyyy-MM-dd"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20" type="flex" justify="start" align="top" tag="div">
            <el-col :span="8" :offset="0" :push="0" :pull="0" tag="div">
              <el-form-item :rules="rules.default_unknown_require_day" prop="default_unknown_require_day" label="默认无法识别需求日期">
                <el-input-number v-model="model.default_unknown_require_day" placeholder="请输入，单位为天" :step="1" :style="{width: '100%'}" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="8" :offset="0" :push="0" :pull="0" tag="div">
              <el-form-item :rules="rules.threshold_duedate" prop="threshold_duedate" label="n天需求日期参数">
                <el-input-number v-model="model.threshold_duedate" placeholder="请输入，单位为天" :step="1" :style="{width: '100%'}" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="8" :offset="0" :push="0" :pull="0" tag="div">
              <el-form-item :rules="rules.threshold_release" prop="threshold_release" label="n天物料到达时间参数">
                <el-input-number v-model="model.threshold_release" placeholder="请输入，单位为天" :step="1" :style="{width: '100%'}" clearable />
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
                <el-input-number v-model="model.large_small_punctuated" placeholder="请输入，单位为秒" :step="1" :style="{width: '100%'}" clearable />
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
                <el-input-number v-model="model.sm13_buttom_new_machine_predict" placeholder="请输入" :step="1" :style="{width: '100%'}" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="12" :offset="0" :push="0" :pull="0" tag="div">
              <el-form-item :rules="rules.sm21_top_led_threshold" prop="sm21_top_led_threshold" label="SM21上板产能点数预测界限，单位为点">
                <el-input-number v-model="model.sm21_top_led_threshold" placeholder="请输入" :step="1" :style="{width: '100%'}" clearable />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20" type="flex" justify="start" align="top" tag="div">
            <el-col :span="8" :offset="0" :push="0" :pull="0" tag="div">
              <el-form-item :rules="rules.sm21_top_le_predict" prop="sm21_top_le_predict" label="SM21上板小于界限产能点数，单位为万">
                <el-input-number v-model="model.sm21_top_le_predict" placeholder="请输入" :step="1" :style="{width: '100%'}" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="8" :offset="0" :push="0" :pull="0" tag="div">
              <el-form-item :rules="rules.sm21_top_gt_predict" prop="sm21_top_gt_predict" label="SM21上板大于界限产能点数，单位为万">
                <el-input-number v-model="model.sm21_top_gt_predict" placeholder="请输入" :step="1" :style="{width: '100%'}" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="8" :offset="0" :push="0" :pull="0" tag="div">
              <el-form-item :rules="rules.led_extra_setup_time" prop="led_extra_setup_time" label="LED额外切换时间">
                <el-input-number v-model="model.led_extra_setup_time" placeholder="请输入" :step="1" :style="{width: '100%'}" clearable />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20" type="flex" justify="start" align="top" tag="div">
            <el-col :span="8" :offset="0" :push="0" :pull="0" tag="div">
              <el-form-item :rules="rules.small_board_single_points_threshold" prop="small_board_single_points_threshold" label="小板线单面点数阈值(大于此值去SM12)">
                <el-input-number v-model="model.small_board_single_points_threshold" placeholder="请输入" :step="1" :style="{width: '100%'}" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="8" :offset="0" :push="0" :pull="0" tag="div">
              <el-form-item :rules="rules.small_board_total_points_threshold" prop="small_board_total_points_threshold" label="小板线大小工单阈值">
                <el-input-number v-model="model.small_board_total_points_threshold" placeholder="请输入" :step="1" :style="{width: '100%'}" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="8" :offset="0" :push="0" :pull="0" tag="div">
              <el-form-item :rules="rules.ai_post_process" prop="ai_post_process" label="后工序为AI提前时间">
                <el-input-number v-model="model.ai_post_process" placeholder="请输入" :step="0.1" :style="{width: '100%'}" clearable />
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
            <el-col :span="6" :offset="0" :push="0" :pull="0" tag="div">
              <el-form-item :rules="rules.not_gaia_release_time_eight" prop="not_gaia_release_time_eight" label="非Gaia工单赌物料到20:00">
                <el-switch v-model="model.not_gaia_release_time_eight" />
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
            <el-col :span="6" :offset="0" :push="0" :pull="0" tag="div">
              <el-form-item :rules="rules.is_run_recognize_ignore_overdue_jobs" prop="is_run_recognize_ignore_overdue_jobs" label="LED工单是否纳入目标函数">
                <el-switch v-model="model.is_run_recognize_ignore_overdue_jobs" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20" type="flex" justify="start" align="top" tag="div">
            <el-col :span="12" :offset="0" :push="0" :pull="0" tag="div">
              <el-form-item :rules="rules.big_lines" prop="big_lines" label="大工单线线体(线体用顿号隔开)">
                <el-input v-model="model.big_lines" placeholder="请输入" :rows="1" type="textarea" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="12" :offset="0" :push="0" :pull="0" tag="div">
              <el-form-item :rules="rules.Big_lines_remove22" prop="Big_lines_remove22" label="优先排大工单线体(线体用顿号隔开)">
                <el-input v-model="model.Big_lines_remove22" placeholder="请输入" :rows="1" type="textarea" clearable />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20" type="flex" justify="start" align="top" tag="div">
            <el-col :span="12" :offset="0" :push="0" :pull="0" tag="div">
              <el-form-item :rules="rules.Non_big_lines" prop="Non_big_lines" label="该线体工单优先排大工单线(线体用顿号隔开)">
                <el-input v-model="model.Non_big_lines" placeholder="请输入" :rows="1" type="textarea" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="12" :offset="0" :push="0" :pull="0" tag="div">
              <el-form-item :rules="rules.ximenzi_lines" prop="ximenzi_lines" label="西门子线体配置(线体用顿号隔开)">
                <el-input v-model="model.ximenzi_lines" placeholder="请输入" :rows="1" type="textarea" clearable />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20" type="flex" justify="start" align="top" tag="div">
            <el-col :span="12" :offset="0" :push="0" :pull="0" tag="div">
              <el-form-item :rules="rules.cannot_binding_lines" prop="cannot_binding_lines" label="不能绑定的线体配置(线体用顿号隔开)">
                <el-input v-model="model.cannot_binding_lines" placeholder="请输入" :rows="1" type="textarea" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="12" :offset="0" :push="0" :pull="0" tag="div">
              <el-form-item :rules="rules.Four_SR_lines" prop="Four_SR_lines" label="BPR线体(线体用顿号隔开)">
                <el-input v-model="model.Four_SR_lines" placeholder="请输入" :rows="1" type="textarea" clearable />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20" type="flex" justify="start" align="top" tag="div">
            <el-col :span="12" :offset="0" :push="0" :pull="0" tag="div">
              <el-form-item :rules="rules.AX_lines" prop="AX_lines" label="安必昂不能绑定线体(线体用顿号隔开)">
                <el-input v-model="model.AX_lines" placeholder="请输入" :rows="1" type="textarea" clearable />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20" type="flex" justify="start" align="top" tag="div">
            <el-col :span="6" :offset="0" :push="0" :pull="0" tag="div">
              <el-form-item :rules="rules.board_width" prop="board_width" label="西门子特殊板宽宽度配置">
                <el-input-number v-model="model.board_width" placeholder="请输入" :step="1" :style="{width: '100%'}" clearable />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20" type="flex" justify="start" align="top" tag="div">
            <el-col :span="24" :offset="0" :push="0" :pull="0" tag="div">
              <el-form-item :rules="rules.input_col" prop="input_col" label="输入的列">
                <el-input v-model="model.input_col" placeholder="请输入" :rows="3" type="textarea" clearable />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20" type="flex" justify="start" align="top" tag="div">
            <el-col :span="24" :offset="0" :push="0" :pull="0" tag="div">
              <el-form-item :rules="rules.output_col" prop="output_col" label="导出的列">
                <el-input v-model="model.output_col" placeholder="请输入" :rows="3" type="textarea" clearable />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20" type="flex" justify="start" align="top" tag="div">
            <el-col :span="24" :offset="0" :push="0" :pull="0" tag="div">
              <el-form-item :rules="rules.output_line_order" prop="output_line_order" label="导出的线体顺序">
                <el-input v-model="model.output_line_order" placeholder="请输入" :rows="3" type="textarea" clearable />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-card>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="modifyData">确认修改</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import elDragDialog from '@/directive/el-drag-dialog' // base on element-ui
import { GetTableData, ModifyData } from '@/api/Control/Config'
export default {
  name: 'Config',
  directives: { elDragDialog },
  data() {
    return {
      value4: '',
      dialogVisible: false,
      isClick: false, // 是否点击了确认修改
      forms: ['$form'],
      pack_holiday_interval: '',
      modelOriginal: {
        schedule_date: '',
        schedule_time: '',
        overdue_weight: '',
        idle_weight: '',
        line_balance_weight: '',
        big_line_weight: '',
        lock_time_idle_weight: '',
        pack_holiday_flag: true,
        pack_holiday_interval_str: '',
        packline_holiday_flag: true,
        led_extra_setup_time: '',
        default_unknown_require_day: '',
        threshold_duedate: '',
        threshold_release: '',
        unschedule_state_str: '',
        large_small_punctuated: '',
        repair_mode: '',
        block_time_rule: true,
        buffer_time_rule: true,
        day_shift_time_rule: true,
        program_as_material_rule: true,
        skip_first_group_rule: true,
        force_day_shift_time_rule: true,
        force_night_shift_time_rule: true,
        not_gaia_release_time_eight: false,
        sm13_buttom_new_machine_predict: '',
        sm21_top_led_threshold: '',
        sm21_top_le_predict: '',
        sm21_top_gt_predict: '',
        need_preprocess: true,
        need_dispatch: true,
        need_repair: true,
        use_insert_lock: true,
        use_tabu: true,
        use_parallel: true,
        deep_search: true,
        small_board_single_points_threshold: '',
        small_board_total_points_threshold: '',
        ai_post_process: '',
        is_run_recognize_ignore_overdue_jobs: true,
        big_lines: '',
        Big_lines_remove22: '',
        Non_big_lines: '',
        ximenzi_lines: '',
        cannot_binding_lines: '',
        AX_lines: '',
        Four_SR_lines: '',
        board_width: 0,
        input_col: '',
        output_col: '',
        output_line_order: '',
        CREATED_BY: '',
        CREATED_TIME: '',
        UPDATED_BY: '',
        UPDATED_TIME: ''
      },
      model: {
        schedule_date: '',
        schedule_time: '',
        overdue_weight: '',
        idle_weight: '',
        line_balance_weight: '',
        big_line_weight: '',
        lock_time_idle_weight: '',
        pack_holiday_flag: true,
        pack_holiday_interval_str: '',
        packline_holiday_flag: true,
        led_extra_setup_time: '',
        default_unknown_require_day: '',
        threshold_duedate: '',
        threshold_release: '',
        unschedule_state_str: '',
        large_small_punctuated: '',
        repair_mode: '',
        block_time_rule: true,
        buffer_time_rule: true,
        day_shift_time_rule: true,
        program_as_material_rule: true,
        skip_first_group_rule: true,
        force_day_shift_time_rule: true,
        force_night_shift_time_rule: true,
        not_gaia_release_time_eight: false,
        sm13_buttom_new_machine_predict: '',
        sm21_top_led_threshold: '',
        sm21_top_le_predict: '',
        sm21_top_gt_predict: '',
        need_preprocess: true,
        need_dispatch: true,
        need_repair: true,
        use_insert_lock: true,
        use_tabu: true,
        use_parallel: true,
        deep_search: true,
        small_board_single_points_threshold: '',
        small_board_total_points_threshold: '',
        ai_post_process: '',
        is_run_recognize_ignore_overdue_jobs: true,
        big_lines: '',
        Big_lines_remove22: '',
        Non_big_lines: '',
        ximenzi_lines: '',
        cannot_binding_lines: '',
        Four_SR_lines: '',
        AX_lines: '',
        board_width: 0,
        input_col: '',
        output_col: '',
        output_line_order: '',
        CREATED_BY: '',
        CREATED_TIME: '',
        UPDATED_BY: '',
        UPDATED_TIME: ''
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
        }],
        idle_weight: [{
          required: true,
          message: 'idle权重不能为空',
          trigger: 'blur'
        }],
        line_balance_weight: [{
          required: true,
          message: 'line balance权重不能为空',
          trigger: 'blur'
        }],
        big_line_weight: [{
          required: true,
          message: '大工单线权重不能为空',
          trigger: 'blur'
        }],
        lock_time_idle_weight: [{
          required: true,
          message: '锁定时间节点内的idle权重不能为空',
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
        }],
        default_unknown_require_day: [{
          required: true,
          message: '默认无法识别需求日期不能为空',
          trigger: 'blur'
        }],
        threshold_duedate: [{
          required: true,
          message: 'n天需求日期参数不能为空',
          trigger: 'blur'
        }],
        threshold_release: [{
          required: true,
          message: 'n天物料到达时间参数不能为空',
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
        not_gaia_release_time_eight: [{
          required: true,
          message: '该选项不能为空',
          trigger: 'change'
        }],
        sm13_buttom_new_machine_predict: [{
          required: true,
          message: 'SM13下板新机种每班产能点数不能为空',
          trigger: 'blur'
        }],
        sm21_top_led_threshold: [{
          required: true,
          message: 'SM21上板产能点数预测界限不能为空',
          trigger: 'blur'
        }],
        sm21_top_le_predict: [{
          required: true,
          message: 'SM21上板小于界限产能点数不能为空',
          trigger: 'blur'
        }],
        sm21_top_gt_predict: [{
          required: true,
          message: 'SM21上板大于界限产能点数不能为空',
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
        small_board_single_points_threshold: [{
          required: true,
          message: '该项不能为空',
          trigger: 'change'
        }],
        small_board_total_points_threshold: [{
          required: true,
          message: '该项不能为空',
          trigger: 'change'
        }],
        ai_post_process: [{
          required: true,
          message: '该项不能为空',
          trigger: 'change'
        }],
        is_run_recognize_ignore_overdue_jobs: [{
          required: true,
          message: '该项不能为空',
          trigger: 'change'
        }],
        big_lines: [{
          required: true,
          message: '该项不能为空',
          trigger: 'change'
        }],
        // AX_lines: [{
        //   required: true,
        //   message: '该项不能为空',
        //   trigger: 'change'
        // }],
        // Big_lines_remove22: [{
        //   required: true,
        //   message: '该项不能为空',
        //   trigger: 'change'
        // }],
        // Non_big_lines: [{
        //   required: true,
        //   message: '该项不能为空',
        //   trigger: 'change'
        // }],
        // ximenzi_lines: [{
        //   required: true,
        //   message: '该项不能为空',
        //   trigger: 'change'
        // }],
        // cannot_binding_lines: [{
        //   required: true,
        //   message: '该项不能为空',
        //   trigger: 'change'
        // }],
        // Four_SR_lines: [{
        //   required: true,
        //   message: '该项不能为空',
        //   trigger: 'change'
        // }],
        // board_width: [{
        //   required: true,
        //   message: '该项不能为空',
        //   trigger: 'change'
        // }],
        input_col: [{
          required: true,
          message: '输入的列不能为空',
          trigger: 'blur'
        }],
        output_col: [{
          required: true,
          message: '导出的列不能为空',
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
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  created() {
    this.getTableData()
  },
  mounted() {

  },
  methods: {
    // v-el-drag-dialog onDrag callback function
    handleDrag() {
      // this.$refs.select.blur()
    },
    modifyDataDialog() {
      this.isClick = false
      this.dialogVisible = true
    },
    getTableData() {
      GetTableData().then(res => {
        if (res.code === 20000) {
          const data = res.table_data[0]
          for (const key in data) {
            this.model[key] = data[key]
            this.modelOriginal[key] = data[key]
          }
          // 将包装放假的字符串改为数组（为了能够在时间选择器组件上正确显示）
          this.pack_holiday_interval = this.model.pack_holiday_interval_str.split(',')
          this.model.pack_holiday_interval_str = this.model.pack_holiday_interval_str.split(',')
        }
      })
    },
    // 刷新数据
    refreshTableData() {
      this.getTableData()
      this.$message({
        type: 'success',
        message: '刷新成功'
      })
    },
    // 表单dialog关闭前提示
    handleFormClose() {
      if (this.checkFormChange() && !this.isClick) {
        this.$confirm('数据未提交，确定要关闭窗口？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.dialogVisible = false
          // 如果不保存则将结果改回原来的样子
          const data = this.modelOriginal
          for (const key in data) {
            this.model[key] = data[key]
          }
        }).catch(() => {

        })
      } else {
        this.dialogVisible = false
      }
    },
    // 检测表单数据是否发生变化，用于提示
    checkFormChange() {
      let isChange = false
      for (const key in this.model) {
        if (key === 'pack') {
          continue
        }
        if (this.model[key] !== this.modelOriginal[key]) {
          isChange = true
          break
        }
      }
      return isChange
    },
    // 修改数据
    modifyData() {
      if (!this.checkFormChange()) {
        this.$message({
          type: 'info',
          message: '数据未修改，无需提交'
        })
        return
      }
      this.isClick = true
      const data = {
        'form': this.model, // 修改后的表单
        'form_original': this.modelOriginal, // 修改前的表单
        'user_name': this.name // 用户名
      }
      this.$refs['$form'].validate((valid) => {
        if (valid) {
          console.log('pack_holiday_interval_str:', this.model.pack_holiday_interval_str)
          ModifyData(data).then(res => {
            if (res.code === 20000) {
              this.$notify({
                title: res.message,
                message: '数据已修改',
                type: 'success'
              })
              this.getTableData() // 刷新数据
            }
          })
        } else {
          this.$message({
            type: 'error',
            message: '提交失败，请按照要求填写数据！'
          })
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
  @import '../../assets/css/Control/Config.scss';
</style>
<style>
.card-form .el-card__body{
    padding: 20px;
}
</style>
