import request from '../utils/request'

// 获取排程结果数据
export function GetChartsData() {
  return request({
    url: '/config/home/get_charts_data/',
    method: 'get'
  })
}
