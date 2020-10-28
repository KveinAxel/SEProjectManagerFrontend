<template>
    <div class="app-container">
        <el-card class="operate-container" shadow="never">
            <i class="el-icon-tickets"></i>
            <span>委托任务</span>
        </el-card>
        <div class="table-container">
            <el-table ref="taskTable"
                      :data="delegates"
                      stripe
                      style="width: 100%"
                      v-loading="listLoading"
                      border>
                <el-table-column label="ID" width="280" align="center">
                    <template slot-scope="scope">{{ scope.row.task.id }}</template>
                </el-table-column>
                <el-table-column label="任务名称" width="140" align="center">
                    <template slot-scope="scope">{{ scope.row.task.name }}</template>
                </el-table-column>
                <el-table-column label="任务类型" width="120" align="center">
                    <template slot-scope="scope">{{ scope.row.task.type }}</template>
                </el-table-column>
                <el-table-column label="负责员工" width="280" align="center">
                    <template slot-scope="scope">{{ scope.row.delegateTo.name}}</template>
                </el-table-column>
                <el-table-column label="任务状态" width="120" align="center">
                    <template slot-scope="scope">{{ scope.row.task.status | formatStatus }}</template>
                </el-table-column>
                <el-table-column label="所属项目" width="120" align="center">
                    <template slot-scope="scope">{{ scope.row.task.project | formatProject }}</template>
                </el-table-column>
                <el-table-column label="任务文档" width="120" align="center">
                    <template slot-scope="scope">
                        <a v-if="scope.row.doc !== null" :href="getUrl(scope.row.task.pending)">{{ scope.row.pending |
                            formatDocument }}</a>
                        <span v-else>{{ scope.row.task.pending | formatDocument }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <p>
                            <el-button
                                size="medium"
                                type="info"
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

    import store from "@/store";
    import {withdrawTask} from "@/api/task";
    import {listDelegate} from "@/api/employee";

    export default {
        name: 'delegateTask',
        data() {
            return {
                listLoading: true,
                tasks: [],
                delegates: [],
            }
        },
        created() {
            this.getList();
        },
        methods: {
            getUrl(doc) {
                if (doc) {
                    return doc.url;
                } else {
                    return doc;

                }
            },
            handleInfo(row, column, event) {
                this.$router.push({path: '/task/taskDetail', query: {task: row}});
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
            getList() {
                this.listLoading = true;
                listDelegate(store.getters.eid).then(response => {
                    if (response.status !== 200) {
                        this.$message.error(response.message);
                    } else {
                        this.delegates = response.data;
                        for (let item of this.delegates) {
                            this.tasks.push(item.task);
                        }
                    }
                    this.listLoading = false;
                })
            },
            canDelegate(delegate) {
                return delegate !== null;
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
                if (document) {

                    return document.url === null ? '未提交' : document.url;
                } else {
                    return '未提交';
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
