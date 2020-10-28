<template>
    <div class="app-container">

        <el-card class="operate-container" shadow="never">
            <i class="el-icon-tickets"></i>
            <span>项目列表</span>
            <el-button
                class="btn-add"
                type="info"
                style="margin-right: 30px"
                @click="handleAddProject"
                size="small">
                生成项目
            </el-button>
        </el-card>
        <div class="table-container">
            <el-table ref="projectTable"
                      :data="projects"
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
                    <template slot-scope="scope">{{ scope.row.status | formatStatus }}</template>
                </el-table-column>
                <el-table-column label="项目文档" width="120" align="center">
                    <template slot-scope="scope">
                        <a v-if="scope.row.doc !== null" :href="scope.row.doc.url">{{ scope.row.doc | formatDocument }}</a>
                        <span v-else>{{ scope.row.doc | formatDocument }}</span>
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
                            <el-button
                                size="medium"
                                type="primary"
                                @click="handleProjectInfo(scope.$index, scope.row)">查看
                            </el-button>
                        </p>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <el-dialog
            :visible.sync="generateProjectDialogVisible"
            title="生成项目"
            width="40%">
            <el-form autoComplete="on"
                     :model="genProjectForm"
                     ref="genProjectForm"
                     style="margin: auto 20px"
                     label-position="left">
                <el-form-item label="生成任务总数" prop="total">
                    <el-input-number name="totalCount" v-model="genProjectForm.total"></el-input-number>
                </el-form-item>
                <el-form-item label="A" prop="A">
                    <el-radio-group v-model="genProjectForm.aType">
                        <el-radio label="true">随机</el-radio>
                        <el-radio label="false">不随机</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="数量" prop="aCount">
                    <el-input-number v-model="genProjectForm.taskCounts.A" :disabled="genProjectForm.aType"></el-input-number>
                </el-form-item>
                <el-form-item label="B" prop="B">
                    <el-radio-group v-model="genProjectForm.bType">
                        <el-radio label="true">随机</el-radio>
                        <el-radio label="false">不随机</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="数量" prop="bCount">
                    <el-input-number v-model="genProjectForm.taskCounts.B" :disabled="genProjectForm.bType"></el-input-number>
                </el-form-item>
                <el-form-item label="C" prop="C">
                    <el-radio-group v-model="genProjectForm.cType">
                        <el-radio label="true">随机</el-radio>
                        <el-radio label="false">不随机</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="数量" prop="cCount">
                    <el-input-number v-model="genProjectForm.taskCounts.C" :disabled="genProjectForm.cType"></el-input-number>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="generateProjectDialogVisible=false">取 消</el-button>
            <el-button type="primary" @click="handleGenProjectConfirm">确 定</el-button>
        </span>
        </el-dialog>
    </div>
</template>

<script>

import {generateProject, startProject, stopProject, listProject} from "@/api/project";
import store from '@/store'

export default {
    name: 'managerListProjectView',
    created() {
        this.getList();
    },
    data() {
        return {
            listLoading: true,
            projects: [],
            genProjectForm: {
                total: 20,
                'taskCounts': {
                    'A': 20,
                    aType: false,
                    'B': null,
                    bType: true,
                    'C': null,
                    cType: true,
                }
            },
            defaultGenProjectForm: {
                total: 20,
                'taskCounts': {
                    'A': 20,
                    aType: false,
                    'B': null,
                    bType: true,
                    'C': null,
                    cType: true,
                }
            },

        }
    },
    methods: {
        handleGenProjectConfirm() {
            this.$confirm('是否确定生成项目', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let A = this.genProjectForm.taskCounts.aType ? null : this.genProjectForm.taskCounts.A;
                let B = this.genProjectForm.taskCounts.bType ? null : this.genProjectForm.taskCounts.B;
                let C = this.genProjectForm.taskCounts.cType ? null : this.genProjectForm.taskCounts.C;
                generateProject(this.genProjectForm.total, A, B, C).then(response => {
                    if (response.status !== 200) {
                        this.$message.error(response.message);
                    }
                });
            });
            this.generateProjectDialogVisible = false;
        },
        getList() {
            this.listLoading = true;
            listProject().then(response => {
                if (response.status === 200) {
                    this.projects = response.data;
                } else {
                    this.$message.error(response.message);
                }
            })
            this.listLoading = false;
        },
        handleAddProject() {
            this.generateProjectDialogVisible = true;
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
        handleProjectInfo(index, row) {
            this.$router.push({path: '/project/detail', query: {id: row.id}});
        },
        isStart(status) {
            return status === "ACTIVE";
        },
        isStop(status) {
            return status === "INACTIVE";
        },
    },
    filters: {
        formatStatus(status) {
            return status === "ACTIVE" ? "运行中" : "已暂停";
        },
        formatUndertaker(undertaker) {
            return undertaker.name;
        },
        formatProject(project) {
            return project.name;
        },
        formatDocument(document) {
            return document.url === null ? '未提交' : document.url;
        }
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
