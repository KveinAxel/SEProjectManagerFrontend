import request from '@/utils/request'

// 委派任务
export function delegateTask(id, data) {
    return request({
        url: '/task/' + id + '/delegate',
        method: 'post',
        data: data
    })
}

// 更新任务信息
export function updateTask(id, data) {
    return request({
        url: '/task/' + id + '/update',
        method: 'post',
        data: data
    })
}

// 批量更新任务信息
export function updateTaskBatch(data) {
    return request({
        url: '/task/update',
        method: 'post',
        data: data
    })
}

// 增加任务
export function addTask(data) {
    return request({
        url: '/task/add',
        method: 'post',
        data: data
    })
}

// 获取任务信息
export function taskInfo(id) {
    return request({
        url: '/task/' + id + '/info',
        method: 'get',
    })
}

// 任务送审
export function commitTask(id, data) {
    return request({
        url: '/task/' + id + '/commit',
        method: 'post',
        data: data
    })
}

// 任务进入提交阶段
export function finishTask(id, data) {
    return request({
        url: '/task/' + id + '/finish',
        method: 'post',
        data: data
    })
}

// 任务确认完成
export function confirmTask(id) {
    return request({
        url: '/task/' + id + '/confirm',
        method: 'get',
    })
}
