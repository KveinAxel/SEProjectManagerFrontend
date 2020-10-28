import request from '@/utils/request'

// 委派任务
export function delegateTask(id, delegateTo, expire) {
    return request({
        url: '/task/' + id + '/delegate',
        method: 'post',
        data: {
            'delegateTo': delegateTo,
            'expire': expire,
        }
    })
}

// 更新任务信息
export function updateTask(id, previousIds, name, type, undertakerEid, status, projectId) {
    return request({
        url: '/task/' + id + '/update',
        method: 'post',
        data: {
            'previousId': previousIds,
            'name': name,
            'type': type,
            'undertakerEid': undertakerEid,
            'status': status,
            'projectId': projectId,
        }
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
export function addTask(previousId, name, type, undertakerEid, projectId) {
    return request({
        url: '/task/add',
        method: 'post',
        data: {
            'previousId': previousId,
            'name': name,
            'type': type,
            'undertakerEid': undertakerEid,
            'projectId': projectId,
        }
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
export function commitTask(id, params) {
    return request({
        url: '/task/' + id + '/commit',
        method: 'post',
        params: params
    })
}

// 任务进入提交阶段
export function finishTask(id) {
    return request({
        url: '/task/' + id + '/finish',
        method: 'post',
    })
}

// 任务确认完成
export function confirmTask(id) {
    return request({
        url: '/task/' + id + '/confirm',
        method: 'post',
    })
}

// 任务打回重做
export function rejectTask(id) {
    return request({
        url: '/task/' + id + '/reject',
        method: 'post',
    })
}

// 任务打回重做
export function withdrawTask(id) {
    return request({
        url: '/task/' + id + '/withdraw',
        method: 'post',
    })
}
