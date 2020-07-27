<template>
    <el-row type="flex" align="top" justify="center" class="nav">
        <el-col :span="1">
            <img style="width: 40px; height: 40px; float: right" src="../../../static/images/logo.png" fit="contain"/>
        </el-col>
        <el-col :span="3" class="logo">
            <h1>留言板</h1>
        </el-col>
        <el-col>
            <el-menu :default-active="activeIndex" class="el-menu" mode="horizontal" @select="handleSelect">
                <el-menu-item index="1" path="123">留言板</el-menu-item>
                <el-menu-item index="2">管理留言</el-menu-item>
                <el-submenu index="3" class="">
                    <template slot="title">
                        <el-avatar v-if="avatar" :size="50" :src="avatar"></el-avatar>
                    </template>
                    <el-menu-item path="123">欢迎你，{{this.userInfo.nickname}}</el-menu-item>
                    <el-menu-item index="3-1">个人信息</el-menu-item>
                    <el-menu-item index="3-2">退出登录</el-menu-item>
                </el-submenu>
            </el-menu>
        </el-col>
    </el-row>
</template>
<script>
    export default {
        data() {
            return {
                activeIndex: null,
                avatar: this.avatar,
            }
        },
        created() {
            this.userInfo = JSON.parse(localStorage.getItem('userInfo'));
            this.avatar = this.userInfo.avatar;
        },

        methods: {
            handleSelect(index) {
                switch (index) {
                    case "1":
                        this.$router.push("/messageBoard").catch(() => {
                        });
                        break;
                    case "2":
                        this.$router.push('/userManage').catch(() => {
                        });
                        break;
                    case "3-1":
                        this.$router.push('/information').catch(() => {
                        });
                        break;
                    case "3-2":
                        this.handleCommand();
                        break;
                    default:
                }
            },
            handleCommand() {
                // 清空用户信息
                localStorage.removeItem('userInfo')
                this.$http.post('/api/logout').then((res) => {
                    const result = res.data;
                    if (result.code === 0) {
                        this.$message.success(result.msg);
                        this.$router.push('/login');
                    } else {
                        this.$message.error(result.msg);
                    }
                })
            },
        }
    }
</script>
<style scoped>
    .nav {
        background-color: cyan;
        vertical-align: middle;
    }

    .el-menu {
        background-color: cyan;
        float: right;
    }

</style>
