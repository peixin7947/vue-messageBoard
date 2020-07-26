<template>
    <el-container class="container">
        <el-header style="">
            <v-head></v-head>
        </el-header>
        <el-container>
            <!-- 留言主窗口 -->
            <el-main v-if="information">
                <el-card :data="information" class="informationCard">
                    <div slot="header">
                        <span style="font-size: 36px; padding-left: 10px">个人信息</span>
                    </div>
                    <div class="information">
                        <label style="width: 600px">用户名：</label>
                        <span style="width: 90%;float: right">
                            {{information.username}}
                        </span>
                        <el-divider></el-divider>
                        <label style="width: 200px">名称：</label>
                        <span style="width: 90%;float: right">
                            {{information.nickname}}
                        </span>
                        <el-divider></el-divider>
                        <div style="display:flex;height: 100px;">
                            <label style="width: 10%">头像：</label>
                            <el-image
                                    style="height:100px;width:100px;float: left;"
                                    :src="this.$url + information.avatar"
                                    :preview-src-list="[this.$url + information.avatar]"
                                    fit="fit"></el-image>
                        </div>
                        <el-divider></el-divider>
                        <label style="width: 200px">邮箱：</label>
                        <span style="width: 90%;float: right">
                            {{information.email}}
                        </span>
                        <el-divider></el-divider>
                        <label style="width: 200px">性别：</label>
                        <span style="width: 90%;float: right" v-if="information.sex === 0">女</span>
                        <span style="width: 90%;float: right" v-if="information.sex === 1">男</span>
                        <el-divider></el-divider>
                        <label style="width: 200px">年龄：</label>
                        <span v-if="information.age!==0" style="width: 90%;float: right">
                            {{information.age}}
                        </span>
                        <span v-if="information.age===0" style="width: 90%;float: right">
                            暂无
                        </span>
                        <el-divider></el-divider>
                        <label style="width: 200px">自我介绍：</label>
                        <span style="width: 90%;float: right">
                            {{information.intro}}
                        </span>
                        <el-divider></el-divider>
                        <label style="width: 200px">创建日期：</label>
                        <span style="width: 90%;float: right">
                            {{dateFormat(information.createTime)}}
                        </span>
                        <el-divider></el-divider>
                        <div style="float: bottom">
                            <el-button style="float: right" icon="el-icon-edit" type="primary"
                                       @click="informationFormVisible = true">修改信息
                            </el-button>
                        </div>
                    </div>
                </el-card>
                <el-dialog :close-on-click-modal="false" v-if="informationForm" title="修改个人信息" :visible.sync="informationFormVisible">
                    <el-form :model="informationForm" status-icon :rules="rules" ref="putInformationForm">
                        <el-form-item label="名称" label-width="20%" prop="nickname">
                            <el-input class="informationTxt" type="text" v-model="informationForm.nickname">
                                {{information.nickname}}
                            </el-input>
                        </el-form-item>
                        <el-form-item label="头像" label-width="20%" prop="avatar">
                            <el-upload
                                    class="avatar-uploader"
                                    action="/api/avatar/upload"
                                    :show-file-list="false"
                                    :on-success="handleAvatarSuccess"
                                    :before-upload="beforeAvatarUpload">
                                <img v-if="informationForm.avatar" :src="this.$url+information.avatar" class="avatar">
                                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                            </el-upload>
                        </el-form-item>
                        <el-form-item label="邮箱" label-width="20%" prop="email">
                            <el-input class="informationTxt" type="text" v-model="informationForm.email">
                                {{information.email}}
                            </el-input>
                        </el-form-item>
                        <el-form-item label="性别" label-width="20%" prop="sex">
                            <el-select v-model="informationForm.sex" value="" placeholder="请选择性别">
                                <el-option key="1" label="男" :value="1"></el-option>
                                <el-option key="0" label="女" :value="0"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="年龄" label-width="20%" prop="age">
                            <el-input class="informationTxt" type="number" v-model="informationForm.age">
                                {{information.age}}
                            </el-input>
                        </el-form-item>
                        <el-form-item label="自我介绍" label-width="20%" prop="intro">
                            <el-input class="informationTxt" type="textarea" v-model="informationForm.intro">
                                {{information.intro}}
                            </el-input>
                        </el-form-item>
                    </el-form>
                    <div slot="footer" class="dialog-footer">
                        <el-button type="primary" @click="putInformation('putInformationForm')">发 布</el-button>
                        <el-button @click="informationFormVisible = false">取 消</el-button>
                    </div>
                </el-dialog>
            </el-main>
        </el-container>
    </el-container>

</template>

<script>
    import vHead from '../common/Header.vue';
    import moment from 'moment';
    import {validatePassword, validateUsername, validateEmail} from '@/utils/validate.js';

    export default {
        name: "Information",
        created() {
            this.init();
        },
        data() {
            return {
                information: this.information,
                informationForm: this.informationForm,
                rules: {
                    nickname: [
                        {required: true, message: '请输入你的名称', trigger: 'blur'},
                        {
                            min: 3, max: 18, message: '用户名必须在3-18个字符之间', trigger: 'blur',
                        },
                        {validator: validateUsername, trigger: 'blur'},
                    ],
                    email: [
                        {required: true, message: '请输入你的邮箱', trigger: 'blur'},
                        {validator: validateEmail, trigger: 'blur'},
                    ],
                    sex: [
                        {required: true, message: '请选中你的性别', trigger: 'blur'},
                    ],
                    age: [
                         {
                            pattern: /^(0|[1-9]\d?|120)$/,
                            message: '年龄范围在0-120',
                            trigger: 'blur'
                        }
                    ],
                    password: [
                        {required: true, message: '请输入密码', trigger: 'blur'},
                        {validator: validatePassword, trigger: 'blur'},
                    ],
                },
                informationFormVisible: false,
            }
        },
        components: {
            vHead,
        },
        methods: {
            init() {
                this.$http.get('/api/information/')
                    .then((res) => {
                        const data = res.data;
                        this.information = data.data;
                        this.informationForm = {
                            nickname: this.information.nickname,
                            email: this.information.email,
                            avatar: this.information.avatar,
                            sex: this.information.sex,
                            intro: this.information.intro,
                            age: this.information.age,
                        };
                        console.log(this.information)
                    });

            },
            dateFormat: function (date) {
                if (date === undefined) {
                    return "";
                }
                moment.locale('zh-cn');
                return moment(date).format('llll');
            },
            putInformation(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$http.put('/api/information', this.informationForm)
                            .then((res) => {
                                const result = res.data;
                                if (result.code === 0) {
                                    this.$message.success(result.msg);
                                    // 刷新留言板数据
                                    this.init();
                                    // 清空写留言的内容
                                    this.$refs[formName].resetFields();
                                } else {
                                    this.$message.error(result.msg);
                                }
                            })
                            .catch((err) => {
                                console.log(err);
                            });
                    } else {
                        return false;
                    }
                });
                this.informationFormVisible = false
            },
            handleAvatarSuccess(res, file) {
                this.informationForm.avatar = URL.createObjectURL(file.raw);
            },
            beforeAvatarUpload(file) {
                const isJPG = file.type === 'image/jpeg';
                const isLt5M = file.size / 1024 / 1024 < 5;
                if (!isJPG) {
                    this.$message.error('上传头像图片只能是 JPG 格式!');
                }
                if (!isLt5M) {
                    this.$message.error('上传头像图片大小不能超过 2MB!');
                }
                return isJPG && isLt5M;
            },
        },
    }
</script>

<style scoped>
    .container {
        height: 100%;
        width: 80%;
        margin: auto;
    }

    .informationCard {
        height: 92%;
        width: 100%;
    }

    .information {
        margin: 20px;
    }

    .informationTxt {
        width: 80%;
    }

    .informationTxt >>> .el-textarea__inner {
        resize: none;
        max-height: 300px;
        height: 100px;
    }

    .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }

    .avatar-uploader .el-upload:hover {
        border-color: #409EFF;
    }

    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 178px;
        height: 178px;
        line-height: 178px;
        text-align: center;
    }

    .avatar {
        width: 100px;
        height: 100px;
        display: block;
    }

</style>
