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
                      border>
                <el-table-column label="ID" width="280" align="center">
                    <template slot-scope="scope">{{ scope.row.id }}</template>
                </el-table-column>
                <el-table-column label="任务名称" width="140" align="center">
                    <template slot-scope="scope">
                        <div v-if="!scope.row.editing">{{ scope.row.name }}</div>
                        <el-input v-else v-model="scope.row.name" placeholder="请输入任务名"></el-input>
                    </template>
                </el-table-column>
                <el-table-column label="任务类型" width="120" align="center" sortable>
                    <template slot-scope="scope">{{ scope.row.type }}</template>
                </el-table-column>
                <el-table-column label="负责员工" width="280" align="center" sortable>
                    <template slot-scope="scope">{{ scope.row.undertaker | formatUndertaker }}</template>
                </el-table-column>
                <el-table-column label="任务状态" width="120" align="center" sortable>
                    <template slot-scope="scope">{{ scope.row.status | formatStatus }}</template>
                </el-table-column>
                <el-table-column label="所属项目" width="120" align="center" sortable>
                    <template slot-scope="scope">{{ scope.row.project | formatProject }}</template>
                </el-table-column>
                <el-table-column label="任务文档" width="120" align="center">
                    <template slot-scope="scope">
                        <a class="el-icon-download" v-if="scope.row.doc" :href="scope.row.doc.url"></a>
                        <span v-else>未生成</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <p>
                            <el-button
                                size="medium"
                                type="primary"
                                @click="handleEdit(scope.$index, scope.row)">{{scope.row.editing | formatEditting}}
                            </el-button>
                        </p>
                        <p>
                            <el-button
                                size="medium"
                                type="success"
                                v-show="canReview(scope.row.status)"
                                @click="handleReview(scope.$index, scope.row)">审核任务
                            </el-button>
                        </p>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <el-dialog
            :visible.sync="addTaskDialogVisible"
            title="添加任务"
            width="40%">
            <el-form autoComplete="on"
                     :model="addTaskForm"
                     ref="addTaskForm"
                     style="margin: auto 20px"
                     label-position="left">
                <el-form-item prop="name" label="任务名"  required>
                    <el-input name="name"
                              type="text"
                              v-model="addTaskForm.name"
                              autoComplete="on"
                              placeholder="请输入任务名">
                    </el-input>
                </el-form-item>

                <el-form-item prop="undertakerEid" label="任务负责人">
                    <el-select v-model="addTaskForm.undertakerEid" placeholder="请选择">
                        <el-option
                            v-for="item in this.employees"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="project" label="所属项目">
                    <el-select v-model="addTaskForm.projectId" placeholder="请选择">
                        <el-option
                            v-for="item in this.projects"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="任务类型" required>

                    <el-radio-group v-model="addTaskForm.type">
                        <el-radio label="A"></el-radio>
                        <el-radio label="B"></el-radio>
                        <el-radio label="C"></el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="addTaskDialogVisible=false">取 消</el-button>
            <el-button type="primary" @click="handleAddTaskConfirm">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>

    import {confirmTask, rejectTask, updateTask, addTask} from "@/api/task";
    import store from "@/store";
    import {listTask} from "@/api/manager";
    import {listProject} from "../../api/project";
    import {listEmployeeOfManager} from "../../api/manager";

    export default {
        name: 'managerListTasksView',
        data() {
            const validateName = (rule, value, callback) => {
                if (value.length < 2) {
                    callback(new Error('姓名字数不能小于2'))
                } else {
                    callback()
                }
            };
            return {
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
                editingRow: {},
                editing: false,
                addTaskDialogVisible: false,
                projects: [],
                employees: [],
            }
        },
        created() {
            this.getList();
        },
        methods: {
            getUrl(doc) {
                if (doc) {
                    return '' +  doc.url;
                } else {
                    return doc;

                }
            },
            handleAddTask() {
                this.addTaskDialogVisible = true;
                listProject().then(response => {
                    if (response.status === 200) {
                        this.projects = response.data;
                        listEmployeeOfManager(store.getters.mid).then(response => {
                            if (response.status === 200) {
                                this.employees = response.data;
                            } else {
                                this.$message.error(response.message);
                            }
                        });
                    } else {
                        this.$message.error(response.message);
                    }
                })
            },
            handleEdit(index, row) {
                if (row.editing) {
                    this.$confirm('是否要更新该任务', '提示', {
                        confirmButtonText: '是',
                        cancelButtonText: '否',
                        distinguishCancelAndClose: true,
                        type: 'warning'
                    }).then(() => {
                        updateTask(row.id, row.previousId, row.name, row.type, row.undertaker, row.project).then(response => {
                            const message = response.status === 200 ? '更新成功' : response.message;
                            const type = response.status === 200 ? 'success' : 'error';
                            this.$message({
                                message: message,
                                type: type
                            });
                            row.editing = false;
                            this.editing = false;
                        })
                    }).catch(() => {
                        row = Object.assign(this.editingRow);
                        this.editingRow = {};
                        row.editing = false;
                        this.editing = false;
                    })

                } else if (this.editing) {
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
                this.$confirm('该任务是否通过?', '任务审核', {
                    confirmButtonText: '通过',
                    cancelButtonText: '打回',
                    distinguishCancelAndClose: true,
                    type: 'warning'
                }).then(() => {
                    confirmTask(row.id).then(response => {
                        if (response.status !== 200) {
                            this.$message.error(response.message);
                        } else {
                            this.$message({
                                type: 'success',
                                message: '操作成功'
                            })
                        }
                    })
                }).catch(() => {
                    rejectTask(row.id).then(response => {
                        if (response.status !== 200) {
                            this.$message.error(response.message);
                        } else {
                            this.$message({
                                type: 'success',
                                message: '操作成功'
                            })
                        }
                    })
                })
            },
            handleAddTaskConfirm() {
                this.$refs.addTaskForm.validate(valid => {
                    if (valid) {
                        this.loading = true;
                        const form = this.addTaskForm;
                        addTask([], form.name, form.type, form.undertakerEid, form.projectId)
                            .then(response => {
                                if (response.status !== 200) {
                                    this.$message.error(response.message);
                                } else {
                                    this.$message({
                                        type: 'success',
                                        message: '添加成功'
                                    })
                                }
                            });
                    } else {
                        console.log('参数验证不合法！');
                        return false
                    }
                })
                this.addTaskForm = Object.assign(this.defaultAddTaskForm);
                this.addTaskDialogVisible = false;
            },
            getList() {
                this.listLoading = true;
                listTask(store.getters.mid).then(response => {
                    if (response.status !== 200) {
                        this.$message.error(response.message);
                    } else {
                        this.tasks = response.data;
                        const len = this.tasks.length;
                        for (let i = 0; i < len; i++) {
                            this.tasks[i]['editing'] = false;
                        }
                    }
                    this.listLoading = false;
                })
            },
            canReview(status) {
                return status === 'WAIT_REVIEW';
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
                return undertaker === null ? '无' : undertaker.id;
            },
            formatProject(project) {
                return project.name;
            },
            formatEditting(editing) {
                return editing ? '完成编辑' : '编辑任务';
            },
            formatDocument(document) {
                if (document) {

                    return document.url === null ? '未提交' : '' + document.url;
                } else {
                    return '未生成';
                }
            },
        }
    }
</script>


<style scoped>
    .app-container {
        margin-top: 30px;
    }
</style>
