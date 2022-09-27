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
    url: '//preprocess/excel/analysis/',
    method: 'get'
  })
}
// 清空分析排程进度条
export function ClearAnaProgress() {
  return request({
    url: '//preprocess/excel/analysis/',
    method: 'get'
  })
}
// 分析排程
export function AnalysisExcel(data) {
  return request({
    url: '/preprocess/excel/analysis/',
    method: 'post',
    data
  })
}
// 生成表格
export function GenerateAnaExcel() {
  return request({
    url: '//preprocess/excel/analysis/',
    method: 'get'
  })
}
// 下载表格
export function DownloadAnaExcel(data) {
  return request({
    method: 'post',
    url: '/preprocess/control/download_history_log/',
    responseType: 'blob',
    data
  })
}
// 获取量化
export function StatisticsSchedule() {
  return request({
    url: '//preprocess/excel/analysis/',
    method: 'get'
  })
}
// 获取历史分析选项
export function GetAnaSelectItem() {
  return request({
    url: '//preprocess/excel/analysis/',
    method: 'get'
  })
}
// 获取历史分析结果
export function GetAnaSelectData(data) {
  return request({
    url: '/preprocess/excel/analysis/',
    method: 'post',
    data
  })
}
