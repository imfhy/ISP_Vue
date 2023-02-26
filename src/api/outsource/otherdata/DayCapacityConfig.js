import request from '../../../utils/request'
// 获取表格数据 分页获取
export function GetTableData(data) {
  return request({
    url: '/config/packholiday/get_table_data/',
    method: 'post',
    data
  })
}
// 添加数据
export function AddData(data) {
  return request({
    url: '/config/packholiday/add_data/',
    method: 'post',
    data
  })
}
// 修改数据
export function ModifyData(data) {
  return request({
    url: '/config/packholiday/modify_data/',
    method: 'post',
    data
  })
}
// 删除勾选的数据
export function DeleteData(data) {
  return request({
    url: '/config/packholiday/delete_data/',
    method: 'post',
    data
  })
}
// 删除一条数据
export function HandleDelete(data) {
  return request({
    url: '/config/packholiday/handle_delete/',
    method: 'post',
    data
  })
}
// 确认导入数据
export function ImportData(data) {
  return request({
    url: '/config/packholiday/import_data/',
    method: 'post',
    data
  })
}
// 确认导出数据
export function ExportData() {
  return request({
    url: '/config/packholiday/export_data/',
    method: 'get'
  })
}
