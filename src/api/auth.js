import request from '@/utils/request'

// 登陆
export function login(username, password) {
    return request({
        url: '/auth/login',
        method: 'post',
        data: {
            'username': username,
            'password': password,
        }
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
export function register(username, password, name, type) {
    return request({
        url: '/auth/register',
        method: 'post',
        data: {
            'username': username,
            'password': password,
            'name': name,
            'type': type,
        }
    })
}
