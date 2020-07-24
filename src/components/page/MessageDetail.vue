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
                                   @click="createReplyFormVisible = true">写评论
                        </el-button>
                    </div>
                    <el-card>
                        <div v-for="(reply, index) in message.reply" v-bind:key="index" style="height: auto">
                            <div slot="header" style="margin-bottom: 10px">
                                <span style="font-size: 12px;">
                                    创建者 {{reply.creator.nickname}} 于 {{dateFormat(reply.createTime)}} 回复 {{reply.toUser.nickname}}
                                </span>
                                <el-tooltip placement="top">
                                    <div slot="content">{{reply.content}}</div><span style="background-color: #409EFF">查看回复内容</span>
                                </el-tooltip>
                                <div style="float: right">
                                    <el-button v-if="userInfo._id !== reply.creator._id" @click="onPutReply(index)">
                                        回复
                                    </el-button>
                                    <el-button v-if="userInfo._id === reply.creator._id" @click="onEditReply(index)">
                                        编辑
                                    </el-button>
                                    <el-button v-if="userInfo._id === reply.creator._id" @click="onDeleteReply(index)">
                                        删除
                                    </el-button>
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
        <el-dialog title="删除评论" :visible.sync="deleteReplyFormVisible">
            <h1>确认删除该留言？</h1>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="deleteReply()">确定</el-button>
                <el-button @click="deleteReplyFormVisible = false;">取 消</el-button>
            </div>
        </el-dialog>
        <el-dialog :close-on-click-modal="false" title="编辑评论" :visible.sync="editReplyFormVisible">
            <el-form v-if="form" :model="form" status-icon :rules="rules" ref="editReplyForm">
                <el-form-item label="内容" label-width="60px" prop="content">
                    <el-input class="contentArea" type="textarea" v-model="form.content"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="editReply('editReplyForm')">修 改</el-button>
                <el-button @click="editReplyFormVisible = false;">取 消</el-button>
            </div>
        </el-dialog>
        <el-dialog :close-on-click-modal="false" title="评论留言" :visible.sync="createReplyFormVisible">
            <el-form :model="replyForm" status-icon :rules="rules" ref="createReplyForm">
                <el-form-item label="内容" label-width="60px" prop="content">
                    <el-input class="contentArea" type="textarea" v-model="replyForm.content"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="createReply('createReplyForm')">发 布</el-button>
                <el-button @click="createReplyFormVisible = false">取 消</el-button>
            </div>
        </el-dialog>
        <el-dialog :close-on-click-modal="false" title="回复评论" :visible.sync="putReplyFormVisible">
            <el-form :model="form" status-icon :rules="rules" ref="createReplyForm">
                <el-form-item label="内容" label-width="60px" prop="content">
                    <el-input class="contentArea" type="textarea" v-model="form.content"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="putReply('createReplyForm')">回 复</el-button>
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
                deleteReplyFormVisible: false,
                editReplyFormVisible: false,
                createReplyFormVisible: false,
                putReplyFormVisible: false,
                userInfo: this.userInfo,
                message: this.message,
                form: {},
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
            // 初始化数据
            init() {
                this.$http.get('/api/message/' + this.$route.query.messageId)
                    .then((res) => {
                        const data = res.data;
                        this.message = data.data;
                    });
            },
            dateFormat: function (date) {
                if (date === undefined) {
                    return "";
                }
                moment.locale('zh-cn');
                return moment(date).format('llll');
            },
            // 删除评论
            onDeleteReply(index) {
                this.deleteReplyFormVisible = true;
                this.form = {
                    id: this.message.reply[index]._id
                };
            },
            deleteReply() {
                this.$http.delete('/api/message', {data: this.form})
                    .then((res) => {
                        const result = res.data;
                        if (result.code === 0) {
                            this.$message.success(result.msg);
                            // 刷新留言板数据
                            this.init();
                        } else {
                            this.$message.error(result.msg);
                        }
                    })
                this.deleteReplyFormVisible = false
            },
            // 编辑评论
            editReply(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$http.put('/api/message', this.form)
                            .then((res) => {
                                const result = res.data;
                                if (result.code === 0) {
                                    this.$message.success(result.msg);
                                    // 刷新留言板数据
                                    this.init();
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
                this.editReplyFormVisible = false
            },
            onEditReply(index) {
                this.editReplyFormVisible = true;
                this.form = {
                    id: this.message.reply[index]._id,
                    content: this.message.reply[index].content,
                };
            },
            // 写评论
            createReply(formName) {
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
                this.createReplyFormVisible = false
            },
            // 回复评论
            onPutReply(index){
                this.putReplyFormVisible = true;
                this.form = {
                    messageId: this.message.reply[index]._id,
                    toUser: this.message.reply[index].creator._id,
                };
            },
            putReply(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$http.post('/api/reply', this.form)
                            .then((res) => {
                                const result = res.data;
                                if (result.code === 0) {
                                    this.$message.success(result.msg);
                                    // 刷新留言板数据
                                    this.init();
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
            }
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
