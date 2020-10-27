// 引入mockjs
const Mock = require('mockjs');

const mockUser = {
    "id": "ff808081755a9f3101755ab92ce00001",
    "username": "user",
    "roles": ["ROLE_MANAGER"],
    "avatar": 'https://imgchr.com/i/BlykQS'
}

const mockManager = {
    "id": "ff808081755a9f3101755ab92ce00001",
    "name": "manager",
    "user": mockUser
};

const mockResource = {
    "id": "123123",
    "url": "www.baidu.com",
    "type": "DOCUMENT",
    "uploader": mockUser,
    "uploadTime": 1000000000
}

const mockEmployee = {
    "id": "ff808081755a9f3101755ab92ce00001",
    "name": "employee",
    "type": "A",
    "manager": mockManager,
    "user": mockUser
}

const mockProject = {
    "id": "ff808081755a9f3101755ab92ce00001",
    "name": "project1",
    "undertaker": mockManager, // 承办项目的经理
    "status": "INACTIVE",         // 停止 - INACTIVE；正在进行 - ACTIVE
    "doc": mockResource
};


const mockTask1 = {
    "id": "ff808081755a9f3101755ab92ce00001",
    "previousId": [],
    "name": "TaskA",
    "type": "A",
    "undertaker": mockManager, // 任务负责人
    "status": "CREATED",    // CREATED - 创建；ACTIVE - 执行中；WAIT_COMMIT - 等待提交；DONE - 完成；REJECTED - 被打回
    "project": mockProject,
    "pending": mockResource,
    "delegate": true,
};

const mockTask2 = {
    "id": "5818852a16a511ebadc10242ac120002",
    "previousId": ["ff808081755a9f3101755ab92ce00001"],
    "name": "TaskB",
    "type": "B",
    "undertaker": mockManager, // 任务负责人
    "status": "ACTIVE",    // CREATED - 创建；ACTIVE - 执行中；WAIT_COMMIT - 等待提交；DONE - 完成；REJECTED - 被打回
    "project": mockProject,
    "pending": mockResource,
    "delegate": true,

}

const mockTask3 = {
    "id": "796d1f4216a511ebadc10242ac120002",
    "previousId": ["ff808081755a9f3101755ab92ce00001", "5818852a16a511ebadc10242ac120002"],
    "name": "TaskC",
    "type": "C",
    "undertaker": null, // 任务负责人
    "status": "WAIT_COMMIT",    // CREATED - 创建；ACTIVE - 执行中；WAIT_COMMIT - 等待提交；DONE - 完成；REJECTED - 被打回
    "project": mockProject,
    "pending": mockResource,
    "delegate": false,

}

const mockDelegate = {
    "id": "123asd",
    "task": mockTask1,
    "from": mockEmployee,
    "delegateTo": mockEmployee,
    "expire": 1000000000
}

const mockManagerAddEmployee = function () {
    return {
        "status": 200,
        "message": null,
        "data": Object.assign(mockEmployee),
    };
};
Mock.mock(/\/api\/manager\/.{32}\/employee\/add/, 'post', mockManagerAddEmployee);

const mockManagerRemoveEmployee = function () {
    return {
        "status": 200,
        "message": null,
        "data": null,
    };
};
Mock.mock(/\/api\/manager\/.{32}\/employee\/remove/, 'post', mockManagerRemoveEmployee);

const mockListManager = function () {
    return {
        "status": 200,
        "message": null,
        "data": [mockManager],
    };
};
Mock.mock('/api/manager/list', 'get', mockListManager);

const mockListEmployeeOfManager = function () {
    return {
        "status": 200,
        "message": null,
        "data": [mockEmployee],
    };
};
Mock.mock(/\/api\/manager\/.{32}\/employee\/list/, 'get', mockListEmployeeOfManager);

const mockUpdateManager = function () {
    return {
        "status": 200,
        "message": null,
        "data": mockManager,
    };
};
Mock.mock(/\/api\/manager\/.{32}\/update/, 'post', mockUpdateManager);

const mockAddManager = function () {
    return {
        "status": 200,
        "message": null,
        "data": null,
    };
};
Mock.mock('/api/manager/add', 'post', mockAddManager);

const mockManagerListTask = function () {
    return {
        "status": 200,
        "message": null,
        "data": [mockTask1, mockTask2],
    };
};
Mock.mock(/\/api\/manager\/.{32}\/task/, 'get', mockManagerListTask);

const mockManagerInfo = function () {
    return {
        "status": 200,
        "message": null,
        "data": Object.assign(mockManager),
    };
};
Mock.mock('/api/manager/info', 'get', mockManagerInfo);

const mockListProject = function () {
    return {
        "status": 200,
        "message": null,
        "data": [mockProject],
    };
};
Mock.mock('/api/project/list', 'get', mockListProject);

const mockStartProject = function () {
    return {
        "status": 200,
        "message": null,
        "data": mockProject,
    };
};
Mock.mock(/\/api\/project\/.{32}\/start/, 'post', mockStartProject);

const mockStopProject = function () {
    return {
        "status": 200,
        "message": null,
        "data": mockProject,
    };
};
Mock.mock(/\/api\/project\/.{32}\/stop/, 'post', mockStopProject);

const mockGenerateProject = function () {
    return {
        "status": 200,
        "message": null,
        "data": mockProject,
    };
};
Mock.mock('/api/project/generate', 'post', mockGenerateProject);

const mockProjectInfo = function () {
    return {
        "status": 200,
        "message": null,
        "data": {
            "info": mockProject,
            "task": [mockTask1, mockTask2, mockTask3]
        },
    };
};
Mock.mock(/\/api\/project\/.{32}/, 'get', mockProjectInfo);

const mockDelegateTask = function () {
    return {
        "status": 200,
        "message": null,
        "data": mockDelegate,
    };
};
Mock.mock(/\/api\/task\/.{32}\/delegate/, 'post', mockDelegateTask);

const mockUpdateTask = function () {
    return {
        "status": 200,
        "message": null,
        "data": mockTask1,
    };
};
Mock.mock(/\/api\/task\/.{32}\/update/, 'post', mockUpdateTask);

const mockUpdateTaskBatch = function () {
    return {
        "status": 200,
        "message": null,
        "data": [mockTask1, mockTask2, mockTask3],
    };
};
Mock.mock('/api/task/update', 'post', mockUpdateTaskBatch);

const mockAddTask = function () {
    return {
        "status": 200,
        "message": null,
        "data": mockTask1,
    };
};
Mock.mock('/api/task/add', 'post', mockAddTask);

const mockTaskInfo = function () {
    return {
        "status": 200,
        "message": null,
        "data": mockTask1,
    };
};
Mock.mock(/\/api\/task\/.{32}\/info/, 'get', mockTaskInfo);

const mockCommitTask = function () {
    return {
        "status": 200,
        "message": null,
        "data": null,
    };
};
Mock.mock(/\/api\/task\/.{32}\/commit/, 'post', mockCommitTask);

const mockFinishTask = function () {
    return {
        "status": 200,
        "message": null,
        "data": mockResource,
    };
};
Mock.mock(/\/api\/task\/.{32}\/finish/, 'post', mockFinishTask);

const mockConfirmTask = function () {
    return {
        "status": 200,
        "message": null,
        "data": null,
    };
};
Mock.mock(/\/api\/task\/.{32}\/confirm/, 'post', mockConfirmTask);

const mockRejectTask = function () {
    return {
        "status": 200,
        "message": null,
        "data": null,
    };
};
Mock.mock(/\/api\/task\/.{32}\/reject/, 'post', mockRejectTask);

const mockWithdrawTask = function () {
    return {
        "status": 200,
        "message": null,
        "data": null,
    };
};
Mock.mock(/\/api\/task\/.{32}\/withdraw/, 'post', mockWithdrawTask);

const mockUpdateUser = function () {
    return {
        "status": 200,
        "message": null,
        "data": mockUser,
    };
};
Mock.mock(/\/api\/user\/.{32}\/update/, 'post', mockUpdateUser);

const mockListUser = function () {
    return {
        "status": 200,
        "message": null,
        "data": [mockUser],
    };
};
Mock.mock('/api/user/list', 'get', mockListUser);

const mockUserInfo = function () {
    return {
        "status": 200,
        "message": null,
        "data": mockUser,
    };
};
Mock.mock('/api/user/info', 'get', mockUserInfo);

const mockListEmployee = function () {
    return {
        "status": 200,
        "message": null,
        "data": [mockEmployee]
    };
};
Mock.mock('/api/employee/list', 'get', mockListEmployee);

const mockUpdateEmployee = function () {
    return {
        "status": 200,
        "message": null,
        "data": mockEmployee,
    };
};
Mock.mock(/\/api\/employee\/.{32}\/update/, 'post', mockUpdateEmployee);

const mockListDelegate = function () {
    return {
        "status": 200,
        "message": null,
        "data": [mockDelegate],
    };
};
Mock.mock(/\/api\/employee\/.{32}\/delegate/, 'get', mockListDelegate);

const mockListTask = function () {
    return {
        "status": 200,
        "message": null,
        "data": [mockTask1, mockTask2],
    };
};
Mock.mock(/\/api\/employee\/.{32}\/task/, 'get', mockListTask);

const mockAddEmployee = function () {
    return {
        "status": 200,
        "message": null,
        "data": mockEmployee,
    };
};
Mock.mock('/api/employee/add', 'post', mockAddEmployee);

const mockEmployeeInfo = function () {
    return {
        "status": 200,
        "message": null,
        "data": mockEmployee,
    };
};
Mock.mock('/api/employee/info', 'get', mockEmployeeInfo);

const mockLogin = function () {
    return {
        "status": 200,
        "message": null,
        "data": {
            "authToken": {
                "token": "token",                     // 登录令牌
                "expired": 1000000000    // 令牌有效期
            },
            "username": "admin",           // 用户名
            "roles": mockUser.roles       // 角色
        },
    };
};
Mock.mock('/api/auth/login', 'post', mockLogin);

const mockRegister = function () {
    return {
        "status": 200,
        "message": null,
        "data": {
            "id": "ff808081755a9f3101755ab92ce00001",  // 用户id
            "username": "admin"                                     // 用户名
        },
    };
};
Mock.mock('/api/auth/register', 'post', mockRegister);

const mockRefresh = function () {
    return {
        "status": 200,
        "message": null,
        "data": {
            "token": "token",                     // 登录令牌
            "expired": 1000000000    // 令牌有效期
        }
    };
};
Mock.mock('/api/auth/refresh', 'get', mockRefresh);

const mockDocument = function () {
    return {
        "status": 200,
        "message": null,
        "data": mockResource
    };
};
Mock.mock('/api/resource/document', 'PUT', mockDocument);

const mockImage = function () {
    return {
        "status": 200,
        "message": null,
        "data": mockResource
    };
};
Mock.mock('/api/resource/image', 'post', mockImage);
