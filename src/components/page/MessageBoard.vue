<template>
    <el-container class="container">
        <el-header style="">
            <v-head></v-head>
        </el-header>
        <el-container>
            <!-- 留言主窗口 -->
            <el-main>
                <el-table :data="items" stripe :show-header="false" class="msgTable">
                    <el-table-column prop="creator.nickname" label="用户" width="120">
                        <template slot-scope="scope">
                            <img :src="scope.row.creator.avatar" width="40" height="40"/>
                        </template>
                    </el-table-column>
                    <el-table-column label="类型" width="120">
                        <template slot-scope="scope">
                            <el-tag>{{scope.row.tag}}</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column prop="content" max-height="20" label="留言">
                        <template slot-scope="scope">
                            <router-link :to="{ path: '/messageDetail', query: { messageId: scope.row._id }}">
                                {{scope.row.title}}
                            </router-link>
                        </template>
                    </el-table-column>
                    <el-table-column prop="createTime" type="datetime" :formatter="dateFormat" min-width="10"
                                     fixed="right">
                    </el-table-column>
                </el-table>
                <!-- 分页 -->
                <div class="block">
                    <el-pagination
                            @size-change="handleSizeChange"
                            @current-change="handleCurrentChange"
                            :current-page="4"
                            :page-sizes="[10, 20, 30, 40]"
                            :page-size="10"
                            layout="total, sizes, prev, pager, next, jumper"
                            :total="total">
                    </el-pagination>
                </div>
            </el-main>
            <!-- 侧边栏卡片 -->
            <el-aside>
                <el-card class="box-card">
                    <div slot="header" class="">
                        <span>欢迎发布留言</span>
                    </div>
                    <el-button style="float: left;" icon="el-icon-edit" type="primary"
                               @click="putMsgFormVisible = true">写留言
                    </el-button>
                    <el-button style="float: left;" icon="el-icon-help" type="primary">查看帮助</el-button>
                </el-card>
                <v-talk></v-talk>
            </el-aside>

            <el-dialog title="发布留言" :visible.sync="putMsgFormVisible">
                <el-form :model="messageForm" status-icon :rules="rules" ref="putMsgForm">
                    <el-form-item label="标题" label-width="60px" prop="title">
                        <el-input v-model="messageForm.title" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="标签" label-width="60px" prop="title">
                        <el-select v-model="messageForm.tag" placeholder="请选择标签">
                            <el-option
                                    v-for="item in options"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="内容" label-width="60px" prop="content">
                        <el-input class="contentArea" type="textarea" v-model="messageForm.content"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="putMessage('putMsgForm')">发 布</el-button>
                    <el-button @click="putMsgFormVisible = false">取 消</el-button>
                </div>
            </el-dialog>
        </el-container>
    </el-container>
</template>

<script>
    import vHead from '../common/Header.vue';
    import vTalk from '../common/talkCard';
    import moment from 'moment';

    export default {
        name: "MessageBoard",
        created() {
            this.init();
        },
        data() {
            return {
                putMsgFormVisible: false,
                items: this.items,
                total: this.total,
                options: [{
                    value: '问答',
                    label: '问答'
                }, {
                    value: '分享',
                    label: '分享'
                },],
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
        components: {
            vHead,
            vTalk,
        },
        methods: {
            init: function () {
                this.$http.get('/api/message')
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
                console.log(`每页 ${val} 条`);
            },
            handleCurrentChange(val) {
                console.log(`当前页: ${val}`);
            },
            putMessage(formName) {
                const that = this;
                that.$refs[formName].validate((valid) => {
                    if (valid) {
                        // this.messageForm.content = this.messageForm.content.replace(/\n/gi,"<br/>");
                        this.$http.post('/api/message', this.messageForm)
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
                            .catch((err) => {
                                console.log(err);
                            });
                    } else {
                        return false;
                    }
                });
                this.putMsgFormVisible = false
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

    .msgTable {
        height: 92%;
        width: 100%;
    }

    .box-card {
        height: 200px;
        width: auto;
        margin: 10px;
    }

    .contentArea >>> .el-textarea__inner {
        resize: none;
        max-height: 800px;
        height: 400px;
        width: 100%;
    }


</style>
