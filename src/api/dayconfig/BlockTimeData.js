import request from '../../utils/request'
// 获取表格数据 分页获取
export function GetTableData(data) {
  return request({
    url: '/DayConfig/BlockTimeData/get_table_data/',
    method: 'post',
    data
  })
}
// 获取初始化数据
export function GetDefaultData() {
  return request({
    url: '/DayConfig/BlockTimeData/get_default_data/',
    method: 'get'
  })
}
// 添加数据
export function AddData(data) {
  return request({
    url: '/DayConfig/BlockTimeData/add_data/',
    method: 'post',
    data
  })
}
// 修改数据
export function ModifyData(data) {
  return request({
    url: '/DayConfig/BlockTimeData/modify_data/',
    method: 'post',
    data
  })
}
// 删除勾选的数据
export function DeleteData(data) {
  return request({
    url: '/DayConfig/BlockTimeData/delete_data/',
    method: 'post',
    data
  })
}
// 删除一条数据
export function HandleDelete(data) {
  return request({
    url: '/DayConfig/BlockTimeData/handle_delete/',
    method: 'post',
    data
  })
}
// 确认导入数据
export function ImportData(data) {
  return request({
    url: '/DayConfig/BlockTimeData/import_data/',
    method: 'post',
    data
  })
}
// 确认导出数据
export function ExportData() {
  return request({
    url: '/DayConfig/BlockTimeData/export_data/',
    method: 'get'
  })
}
// 获取备份名
export function GetBackupName() {
  return request({
    method: 'get',
    url: '/DayConfig/BlockTimeData/get_backup_name/'
  })
}
// 备份数据
export function BackupData(data) {
  return request({
    method: 'post',
    url: '/DayConfig/BlockTimeData/backup_data/',
    data
  })
}
// 恢复备份
export function RecoverBackupData(data) {
  return request({
    method: 'post',
    url: '/DayConfig/BlockTimeData/recover_backup_data/',
    data
  })
}
// 删除备份数据
export function DeleteBackupData(data) {
  return request({
    method: 'post',
    url: '/DayConfig/BlockTimeData/delete_backup_data/',
    data
  })
}
// 添加多个放假
export function AddMultiData(data) {
  return request({
    method: 'post',
    url: '/DayConfig/BlockTimeData/add_multi_data/',
    data
  })
}
// 测试库同步正式库的维护时间表
export function SyncFormalData() {
  return request({
    method: 'get',
    url: '/DayConfig/BlockTimeData/sync_data/'
  })
}
