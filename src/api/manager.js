import request from '@/utils/request'

// 向经理的组内增加员工
export function addEmployee(mid, uid) {
    return request({
        url: '/manager/' + mid + '/addEmployee/' + uid,
        method: 'get',
    })
}

// 从经理组内移除员工
export function removeEmployee(mid, uid) {
    return request({
        url: '/manager/' + mid + '/removeEmployee/' + uid,
        method: 'get',
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
        url: '/manager/' + mid + '/list',
        method: 'get',
    })
}


// 更新经理信息
export function updateManager(mid, data) {
    return request({
        url: '/manager/' + mid + '/update',
        method: 'post',
        data: data
    })
}


