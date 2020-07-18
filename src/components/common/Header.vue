<template>
    <el-row type="flex" align="top" justify="center" class="nav">
        <el-col class="logo">
            <h1>留言板</h1>
        </el-col>
        <el-col>
            <el-menu :default-active="activeIndex" class="el-menu" mode="horizontal" @select="handleSelect">
                <el-menu-item index="1" path="123">留言板</el-menu-item>
                <el-menu-item index="2">管理留言</el-menu-item>
                <el-submenu index="3" class="">
                    <template slot="title">
                        <el-avatar :size="50" :src="avatar"></el-avatar>
                    </template>
                    <el-menu-item index="3-1">个人信息</el-menu-item>
                    <el-menu-item index="3-2">退出登录</el-menu-item>
                </el-submenu>
            </el-menu>
        </el-col>
    </el-row>
</template>
<script>
    const userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
    export default {
        data() {
            return {
                activeIndex: '1',
                avatar: this.$url + userInfo.avatar,
            }
        },

        computed: {
            // username() {
            //     let userInfo = sessionStorage.userInfo;
            //     return userInfo ? userInfo : null;
            // }
        },
        methods: {
            handleSelect(index) {
                switch (index) {
                    case "1":
                        this.$router.push("/messageBoard").catch(() => {
                        });
                        break;
                    case "2":
                        this.$router.push('/managerMessage').catch(() => {
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
            collapse() {
                this.collapsed = !this.collapsed
            }
        }
    }
</script>
<style scoped>
    .nav {
        background-color: cyan;
    }

    .el-menu {
        background-color: cyan;
        float: right;
    }

    .logo {
        margin: auto;

    }

    .logo h1 {
        vertical-align: middle;
    }

    .logo img {
        padding: 10px;
    }

</style>
