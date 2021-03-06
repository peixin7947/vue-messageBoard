<template>
    <el-container style="height: 800px">
        <el-container v-if="items">
            <el-main>
                <el-scrollbar class="el-scrollbar">
                <el-table :data="items" type=index stripe class="msgTable">
                    <el-table-column prop="content" style="float: left;" label="内容" width="1000"
                                     show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="createTime" type="datetime" :formatter="dateFormat" width="120"
                                     label="发布日期" fixed="right">
                    </el-table-column>
                    <el-table-column min-width="50" fixed="right" label="操作" style="float: right;">
                        <template slot-scope="scope">
                            <el-button>
                                <router-link :to="{ path: '/messageDetail', query: { messageId: scope.row.messageId }}">
                                    查看详情
                                </router-link>
                            </el-button>
                            <el-button @click="editMsg(scope.$index)">编辑</el-button>
                            <el-button @click="deleteMsg(scope.$index)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                </el-scrollbar>
                <!-- 分页 -->
                <div class="block">
                    <el-pagination
                            @size-change="handleSizeChange"
                            @current-change="handleCurrentChange"
                            :current-page="1"
                            :page-sizes="[10,20,50]"
                            :page-size="10"
                            layout="total, sizes, prev, pager, next, jumper"
                            :total="total">
                    </el-pagination>
                </div>
            </el-main>
            <el-dialog v-if="msg" title="删除留言" :visible.sync="deleteMsgFormVisible">
                <h1>确认删除该留言？</h1>
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="doDeleteMsg()">确定</el-button>
                    <el-button @click="deleteMsgFormVisible = false, this.msg = null">取 消</el-button>
                </div>
            </el-dialog>
            <el-dialog :close-on-click-modal="false" title="编辑评论" :visible.sync="editMsgFormVisible">
                <el-form v-if="msg" :model="msg" status-icon :rules="rules" ref="putMsgForm">
                    <el-form-item label="内容" label-width="60px" prop="content">
                        <el-input class="contentArea" type="textarea" maxlength="1024" @input="commentInput"
                                  v-model="msg.content"></el-input>
                        <span style="float: right;">{{remnant}}/1024</span>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="putMsg('putMsgForm')">修 改</el-button>
                    <el-button @click="editMsgFormVisible = false">取 消</el-button>
                </div>
            </el-dialog>
        </el-container>
    </el-container>
</template>

<script>
    import moment from 'moment';

    export default {
        name: "MessageBoard",
        created() {
            this.userInfo = JSON.parse(localStorage.getItem('userInfo'));
            this.init();
        },
        data() {
            return {
                remnant: 0,
                editMsgFormVisible: false,
                deleteMsgFormVisible: false,
                items: this.items,
                total: this.total,
                pageSize: 10,
                pageIndex: 1,
                msg: null,
                messageForm: {
                    title: null,
                    content: null,
                    tag: null,
                },
                rules: {
                    title: [
                        {required: true, message: '标题', trigger: 'blur'},
                        {
                            min: 3, max: 30, message: '标题必须在3-30个字符之间', trigger: 'blur',
                        },
                    ],
                    content: [
                        {required: true, message: '请输入留言', trigger: 'blur'},
                    ],
                },
            };
        },
        methods: {
            commentInput() {
                this.remnant = this.msg.content.length;
            },
            init: function () {
                if (!this.pageIndex) {
                    this.pageIndex = 1;
                    this.pageSize = 10;
                }
                this.$http.get(('/api/comment/' + this.userInfo._id + "?pageIndex=" + this.pageIndex + "&pageSize=" + this.pageSize))
                    .then((res) => {
                        const data = res.data.data;
                        this.items = data.items;
                        this.total = data.total;
                    });
            },
            dateFormat: function (row, column) {
                const date = row[column.property];
                if (date === undefined) {
                    return "";
                }
                return moment(date).format("YYYY-MM-DD");
            },
            handleSizeChange(val) {
                this.pageSize = val;
                this.init();
            },
            handleCurrentChange(val) {
                this.pageIndex = val;
                this.init();
            },
            deleteMsg(row) {
                this.deleteMsgFormVisible = true;
                this.msg = {
                    id: this.items[row]._id
                };
            },
            editMsg(row) {
                this.editMsgFormVisible = true;
                this.msg = {
                    id: this.items[row]._id,
                    content: this.items[row].content,
                };
                this.remnant = this.items[row].content.length;

            },
            putMsg(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$http.put('/api/comment', this.msg)
                            .then((res) => {
                                const result = res.data;
                                if (result.code === 0) {
                                    this.$message.success(result.msg);
                                    // 刷新留言板数据
                                    this.init();
                                    // 情况写留言的内容
                                    this.$refs[formName].resetFields();
                                } else {
                                    this.$message.error(result.msg);
                                }
                            })
                    } else {
                        return false;
                    }
                });
                this.editMsgFormVisible = false
            },
            doDeleteMsg() {
                this.$http.delete('/api/message', {data: this.msg})
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
                this.deleteMsgFormVisible = false
            }
        },
    }
</script>

<style scoped>
    .container {
        height: 100%;
        margin: auto;
    }

    .msgTable {
        height: 92%;
        width: 100%;
    }

    .contentArea >>> .el-textarea__inner {
        resize: none;
        max-height: 800px;
        height: 400px;
        width: 100%;
    }
    .el-scrollbar {
        height: 92%;
    }

    .el-scrollbar >>> .el-scrollbar__wrap {
        overflow-x: hidden;
    }

</style>
<style>
    .el-tooltip__popper {
        max-width: 600px;
    }
</style>
