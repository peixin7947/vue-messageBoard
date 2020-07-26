<template>
    <el-container class="container">
        <el-header style="">
            <v-head></v-head>
        </el-header>
        <el-container>
            <!-- 主窗口 -->
            <el-main>
                <el-tabs>
                    <el-tab-pane label="我的留言" name="first">
                        <v-message></v-message>
                    </el-tab-pane>
                    <el-tab-pane label="我的评论" name="second">
                        <v-comment></v-comment>
                    </el-tab-pane>
                </el-tabs>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
    import vHead from '../common/Header.vue';
    import vMessage from './ManagerMessage';
    import vComment from './ManagerComment';
    export default {
        name: "UserManage",
        components: {
            vHead,
            vMessage,
            vComment
        },
    }
</script>

<style scoped>
    .container {
        height: 100%;
        width: 80%;
        margin: auto;
    }

</style>