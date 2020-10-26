import request from '@/utils/request'

// 向经理的组内增加员工
export function addEmployee(mid, params) {
    return request({
        url: '/manager/' + mid + '/add/',
        method: 'post',
        params: params
    })
}

// 从经理组内移除员工
export function removeEmployee(mid, params) {
    return request({
        url: '/manager/' + mid + '/remove/',
        method: 'post',
        params: params
    })
}

// 显示所有经理
export function listManager() {
    return request({
        url: '/manager/list',
        method: 'get',
    })
}


// 显示经理的员工
export function listEmployeeOfManager(mid) {
    return request({
        url: '/manager/' + mid + '/employee/list',
        method: 'get',
    })
}


// 更新经理信息
export function updateManager(mid, name) {
    return request({
        url: '/manager/' + mid + '/update',
        method: 'post',
        data: {
            'name': name
        }
    })
}


// 管理员增加经理
export function adminAddManager(userId) {
    return request({
        url: '/manager/add',
        method: 'post',
        data: {
            'userId': userId
        }
    })
}


// 获取经理信息
export function managerInfo() {
    return request({
        url: '/manager/info',
        method: 'get',
    })
}



