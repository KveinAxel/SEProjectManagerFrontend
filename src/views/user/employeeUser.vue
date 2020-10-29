<template>
    <div>
        <el-card class="operate-container" shadow="never">
            <i class="el-icon-tickets"></i>
            <span>员工列表</span>
        </el-card>
        <el-card class="form-container" shadow="never">
            <el-form :model="userForm" :rules="rules" ref="userForm" label-width="150px">
                <el-form-item label="姓名：" prop="name">
                    <el-input v-model="userForm.name"></el-input>
                </el-form-item>
                <el-form-item label="用户名：" prop="userName">
                    <el-input v-model="userForm.username"></el-input>
                </el-form-item>
                <el-form-item label="角色：" prop="userName">
                    <template slot-scope="scope">{{userForm.roles | formatRoles}}</template>
                </el-form-item>
                <el-form-item label="头像：" prop="icon">
                    <pic-upload></pic-upload>
                </el-form-item>
                <el-form-item label="工作类型" required>
                    <el-radio-group v-model="userForm.type">
                        <el-radio label="A"></el-radio>
                        <el-radio label="B"></el-radio>
                        <el-radio label="C"></el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onSubmit('userForm')">提交</el-button>
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>

<script>
    import {isvalidUsername} from '@/utils/validate';
    import {employeeInfo, updateEmployee} from "@/api/employee";
    import PicUpload from "@/components/Upload/picUpload";
    import {updateUser} from "@/api/user";
    import store from "@/store";
    import {listUser} from "@/api/user";
    import {addEmployee} from "../../api/employee";

    const defaultUserForm = {
        name: '',
        username: '',
        roles: [],
        avatar: '',
        type: ''
    };
    export default {
        name: "employeeUsers",
        components: {PicUpload},
        data() {
            const validateUsername = (rule, value, callback) => {
                if (!isvalidUsername(value)) {
                    callback(new Error('请输入正确的用户名'))
                } else {
                    callback()
                }
            };

            return {
                userForm: Object.assign({}, defaultUserForm),
                rules: {
                    username: [{required: true, trigger: 'blur', validator: validateUsername}],
                    avatar: [
                        {required: true, message: '请上传用户头像logo', trigger: 'blur'}
                    ],
                },
            }
        },
        created() {
            employeeInfo(store.getters.eid).then(response => {
                if (response.status === 200) {

                    this.userForm = response.data.user;
                    this.userForm.name = response.data.name;
                    this.userForm.eid = response.data.id;
                    this.userForm.type = response.data.type;
                } else {
                    this.$message.error(response.message);
                }
            });
        },
        methods: {
            onSubmit(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$confirm('是否提交数据', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(() => {
                            const rid = window.resourceObject.id;
                            updateUser(this.userForm.id, this.userForm.username, rid).then(response => {
                                if (response.status === 200) {
                                    updateEmployee(this.userForm.eid, this.userForm.name, this.userForm.type).then(response => {
                                        if (response.status === 200) {
                                            this.$message({
                                                type: 'success',
                                                message: '更新成功'
                                            });
                                        } else {
                                            this.$message.error(response.message);
                                        }
                                    })
                                } else {
                                    this.$message.error(response.message)
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
            },
        },
        filters: {
            formatRoles(roles) {
                if (roles.includes("ROLE_ADMIN") ) {
                    return '管理员';
                } else if (roles.includes("ROLE_MANAGER")) {
                    return '经理';
                } else if (roles.includes("ROLE_EMPLOYEE")) {
                    return '员工';
                } else {
                    return '未定';
                }
            }
        }
    }
</script>

<style scoped>

</style>
