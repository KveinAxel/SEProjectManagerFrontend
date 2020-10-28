<template>
    <div class="app-container">

        <el-card class="operate-container" shadow="never">
            <i class="el-icon-tickets"></i>
            <span>项目列表</span>
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
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <p>
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

    import {listProject} from "@/api/project";

    export default {
        name: 'employeeListProjectView',
        created() {
            this.getList();
        },
        data() {
            return {
                listLoading: true,
                projects: [],
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
            handleProjectInfo(index, row) {
                this.$router.push({path: '/project/detail', query: {id: row.id}});
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
