<template>
    <div>
        <el-card class="register-form-layout">
            <el-form autoComplete="on"
                     :model="registerForm"
                     :rules="registerRules"
                     ref="registerForm"
                     style="margin: auto 20px"
                     label-position="left">
                <div style="text-align: center">
                    <svg-icon icon-class="login" style="width: 56px;height: 56px;color: #409EFF"></svg-icon>
                </div>
                <h2 class="login-title color-main">项目管理系统</h2>
                <el-form-item prop="phone">
                    <el-input name="phone"
                              type="text"
                              v-model="registerForm.phone"
                              autoComplete="on"
                              placeholder="请输入手机号">
                        <span slot="prefix">
                            <svg-icon icon-class="user" class="color-main"></svg-icon>
                        </span>
                    </el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input name="password"
                              :type="pwdType"
                              v-model="registerForm.password"
                              autoComplete="on"
                              placeholder="请输入密码">
                        <span slot="prefix">
                            <svg-icon icon-class="password" class="color-main"></svg-icon>
                        </span>
                        <span slot="suffix" @click="showPwd">
                            <svg-icon icon-class="eye" class="color-main"></svg-icon>
                        </span>
                    </el-input>
                </el-form-item>
                <el-form-item prop="confirmPassword">
                    <el-input name="confirmPassword"
                              :type="pwdType"
                              v-model="registerForm.confirmPassword"
                              autoComplete="on"
                              placeholder="请输入确认密码">
                        <span slot="prefix">
                            <svg-icon icon-class="password" class="color-main"></svg-icon>
                        </span>
                        <span slot="suffix" @click="showPwd">
                            <svg-icon icon-class="eye" class="color-main"></svg-icon>
                        </span>
                    </el-input>
                </el-form-item>
                <el-form-item style="margin-bottom: 40px;text-align: center">
                    <el-button style="width: 45%" type="primary" :loading="loading"
                               @click.native.prevent="handleRegister">
                        注册
                    </el-button>
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>

<script>
    import {register} from "@/api/user";
    import {isvalidPhoneNumber} from "@/utils/validate";

    export default {
        name: "register",
        created() {
        },
        data() {
            const validatePhone = (rule, value, callback) => {
                if (!isvalidPhoneNumber(value)) {
                    callback(new Error('请输入正确的手机号'));
                } else {
                    callback();
                }
            };
            const validatePass = (rule, value, callback) => {
                if (value.length < 3) {
                    callback(new Error('密码不能小于3位'));
                } else {
                    callback()
                }
            };
            const validateConfirmPass = (rule, value, callback) => {
                if (value.length < 3) {
                    callback(new Error('密码不能小于3位'));
                } else {
                    callback()
                }
            };

            return {
                registerForm: {
                    phone: '',
                    password: '',
                    confirmPassword: '',
                },
                registerRules: {
                    phone: [{required: true, trigger: 'blur', validator: validatePhone}],
                    password: [{required: true, trigger: 'blur', validator: validatePass}],
                    confirmPassword: [{required: true, trigger: 'blur', validator: validateConfirmPass}],
                },
                loading: false,
                pwdType: 'password',
            }
        },
        methods: {
            showPwd() {
                if (this.pwdType === 'password') {
                    this.pwdType = ''
                } else {
                    this.pwdType = 'password'
                }
            },
            handleRegister() {
                this.$refs.registerForm.validate(valid => {
                    if (valid) {
                        this.loading = true;
                        if (this.registerForm.password === this.registerForm.confirmPassword) {
                            let params = new URLSearchParams();
                            params.append('phone', this.registerForm.phone);
                            params.append('password', this.registerForm.password);
                            register(params).then(response => {
                                this.$message(response.message);
                            });
                            this.$router.push({path: '/login'});
                        } else {
                            this.$message('请确保两次密码相同!');
                        }
                    } else {
                        console.log('参数验证不合法！');
                        return false
                    }
                })
            },
        }
    }
</script>

<style scoped>
    .register-form-layout {
        position: absolute;
        left: 0;
        right: 0;
        width: 360px;
        margin: 100px auto;
        border-top: 10px solid #409EFF;
    }

    .login-title {
        text-align: center;
    }
</style>
