<template>
    <div class="app-container">
        <el-card class="operate-container" shadow="never">
            <i class="el-icon-tickets"></i>
            <span>经理列表</span>
            <el-button
                class="btn-add"
                type="info"
                style="margin-right: 30px"
                @click="handleAddManager"
                size="small">
                添加经理
            </el-button>
        </el-card>
        <div class="table-container">
            <el-table ref="managerManageTable"
                      :data="managers"
                      stripe
                      style="width: 100%"
                      v-loading="listLoading"
                      border>
                <el-table-column label="经理ID" align="center">
                    <template slot-scope="scope">{{ scope.row.id }}</template>
                </el-table-column>
                <el-table-column label="姓名"  align="center">
                    <template slot-scope="scope">
                        <span v-if="!scope.row.isEditing">{{ scope.row.name }}</span>
                        <el-input v-else v-model="scope.row.name"></el-input>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <el-button
                            size="medium"
                            type="primary"
                            @click="handleEdit(scope.$index, scope.row)">{{isEditing | formatEditting}}
                        </el-button>
                        <el-button
                            size="medium"
                            type="danger"
                            @click="handleDeleteManager(scope.$index, scope.row)">删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <el-dialog :visible.sync="addManagerDialogVisible"
                   title="添加员工"
                   width="40%">
            <el-form autoComplete="on"
                     :model="addManagerForm"
                     :rules="addManagerRules"
                     ref="addManagerForm"
                     style="margin: auto 20px"
                     label-position="left">
                <el-form-item prop="name" label="经理姓名" required>
                    <el-input name="name"
                              type="text"
                              v-model="addManagerForm.name"
                              autoComplete="on"
                              placeholder="经理姓名">
                    </el-input>
                </el-form-item>
                <el-form-item prop="uid" label="用户名">
                    <el-select v-model="addManagerForm.uid" placeholder="用户名">
                        <el-option
                            v-for="item in users"
                            :key="item.value"
                            :label="item.username"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="addManagerDialogVisible=false">取 消</el-button>
            <el-button type="primary" @click="handleAddManagerConfirm">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
    import {deleteManager, listManager, updateManager} from "@/api/manager";
    import {listUser} from "@/api/user";
    import {addManager} from "@/api/manager";

    export default {
        name: "manageEmployee",
        data() {
            const validateName = (rule, value, callback) => {
                if (value.length < 2) {
                    callback(new Error('姓名字数不能小于2'))
                } else {
                    callback()
                }
            };
            return {
                managers: [],
                listLoading: false,
                isEditing: false,
                editingRow: {},
                addManagerDialogVisible: false,
                addManagerForm: {
                    name: '',
                    uid: '',
                },
                addManagerRules: {
                    name: [{required: true, trigger: 'blur', validator: validateName}]
                },
                users: []
            }
        },
        created() {
            this.getList();
        },
        methods: {
            handleAddManager() {
                this.addManagerDialogVisible = true;
                listUser().then(response => {
                    if (response.status === 200) {
                        this.users = response.data;
                        for (let item of this.users) {
                            item.key = item.id;
                            item.label = item.username;
                        }
                    } else {
                        this.$message.error(response.message);
                    }
                })
            },
            handleAddManagerConfirm() {
                this.$refs['addManagerForm'].validate((valid) => {
                    if (valid) {
                        this.$confirm('是否进行操作', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(() => {
                            addManager(this.addManagerForm.name, this.addManagerForm.uid).then(response => {
                                if (response.status === 200) {
                                    this.$message({
                                        type: 'success',
                                        message: '操作成功'
                                    })
                                } else {
                                    this.$message.error(response.message);
                                }
                            });
                        });
                    } else {
                        this.$message({
                            message: '验证失败',
                            type: 'error',
                            duration: 1000
                        });
                        return false;
                    }
                });
                this.addManagerDialogVisible = false;
            },
            handleDeleteManager(index, row) {
                this.$confirm('是否要删除该经理', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    deleteManager(row.id).then(response => {
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
                        updateManager(row.id, row.name).then(response => {
                            if (response.status !== 200) {
                                this.$message.error(response.message);
                            } else {
                                this.$message({
                                    type: 'success',
                                    message: '更新成功'
                                })
                            }
                            this.$nextTick(() => {

                                this.editing = false;
                                this.row.editing = false;
                            })
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
                    this.$nextTick(()=> {

                        this.editing = true;
                        row.isEditing = true;
                    })
                    this.editingRow = Object.assign(row);
                }
            },
            getList() {
                this.listLoading = true;
                listManager().then(response => {
                    if (response.status !== 200) {
                        this.$message.error(response.message);
                    } else {
                        this.managers = response.data;
                        for (let item of this.managers) {
                            item['isEditing'] = false;
                        }
                    }
                    this.listLoading = false;
                })
            }
        },
        filters: {
            formatEditting(editing) {
                return editing ? '完成' : '编辑';
            },
        }
    }
</script>

<style scoped>

</style>
