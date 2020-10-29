import request from '@/utils/request'

// 向经理的组内增加员工
export function managerAddEmployee(mid, eid) {
    return request({
        url: '/manager/' + mid + '/employee/add/?eid='+eid,
        method: 'post',
    })
}

// 从经理组内移除员工
export function managerRemoveEmployee(mid, eid) {
    return request({
        url: '/manager/' + mid + '/employee/remove/?eid='+eid,
        method: 'post',
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
export function addManager(name, uid) {
    return request({
        url: '/manager/add',
        method: 'post',
        data: {
            'name': name,
            'uid': uid
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

// 查看自己的任务
export function listTask(id) {
    return request({
        url: '/manager/' + id + '/task',
        method: 'get',
    })
}

// 删除经理
export function deleteManager(id) {
    return request({
        url: '/manager/' + id,
        method: 'delete',
    })
}





