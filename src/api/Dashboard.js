import request from '../utils/request'

// 获取排程结果数据
export function GetChartsData(days) {
  return request({
    url: '/Dashboard/get_charts_data/',
    method: 'get',
    params: { days }
  })
}
export function GetCalendarData() {
  return request({
    url: '/Dashboard/get_calendar_data/',
    method: 'get'
  })
}
