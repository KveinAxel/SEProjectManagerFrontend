// 引入mockjs
const Mock = require('mockjs');
// 获取 mock.Random 对象
const Random = Mock.Random;

const employee = {
    id: 123,
    name: 'employee',
    type: 'A',
    auth: 1
};

const manager = {
    id: 124,
    name: 'manager',
    auth: 5
};

const task1 = {
    id: 125,
    prevId: null,
    name: 'TaskA',
    type: 'A',
    projId: 127
};

const task2 = {
    id: 126,
    prevId: 125,
    name: 'TaskB',
    type: 'B',
    projId: 127
};

const project = {
    id: 127,
    name: 'project',
    task: [task1, task2]
};

const user = {
    id: 128,
    name: 'user',
    auth: 10
}

const loginData = function () {
    return {
        "status": 200,
        "message": null,
        "data": null,
    };
};
Mock.mock('/auth/login', 'get', loginData);


const registerData = function () {
    return {
        "status": 200,
        "message": null,
        "data": null,
    };
};
Mock.mock('/auth/register', 'post', registerData);


const refreshLoginData = function () {
    return {
        "status": 200,
        "message": null,
        "data": null,
    };
};
Mock.mock('/auth/refresh', 'get', refreshLoginData);


const listEmployeeData = function () {
    return {
        "status": 200,
        "message": null,
        "data": [Object.assign(employee)]
    };
};
Mock.mock('/employee/list', 'get', listEmployeeData);


const updateEmployeeData = function () {
    return {
        "status": 200,
        "message": null,
        "data": null,
    };
};
Mock.mock(/\/employee\/[\d]+\/list/, 'post', updateEmployeeData);


const listDelegateData = function () {
    return {
        "status": 200,
        "message": null,
        "data": [Object.assign(task1)],
    };
};
Mock.mock(/\/employee\/[\d]+\/list/, 'get', listDelegateData);


const listTaskData = function () {
    return {
        "status": 200,
        "message": null,
        "data": [Object.assign(task1), Object.assign(task2)],
    };
};
Mock.mock(/\/employee\/[\d]+\/list/, 'get', listTaskData);


const addEmployeeData = function () {
    return {
        "status": 200,
        "message": null,
        "data": null,
    };
};
Mock.mock(/\/manager\/[\d]+\/addEmployee\/[\d]+/, 'get', addEmployeeData);


const removeEmployeeData = function () {
    return {
        "status": 200,
        "message": null,
        "data": null,
    };
};
Mock.mock(/\/manager\/[\d]+\/removeEmployee\/[\d]+/, 'get', removeEmployeeData);


const listManagerData = function () {
    return {
        "status": 200,
        "message": null,
        "data": [Object.assign(manager)],
    };
};
Mock.mock('/manager/list', 'get', listManagerData);


const listEmployeeOfManagerData = function () {
    return {
        "status": 200,
        "message": null,
        "data": [Object.assign(employee)],
    };
};
Mock.mock(/\/manager\/[\d]+\/list/, 'get', listEmployeeOfManagerData);


const updateManagerData = function () {
    return {
        "status": 200,
        "message": null,
        "data": null,
    };
};
Mock.mock(/\/manager\/[\d]+\/update/, 'post', updateManagerData);

const listProjectData = function () {
    return {
        "status": 200,
        "message": null,
        "data": [Object.assign(project)],
    };
};
Mock.mock('/project/list', 'get', listProjectData);


const startProjectData = function () {
    return {
        "status": 200,
        "message": null,
        "data": null,
    };
};
Mock.mock(/\/project\/[\d]+\/start/, 'get', startProjectData);


const stopProjectData = function () {
    return {
        "status": 200,
        "message": null,
        "data": null,
    };
};
Mock.mock(/\/project\/[\d]+\/stio/, 'get', stopProjectData);


const generateProjectData = function () {
    return {
        "status": 200,
        "message": null,
        "data": [Object.assign(project)],
    };
};
Mock.mock('/project/gen', 'get', generateProjectData);


const projectInfoData = function () {
    return {
        "status": 200,
        "message": null,
        "data": [Object.assign(project)],
    };
};
Mock.mock(/\/project\/[\d]+\/info/, 'get', projectInfoData);


const delegateTaskData = function () {
    return {
        "status": 200,
        "message": null,
        "data": null,
    };
};
Mock.mock(/\/task\/[\d]+\/delegate/, 'post', delegateTaskData);


const updateTaskData = function () {
    return {
        "status": 200,
        "message": null,
        "data": null,
    };
};
Mock.mock(/\/task\/[\d]+\/update/, 'post', updateTaskData);


const updateTaskBatchData = function () {
    return {
        "status": 200,
        "message": null,
        "data": null,
    };
};
Mock.mock('/task/update', 'post', updateTaskBatchData);


const addTaskData = function () {
    return {
        "status": 200,
        "message": null,
        "data": null,
    };
};
Mock.mock('/task/add', 'post', addTaskData);


const taskInfoData = function () {
    return {
        "status": 200,
        "message": null,
        "data": [Object.assign(task1)],
    };
};
Mock.mock(/\/task\/[\d]+\/info/, 'get', taskInfoData);


const commitTaskData = function () {
    return {
        "status": 200,
        "message": null,
        "data": null,
    };
};
Mock.mock(/\/task\/[\d]+\/commit/, 'post', commitTaskData);


const finishTaskData = function () {
    return {
        "status": 200,
        "message": null,
        "data": null,
    };
};
Mock.mock(/\/task\/[\d]+\/finish/, 'get', finishTaskData);


const confirmTaskData = function () {
    return {
        "status": 200,
        "message": null,
        "data": null,
    };
};
Mock.mock(/\/task\/[\d]+\/confirm/, 'get', confirmTaskData);


const rejectTaskData = function () {
    return {
        "status": 200,
        "message": null,
        "data": null,
    };
};
Mock.mock(/\/task\/[\d]+\/reject/, 'get', rejectTaskData);


const updateUserData = function () {
    return {
        "status": 200,
        "message": null,
        "data": null,
    };
};
Mock.mock(/\/user\/[\d]+\/update/, 'post', updateUserData);


const listUserData = function () {
    return {
        "status": 200,
        "message": null,
        "data": [Object.assign(user)],
    };
};
Mock.mock('/user/list', 'get', listUserData);




