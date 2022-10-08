import request from '../../utils/request'
// 获取表格数据分页获取
export function GetTableData(data) {
  return request({
    url: '/config/logging/loggingdb/get_table_data/',
    method: 'post',
    data
  })
}
// 获取表格数据 分页获取
export function SearchData(data) {
  return request({
    url: '/config/logging/loggingdb/search_data/',
    method: 'post',
    data
  })
}