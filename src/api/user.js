import request from '@/utils/request'

// 更新用户
export function updateUser(id, username) {
    return request({
        url: '/user/' + id + '/update',
        method: 'post',
        data: {
            'username': username
        }
    })
}

// 显示用户列表
export function listUser() {
    return request({
        url: '/user/list',
        method: 'get',
    })
}

// 显示用户列表
export function userInfo() {
    return request({
        url: '/user/info',
        method: 'get',
    })
}
