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
                v-show="canEdit"
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
<!--                todo function: 增加点击项目经理名称跳转详细信息-->
                <el-table-column label="负责经理" width="120" align="center" v-if="canEdit">
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
                                v-if="isStop(scope.row.status) && canEdit"
                                @click="handleStartProject(scope.$index, scope.row)">开始
                            </el-button>
                            <el-button
                                size="medium"
                                type="info"
                                v-if="isStart(scope.row.status) && canEdit"
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
    </div>
</template>

<script>

import {generateProject, startProject, stopProject} from "@/api/project";
import {listProject} from "@/api/project";
import store from '@/store'

export default {
    name: 'listProjectView',
    created() {
        this.getList();
    },
    computed: {
        canEdit() {
            return store.getters.roles.indexOf('ROLE_MANAGER') !== -1;
        },
    } ,
    data() {
        return {
            listLoading: true,
            projects: []
        }
    },
    methods: {
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
            // todo 变更api
            this.$confirm('是否要生成项目', '提示', {
                confirmButtonText: '是',
                cancelButtonText: '否',
                type: 'warning'
            }).then(() => {
                generateProject().then(response => {
                    const message = response.status === 200 ? '操作成功' : response.message;
                    const type = response.status === 200 ? 'success' : 'warning';
                    this.$message({
                        message: message,
                        type: type
                    });
                })
            })
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
        handleProjectInfo() {
            // todo handle push to project info views
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
