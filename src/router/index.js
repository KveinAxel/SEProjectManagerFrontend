import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router);

import Layout from '../views/layout/Layout'

export const constantRouterMap = [
    { path: '/login',    component: () => import('@/views/login/index'),     hidden: true},
    { path: '/register', component: () => import('@/views/login/register'),  hidden: true},
    { path: '/404',      component: () => import('@/views/404'),             hidden: true},
    { path: '/user',     component: () => import('@/views/user/index'),      hidden: true},
    {
        path: '',
        component: Layout,
        redirect: '/home',
        children: [{
            path: 'home',
            name: 'home',
            component: () => import('@/views/home/index'),
            meta: {title: '首页', icon: 'home'}
        }]
    },
    {
        path: '/project',
        component: Layout,
        redirect: '/project/project',
        name: 'project',
        meta: {title: '项目', icon: 'project'},
        children: [
            {
                path: 'project',
                name: 'project',
                component: () => import('@/views/project/index'),
                meta: {title: '项目列表', icon: 'project-list'} // todo icon
            },
            {
                path: 'projectDetail',
                name: 'projectDetail',
                component: () => import('@/views/project/projectDetail'),
                meta: {title: '项目详情'},
                hidden: true
            }
        ]
    },
    {
        path: '/task',
        component: Layout,
        redirect: '/task/task',
        name: 'task',
        meta: {title: '任务', icon: 'task'},
        children: [
            {
                path: 'task',
                name: 'task',
                component: () => import('@/views/task/index'),
                meta: {title: '任务列表', icon: 'task-list'} // todo icon
            },
            {
                path: 'delegateTask',
                name: 'delegateTask',
                component: () => import('@/views/task/delegateTask'),
                meta: {title: '委派任务'},
            },
            {
                path: 'taskDetail',
                name: 'taskDetail',
                component: () => import('@/views/task/taskDetail'),
                meta: {title: '任务详情'},
                hidden: true
            },
        ]
    },
    {path: '*', redirect: '/404', hidden: true}
];

export default new Router({
    scrollBehavior: () => ({y: 0}),
    routes: constantRouterMap
})

