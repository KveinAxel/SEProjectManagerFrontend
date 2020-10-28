<template>
    <div class="app-container">
        <el-card class="operate-container" shadow="never">
            <i class="el-icon-tickets"></i>
            <span>项目信息</span>
        </el-card>
        <div class="table-container">
            <el-table ref="projectTable"
                      :data="[project]"
                      stripe
                      style="width: 100%"
                      v-loading="listLoading"
                      border>
                <el-table-column label="ID" align="center">
                    <template slot-scope="scope">{{ scope.row.id }}</template>
                </el-table-column>
                <el-table-column label="项目名称" width="120" align="center">
                    <template slot-scope="scope">{{ scope.row.name }}</template>
                </el-table-column>
                <el-table-column label="负责经理" width="120" align="center">
                    <template slot-scope="scope">{{ scope.row.undertaker | formatUndertaker }}</template>
                </el-table-column>
                <el-table-column label="项目状态" width="120" align="center">
                    <template slot-scope="scope">{{ scope.row.status | formatProjectStatus }}</template>
                </el-table-column>
                <el-table-column label="项目文档" width="120" align="center">
                    <template slot-scope="scope">
                        <a v-if="scope.row.doc !== null" :href="scope.row.doc.url">{{ scope.row.doc | formatDocument
                            }}</a>
                        <span v-else>未生成</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <p>
                            <el-button
                                size="medium"
                                type="info"
                                v-if="isStop(scope.row.status)"
                                @click="handleStartProject(scope.$index, scope.row)">开始
                            </el-button>
                            <el-button
                                size="medium"
                                type="info"
                                v-if="isStart(scope.row.status)"
                                @click="handleStopProject(scope.$index, scope.row)">暂停
                            </el-button>
                        </p>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <div style="margin-top: 30px">
            <el-table ref="taskTable"
                      :data="taskList"
                      stripe
                      style="width: 100%"
                      v-loading="listLoading"
                      border>
                <el-table-column label="ID" align="center">
                    <template slot-scope="scope">{{ scope.row.id }}</template>
                </el-table-column>
                <el-table-column label="任务名称" width="120" align="center">
                    <template slot-scope="scope">{{ scope.row.name }}</template>
                </el-table-column>
                <el-table-column label="负责员工" width="120" align="center">
                    <template slot-scope="scope">{{ scope.row.undertaker | formatUndertaker }}</template>
                </el-table-column>
                <el-table-column label="任务状态" width="120" align="center">
                    <template slot-scope="scope">{{ scope.row.status | formatTaskStatus }}</template>
                </el-table-column>
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <p>
                            <el-button
                                size="medium"
                                type="info"
                                @click="handleChangeUndertaker(scope.$index, scope.row)">换人
                            </el-button>
                        </p>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <el-card style="margin-top: 30px" class="operate-container" shadow="never">
            <i class="el-icon-tickets"></i>
            <span>项目进度</span>
        </el-card>
        <el-card style="margin-top: 20px">
            <el-steps :active="stepStatus" align-center>
                <el-step title="未激活"></el-step>
                <el-step title="运行中"></el-step>
                <el-step title="完成"></el-step>
            </el-steps>
        </el-card>
        <el-card class="operate-container" shadow="never" style="margin-top: 30px">
            <i class="el-icon-tickets"></i>
            <span>任务状态</span>
        </el-card>
        <el-card style="margin-top: 20px">
            <el-row style="text-align: center" type="flex" justify="center">
                <el-col :span="3">
                    <el-row style="text-align: center">
                        <el-progress type="circle" :percentage="taskStatus['CREATED']"></el-progress>
                    </el-row>
                    <el-row style="text-align: center">
                        创建
                    </el-row>
                </el-col>
                <el-col :span="3">
                    <el-row style="text-align: center">
                        <el-progress type="circle" :percentage="taskStatus['ACTIVE']"></el-progress>
                    </el-row>
                    <el-row style="text-align: center">
                        运行
                    </el-row>
                </el-col>
                <el-col :span="3">
                    <el-row style="text-align: center">
                        <el-progress type="circle" status="warning" :percentage="taskStatus['INACTIVE']"></el-progress>
                    </el-row>
                    <el-row style="text-align: center">
                        暂停
                    </el-row>
                </el-col>
                <el-col :span="3">
                    <el-row style="text-align: center">
                        <el-progress type="circle" :percentage="taskStatus['WAIT_COMMIT']"></el-progress>
                    </el-row>
                    <el-row style="text-align: center">
                        等待结果
                    </el-row>
                </el-col>
                <el-col :span="3">
                    <el-row style="text-align: center">
                        <el-progress type="circle" :percentage="taskStatus['WAIT_REVIEW']"></el-progress>
                    </el-row>
                    <el-row style="text-align: center">
                        等待审核
                    </el-row>
                </el-col>
                <el-col :span="3">
                    <el-row style="text-align: center">
                        <el-progress type="circle" status="success" :percentage="taskStatus['DONE']"></el-progress>
                    </el-row>
                    <el-row style="text-align: center">
                        完成
                    </el-row>
                </el-col>
                <el-col :span="3">
                    <el-row style="text-align: center">
                        <el-progress type="circle" status="exception"
                                     :percentage="taskStatus['REJECTED']"></el-progress>
                    </el-row>
                    <el-row style="text-align: center">
                        被打回
                    </el-row>
                </el-col>
            </el-row>
        </el-card>
        <el-card style="margin-top: 30px" class="operate-container" shadow="never">
            <i class="el-icon-tickets"></i>
            <span>任务依赖图</span>
        </el-card>
        <!--        <echarts v-bind="tasks"></echarts>-->
        <el-card style="margin-top: 30px" class="operate-container" shadow="never">
            <i class="el-icon-tickets"></i>
            <span>任务依赖表</span>
        </el-card>
        <div class="table-container">
            <el-table ref="taskTable"
                      :data="tasks"
                      stripe
                      style="width: 100%"
                      v-loading="listLoading"
                      border
            >
                <el-table-column label="任务ID" align="center">
                    <template slot-scope="scope">{{ scope.row.id }}</template>
                </el-table-column>
                <el-table-column label="任务名称" align="center">
                    <template slot-scope="scope">{{ scope.row.name }}</template>
                </el-table-column>
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <el-button
                            size="medium"
                            type="primary"
                            @click="handlePreviousId(scope.$index, scope.row)">修改前置
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <el-dialog
            :visible.sync="changeUndertakerDialogVisible"
            title="变更人员"
            width="40%">
            <div>
                <el-transfer filterable :filter-method="filterMethod" filter-placeholder="请输入姓名"
                             :titles="['员工名单', '负责人']"
                             v-model="changeUndertakerSelected" :data="employees"></el-transfer>
            </div>
            <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="changeUndertakerDialogVisible=false">取 消</el-button>
            <el-button type="primary" @click="handleChangeUndertakerConfirm">确 定</el-button>
        </span>
        </el-dialog>
        <el-dialog
            :visible.sync="previousIdDialogVisible"
            title="修改前置任务"
            width="40%">
            <div>
                <el-transfer filterable :filter-method="filterMethod" filter-placeholder="任务名"
                             :titles="['任务清单', '前置任务']"
                             v-model="previousIdSelected" :data="taskList"></el-transfer>
            </div>
            <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="previousIdDialogVisible=false">取 消</el-button>
            <el-button type="primary" @click="handlePreviousIdConfirm">确 定</el-button>
        </span>
        </el-dialog>

    </div>
</template>

<script>

    import Echarts from "./echarts";
    import {startProject, stopProject} from "@/api/project";
    import {listEmployee} from "@/api/employee";
    import {projectInfo} from "@/api/project";
    import {updateTask} from "@/api/task";

    export default {
        name: "projectDetail",
        components: {Echarts},
        data() {
            return {
                previousIdDialogVisible: false,
                previousIdSelected: [],
                changeUndertakerDialogVisible: false,
                listLoading: false,
                tasks: [],
                task: {},
                employees: [],
                taskStatus: {
                    "CREATED": 0,
                    "ACTIVE": 0,
                    "INACTIVE": 0,
                    "WAIT_COMMIT": 0,
                    "WAIT_REVIEW": 0,
                    "DONE": 0,
                    "REJECTED": 0,
                },
                changeUndertakerSelected: [],
                taskList: [],
                project: {
                    "id": "",
                    "name": "",
                    "undertaker": null, // 承办项目的经理
                    "status": "",         // 停止 - INACTIVE；正在进行 - ACTIVE
                    "doc": null
                },
                changeUndertakerRow: {}
            }
        },
        created() {
            this.getList();
        },
        computed: {
            stepStatus() {
                const status = this.project.status;
                if (status === 'INACTIVE') {
                    return 1;
                } else if (status === 'ACTIVE') {
                    return 2;
                } else if (status === 'DONE') {
                    return 3;
                }
            }
        },
        filters: {
            formatProjectStatus(status) {
                if (status === 'ACTIVE') {
                    return '运行中';
                } else if (status === 'INACTIVE') {
                    return '已暂停';
                } else if (status === 'DONE') {
                    return '已完成';
                } else {
                    return '不明';
                }
            },
            formatTaskStatus(status) {
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
                    return '不明';
                }
            },
            formatUndertaker(undertaker) {
                if (undertaker) {
                    return undertaker.name;
                } else {
                    return undertaker;
                }
            },
            formatProject(project) {
                return project.name;
            },
            formatDocument(document) {
                return document.url === null ? '未生成' : document.url;
            }
        },
        methods: {
            handlePreviousIdConfirm() {
                const task = this.task;
                updateTask(task.id, this.previousIdSelected, task.name, task.type, task.undertaker.id, task.status, status.project.id).then(response => {
                    if(response.status === 200) {
                        this.$message({
                            type:'success',
                            message: '设置成功'
                        })
                    } else {
                        this.$message.error(response.message);
                    }
                })
                this.previousIdDialogVisible = false;
            },
            handlePreviousId(index, row) {
                this.previousIdDialogVisible = true;
                this.task = row;
            },
            filterMethod(query, item) {
                return item.name.indexOf(query) > -1;
            },
            handleChangeUndertaker(index, row) {
                this.changeUndertakerDialogVisible = true;
                this.changeUndertakerSelected = []
                this.changeUndertakerRow = Object.assign(row);
                listEmployee().then(response => {
                    if (response.status === 200) {
                        this.employees = response.data;
                        for (let employee of this.employees) {
                            employee.label = employee.name;
                            employee.key = employee.id;
                        }
                    } else {
                        this.$message.error(response.message);
                    }
                })
            },
            handleChangeUndertakerConfirm() {
                if (this.changeUndertakerSelected.length > 1) {
                    this.$message({
                        type: 'warning',
                        message: '一个任务只能至多一个人完成'
                    })
                } else if (this.changeUndertakerSelected.length < 1) {
                    this.$message({
                        type: 'warning',
                        message: '请选择任务负责人'
                    })
                } else {
                    const row = this.changeUndertakerRow;
                    updateTask(row.id, row.previousId, row.name, row.type, this.changeUndertakerSelected[0], row.status, row.project.id).then(response => {
                        if (response.status === 200) {
                            this.$message({
                                'type': 'success',
                                'message': '指定成功'
                            })
                        } else {
                            this.$message.error(response.message);
                        }
                    })
                    this.changeUndertakerDialogVisible = false;
                }
            },
            handleStartProject(index, row) {
                this.$confirm('是否要开始项目', '提示', {
                    confirmButtonText: '是',
                    cancelButtonText: '否',
                    type: 'warning'
                }).then(() => {
                    startProject(row.id).then(response => {
                        const message = response.status === 200 ? '操作成功' : response.message;
                        const type = response.status === 200 ? 'success' : 'warning';
                        this.$message({
                            message: message,
                            type: type
                        });
                    })
                })
            },
            handleStopProject(index, row) {
                this.$confirm('是否要暂停项目', '提示', {
                    confirmButtonText: '是',
                    cancelButtonText: '否',
                    type: 'warning'
                }).then(() => {
                    stopProject(row.id).then(response => {
                        const message = response.status === 200 ? '操作成功' : response.message;
                        const type = response.status === 200 ? 'success' : 'warning';
                        this.$message({
                            message: message,
                            type: type
                        });
                    })
                })
            },
            isStart(status) {
                return status === "ACTIVE";
            },
            isStop(status) {
                return status === "INACTIVE";
            },
            getList() {
                projectInfo(this.$route.query.id).then(response => {
                    if (response.status === 200) {
                        const data = response.data.tasks;
                        this.taskList = Object.assign(data);
                        for (let item of this.taskList) {
                            item.key = item.id;
                            item.label = item.name;
                        }
                        let cnt = 0;
                        for (const item of data) {
                            cnt++;
                            this.taskStatus[item.status]++;
                            // for (const deps of item.previousId) {
                            //     let next = Object.assign(item);
                            //     next.previousId = deps;
                            //     this.tasks.push(next);
                            // }
                        }
                        for (let key in this.taskStatus) {
                            this.taskStatus[key] /= cnt / 100;
                            this.taskStatus[key] = parseFloat(this.taskStatus[key].toFixed(2));
                        }

                    } else {
                        this.$message.error(response.message);
                    }
                    const id = this.$route.query.id;
                    projectInfo(id).then(response => {
                        if (response.status === 200) {
                            this.project = response.data.info;
                        } else {
                            this.$message.error(response.message);
                        }
                    })
                })
            }
        }
    }
</script>

<style scoped>

</style>
