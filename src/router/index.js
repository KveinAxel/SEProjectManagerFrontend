import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router);

import Layout from '../views/layout/Layout'
import store from "../store";


export const constantRouterMap = [
    {path: '/login', component: () => import('@/views/login/index'), hidden: true},
    {path: '/register', component: () => import('@/views/login/register'), hidden: true},
    {path: '/404', component: () => import('@/views/404'), hidden: true},
    {path: '/user', component: () => import('@/views/user/index'), hidden: true},
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
        // redirect: '/project/project',
        name: 'project',
        meta: {title: '项目', icon: 'project'},
        children: [
            // {
            //     path: 'project',
            //     name: 'project',
            //     component: () => import('@/views/project/index'),
            //     meta: {title: '项目列表', icon: 'tree'}
            // },
            {
                path: 'managerProject',
                name: 'managerProject',
                component: () => import('@/views/project/managerListProject'),
                meta: {title: 'M项目列表', icon: 'tree'},
            },
            {
                path: 'employeeProject',
                name: 'employeeProject',
                component: () => import('@/views/project/employeeListProject'),
                meta: {title: 'E项目列表', icon: 'tree'},
            },

            {
                path: 'employeeDetail',
                name: 'employeeDetail',
                component: () => import('@/views/project/employeeProjectDetail'),
                meta: {title: '项目详情'},
                hidden: true
            },
            {
                path: 'managerDetail',
                name: 'managerDetail',
                component: () => import('@/views/project/managerProjectDetail'),
                meta: {title: '项目详情'},
                hidden: true
            }

        ]
    },
    {
        path: '/task',
        component: Layout,
        // redirect: '/task/listTask',
        name: 'task',
        meta: {title: '任务'},
        children: [
            // {
            //     path: 'listTask',
            //     name: 'listTask',
            //     component: () => import('@/views/task/index'),
            //     meta: {title: '任务列表', icon: 'marker'},
            // },
            {
                path: 'managerTask',
                name: 'managerTask',
                component: () => import('@/views/task/managerListTask'),
                meta: {title: 'M任务列表', icon: 'marker'},
            },
            {
                path: 'employeeTask',
                name: 'employeeTask',
                component: () => import('@/views/task/employeeListTask'),
                meta: {title: 'E任务列表', icon: 'marker'},
            },
        ]
    },
    {
        path: '/delegate',
        component: Layout,
        redirect: '/delegate/delegateTask',
        name: 'delegate',
        meta: {title: '任务'},
        children: [
            {
                path: 'task',
                name: 'delegateTask',
                component: () => import('@/views/task/delegateTask'),
                meta: {title: '委派任务', icon: 'table'},
            },
        ]
    },
    {
        path: '/user',
        component: Layout,
        // redirect: '/user/user',
        name: 'delegate',
        meta: {title: '用户'},
        children: [
            // {
            //     path: 'user',
            //     name: 'user',
            //     component: () => import('@/views/user/index'),
            //     meta: {title: '个人中心', icon: 'user'},
            // },
            {
                path: 'managerUser',
                name: 'managerUser',
                component: () => import('@/views/user/managerUser'),
                meta: {title: '经理中心', icon: 'user'},
            },
            {
                path: 'employeeUser',
                name: 'employeeUser',
                component: () => import('@/views/user/employeeUser'),
                meta: {title: '员工中心', icon: 'user'},
            },
        ]
    },
    {
        path: '/manage',
        component: Layout,
        name: 'delegate',
        meta: {title: '管理', icon: 'user'},
        children: [
            {
                path: 'manageUser',
                name: 'manageUser',
                component: () => import('@/views/manage/userManage'),
                meta: {title: '用户管理', icon: 'user'},
            },
            {
                path: 'manageEmployee',
                name: 'manageEmployee',
                component: () => import('@/views/manage/employeeManage'),
                meta: {title: '员工管理', icon: 'user'},
            },
            {
                path: 'manageManager',
                name: 'manageManager',
                component: () => import('@/views/manage/managerManage'),
                meta: {title: '经理管理', icon: 'user'},
            },


        ]
    },

    {path: '*', redirect: '/404', hidden: true}
];

export default new Router({
    scrollBehavior: () => ({y: 0}),
    routes: constantRouterMap
})

