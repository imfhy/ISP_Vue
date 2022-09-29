import request from '../utils/request'

// 检查表格
export function CheckData(data) {
  return request({
    url: '/preprocess/excel/analysis/',
    method: 'post',
    data
  })
}
// 获取分析排程进度条
export function GetAnaProgress() {
  return request({
    url: '/preprocess/onlinetable/get_analysis_progress/',
    method: 'get'
  })
}
// 清空分析排程进度条
export function ClearAnaProgress() {
  return request({
    url: '/preprocess/onlinetable/clear_analysis_progress/',
    method: 'get'
  })
}
// 分析排程
export function AnalysisExcel(data) {
  return request({
    url: '/preprocess/onlinetable/begin_analysis/',
    method: 'post',
    data
  })
}
// 生成表格
export function GenerateAnaExcel() {
  return request({
    url: '/preprocess/onlinetable/analysis_confirm_output/',
    method: 'get'
  })
}
// 下载表格
export function DownloadAnaExcel(data) {
  return request({
    method: 'post',
    url: '/preprocess/onlinetable/download_analysis_excel/',
    responseType: 'blob',
    data
  })
}
// 获取量化
export function StatisticsSchedule() {
  return request({
    url: '/preprocess/onlinetable/get_quantify_data/',
    method: 'get'
  })
}
// 获取历史分析选项
export function GetHistoryAnaItem() {
  return request({
    url: '/preprocess/onlinetable/get_analysis_select_item/',
    method: 'get'
  })
}
// 获取历史分析结果
export function GetHistoryAnaData(data) {
  return request({
    url: '/preprocess/onlinetable/get_analysis_history_data/',
    method: 'post',
    data
  })
}
// 获取历史Excel选项
export function GetHistoryExcelItem() {
  return request({
    url: '/preprocess/onlinetable/get_history_excel_item/',
    method: 'get'
  })
}
// 获取历史Excel
export function GetHistoryExcelData(data) {
  return request({
    url: '/preprocess/onlinetable/get_history_excel_data/',
    method: 'post',
    responseType: 'blob',
    data
  })
}
// 获取运行状态
export function GetRunFlag() {
  return request({
    method: 'get',
    url: '/preprocess/onlinetable/get_run_flag_ana/'
  })
}

