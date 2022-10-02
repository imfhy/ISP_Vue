import request from '../../utils/request'
// 获取表格数据 分页获取
export function GetTableData(data) {
  return request({
    url: '/config/blocktimedata/get_table_data/',
    method: 'post',
    data
  })
}
// 添加数据
export function AddData(data) {
  return request({
    url: '/config/blocktimedata/add_data/',
    method: 'post',
    data
  })
}
// 修改数据
export function SaveData(data) {
  return request({
    url: '/config/blocktimedata/save_data/',
    method: 'post',
    data
  })
}
// 删除勾选的数据
export function DeleteData(data) {
  return request({
    url: '/config/blocktimedata/delete_data/',
    method: 'post',
    data
  })
}
// 删除一条数据
export function HandleDelete(id) {
  return request({
    url: '/config/blocktimedata/handle_delete/',
    method: 'get',
    params: { id }
  })
}
// 确认导入数据
export function ConfirmImport(data) {
  return request({
    url: '/config/blocktimedata/import_data/',
    method: 'post',
    data
  })
}
// 确认导出数据
export function ConfirmExport() {
  return request({
    url: '/config/blocktimedata/export_data/',
    method: 'get'
  })
}
