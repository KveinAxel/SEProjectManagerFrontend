import request from '@/utils/request'

// 列出符合当前权限的项目
export function listProject(params) {
    return request({
        url: '/project/list',
        method: 'get',
        params: params
    })
}

// 重启项目
export function rebootProject(params) {
    return request({
        url: '/project/reboot',
        method: 'get',
        params: params
    })
}

// 终止项目
export function stopProject(params) {
    return request({
        url: '/project/stop',
        method: 'get',
        params: params
    })
}

// 调整项目顺序
export function reorderProject(params) {
    return request({
        url: '/project/reorder',
        method: 'get',
        params: params
    })
}

// 指派项目人员
export function dispatchProject(params) {
    return request({
        url: '/project/dispatch',
        method: 'get',
        params: params
    })
}

// 查看项目指派
export function listProjectDispatch(params) {
    return request({
        url: '/project/listDispatch',
        method: 'get',
        params: params
    })
}
