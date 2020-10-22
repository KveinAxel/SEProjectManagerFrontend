import request from '@/utils/request'

// 列出符合当前权限的项目
export function listProject() {
    return request({
        url: '/project/list',
        method: 'get',
    })
}

// 启动项目
export function startProject(id) {
    return request({
        url: '/project/' + id + '/start',
        method: 'get',
    })
}

// 终止项目
export function stopProject(id) {
    return request({
        url: '/project/' + id + '/stop',
        method: 'get',
    })
}

// 生成项目
export function generateProject() {
    return request({
        url: '/project/gen',
        method: 'get',
    })
}

// 查询项目信息
export function dispatchProject(id) {
    return request({
        url: '/project/' + id + '/info',
        method: 'get',
    })
}
