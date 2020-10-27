import request from '@/utils/request'

// 上传文档文件。
export function uploadDocument(file) {
    return request({
        url: '/auth/document',
        method: 'put',
        data: file
    })
}

// 上传图片文件。
export function uploadPicture(file) {
    return request({
        url: '/resource/image',
        method: 'put',
        data: file
    })
}
