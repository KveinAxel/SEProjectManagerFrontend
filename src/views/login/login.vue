<template>
    <div>
        <el-card class="login-form-layout">
            <el-form autoComplete="on"
                     :model="loginForm"
                     :rules="loginRules"
                     ref="loginForm"
                     style="margin: auto 20px"
                     label-position="left">
                <div style="text-align: center">
                    <svg-icon icon-class="login" style="width: 56px;height: 56px;color: #409EFF"></svg-icon>
                </div>
                <h2 class="login-title color-main">项目管理系统</h2>
                <el-form-item prop="phone" required>
                    <el-input name="phone"
                              type="text"
                              v-model="loginForm.phone"
                              autoComplete="on"
                              placeholder="请输入手机号">
                        <span slot="prefix">
                            <svg-icon icon-class="user" class="color-main"></svg-icon>
                        </span>
                    </el-input>
                </el-form-item>
                <el-form-item prop="password" required>
                    <el-input name="password"
                              :type="pwdType"
                              @keyup.enter.native="handleLogin"
                              v-model="loginForm.password"
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
                <el-form-item style="margin-bottom: 40px;text-align: center">
                    <el-button style="width: 45%" type="primary" :loading="loading" @click="handleLogin">
                        登录
                    </el-button>
                    <el-button style="width: 45%" :loading="loading" @click="handleRegister">
                        注册
                    </el-button>
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>

<script>
    import login_center_bg from '@/assets/images/login_center_bg.png'
    import {login} from '@/api/user'
    import {isvalidPhoneNumber} from "@/utils/validate";

    export default {
        name: 'login',
        data() {
            const validatePhoneNumber = (rule, value, callback) => {
                if (!isvalidPhoneNumber(value)) {
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
                loginForm: {
                    phone: '',
                    password: '',
                },
                loginRules: {
                    phone: [{required: true, trigger: 'blur', validator: validatePhoneNumber}],
                    password: [{required: true, trigger: 'blur', validator: validatePass}]
                },
                loading: false,
                pwdType: 'password',
                login_center_bg,
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
            handleLogin() {
                this.$refs.loginForm.validate(valid => {
                    if (valid) {
                        this.loading = true;
                        let params = new URLSearchParams();
                        params.append('phone', this.loginForm.phone);
                        params.append('password', this.loginForm.password);
                        login(params).then(response => {
                            this.$message(response.message);
                            this.loading = false;
                            if(this.loginForm.admin === 'admin') {
                                this.$router.push({path: '/admin'})
                            } else {
                                this.$router.push({path: '/user'})
                            }
                        }).catch(response => {
                            this.loading = false;
                            this.$message({
                                message: response.message,
                                type: 'warning'
                            });

                        })

                    } else {
                        console.log('参数验证不合法！');
                        return false
                    }
                })
            },
            handleRegister() {
                this.$router.push({path: '/register'})
            }
        }
    }
</script>

<style scoped>
    .login-form-layout {
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
