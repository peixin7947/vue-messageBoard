<template>
    <el-container class="container">
        <el-header style="">
            <v-head></v-head>
        </el-header>
        <el-container>
            <!-- 留言主窗口 -->
            <el-main v-if="items" style="height: 100%">
                <el-input placeholder="搜索关键字" v-model="keyword" class="searchClass">
                    <el-button slot="append" icon="el-icon-search" @click="init(keyword)"></el-button>
                </el-input>
                <el-button slot="append" icon="el-icon-search"></el-button>
                <el-table :data="items" stripe :show-header="false" class="msgTable">
                    <el-table-column label="用户" width="120">
                        <template slot-scope="scope">
                            <img :src="(scope.row.creator ? scope.row.creator.avatar: null)"
                                 width="40" height="40"/>
                            <el-button type="text"
                                       @click="getUserInfoById(scope.row.creator._id),informationFormVisible = true">
                                {{scope.row.creator ? scope.row.creator.nickname: null}}
                            </el-button>
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
                            :current-page="1"
                            :page-sizes="[10,20,50]"
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
                </el-card>
                <v-talk></v-talk>
            </el-aside>

            <el-dialog title="发布留言" :close-on-click-modal="false" :visible.sync="putMsgFormVisible">
                <el-form :model="messageForm" status-icon :rules="rules" ref="putMsgForm">
                    <el-form-item label="标题" label-width="60px" prop="title">
                        <el-input v-model="messageForm.title" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="标签" label-width="60px">
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
                        <el-input class="contentArea" maxlength="1024" type="textarea" @input="commentInput"
                                  v-model="messageForm.content"></el-input>
                        <span style="float: right;">{{remnant}}/1024</span>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="putMessage('putMsgForm')">发 布</el-button>
                    <el-button @click="putMsgFormVisible = false">取 消</el-button>
                </div>
            </el-dialog>
            <el-dialog v-if="informationForm"
                       :title="this.informationForm._id === this.userInfo._id?'我的信息':'他人信息'"
                       :visible.sync="informationFormVisible">
                <div class="information">
                    <label style="width: 200px">名称：</label>
                    <span style="width: 90%;float: right">
                            {{informationForm.nickname}}
                        </span>
                    <el-divider></el-divider>
                    <div style="display:flex;height: 100px;">
                        <label style="width: 10%">头像：</label>
                        <el-image
                                style="height:100px;width:100px;float: left;"
                                :src="this.$url + informationForm.avatar"
                                fit="fit"></el-image>
                    </div>
                    <el-divider></el-divider>
                    <label style="width: 200px">性别：</label>
                    <span style="width: 90%;float: right" v-if="informationForm.sex === 0">女</span>
                    <span style="width: 90%;float: right" v-if="informationForm.sex === 1">男</span>
                    <el-divider></el-divider>
                    <label style="width: 200px">年龄：</label>
                    <span v-if="informationForm.age!==0" style="width: 90%;float: right">
                            {{informationForm.age}}
                        </span>
                    <span v-if="informationForm.age===0" style="width: 90%;float: right">
                            暂无
                        </span>
                    <el-divider></el-divider>
                    <label style="width: 200px">自我介绍：</label>
                    <span style="width: 90%;float: right">
                            {{informationForm.intro}}
                        </span>
                    <el-divider></el-divider>
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
            this.init('');
            this.userInfo = JSON.parse(localStorage.getItem('userInfo'));
        },
        data() {
            return {
                keyword: '',
                remnant: 0,
                informationFormVisible: false,
                putMsgFormVisible: false,
                items: this.items,
                total: this.total,
                pageSizes: this.pageSizes,
                pageSize: 10,
                pageIndex: 1,
                informationForm: {},
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
            getUserInfoById(id) {
                this.$http.get('/api/information/' + id)
                    .then((res) => {
                        this.informationForm = res.data.data;
                    });
            },
            commentInput() {
                this.remnant = this.messageForm.content.length;
            },
            init: function (keyword = '') {
                this.$http.get('/api/message?keyword=' + keyword + '&pageSize=' + this.pageSize + '&pageIndex=' + this.pageIndex)
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
            putMessage(formName) {
                const that = this;
                that.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$http.post('/api/message', this.messageForm)
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
        height: 90%;
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

    .searchClass{
        width: 400px;
    }

</style>
