<template>
    <el-card class="form-container" shadow="never">
        <el-form :model="userForm" :rules="rules" ref="userForm" label-width="150px">
            <el-form-item label="姓名："   prop="name">
                <el-input v-model="userForm.name"></el-input>
            </el-form-item>
            <el-form-item label="用户名：" prop="userName">
                <el-input v-model="userForm.username"></el-input>
            </el-form-item>
            <el-form-item label="角色：" prop="role">
                <template slot-scope="scope">{{userForm.roles | formatRoles}}</template>
            </el-form-item>
            <el-form-item label="头像：" prop="avatar">
                <template slot-scope="scope"><pic-upload v-model="userForm.url"></pic-upload></template>
            </el-form-item>

            <el-form-item>
                <el-button type="primary" @click="onSubmit('userForm')">提交</el-button>
            </el-form-item>
        </el-form>
        <el-dialog :visible.sync="addManagerDialogVisible">
            title="添加经理"
            width="40%">
            <el-form autoComplete="on"
                     :model="addManagerForm"
                     :rules="addManagerRules"
                     ref="addEmployeeForm"
                     style="margin: auto 20px"
                     label-position="left">
                <el-form-item prop="name" required>
                    <el-input name="name"
                              type="text"
                              v-model="addManagerRules.name"
                              autoComplete="on"
                              placeholder="员工姓名">
                    </el-input>
                </el-form-item>
                <el-form-item prop="uid">
                    <el-select v-model="addManagerRules.uid" placeholder="员工id">
                        <el-option
                            v-for="item in this.users"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="addEmployeeDialogVisible=false">取 消</el-button>
            <el-button type="primary" @click="handleAddManagerConfirm">确 定</el-button>
            </span>
        </el-dialog>
    </el-card>
</template>

<script>
    import {isvalidUsername} from '@/utils/validate';
    import {managerInfo, updateManager} from "@/api/manager";
    import PicUpload from "@/components/Upload/picUpload";
    import {updateUser} from "@/api/user";
    import store from "@/store";

    const defaultUserForm = {
        name:'',
        username:'',
        roles:[],
        avatar:'',
    };
    export default {
        name: "managerUsers",
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
                addManagerDialogVisible: false,
                addManagerForm: {

                },
                addManagerRules: {

                },
                userForm:Object.assign({},defaultUserForm),
                rules: {
                    username: [{required: true, trigger: 'blur', validator: validateUsername}],
                    avatar: [
                        {required: true, message: '请上传用户头像logo', trigger: 'blur'}
                    ],
                }
            }
        },
        created() {
            managerInfo(store.getters.mid).then(response => {
                this.userForm = response.data.user;
                this.userForm.name = response.data.name;
                this.userForm.mid = response.data.id;
                if (this.userForm.avatar === null) {
                    this.userForm.avatar = {
                        url: ''
                    }
                }
            });
        },
        methods: {
            onSubmit(formName) {
                this.avatar = window.resourceObject;
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$confirm('是否提交数据', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(() => {
                            updateUser(this.userForm.id, this.userForm.username).then(response => {
                                if (response.status === 200) {
                                    updateManager(this.userForm.mid).then(response => {
                                        if (response.status === 200) {
                                            this.$message({
                                                type: 'success',
                                                message: '更新成功'
                                            });
                                            this.$router.back();
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
                            duration:1000
                        });
                        return false;
                    }
                });
            },
        },
        filters: {
            formatRoles(roles) {
                if (roles.indexOf("ROLE_ADMIN")) {
                    return '管理员';
                } else if (roles.indexOf("ROLE_MANAGER")) {
                    return '经理';
                } else if (roles.indexOf("ROLE_EMPLOYEE")) {
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
