import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router);

import Layout from '../views/layout/Layout'
import store from "../store";


export let constantRouterMap = [
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
        name: 'project',
        meta: {title: '项目', icon: 'tree'},
        children: [
            {
                path: 'managerProject',
                name: 'managerProject',
                component: () => import('@/views/project/managerListProject'),
                meta: {title: '项目列表', icon: 'tree', roles: 'ROLE_MANAGER'},
            },
            {
                path: 'employeeProject',
                name: 'employeeProject',
                component: () => import('@/views/project/employeeListProject'),
                meta: {title: '项目列表', icon: 'tree'},
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
        name: 'task',
        meta: {title: '任务', icon: "form", roles: "!ROLE_ADMIN"},
        children: [
            {
                path: 'managerTask',
                name: 'managerTask',
                component: () => import('@/views/task/managerListTask'),
                meta: {title: '任务列表', icon: 'marker', roles: "ROLE_MANAGER"},
            },
            {
                path: 'employeeTask',
                name: 'employeeTask',
                component: () => import('@/views/task/employeeListTask'),
                meta: {title: '任务列表', icon: 'marker', roles: "ROLE_EMPLOYEE"},
            },
            {
                path: 'delegateTask',
                name: 'delegateTask',
                component: () => import('@/views/task/delegateTask'),
                meta: {title: '委派任务', icon: 'table', roles: "ROLE_EMPLOYEE"},
            },
        ]
    },
    {
        path: '/user',
        component: Layout,
        name: 'user',
        meta: {title: '用户', icon: 'user'},
        children: [
            {
                path: 'user',
                name: 'user',
                component: () => import('@/views/user/index'),
                meta: {title: '个人中心', icon: 'marker'},
            },
            {
                path: 'managerUser',
                name: 'managerUser',
                component: () => import('@/views/user/managerUser'),
                meta: {title: '经理中心', icon: 'marker', roles: "ROLE_MANAGER"},
            },
            {
                path: 'employeeUser',
                name: 'employeeUser',
                component: () => import('@/views/user/employeeUser'),
                meta: {title: '员工中心', icon: 'marker', roles: "ROLE_EMPLOYEE"},
            },
        ]
    },
    {
        path: '/manage',
        component: Layout,
        name: 'manage',
        meta: {title: '管理', icon: 'table', roles: "!ROLE_EMPLOYEE"},
        children: [
            {
                path: 'manageUser',
                name: 'manageUser',
                component: () => import('@/views/manage/userManage'),
                meta: {title: '用户管理', icon: 'user', roles: "ROLE_ADMIN"},
            },
            {
                path: 'manageEmployee',
                name: 'manageEmployee',
                component: () => import('@/views/manage/employeeManage'),
                meta: {title: '员工管理', icon: 'user', roles: "ROLE_ADMIN"},
            },
            {
                path: 'manageManager',
                name: 'manageManager',
                component: () => import('@/views/manage/managerManage'),
                meta: {title: '经理管理', icon: 'user', roles: "ROLE_ADMIN"},
            },
            {
                path: 'manageGroup',
                name: 'manageGroup',
                component: () => import('@/views/manage/groupManage'),
                meta: {title: '组员管理', icon: 'user', roles: "ROLE_MANAGER"},
            },


        ]
    },

    {path: '*', redirect: '/404', hidden: true}
];

export default new Router({
    scrollBehavior: () => ({y: 0}),
    routes: constantRouterMap
})

