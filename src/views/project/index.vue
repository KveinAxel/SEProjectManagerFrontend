<template>
    <div class="app-container">
        <el-card class="filter-container" shadow="never" style="margin-top: 30px">
            <div>
                <i class="el-icon-search"></i>
                <span>筛选搜索</span>
                <el-button
                    style="float: right"
                    @click="handleSearchList()"
                    type="primary"
                    size="small">
                    查询结果
                </el-button>
                <el-button
                    style="float: right;margin-right: 15px"
                    @click="handleResetSearch()"
                    size="small">
                    重置
                </el-button>
            </div>
            <!--        todo Search Frame-->
            <!--                    -->
            <!--            <div style="margin-top: 30px">-->
            <!--                <el-form :inline="true" :model="searchQuery" size="small" label-width="100px">-->
            <!--                    <el-form-item label="航班号：">-->
            <!--                        <el-input style="width: 180px" v-model="searchQuery.flight_number" placeholder="航班号"></el-input>-->
            <!--                    </el-form-item>-->
            <!--                </el-form>-->
            <!--            </div>-->
        </el-card>

        <el-card class="operate-container" shadow="never">
            <i class="el-icon-tickets"></i>
            <span>项目列表</span>
            <el-button
                class="btn-add"
                type="info"
                @click="handleAddProject"
                v-show="canEdit"
                size="mini">
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
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <p>
                            <el-button
                                size="medium"
                                type="info"
                                v-show="isStop(scope.row.status) && canEdit"
                                @click="handleStartProject(scope.$index, scope.row)">开始
                            </el-button>
                            <el-button
                                size="medium"
                                type="info"
                                v-show="isStart(scope.row.status) && canEdit"
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

import {generateProject, startProject, stopProject} from "../../api/project";

export default {
    name: 'listProjectView',
    created() {
        this.getList();
    },
    data() {
        return {
            listLoading: true,
            projects: [],
            canEdit: true, // todo handle auth can edit priviledge
            mockTasks: [
                {
                    "id": "ff808081755a9f3101755ab92ce00001",
                    "previousId": [],
                    "name": "TaskA",
                    "type": "A",
                    "undertaker": null, // 任务负责人
                    "status": "CREATED",    // CREATED - 创建；ACTIVE - 执行中；WAIT_COMMIT - 等待提交；DONE - 完成；REJECTED - 被打回
                },
                {
                    "id": "5818852a16a511ebadc10242ac120002",
                    "previousId": ["ff808081755a9f3101755ab92ce00001"],
                    "name": "TaskB",
                    "type": "B",
                    "undertaker": null, // 任务负责人
                    "status": "CREATED",    // CREATED - 创建；ACTIVE - 执行中；WAIT_COMMIT - 等待提交；DONE - 完成；REJECTED - 被打回
                },
                {
                    "id": "796d1f4216a511ebadc10242ac120002",
                    "previousId": ["ff808081755a9f3101755ab92ce00001", "5818852a16a511ebadc10242ac120002"],
                    "name": "TaskC",
                    "type": "C",
                    "undertaker": null, // 任务负责人
                    "status": "CREATED",    // CREATED - 创建；ACTIVE - 执行中；WAIT_COMMIT - 等待提交；DONE - 完成；REJECTED - 被打回
                },
            ],
            mockManagers: [
                {
                    "id": "ff808081755a9f3101755ab92ce00001",
                    "name": "manager"
                }
            ]

        }
    },
    methods: {
        getList() {
            this.listLoading = true;
            // todo get project list
            // for test
            this.projects = [
                {
                    "id": "ff808081755a9f3101755ab92ce00001",
                    "name": "project1",
                    "undertaker": Object.assign(this.mockManagers[0]), // 承办项目的经理
                    "status": "INACTIVE",         // 停止 - INACTIVE；正在进行 - ACTIVE
                },
                {
                    "id": "ff808081755a9f3101755ab92ce00001",
                    "name": "project2",
                    "undertaker": Object.assign(this.mockManagers[0]), // 承办项目的经理
                    "status": "INACTIVE",         // 停止 - INACTIVE；正在进行 - ACTIVE
                },
                {
                    "id": "ff808081755a9f3101755ab92ce00001",
                    "name": "project3",
                    "undertaker": Object.assign(this.mockManagers[0]), // 承办项目的经理
                    "status": "ACTIVE",         // 停止 - INACTIVE；正在进行 - ACTIVE
                },
            ]
            this.listLoading = false;
        },
        handleSearchList() {
            this.$confirm('是否要进行查询', '提示', {
                confirmButtonText: '是',
                cancelButtonText: '否',
                type: 'warning'
            }).then(() => {
                // todo handle search
            })
        },
        handleAddProject() {
            this.$confirm('是否要生成项目', '提示', {
                confirmButtonText: '是',
                cancelButtonText: '否',
                type: 'warning'
            }).then(() => {
                generateProject().then(response => {
                    const message = response.status === '200' ? '操作成功' : response.message;
                    const type = response.status === '200' ? 'success' : 'warning';
                    this.$message({
                        message: message,
                        type: type
                    });
                })
            })
        },
        handleResetSearch() {
            // todo reset search
            this.getList();
        },
        handleStartProject(index, row) {
            this.$confirm('是否要开始项目', '提示', {
                confirmButtonText: '是',
                cancelButtonText: '否',
                type: 'warning'
            }).then(() => {
                startProject(row.id).then(response => {
                    const message = response.status === '200' ? '操作成功' : response.message;
                    const type = response.status === '200' ? 'success' : 'warning';
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
                    const message = response.status === '200' ? '操作成功' : response.message;
                    const type = response.status === '200' ? 'success' : 'warning';
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
        }
    }
}
</script>

<style scoped>
</style>
