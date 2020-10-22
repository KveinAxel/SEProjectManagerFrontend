import request from '@/utils/request'

// 显示员工列表
export function listEmployee() {
    return request({
        url: '/employee/list',
        method: 'get',
    })
}

// 更新员工信息
export function updateEmployee(id, data) {
    return request({
        url: '/employee/' + id + '/update',
        method: 'post',
        data: data
    })
}

// 查看已委托别人的项目
export function listDelegate(id) {
    return request({
        url: '/employee/' + id + '/listDelegate',
        method: 'get',
    })
}

// 查看自己的任务
export function listTask(id) {
    return request({
        url: '/employee/' + id + '/listTask',
        method: 'get',
    })
}
