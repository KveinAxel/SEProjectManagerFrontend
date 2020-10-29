import axios from 'axios'
import {Message, MessageBox} from 'element-ui'
import store from '../store'
import {getToken} from '@/utils/auth'

const service = axios.create({
    baseURL: '/api', // api的base_url
    timeout: 5000, // 请求超时时间
});


// request拦截器
service.interceptors.request.use(config => {
    if (store.getters.token) {
        config.headers['Authorization'] = getToken() // 让每个请求携带自定义token
    }
    return config
}, error => {
    console.log(error);
    Promise.reject(error);
});

// respone拦截器
service.interceptors.response.use(
    response => {
        /**
         * code为非200是抛错
         */
        const res = response.data;
        if (res.status !== 200) {
            Message({
                message: res.message,
                type: 'error',
                duration: 3 * 1000
            });

            return Promise.reject('error')
        } else {
            return response.data
        }
    },
    error => {
        console.log('err' + error);
        Message({
            message: error.message,
            type: 'error',
            duration: 3 * 1000
        });
        return Promise.reject(error)
    }
);


export default service
