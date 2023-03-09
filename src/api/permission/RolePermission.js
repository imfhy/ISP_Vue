import request from '../../utils/request'
// 获取所有用户信息
export function GetAllUserInfo() {
  return request({
    url: '/User/get_all_user/',
    method: 'get'
  })
}
// 创建用户
export function CreateUser(data) {
  return request({
    url: '/User/create_user/',
    method: 'post',
    data
  })
}
// 修改用户基本信息
export function ModifyUserInfo(data) {
  return request({
    url: '/User/modify_userinfo/',
    method: 'post',
    data
  })
}
// 修改用户密码
export function ModifyUserPassword(data) {
  return request({
    url: '/User/modify_password/',
    method: 'post',
    data
  })
}
// 删除用户
export function DeleteUser(data) {
  return request({
    url: '/User/delete_user/',
    method: 'post',
    data
  })
}
