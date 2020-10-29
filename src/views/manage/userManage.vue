<template>
    <div class="app-container">
        <el-card class="operate-container" shadow="never">
            <i class="el-icon-tickets"></i>
            <span>用户列表</span>
        </el-card>
        <div class="table-container">
            <el-table ref="userManageTable"
                      :data="users"
                      stripe
                      style="width: 100%"
                      v-loading="listLoading"
                      border>
                <el-table-column label="头像" width="120" align="center">
                    <template slot-scope="scope">
                        <el-avatar :size="50" :src="getURL(scope.row.avatar)"></el-avatar>
                    </template>
                </el-table-column>
                <el-table-column label="ID" align="center">
                    <template slot-scope="scope">{{ scope.row.id }}</template>
                </el-table-column>
                <el-table-column label="用户名" align="center">
                    <template slot-scope="scope">
                        <span v-if="!scope.row.isEditing">{{ scope.row.username }}</span>
                        <el-input v-else v-model="scope.row.username"></el-input>
                    </template>
                </el-table-column>
                <el-table-column label="角色" align="center">
                    <template slot-scope="scope">{{ scope.row.roles | formatRoles }}</template>
                </el-table-column>
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <el-button
                            size="medium"
                            type="primary"
                            @click="handleEdit(scope.$index, scope.row)">{{scope.row.isEditing | formatEditting}}
                        </el-button>
                        <el-button
                            size="medium"
                            type="warning"
                            @click="handleChangePassword(scope.$index, scope.row)">改密
                        </el-button>
                        <el-button
                            size="medium"
                            type="danger"
                            @click="handleDeleteUser(scope.$index, scope.row)">删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>
<script>
    import {deleteUser, listUser, updatePassword, updateUser} from "@/api/user";

    export default {
        name: "manage",
        data() {
            return {
                listLoading: false,
                isEditing: false,
                editingRow: {},
            }
        },
        created() {
            this.getList();
        },
        methods: {

            handleChangePassword(index, row) {
                this.$prompt('请输入新密码', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    inputPattern: /.{3,16}/,
                    inputErrorMessage: '密码格式不正确'
                }).then(({value}) => {
                    updatePassword(row.id, row.username, value).then(response => {
                        if (response.status !== 200) {
                            this.$message.error(response.message);
                        } else {
                            this.$message({
                                type: 'success',
                                message: '修改成功'
                            })
                        }
                    });
                });
            },
            getURL(avatar) {
                if (avatar) {
                    return '/api' + avatar.url;
                } else {
                    return avatar;
                }
            },
            handleDeleteUser(index, row) {
                this.$confirm('是否要删除该用户', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    deleteUser(row.id).then(response => {
                        if (response.status !== 200) {
                            this.$message.error(response.message);
                        } else {
                            this.$message({
                                type: 'success',
                                message: '删除成功'
                            })
                        }
                    });
                });
            },
            handleEdit(index, row) {
                if (row.isEditing) {
                    this.$confirm('是否要提交变更', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        updateUser(row.id, row.username).then(response => {
                            if (response.status !== 200) {
                                this.$message.error(response.message);
                            } else {
                                this.$message({
                                    type: 'success',
                                    message: '更新成功'
                                })
                            }
                            this.editing = false;
                            this.row.editing = false;
                        });
                    }).catch(() => {
                        row = Object.assign(this.editingRow);
                        this.editing = false;
                        row.editing = false;
                    });
                } else if (this.isEditing) {
                    this.$message({
                        type: 'warning',
                        message: '一次只能修改一行'
                    });
                } else {
                    this.editing = true;
                    this.editingRow = Object.assign(row);
                    row.isEditing = true;
                }
            },
            getList() {
                this.listLoading = true;
                listUser().then(response => {
                    if (response.status !== 200) {
                        this.$message.error(response.message);
                    } else {
                        this.users = response.data;
                        for (let item of this.users) {
                            item['isEditing'] = false;
                        }
                    }
                    this.listLoading = false;
                })
            }
        },
        filters: {
            formatRoles(roles) {
                let s = '';
                for (let role of roles) {
                    if (role === 'ROLE_ADMIN') {
                        s += '管理员\n';
                    } else if (role === 'ROLE_MANAGER') {
                        s += '经理\n';
                    } else if (role === 'ROLE_EMPLOYEE') {
                        s += '员工\n';
                    }
                }
                if (s.length > 1) {
                    s = s.substr(0, s.length - 1);
                }
                return s;
            },
            formatEditting(editing) {
                return editing ? '完成' : '编辑';
            },
        }
    }
</script>

<style scoped>

</style>
