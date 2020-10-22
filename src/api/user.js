import request from '@/utils/request'

// 更新用户
export function updateUser(id, data) {
    return request({
        url: '/user/' + id + '/update',
        method: 'post',
        data: data
    })
}

// 显示用户列表
export function listUser() {
    return request({
        url: '/user/list',
        method: 'get',
    })
}
