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
export function refreshLogin() {
    return request({
        url: '/auth/refresh',
        method: 'get',
    })
}

// 注册
export function register(data) {
    return request({
        url: '/auth/register',
        method: 'post',
        data: data
    })
}
