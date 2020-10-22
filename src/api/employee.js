import request from '@/utils/request'

// 显示员工列表
export function listEmployee(params) {
    return request({
        url: '/employee/list',
        method: 'get',
        params: params
    })
}
