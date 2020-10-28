import request from '@/utils/request'
import user from "../store/modules/user";

// 登陆
export function login(username, password) {
    let param = new URLSearchParams();
    param.append('username', username);
    param.append('password', password);
    return request({
        url: '/auth/login?' + param.toString(),
        method: 'post',
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
