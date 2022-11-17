import request from '../../utils/request'

// 训练预测模型接口
export function TrainModel(data) {
  return request({
    url: '/preprocess/control/train_model/',
    method: 'post',
    data
  })
}
// 训练预测模型接口
export function CheckData(data) {
  return request({
    url: '/preprocess/control/check_input_excel/',
    method: 'post',
    data
  })
}
// 导入排程表格接口
export function ImportSchedule(data) {
  return request({
    url: '/preprocess/control/import_schedule/',
    method: 'post',
    data
  })
}
// 导入小板排程表格接口
export function ImportScheduleSmall(data) {
  return request({
    url: '/preprocess/control/import_schedule_small/',
    method: 'post',
    data
  })
}
// 计算排程表格接口
export function ComputeSchedule(data) {
  return request({
    url: '/preprocess/control/compute_schedule/',
    method: 'post',
    timeout: 60 * 60 * 1000,
    data
  })
}
export function ComputeScheduleSmall(data) {
  return request({
    url: '/preprocess/control/compute_schedule_small/',
    method: 'post',
    timeout: 60 * 60 * 1000,
    data
  })
}
// 终止深度搜素
export function StopTabu(user_name) {
  return request({
    url: '/preprocess/control/stop_tabu/',
    method: 'get',
    params: { user_name }
  })
}
// 获取进度条
export function GetProgress() {
  return request({
    url: '/preprocess/control/get_progress/',
    method: 'get'
  })
}
// 获取历史日志选择器选项
export function GetLogSelectItem() {
  return request({
    url: '/preprocess/control/get_history_log_item/',
    method: 'get'
  })
}
// 获取历史排程选择器选项
export function GetExcelSelectItem() {
  return request({
    url: '/preprocess/control/get_history_excel_item/',
    method: 'get'
  })
}
// 下载历史日志
export function DownloadHistoryLog(data) {
  return request({
    method: 'post',
    url: '/preprocess/control/download_history_log/',
    responseType: 'blob',
    data
  })
}
// 下载历史日志
export function DownloadHistoryExcel(data) {
  return request({
    method: 'post',
    url: '/preprocess/control/download_history_excel/',
    responseType: 'blob',
    data
  })
}
// 下载最新排程
export function DownloadSchedule() {
  return request({
    method: 'get',
    url: '/preprocess/control/download_schedule/',
    responseType: 'blob'
  })
}
// 下载最新日志
export function DownloadLatestLog() {
  return request({
    method: 'get',
    url: '/preprocess/control/download_latest_log/',
    responseType: 'blob'
  })
}
// 下载无程序表
export function DownloadNoProgram() {
  return request({
    method: 'get',
    url: '/preprocess/control/download_program/',
    responseType: 'blob'
  })
}
// 下载idle明细
export function DownloadIdleInfo() {
  return request({
    method: 'get',
    url: '/preprocess/control/download_idle_info/',
    responseType: 'blob'
  })
}
// 下载量化结果
export function DownloadStatistics() {
  return request({
    method: 'get',
    url: '/preprocess/control/download_statistics/',
    responseType: 'blob'
  })
}
// 获取运行状态
export function GetRunFlag() {
  return request({
    method: 'get',
    url: '/preprocess/control/get_run_flag/'
  })
}
// 获取排程结果
export function GeScheduleRes() {
  return request({
    method: 'get',
    url: '/preprocess/control/get_schedule_res/'
  })
}
// 终止计算排程
export function StopSchedule(user_name) {
  return request({
    method: 'get',
    url: '/preprocess/control/stop_schedule/',
    params: { user_name }
  })
}
// 更新钢网信息接口
export function GetApsMtool(data) {
  return request({
    url: '/schedule/api/getApsMtool',
    method: 'post',
    timeout: 10 * 60 * 1000,
    data
  })
}
// 更新程序信息接口
export function GetApsProgram(data) {
  return request({
    url: '/schedule/api/getApsProgram',
    method: 'post',
    timeout: 10 * 60 * 1000,
    data
  })
}
// 导出检查接口
export function ExportScheduleData(data) {
  return request({
    method: 'get',
    url: '/schedule/api/exportScheduleData',
    responseType: 'blob'
  })
}
// 下载最新排程
export function DownloadScheduleSmall() {
  return request({
    method: 'get',
    url: '/preprocess/control/download_schedule_small/',
    responseType: 'blob'
  })
}
