<template>
    <div class="app-container">
        <el-card class="operate-container" shadow="never">
            <i class="el-icon-tickets"></i>
            <span>任务列表</span>
        </el-card>
        <div class="table-container">
            <el-table ref="taskTable"
                      :data="tasks"
                      stripe
                      style="width: 100%"
                      v-loading="listLoading"
                      border>
                <el-table-column label="ID" width="280" align="center">
                    <template slot-scope="scope">{{ scope.row.id }}</template>
                </el-table-column>
                <el-table-column label="任务名称" width="140" align="center">
                    <template slot-scope="scope">{{ scope.row.name }}</template>
                </el-table-column>
                <el-table-column label="任务类型" width="120" align="center">
                    <template slot-scope="scope">{{ scope.row.type }}</template>
                </el-table-column>
                <el-table-column label="负责员工" width="280" align="center">
                    <template slot-scope="scope">{{ scope.row.undertaker | formatUndertaker }}</template>
                </el-table-column>
                <el-table-column label="任务状态" width="120" align="center">
                    <template slot-scope="scope">{{ scope.row.status | formatStatus }}</template>
                </el-table-column>
                <el-table-column label="所属项目" width="120" align="center">
                    <template slot-scope="scope">{{ scope.row.project | formatProject }}</template>
                </el-table-column>
                <el-table-column label="任务文档" width="120" align="center">
                    <template slot-scope="scope">
                        <a v-if="scope.row.doc !== null" :href="scope.row.pending.url">{{ scope.row.pending |
                            formatDocument }}</a>
                        <span v-else>{{ scope.row.pending | formatDocument }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <p>
                            <el-button
                                size="medium"
                                type="info"
                                v-if="canDelegate(scope.delegate)"
                                @click="handleDelegate(scope.$index, scope.row)">委托任务
                            </el-button>
                            <el-button
                                size="medium"
                                type="info"
                                v-if="!canDelegate(scope.delegate)"
                                @click="handleWithdraw(scope.$index, scope.row)">收回任务
                            </el-button>
                        </p><p>
                            <el-button
                                size="medium"
                                type="primary"
                                v-show="canFinish(scope.row.status)"
                                @click="handleFinish(scope.$index, scope.row)">完成任务
                            </el-button>
                            <el-button
                                size="medium"
                                type="primary"
                                v-show="canCommit(scope.row.status)"
                                @click="handleCommit(scope.$index, scope.row)">上交任务
                            </el-button>
                        </p>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <el-dialog title="提交任务文件"
                   :visible.sync="isUploading"
        >
            <!--            todo -->
            <el-upload
                drag
                v-bind:action="commitingUrl"
                multiple>
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
        </el-dialog>
        <el-dialog title="委托任务" :visible.sync="delegateTaskDialogVisible">
            <div><el-transfer filterable :filter-method="filterMethod" filter-placeholder="请输入姓名"
                         :titles="['名单', '委托人']"
                              v-model="delegateSelected" :data="employees"></el-transfer></div>
            <div style="margin-top: 20px">
                收回日期
                <el-switch
                    v-model="hasDDL"
                    active-color="#13ce66"
                    inactive-color="#ff4949">
                </el-switch>
            </div>
            <div class="block" style="margin-top: 20px" v-if="hasDDL">
                <span class="demonstration">任务收回日期</span>
                <el-date-picker
                    v-model="DDL"
                    type="datetime"
                    placeholder="选择委托收回时间"
                    align="right"
                    :picker-options="pickerOptions">
                </el-date-picker>
            </div>
            <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="delegateTaskDialogVisible=false">取 消</el-button>
            <el-button type="primary" @click="handleDelegateConfirm">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>

    import {finishTask} from "@/api/task";
    import store from "@/store";
    import {withdrawTask} from "@/api/task";
    import {listTask} from "@/api/employee";
    import {listEmployee} from "../../api/employee";
    import {delegateTask} from "../../api/task";

    export default {
        name: 'employeeListTasksView',
        data() {
            const validateName = (rule, value, callback) => {
                if (value.length < 2) {
                    callback(new Error('姓名字数不能小于2'))
                } else {
                    callback()
                }
            };
            return {
                pickerOptions: {
                    shortcuts: [
                        {
                            text: '明天',
                            onClick(picker) {
                                const date = new Date();
                                date.setTime(date.getTime() + 3600 * 1000 * 24);
                                picker.$emit('pick', date);
                            }
                        }, {
                            text: '一周后',
                            onClick(picker) {
                                const date = new Date();
                                date.setTime(date.getTime() + 3600 * 1000 * 24 * 7);
                                picker.$emit('pick', date);
                            }
                        }]
                },
                DDL: new Date(),
                employees: [],
                hasDDL: false,
                delegateSelected: [],
                addTaskForm: {
                    "previousId": [],
                    "name": "",
                    "type": "",
                    "undertakerEid": "",
                    "projectId": ""
                },
                defaultAddTaskForm: {
                    "previousId": [],
                    "name": "",
                    "type": "",
                    "undertakerEid": "",
                    "projectId": ""
                },
                addTaskRules: {
                    name: [{required: true, trigger: 'blur', validator: validateName}],
                },
                listLoading: true,
                tasks: [],
                isUploading: false,
                commitingId: null,
                addTaskDialogVisible: false,
                delegateTaskDialogVisible: false,
            }
        },
        created() {
            this.getList();
        },
        computed: {
            commitingUrl: function () {
                return 'http://localhost:8090/api/task/' + this.commitingId + '/commit';
            },
        },
        methods: {
            handleDelegateConfirm() {
                if (this.delegateSelected.length > 1) {
                    this.$message({
                        type: 'warning',
                        message: '只能选择一个委托人'
                    })
                } else if (this.delegateSelected.length < 1) {
                    this.$message({
                        type: 'warning',
                        message: '请选择委托人'
                    })
                } else {
                    let t = this.hasDDL ? this.DDL : null;
                    delegateTask(store.getters.eid, this.delegateSelected[0].id, t).then(response => {
                        if (response.status === 200) {
                            this.$message({
                                type: 'success',
                                message: '委托成功'
                            })
                        } else {
                            this.$message.error(response.message);
                        }
                        this.hasDDL = false;
                        this.DDL = new Date();
                        this.delegateSelected = [];
                        this.delegateTaskDialogVisible = false;
                    })
                }

            },
            filterMethod(query, item) {
                return item.name.indexOf(query) > -1;
            },
            handleWithdraw(index, row) {
                this.$confirm('是否要收回委托', '提示', {
                    confirmButtonText: '是',
                    cancelButtonText: '否',
                    type: 'warning'
                }).then(() => {
                    withdrawTask(row.id).then(response => {
                        const message = response.status === 200 ? '操作成功' : response.message;
                        const type = response.status === 200 ? 'success' : 'warning';
                        this.$message({
                            message: message,
                            type: type
                        });
                    })
                })
            },
            handleFinish(index, row) {
                this.$confirm('是否要结束任务,并进入提交阶段', '提示', {
                    confirmButtonText: '是',
                    cancelButtonText: '否',
                    type: 'warning'
                }).then(() => {
                    finishTask(row.id).then(response => {
                        const message = response.status === 200 ? '操作成功' : response.message;
                        const type = response.status === 200 ? 'success' : 'warning';
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
            handleDelegate(index, row) {
                this.delegateTaskDialogVisible = true;
                listEmployee().then(response => {
                    if (response.status !== 200) {
                        this.$message.error('获取员工名单失败');
                    } else {
                        this.employees = response.data;
                        for (let item of this.employees) {
                            item.key = item.id;
                            item.label = item.name;
                        }
                    }
                })
            },
            getList() {
                this.listLoading = true;
                listTask(store.getters.eid).then(response => {
                    if (response.status !== 200) {
                        this.$message.error(response.message);
                    } else {
                        this.tasks = response.data;
                    }
                    this.listLoading = false;
                })
            },
            canDelegate(delegate) {
                return delegate !== null;
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
                } else if (status === 'WAIT_REVIEW') {
                    return '等待审核';
                } else if (status === 'INACTIVE') {
                    return '暂停';
                } else {
                    return '不明'
                }
            },
            formatUndertaker(undertaker) {
                return undertaker === null ? '暂无' : undertaker.id;
            },
            formatProject(project) {
                return project.name;
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
    }
</style>
