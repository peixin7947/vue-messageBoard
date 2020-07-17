<template>
    <el-row type="flex" class="row-bg" justify="center">
        <el-col :span="8" class="el-col bg-purple-light">
            <h2 class="title">注册留言板账号</h2>
            <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="">
                <el-form-item label="用户名" prop="username">
                    <el-input type="text" v-model="ruleForm.username" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input type="text" v-model="ruleForm.email" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input type="password" v-model="ruleForm.password" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="确认密码" prop="rePassword">
                    <el-input type="password" v-model="ruleForm.rePassword" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button size="medium" type="primary" @click="submitForm('ruleForm')">注册</el-button>
                    <el-button size="medium" @click="resetForm('ruleForm')">重置</el-button>
                </el-form-item>
                <el-form-item>
                    <el-link class="link" type="primary">
                        <router-link to="/login">返回登录</router-link>
                    </el-link>
                </el-form-item>

            </el-form>
        </el-col>
    </el-row>
</template>

<script>
    import {validatePassword, validateUsername, validateEmail} from '@/utils/validate.js';

    export default {
        data() {
            const validateRePassword = (rule, value, callback) => {
                if (this.ruleForm.password !== this.ruleForm.rePassword) {
                    callback(new Error('两次输入的密码不一样'));
                }
                callback();
            }
            return {
                ruleForm: {
                    username: '',
                    password: '',
                    rePassword: '',
                    email: '',
                },
                rules: {
                    username: [
                        {required: true, message: '请输入用户名', trigger: 'blur'},
                        {
                            min: 3, max: 18, message: '用户名必须在3-18个字符之间', trigger: 'blur',
                        },
                        {validator: validateUsername, trigger: 'blur'},
                    ],
                    password: [
                        {required: true, message: '请输入密码', trigger: 'blur'},
                        {
                            min: 6, max: 24, message: '密码必须在6-24个字符之间', trigger: 'blur',
                        },
                        {validator: validatePassword, trigger: 'blur'},
                    ],
                    rePassword: [
                        {required: true, message: '请再次输入密码', trigger: 'blur'},
                        {validator: validateRePassword, trigger: 'blur'},
                    ],
                    email: [
                        {required: true, message: '请输入邮箱', trigger: 'blur'},
                        {validator: validateEmail, trigger: 'blur'},
                    ],
                },
            };
        },
        methods: {
            submitForm(formName) {
                const that = this;
                that.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$http.post('/register', this.ruleForm)
                            .then((res) => {
                                if (res.data.code === 0) {
                                    this.$message.success(res.data.msg);
                                    that.resetForm(formName);
                                } else {
                                    this.$message.error(res.data.msg);
                                }
                            })
                            .catch((err) => {
                                console.log(err);
                            });
                    } else {
                        return false;
                    }
                });
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
            },
        },
    };
</script>

<style scoped>
    /* el-row */
    .row-bg {
        margin: auto;
        padding: 10% 0;
    }

    /*el行*/
    .el-col {
        border-radius: 4px;
        padding: 10px 30px;
        margin: 10px;
    }

    /*表格样式*/
    .bg-purple-light {
        background-image: linear-gradient(to top, #f3e7e9 0%, #e3eeff 99%, #e3eeff 100%);
    }

    /*留言板标题*/
    .title {
        padding: 20px;
    }

    /* 2个链接 */
    .link {
        padding-right: 32px;
    }

</style>
