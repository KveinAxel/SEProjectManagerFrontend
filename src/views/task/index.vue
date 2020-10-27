<template>
    <div class="app-container">
        <el-card class="operate-container" shadow="never">
            <i class="el-icon-tickets"></i>
            <span>任务列表</span>
            <el-button
                class="btn-add"
                type="info"
                @click="handleAddTask"
                size="mini">
                添加任务
            </el-button>
        </el-card>
        <div class="table-container">
            <el-table ref="taskTable"
                      :data="tasks"
                      stripe
                      style="width: 100%"
                      v-loading="listLoading"
                      @row-dblclick="handleInfo"
                      border>
                <el-table-column label="ID" width="400" align="center">
                    <template slot-scope="scope">{{ scope.row.id }}</template>
                </el-table-column>
                <el-table-column label="任务名称" width="140" align="center">
                    <template slot-scope="scope">
                        <div v-if="!scope.row.editing">{{ scope.row.name }}</div>
<!--                        fixme 居中编辑文字-->
                        <el-input v-else v-model="scope.row.name" placeholder="请输入任务名"></el-input>
                    </template>
                </el-table-column>
                <el-table-column label="任务类型" width="120" align="center">
                    <template slot-scope="scope">{{ scope.row.type }}</template>
                </el-table-column>
                <!--                todo function: 增加点击项目经理名称跳转详细信息-->
                <el-table-column label="负责员工" width="400" align="center" v-if="canEdit">
                    <template slot-scope="scope">{{ scope.row.undertaker | formatUndertaker }}</template>
                </el-table-column>
                <el-table-column label="任务状态" width="120" align="center">
                    <template slot-scope="scope">{{ scope.row.status | formatStatus }}</template>
                </el-table-column>
                <el-table-column label="所属项目" width="120" align="center">
                    <template slot-scope="scope">{{ scope.row.project | formatProject }}</template>
                </el-table-column>
                <el-table-column label="任务进度" v-if="canEdit" width="120" align="center">
                    <!--                    todo function: 把url加上url标签-->
                    <template slot-scope="scope">{{ scope.row.pendding | formatDocument }}</template>
                </el-table-column>
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <p>
                            <el-button
                                size="medium"
                                type="info"
                                v-if="canDelegate(scope.status)"
                                @click="handleDelegate(scope.$index, scope.row)">委托任务
                            </el-button>
<!--                            fixme: 实时更新按钮文字-->
                            <el-button
                                size="medium"
                                type="primary"
                                v-if="canEdit"
                                @click="handleEdit(scope.$index, scope.row)">{{scope.row.editing | formatEditting}}
                            </el-button>
                            <el-button
                                size="medium"
                                type="primary"
                                v-show="canFinish(scope.row)"
                                @click="handleFinish(scope.$index, scope.row)">完成任务
                            </el-button>
                            <el-button
                                size="medium"
                                type="primary"
                                v-show="canCommit(scope.row.status)"
                                @click="handleCommit(scope.$index, scope.row)">上交任务
                            </el-button>
                            <el-button
                                size="medium"
                                type="primary"
                                v-show="canReview(scope.status)"
                                @click="handleReview(scope.$index, scope.row)">审核任务
                            </el-button>
                        </p>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <el-dialog title="提交任务文件"
                   :visible.sync="isUploading"
                   >
            <el-upload
                drag
                v-bind:action="commitingUrl"
                multiple>
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
        </el-dialog>
        <el-dialog
            title="添加任务"
            :visible.sync="addTaskDialogVisible"
            width="40%">
            <el-form autoComplete="on"
                     :model="addTaskForm"
                     :rules="addTaskRule"
                     ref="addTaskForm"
                     style="margin: auto 20px"
                     label-position="left">
                <el-form-item prop="previousTask" required>
                    <el-input name="previousTask"
                              type="text"
                              v-model="addTaskForm.previousTask"
                              autoComplete="on"
                              placeholder="请选择依赖任务">
                        <span slot="prefix">
                            <svg-icon icon-class="user" class="color-main"></svg-icon>
                        </span>
                    </el-input>
                </el-form-item>
                <el-form-item prop="name" required>
                    <el-input name="name"
                              type="text"
                              v-model="addTaskForm.name"
                              autoComplete="on"
                              placeholder="请输入任务名">
                        <span slot="prefix">
                            <svg-icon icon-class="password" class="color-main"></svg-icon>
                        </span>
                    </el-input>
                </el-form-item>
                <el-form-item style="margin-bottom: 40px;text-align: center">
                    <el-button style="width: 45%" type="primary" :loading="loading" @click="handleLogin">
                        登录
                    </el-button>
                    <el-button style="width: 45%" :loading="loading" @click="handleRegister">
                        注册
                    </el-button>

                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="addTaskDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="handleAddTaskConfirm">确 定</el-button>
        </span>
        </el-dialog>
    </div>
</template>

<script>

import {confirmTask, finishTask, rejectTask, updateTask} from "@/api/task";
import store from "@/store";

export default {
    name: 'listTasksView',
    data() {
        return {
            listLoading: true,
            tasks: [],
            isUploading: false,
            commitingId: null,
            editingRow: {},
            editing: false,
            addTaskDialogVisible: false,
            addTaskForm: {
                "previousId": [],
                "name": "",
                "type": "",
                "undertakerEid": "",
                "projectId": ""
            }
        }
    },
    created() {
        this.getList();
    },
    computed: {
        commitingUrl: function() {
            return 'http://localhost:8090/api/task/' + this.commitingId + '/commit';
        },
        canEdit() {
            return store.getters.roles.indexOf('ROLE_MANAGER') !== -1;
        },
    },
    methods: {
        handleAddTaskConfirm() {
            // todo
        },
        handleCancelUpdate(index, row) {
            row = Object.assign(this.editingRow);
            this.editingRow = {};
            row.editing = false;
            this.editing = false;
        },
        handleUpdate(index, row) {
            this.$confirm('是否要更新该任务', '提示', {
                confirmButtonText: '是',
                cancelButtonText: '否',
                type: 'warning'
            }).then(() => {
                updateTask(row.id, row.previousId, row.name, row.type, row.undertaker, row.project).then(response => {
                    const message = response.status === '200' ? '操作成功' : response.message;
                    const type = response.status === '200' ? 'success' : 'warning';
                    this.$message({
                        message: message,
                        type: type
                    });
                })
            })
            row.editing = false;
            this.editing = false;
        },
        handleAddTask() {
            // todo
        },
        handleInfo(row, column, event) {
            this.$message.error('dbclik')
            // todo
        },
        handleWithdraw(index, row) {
            // todo
        },
        handleFinish(index, row) {
            this.$confirm('是否要结束任务,并进入提交阶段', '提示', {
                confirmButtonText: '是',
                cancelButtonText: '否',
                type: 'warning'
            }).then(() => {
                finishTask(row.id).then(response => {
                    // todo handle resource object
                    const message = response.status === '200' ? '操作成功' : response.message;
                    const type = response.status === '200' ? 'success' : 'warning';
                    this.$message({
                        message: message,
                        type: type
                    });
                })
            })
        },
        handleCommit(index, row) {
            this.isUploading = true;
            this.commitingId = row.id;
        },
        handleEdit(index, row) {
            if (this.editing) {
                this.$message({
                    message: '一次只能编辑一个任务!',
                    type: 'warning',
                    showClose: true,
                    duration: 10000
                });
            } else {
                this.editingRow = Object.assign(row);
                row.editing = true;
                this.editing = true;
            }
        },
        handleReview(index, row) {
            this.$confirm('该任务是否通过?\n任务进度：' + row.url, '任务审核', {
                confirmButtonText: '通过',
                cancelButtonText: '打回',
                distinguishCancelAndClose: true,
                type: 'warning'
            }).then(() => {
                confirmTask(row.id).then(response => {
                    const message = response.status === '200' ? '操作成功' : response.message;
                    const type = response.status === '200' ? 'success' : 'warning';
                    this.$message({
                        message: message,
                        type: type
                    });
                })
            }).catch(() => {
                rejectTask(row.id).then(response => {
                    const message = response.status === '200' ? '操作成功' : response.message;
                    const type = response.status === '200' ? 'success' : 'warning';
                    this.$message({
                        message: message,
                        type: type
                    });
                })
            })
        },
        handleDelegate(index, row) {
            this.$confirm('是否要将该任务委托给他人', '提示', {
                confirmButtonText: '是',
                cancelButtonText: '否',
                type: 'warning'
            }).then(() => {
                finishTask(row.id).then(response => {
                    const message = response.status === '200' ? '操作成功' : response.message;
                    const type = response.status === '200' ? 'success' : 'warning';
                    this.$message({
                        message: message,
                        type: type
                    });
                })
            })
        },
        getList() {
            // todo get task list
            // for test
            this.listLoading = true;
            let mockManagers = [
                {
                    "id": "ff808081755a9f3101755ab92ce00001",
                    "name": "manager"
                }
            ];
            let mockEmployee = [
                {
                    "id": "ff808081755a9f3101755ab92ce00001",
                    "name": "employee",
                    "type": "A",
                    "manager": mockManagers[0]
                }
            ];
            this.tasks = [
                {
                    "id": "ff808081755a9f3101755ab92ce00001",
                    "previousId": [],
                    "name": "TaskA",
                    "type": "A",
                    "undertaker": mockEmployee[0], // 任务负责人
                    "status": "CREATED",    // CREATED - 创建；ACTIVE - 执行中；WAIT_COMMIT - 等待提交；DONE - 完成；REJECTED - 被打回
                    "project": {
                        "id": "ff808081755a9f3101755ab92ce00001",
                        "name": "project1",
                        "undertaker": mockManagers[0],
                        "status": "INACTIVE",
                    },
                    "pendding": {
                        'url': 'www.baidu.com'
                    },
                },
                {
                    "id": "5818852a16a511ebadc10242ac120002",
                    "previousId": ["ff808081755a9f3101755ab92ce00001"],
                    "name": "TaskB",
                    "type": "B",
                    "undertaker": mockEmployee[0], // 任务负责人
                    "status": "ACTIVE",    // CREATED - 创建；ACTIVE - 执行中；WAIT_COMMIT - 等待提交；DONE - 完成；REJECTED - 被打回
                    "project": {
                        "id": "ff808081755a9f3101755ab92ce00001",
                        "name": "project1",
                        "undertaker": mockManagers[0],
                        "status": "INACTIVE",
                    },
                    "pendding": {
                        'url': 'www.baidu.com'
                    },
                },
                {
                    "id": "796d1f4216a511ebadc10242ac120002",
                    "previousId": ["ff808081755a9f3101755ab92ce00001", "5818852a16a511ebadc10242ac120002"],
                    "name": "TaskC",
                    "type": "C",
                    "undertaker": null, // 任务负责人
                    "status": "WAIT_COMMIT",    // CREATED - 创建；ACTIVE - 执行中；WAIT_COMMIT - 等待提交；DONE - 完成；REJECTED - 被打回
                    "project": {
                        "id": "ff808081755a9f3101755ab92ce00001",
                        "name": "project1",
                        "undertaker": mockManagers[0],
                        "status": "INACTIVE",
                    },
                    "pendding": {
                        'url': 'www.baidu.com'
                    },
                },
            ];
            const len = this.tasks.length;
            for (let i = 0; i < len; i++) {
                this.tasks[i]['editing'] = false;
            }
            this.listLoading = false;
        },
        canDelegate(status){
            // handle delegate button visible
            return true;
        },
        canReview(status) {
            // todo
            return true
        },
        canFinish(status) {
            return status === 'ACTIVE';
        },
        canCommit(status) {
            return status === 'WAIT_COMMIT';
        },
    },
    filters: {
        formatStatus(status) {
            if (status === 'CREATED') {
                return '创建';
            } else if (status === 'ACTIVE') {
                return '执行中';
            } else if (status === 'WAIT_COMMIT') {
                return '等待提交';
            } else if (status === 'DONE') {
                return '完成';
            } else if (status === 'REJECTED') {
                return '被打回';
            } else {
                return '不明'
            }
        },
        formatUndertaker(undertaker) {
            return undertaker === null ? '无' : undertaker.id;
        },
        formatProject(project) {
            return project.name;
        },
        formatEditting(editing) {
            return editing ? '完成编辑' : '编辑任务';
        },
        formatDocument(document) {
            return document.url === null ? '未提交' : document.url;
        },
    }
}
</script>


<style scoped>
.app-container {
    margin-top: 30px;
    margin-left: 100px;
    margin-right: 100px;
}
</style>
