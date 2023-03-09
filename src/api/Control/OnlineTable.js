import request from '../../utils/request'

// 检查表格
export function CheckData(data) {
  return request({
    url: '/Control/OnlineTable/check_excel_data/',
    method: 'post',
    timeout: 10 * 60 * 1000,
    data
  })
}
// 获取分析排程进度条
export function GetAnaProgress() {
  return request({
    url: '/Control/OnlineTable/get_analysis_progress/',
    method: 'get'
  })
}
// 清空分析排程进度条
export function ClearAnaProgress() {
  return request({
    url: '/Control/OnlineTable/clear_analysis_progress/',
    method: 'get'
  })
}
// 获取分析排程中的错误信息
export function GetAnaError() {
  return request({
    url: '/Control/OnlineTable/get_analysis_error/',
    method: 'get'
  })
}
// 分析排程
export function AnalysisExcel(data) {
  return request({
    url: '/Control/OnlineTable/begin_analysis/',
    method: 'post',
    timeout: 10 * 60 * 1000,
    data
  })
}
// 生成表格
export function GenerateAnaExcel() {
  return request({
    url: '/Control/OnlineTable/analysis_confirm_output/',
    method: 'get'
  })
}
// 下载表格
export function DownloadAnaExcel(data) {
  return request({
    method: 'post',
    url: '/Control/OnlineTable/download_analysis_excel/',
    responseType: 'blob',
    data
  })
}
// 获取量化
export function StatisticsSchedule() {
  return request({
    url: '/Control/OnlineTable/get_quantify_data/',
    method: 'get'
  })
}
// 获取历史分析选项
export function GetHistoryAnaItem() {
  return request({
    url: '/Control/OnlineTable/get_analysis_select_item/',
    method: 'get'
  })
}
// 获取历史分析结果
export function GetHistoryAnaData(data) {
  return request({
    url: '/Control/OnlineTable/get_analysis_history_data/',
    method: 'post',
    data
  })
}
// 获取历史Excel选项
export function GetHistoryExcelItem() {
  return request({
    url: '/Control/OnlineTable/get_history_excel_item/',
    method: 'get'
  })
}
// 获取历史Excel
export function GetHistoryExcelData(data) {
  return request({
    url: '/Control/OnlineTable/get_history_excel_data/',
    method: 'post',
    responseType: 'blob',
    data
  })
}
// 获取运行状态
export function GetRunFlag() {
  return request({
    method: 'get',
    url: '/Control/OnlineTable/get_run_flag_ana/'
  })
}
// 推送SMT未排接口
export function SmtUnscheduled(data) {
  return request({
    url: '/schedule/api/saveApsScheduleSmtWplan',
    method: 'post',
    timeout: 10 * 60 * 1000,
    data
  })
}
// 推送SMT预排接口
export function SmtPrescheduled(data) {
  return request({
    url: '/schedule/api/saveApsSmtScheduleResultFirst',
    method: 'post',
    timeout: 10 * 60 * 1000,
    data
  })
}
// 推送SMT正排接口
export function SmtScheduled(data) {
  return request({
    url: '/schedule/api/saveApsSmtScheduleResultSecond',
    method: 'post',
    timeout: 10 * 60 * 1000,
    data
  })
}
// 推送AI未排接口
export function AiUnscheduled(data) {
  return request({
    url: '/schedule/api/saveApsScheduleAiWplan',
    method: 'post',
    timeout: 10 * 60 * 1000,
    data
  })
}
// 推送AI预排接口
export function AiPrescheduled(data) {
  return request({
    url: '/schedule/api/saveApsAiScheduleResultFirst',
    method: 'post',
    timeout: 10 * 60 * 1000,
    data
  })
}
// 推送AI正排接口
export function AiScheduled(data) {
  return request({
    url: '/schedule/api/saveApsAiScheduleResultSecond',
    method: 'post',
    timeout: 10 * 60 * 1000,
    data
  })
}
// 导入排程表格接口
export function ImportPushSchedule(data) {
  return request({
    url: '/Control/OnlineTable/import_push_schedule/',
    method: 'post',
    timeout: 10 * 60 * 1000,
    data
  })
}
// 推送量化结果
export function SaveApiCustweekSelfcreate(data) {
  return request({
    url: '/schedule/api/saveApiCustweekSelfcreate',
    method: 'post',
    timeout: 10 * 60 * 1000,
    data
  })
}
