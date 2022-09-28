import request from '../utils/request'

// 训练预测模型接口
export function TrainModel(data) {
  return request({
    url: '/preprocess/control/train_model/',
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
// 计算排程表格接口
export function ComputeSchedule() {
  return request({
    url: '/preprocess/control/compute_schedule/',
    method: 'get'
  })
}
// 终止深度搜素
export function StopTabu() {
  return request({
    url: '/preprocess/control/stop_tabu/',
    method: 'get'
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
// 下载历史日志
export function DownloadHistoryLog(data) {
  return request({
    method: 'post',
    url: '/preprocess/control/download_history_log/',
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
// 获取运行状态
export function GetRunFlag() {
  return request({
    method: 'get',
    url: '/preprocess/control/get_run_flag/'
  })
}
