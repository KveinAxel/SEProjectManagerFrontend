<template>
    <div class="app-container">
        <el-card class="operate-container" shadow="never">
            <i class="el-icon-tickets"></i>
            <span>员工列表</span>
            <el-button
                class="btn-add"
                type="info"
                style="margin-right: 30px"
                @click="handleAddEmployee"
                size="small">
                添加员工
            </el-button>
        </el-card>
        <div class="table-container">
            <el-table ref="employeeManageTable"
                      :data="employees"
                      stripe
                      style="width: 100%"
                      v-loading="listLoading"
                      border>
                <el-table-column label="员工ID" align="center">
                    <template slot-scope="scope">{{ scope.row.id }}</template>
                </el-table-column>
                <el-table-column label="姓名" align="center">
                    <template slot-scope="scope">
                        <span v-if="!scope.row.isEditing">{{ scope.row.name }}</span>
                        <el-input v-else v-model="scope.row.name"></el-input>
                    </template>
                </el-table-column>
                <el-table-column label="类型" align="center">
                    <template slot-scope="scope">
                        <span v-if="!scope.row.isEditing">{{ scope.row.type }}</span>
                        <el-select v-else v-model="scope.row.type" placeholder="请选择">
                            <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column label="上司" align="center">
                    <template slot-scope="scope">{{ scope.row.manager | formatManager }}</template>
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
                            @click="handleDeleteEmployee(scope.$index, scope.row)">删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <el-dialog :visible.sync="addEmployeeDialogVisible"
                   title="添加员工"
                   width="40%">
            <el-form autoComplete="on"
                     :model="addEmployeeForm"
                     :rules="addEmployeeRules"
                     ref="addEmployeeForm"
                     style="margin: auto 20px"
                     label-position="left">
                <el-form-item prop="name" label="员工姓名" required>
                    <el-input name="name"
                              type="text"
                              v-model="addEmployeeForm.name"
                              autoComplete="on"
                              placeholder="员工姓名">
                    </el-input>
                </el-form-item>
                <el-form-item prop="type" label="工作类型" required>
                    <el-radio-group v-model="addEmployeeForm.type">
                        <el-radio label="A"></el-radio>
                        <el-radio label="B"></el-radio>
                        <el-radio label="C"></el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item prop="uid" label="用户名">
                    <el-select v-model="addEmployeeForm.uid" placeholder="用户名">
                        <el-option
                            v-for="item in users"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="addEmployeeDialogVisible=false">取 消</el-button>
            <el-button type="primary" @click="handleAddEmployeeConfirm">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
    import {addEmployee, deleteEmployee, listEmployee, updateEmployee} from "@/api/employee";
    import {listUser} from "@/api/user";

    export default {
        name: "employeeManage",
        data() {
            const validateName = (rule, value, callback) => {
                if (value.length < 2) {
                    callback(new Error('姓名字数不能小于2'))
                } else {
                    callback()
                }
            };
            return {
                employees: [],
                listLoading: false,
                isEditing: false,
                editingRow: {},
                options: [{
                    value: 'A',
                    label: 'A'
                }, {
                    value: 'B',
                    label: 'B'
                }, {
                    value: 'C',
                    label: 'C'
                }],
                addEmployeeRules: {
                    name: [{required: true, trigger: 'blur', validator: validateName}]
                },
                addEmployeeForm: {
                    name: '',
                    type: '',
                    uid: '',
                },
                addEmployeeDialogVisible: false,
                users: [],
            }
        },
        created() {
            this.getList();
        },
        methods: {

            handleAddEmployee() {
                this.addEmployeeDialogVisible = true;
                listUser().then(response => {
                    if (response.status === 200) {
                        this.users = response.data;
                        for (let item of this.users) {
                            item.key = item.id;
                            item.value = item.id;
                            item.label = item.username;
                        }
                    } else {
                        this.$message.error(response.message);
                    }
                })
            },
            handleAddEmployeeConfirm() {
                this.$refs['addEmployeeForm'].validate((valid) => {
                    if (valid) {
                        this.$confirm('是否进行操作', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(() => {
                            addEmployee(this.addEmployeeForm.uid, this.addEmployeeForm.name, this.addEmployeeForm.type).then(response => {
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
                this.addEmployeeDialogVisible = false;
            },
            handleDeleteEmployee(index, row) {
                this.$confirm('是否要删除该员工', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    deleteEmployee(row.id).then(response => {
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
                        updateEmployee(row.id, row.name, row.type).then(response => {
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
                listEmployee().then(response => {
                    if (response.status !== 200) {
                        this.$message.error(response.message);
                    } else {
                        this.employees = response.data;
                        for (let item of this.employees) {
                            item['isEditing'] = false;
                        }
                    }
                    this.listLoading = false;
                })
            }
        },
        filters: {
            formatManager(manager) {
                if (manager) {
                    return manager.name;
                } else {
                    return manager;
                }
            }, formatEditting(editing) {
                return editing ? '完成' : '编辑';
            },
        }
    }
</script>

<style scoped>

</style>
