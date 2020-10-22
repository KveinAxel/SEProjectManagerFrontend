 

#### api

##### /auth

* `/auth/login`
* `/auth/refresh`
* `/auth/register`

##### /employee

* `/employee/list` 显示员工列表
* `/employee/:id/update` 更新员工信息
* `/employee/:id/listDelegate` 查看已委托别人的项目，可主动收回
* `/employee/:id/listTask` 查看自己的任务

##### /user

* `/user/:id/update` 更新用户信息（权限等）
* `/user/list`

##### /manager

* `/manager/:mid/addEmployee/:uid` 向经理的组内增加员工
* `/manager/:mid/removeEmployee/:uid` 向经理的组内移除员工
* `/manager/list` 显示所有经理
* `/manager/:mid/list` 显示经理的员工
* `/manager/:mid/update`

##### /project

* `/project/list`  列出当前权限能查看的项目, 特殊人员：所有项目，员工：被分配项目
* `/project/:id/start` 启动项目
* `/project/:id/stop` 终止项目
* `/project/gen` 生成项目
* `/project/:id/info ` 项目信息

##### /task

* `/task/:id/delegate` 指定项目人员，可指定期限自动收回，也可不带期限
* `/task/:id/update` 更新任务信息
* `/task/update` （批量）更新任务信息（执行情况、前驱等）
* `/task/add`
* `/task/:id/info`
* `/task/:id/commit` 上传更改后的word文档，任务结束
* `/task/:id/finish` 任务进入提交状态，返回word文档链接
* `/task/:id/confirm` 经理确认任务完成
* `/task/:id/reject` 经理拒绝任务

