import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/User/login/',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/User/info/',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/User/logout/',
    method: 'post'
  })
}
