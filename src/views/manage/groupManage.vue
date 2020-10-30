<template>
    <div class="app-container">
        <el-card class="operate-container" shadow="never">
            <i class="el-icon-tickets"></i>
            <span>组员列表</span>
            <el-button
                class="btn-add"
                type="info"
                style="margin-right: 30px"
                @click="handleAddEmployee"
                size="small">
                添加到组
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
                        <span>{{ scope.row.name }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="类型" align="center">
                    <template slot-scope="scope">
                        <span>{{ scope.row.type }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
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
            <el-transfer filterable :filter-method="filterMethod" filter-placeholder="请输入姓名"
                         :titles="['员工名单', '添加到组员']"
                         v-model="groupSelected" :data="totolEmployees"></el-transfer>
            <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="addEmployeeDialogVisible=false">取 消</el-button>
            <el-button type="primary" @click="handleAddEmployeeConfirm">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
    import {listEmployee} from "@/api/employee";
    import {listEmployeeOfManager, managerAddEmployee, managerRemoveEmployee} from "@/api/manager";
    import store from '@/store';

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
                totolEmployees: [],
                groupSelected: [],
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
            handleDeleteEmployee(index, row) {
                this.$confirm('是否将该组员移出组', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    managerRemoveEmployee(this.$store.getters.mid, row.id).then(response => {
                        if (response.status === 200) {
                            this.$message({
                                type:'success',
                                message: '移除成功'
                            })
                        } else {
                            this.$message.error(response.message);
                        }
                    })
                });
            },
            filterMethod(query, item) {
                return item.name.indexOf(query) > -1;
            },
            handleAddEmployee() {
                this.addEmployeeDialogVisible = true;
                listEmployee().then(response => {
                    if (response.status === 200) {
                        this.totolEmployees = response.data;
                        for (let item of this.totolEmployees) {
                            item.key = item.id;
                            item.value = item.id;
                            item.label = item.name;
                        }
                    } else {
                        this.$message.error(response.message);
                    }
                })
            },
            handleAddEmployeeConfirm() {
                let list = [];
                for (let eid of this.groupSelected) {
                    list.push(managerAddEmployee(this.$store.getters.mid, eid));
                }
                Promise.all(list).then(value => {

                    this.$message({
                        type: 'success',
                        message: '添加成功'
                    })
                })
                this.addEmployeeDialogVisible = false;
            },
            getList() {
                this.listLoading = true;
                listEmployeeOfManager(store.getters.mid).then(response => {
                    if (response.status === 200) {
                        this.employees = response.data;
                    } else {
                        this.$message.error(response.message);
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
