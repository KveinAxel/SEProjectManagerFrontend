import request from '@/utils/request'

// 显示员工列表
export function listEmployee() {
    return request({
        url: '/employee/list',
        method: 'get',
    })
}

// 更新员工信息
export function updateEmployee(id, name, type) {
    return request({
        url: '/employee/' + id + '/update',
        method: 'post',
        data: {
            'name': name,
            'type': type,
        }
    })
}

// 查看已委托别人的项目
export function listDelegate(id) {
    return request({
        url: '/employee/' + id + '/delegate',
        method: 'get',
    })
}

// 查看自己的任务
export function listTask(id) {
    return request({
        url: '/employee/' + id + '/task',
        method: 'get',
    })
}

// 查看自己的任务
export function addEmployee(userId) {
    return request({
        url: '/employee/add',
        method: 'post',
        data: {
            'userId': userId,
        }
    })
}

// 员工信息
export function employeeInfo(eid) {
    return request({
        url: '/employee/' + eid + '/info',
        method: 'get',
    })
}
