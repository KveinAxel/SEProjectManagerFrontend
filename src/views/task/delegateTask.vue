<template>
    <div class="app-container">

        <el-card class="operate-container" shadow="never">
            <i class="el-icon-tickets"></i>
            <span>委托任务</span>
        </el-card>
        <div class="table-container">
            <el-table ref="taskTable"
                      :data="tasks"
                      stripe
                      style="width: 100%"
                      v-loading="listLoading"
                      border>
                <el-table-column label="ID" align="center">
                    <template slot-scope="scope">{{ scope.row.id }}</template>
                </el-table-column>
                <el-table-column label="任务名称" align="center">
                    <template slot-scope="scope">{{ scope.row.name }}</template>
                </el-table-column>
                <el-table-column label="任务类型" align="center">
                    <template slot-scope="scope">{{ scope.row.type }}</template>
                </el-table-column>
                <!--                todo function: 增加点击项目经理名称跳转详细信息-->
                <el-table-column label="负责员工" width="120" align="center" v-if="canEdit">
                    <template slot-scope="scope">{{ scope.row.undertaker | formatUndertaker }}</template>
                </el-table-column>
                <el-table-column label="任务状态" width="120" align="center">
                    <template slot-scope="scope">{{ scope.row.status | formatStatus }}</template>
                </el-table-column>
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <p>
                            <el-button
                                size="medium"
                                type="info"
                                @click="handleShowDeps(scope.$index, scope.row)">查看依赖项目
                            </el-button>
                            <el-button
                                size="medium"
                                type="primary"
                                @click="handleWithdraw(scope.$index, scope.row)">收回任务
                            </el-button>
                        </p>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>

import {confirmTask, finishTask, rejectTask, updateTask} from "@/api/task";

export default {
    name: 'delegateView',
    created() {
        this.getList();
    },
    data() {
        return {
            listLoading: true,
            tasks: [],
            canEdit: true, // todo handle auth can edit priviledge
            editingRow: {},
            editing: false,

        }
    },
    methods: {
        handleInfo(index, row) {
            // todo
        },
        handleWithdraw(index, row) {
            // todo
        },
        handleShowDeps(index, row) {
            // todo
        },
        getList() {
            // todo get task list
            // for test
            this.listLoading = true;
            this.tasks = Object.assign(this.mockTasks);

            const len = this.tasks.length;
            for (let i = 0; i < len; i++) {
                this.tasks[i]['editing'] = false;
            }
            this.listLoading = false;
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
            return undertaker === null ? '无' : undertaker;
        }
    }
}
</script>

<style scoped>
</style>
