import request from '@/utils/request'

// 更新用户
export function updateUser(id, username, resourceId) {
    return request({
        url: '/user/' + id + '/update',
        method: 'post',
        data: {
            'username': username,
            'avatarId': resourceId
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

// 增加用户
export function addUser(username, password) {
    return request({
        url: '/user/',
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


