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
                        <pre style="font-size: 18px">{{message.content}}</pre>
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
                    <el-card>
                        <div v-for="(reply, index) in message.reply" v-bind:key="index" style="height: auto">
                            <div slot="header" style="margin-bottom: 10px">
                                <span style="font-size: 12px;">
                                    创建者 {{reply.creator.nickname}} 于 {{dateFormat(reply.createTime)}} 回复 {{reply.toUser.nickname}}
                                </span>
                                <div style="float: right">
                                    <el-button v-if="userInfo._id === reply.creator._id">编辑</el-button>
                                    <el-button v-if="userInfo._id === reply.creator._id">删除</el-button>
                                </div>
                            </div>
                            <div style="display: block;height: auto">
                                <pre class="replyContent">{{ reply.content }}</pre>
                            </div>
                            <el-divider></el-divider>
                        </div>
                    </el-card>
                </el-footer>
            </el-container>
        </el-scrollbar>
        <el-dialog title="删除评论" :visible.sync="deleteMsgFormVisible">
            <h1>确认删除该留言？</h1>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="doDeleteMsg()">确定</el-button>
                <el-button @click="deleteMsgFormVisible = false; this.msg = null">取 消</el-button>
            </div>
        </el-dialog>
        <el-dialog title="编辑评论" :visible.sync="editMsgFormVisible">
            <el-form v-if="msg" :model="msg" status-icon :rules="rules" ref="putMsgForm">
                <el-form-item label="标签" label-width="60px" prop="title">
                    <el-select v-model="msg.tag" placeholder="请选择标签">
                        <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="内容" label-width="60px" prop="content">
                    <el-input class="contentArea" type="textarea" v-model="msg.content"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="putMsg('putMsgForm')">修 改</el-button>
                <el-button @click="editMsgFormVisible = false;this.msg = null">取 消</el-button>
            </div>
        </el-dialog>
        <el-dialog title="回复" :visible.sync="putReplyFormVisible">
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
            this.userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
        },

        data() {
            return {
                putReplyFormVisible: false,
                userInfo: this.userInfo,
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

    .replyContent {
        font-size: 14px;
        width: 90%;
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
