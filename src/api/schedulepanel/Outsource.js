import request from '../../utils/request'

// 导入文件
export function ImportFiles(data) {
  return request({
    url: '/OutsourcingPriority/importallfiles/',
    method: 'post',
    timeout: 10 * 60 * 1000,
    data
  })
}
// 组件筛选
export function DoFilterRules(data) {
  return request({
    url: '/OutsourcingPriority/filterrules/',
    method: 'post',
    timeout: 100 * 60 * 1000,
    data
  })
}
// 更新新机种
export function UpdateNewModels(data) {
  return request({
    url: '/OutsourcingPriority/updatenewmodels/',
    method: 'post',
    timeout: 100 * 60 * 1000,
    data
  })
}
// 显示筛选规则
export function ShowFilterRules(data) {
  return request({
    url: '/OutsourcingPriority/showfilterrules/',
    method: 'post',
    timeout: 100 * 60 * 1000,
    data
  })
}
// 生成分工单
export function GnerateDivisions(data) {
  return request({
    url: '/OutsourcingPriority/generatedivisions/',
    method: 'post',
    timeout: 100 * 60 * 1000,
    data
  })
}
// 计算排程
export function DoOutsourceDistribute(data) {
  return request({
    url: '/OutsourcingPriority/outsourcedistribute/',
    method: 'post',
    timeout: 100 * 60 * 1000,
    data
  })
}
// 输出文件
export function GenerateOutput(data) {
  return request({
    url: '/OutsourcingPriority/generateoutput/',
    method: 'post',
    timeout: 100 * 60 * 1000,
    data
  })
}
// 获取进度条
export function GetProgress() {
  return request({
    url: '/preprocess/control/get_progress/',
    method: 'get'
  })
}
// 获取排程结果
export function GeScheduleRes() {
  return request({
    method: 'get',
    url: '/preprocess/control/get_schedule_res/'
  })
}
