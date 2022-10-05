import request from '../../utils/request'
// 获取数据
export function GetTableData() {
  return request({
    url: '/config/configdata/get_table_data/',
    method: 'get'
  })
}
// 修改数据
export function ModifyData(data) {
  return request({
    url: '/config/configdata/modify_data/',
    method: 'post',
    data
  })
}
