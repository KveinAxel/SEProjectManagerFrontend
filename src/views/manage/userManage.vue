<template>
    <div class="app-container">
        <el-card class="operate-container" shadow="never">
            <i class="el-icon-tickets"></i>
            <span>用户列表</span>
            <el-button
                class="btn-add"
                type="info"
                style="margin-right: 30px"
                @click="handleAddUser"
                size="small">
                添加用户
            </el-button>
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
        <el-dialog :visible.sync="addUserDialogVisible"
                   title="用户"
                   width="40%">
            <el-form autoComplete="on"
                     :model="addUserForm"
                     :rules="addUserRules"
                     ref="addUserForm"
                     style="margin: auto 20px"
                     label-position="left">
                <el-form-item prop="username" label="用户名" required>
                    <el-input name="username"
                              type="text"
                              v-model="addUserForm.username"
                              autoComplete="on"
                              placeholder="用户名">
                    </el-input>
                </el-form-item>
                <el-form-item prop="password" label="密码">
                    <el-input name="password"
                              type="text"
                              v-model="addUserForm.password"
                              autoComplete="on"
                              placeholder="密码">
                    </el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="addUserDialogVisible=false">取 消</el-button>
            <el-button type="primary" @click="handleAddUserConfirm">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
    import {deleteUser, listUser, updatePassword, updateUser} from "@/api/user";
    import {addUser} from "@/api/user";
    import {isvalidUsername} from "../../utils/validate";

    export default {
        name: "manage",
        data() {
            const validateUsername = (rule, value, callback) => {
                if (!isvalidUsername(value)) {
                    callback(new Error('请输入正确的用户名'))
                } else {
                    callback()
                }
            };
            const validatePass = (rule, value, callback) => {
                if (value.length < 3) {
                    callback(new Error('密码不能小于3位'))
                } else {
                    callback()
                }
            };
            return {
                users:[],
                listLoading: false,
                isEditing: false,
                editingRow: {},
                addUserForm: {
                    username: '',
                    password: '',
                },
                addUserDialogVisible: false,
                addUserRules: {
                    username: [{required: true, trigger: 'blur', validator: validateUsername}],
                    password: [{required: true, trigger: 'blur', validator: validatePass}]
                }
            }
        },
        created() {
            this.getList();
        },
        methods: {
            handleAddUser() {
                this.addUserDialogVisible = true;
            },
            handleAddUserConfirm() {
                this.$refs.addUserForm.validate(valid => {
                    if (valid) {
                        this.loading = true;
                        addUser(this.addUserForm.username, this.addUserForm.password).then(response => {
                            if (response.status === 200) {
                                this.$message({
                                    type: 'success',
                                    message: '添加成功'
                                })
                            } else {
                                this.$message.error(response.message);
                            }
                            this.loading = true;
                            this.addUserDialogVisible = false;
                        });

                    } else {
                        console.log('参数验证不合法！');
                        return false
                    }
                })
            },
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
                    return '' + avatar.url;
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
