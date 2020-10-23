// 引入mockjs
const Mock = require('mockjs');
// 获取 mock.Random 对象
const Random = Mock.Random;

const loginData = function () {
    return {};
};
Mock.mock('/auth/login', 'get', loginData);


const registerData = function () {
    return {};
};
Mock.mock('/auth/register', 'post', registerData);


const refreshLoginData = function () {
    return {};
};
Mock.mock('/auth/refresh', 'get', refreshLoginData);


const listEmployeeData = function () {
    return {};
};
Mock.mock('/employee/list', 'get', listEmployeeData);


const updateEmployeeData = function () {
    return {};
};
Mock.mock(/\/employee\/[\d]+\/list/, 'post', updateEmployeeData);


const listDelegateData = function () {
    return {};
};
Mock.mock(/\/employee\/[\d]+\/list/, 'get', listDelegateData);


const listTaskData = function () {
    return {};
};
Mock.mock(/\/employee\/[\d]+\/list/, 'get', listTaskData);


const addEmployeeData = function () {
    return {};
};
Mock.mock(/\/manager\/[\d]+\/addEmployee\/[\d]+/, 'get', addEmployeeData);


const removeEmployeeData = function () {
    return {};
};
Mock.mock(/\/manager\/[\d]+\/removeEmployee\/[\d]+/, 'get', removeEmployeeData);


const listManagerData = function () {
    return {};
};
Mock.mock('/manager/list', 'get', listManagerData);


const listEmployeeOfManagerData = function () {
    return {};
};
Mock.mock(/\/manager\/[\d]+\/list/, 'get', listEmployeeOfManagerData);


const updateManagerData = function () {
    return {};
};
Mock.mock(/\/manager\/[\d]+\/update/, 'post', updateManagerData);

const listProjectData = function () {
    return {};
};
Mock.mock('/project/list', 'get', listProjectData);


const startProjectData = function () {
    return {};
};
Mock.mock(/\/project\/[\d]+\/start/, 'get', startProjectData);


const stopProjectData = function () {
    return {};
};
Mock.mock(/\/project\/[\d]+\/stio/, 'get', stopProjectData);


const generateProjectData = function () {
    return {};
};
Mock.mock('/project/gen', 'get', generateProjectData);


const projectInfoData = function () {
    return {};
};
Mock.mock(/\/project\/[\d]+\/info/, 'get', projectInfoData);


const delegateTaskData = function () {
    return {};
};
Mock.mock(/\/task\/[\d]+\/delegate/, 'post', delegateTaskData);


const updateTaskData = function () {
    return {};
};
Mock.mock(/\/task\/[\d]+\/update/, 'post', updateTaskData);


const updateTaskBatchData = function () {
    return {};
};
Mock.mock('/task/update', 'post', updateTaskBatchData);


const addTaskData = function () {
    return {};
};
Mock.mock('/task/add', 'post', addTaskData);


const taskInfoData = function () {
    return {};
};
Mock.mock(/\/task\/[\d]+\/info/, 'get', taskInfoData);


const commitTaskData = function () {
    return {};
};
Mock.mock(/\/task\/[\d]+\/commit/, 'post', commitTaskData);


const finishTaskData = function () {
    return {};
};
Mock.mock(/\/task\/[\d]+\/finish/, 'get', finishTaskData);


const confirmTaskData = function () {
    return {};
};
Mock.mock(/\/task\/[\d]+\/confirm/, 'get', confirmTaskData);


const rejectTaskData = function () {
    return {};
};
Mock.mock(/\/task\/[\d]+\/reject/, 'get', rejectTaskData);


const updateUserData = function () {
    return {};
};
Mock.mock(/\/user\/[\d]+\/update/, 'post', updateUserData);


const listUserData = function () {
    return {};
};
Mock.mock('/user/list', 'get', listUserData);




