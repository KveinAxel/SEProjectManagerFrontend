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

// 更新密码
export function updatePassword(id, username, password) {
    return request({
        url: '/user/' + id + '/update',
        method: 'post',
        data: {
            'username': username,
            'password': password
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

// 显示用户列表
export function deleteUser(id) {
    return request({
        url: '/user/' + id,
        method: 'delete',
    })
}


