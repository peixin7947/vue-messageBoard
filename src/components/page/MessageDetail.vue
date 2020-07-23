<template>
    <el-container class="container" v-if="message">
        <el-header style="height: 8%; vertical-align: center;">
            <v-head></v-head>
        </el-header>
        <el-scrollbar class="el-scrollbar">
            <el-container>
                <!-- 留言主窗口 -->
                <el-main>
                    <el-card class="msgContainer">
                        <div slot="header">
                            <div class="msgTitle">
                                <el-tag>{{message.tag}}</el-tag>
                                <span style="font-size: 36px; padding-left: 10px">{{message.title}}</span>
                            </div>
                            <div class="msgInfo">
                            <span style="font-size: 12px; padding-left: 5px">
                                创建者{{message.creator.nickname}} 于 {{dateFormat(message.createTime)}} 发布·
                            </span>
                            </div>
                        </div>
                        <div class="msgContent">
                            <span>{{message.content}}</span>
                        </div>
                    </el-card>

                </el-main>
                <el-footer>
                    <el-divider></el-divider>
                    <div style="display: block;padding-bottom: 30px">
                        <span style="font-size: 24px; padding-left: 10px">共有{{message.reply.length}}条评论</span>
                        <el-button style="float: right;" icon="el-icon-edit" type="primary"
                                   @click="putReplyFormVisible = true">写评论
                        </el-button>
                    </div>
                    <el-card style="white-space: pre-line">
                        <div v-for="(reply, index) in message.reply" v-bind:key="index">
                            <div slot="header" style="margin-bottom: 10px">
                                <span style="font-size: 12px;">
                                    创建者 {{reply.creator.nickname}} 于 {{dateFormat(reply.createTime)}} 回复 {{reply.toUser.nickname}}
                                </span>
                            </div>
                            <p class="replyContent">
                                 {{ reply.content }}
                            </p>
                            <el-divider></el-divider>
                        </div>
                    </el-card>
                </el-footer>
            </el-container>
        </el-scrollbar>
        <el-dialog title="评论留言" :visible.sync="putReplyFormVisible">
            <el-form :model="replyForm" status-icon :rules="rules" ref="putReplyForm">
                <el-form-item label="内容" label-width="60px" prop="content">
                    <el-input class="contentArea" type="textarea" v-model="replyForm.content"></el-input>
                </el-form-item>
            </el-form>

            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="putReply('putReplyForm')">发 布</el-button>
                <el-button @click="putReplyFormVisible = false">取 消</el-button>
            </div>
        </el-dialog>
    </el-container>
</template>

<script>
    import vHead from '../common/Header.vue';
    import moment from 'moment';

    export default {
        name: "MessageDetail",
        created() {
            this.init();
        },

        data() {
            return {
                putReplyFormVisible: false,
                message: this.message,
                replyForm: {
                    messageId: null,
                    content: null,
                    toUser: null,
                },
                rules: {
                    content: [
                        {required: true, message: '请输入评论', trigger: 'blur'},
                    ],
                },
            }
        },
        components: {
            vHead,
        },
        methods: {
            init() {
                this.$http.get('/api/message/' + this.$route.query.messageId)
                    .then((res) => {
                        const data = res.data;
                        this.message = data.data;
                        console.log(this.message);
                    });
            },
            dateFormat: function (date) {
                if (date === undefined) {
                    return "";
                }
                moment.locale('zh-cn');
                return moment(date).format('llll');
            },
            putReply(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        if (this.replyForm.toUser === null) {
                            this.replyForm.messageId = this.message._id;
                            this.replyForm.toUser = this.message.creator._id;
                        }
                        // this.replyForm.content = this.replyForm.content.replace(new RegExp('\\n',"gi"), "<br/>")
                        this.replyForm.content = this.replyForm.content.substring(1);
                        this.$http.post('/api/reply', this.replyForm)
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
                this.putReplyFormVisible = false
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

    .msgTitle {
        display: flex;
        margin: 10px;
    }

    .msgContainer {
        height: 600px;
    }

    /*.replyContent {*/
    /*    white-space: pre-wrap;*/
    /*    height: 100%;*/
    /*    width: auto;*/
    /*}*/

    .msgContent {
        white-space: pre-wrap;
        height: 100%;
        width: auto;
    }

    .el-scrollbar {
        height: 92%;
    }

    .contentArea >>> .el-textarea__inner {
        resize: none;
        max-height: 800px;
        height: 400px;
        width: 100%;
    }

    .el-scrollbar >>> .el-scrollbar__wrap {
        overflow-x: hidden;
    }
</style>
