import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/config/user/login/',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/config/user/info/',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/config/user/logout/',
    method: 'post'
  })
}
