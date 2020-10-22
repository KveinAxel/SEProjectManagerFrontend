import request from '@/utils/request'

// 登陆
export function login(params) {
    return request({
        url: '/auth/login',
        method: 'get',
        params: params
    })
}

// 刷新凭证
export function refreshLogin(params) {
    return request({
        url: '/auth/refresh',
        method: 'get',
        params: params
    })
}

// 注册
export function register(params) {
    return request({
        url: '/auth/register',
        method: 'get',
        params: params
    })
}
