<template>
    <el-card class="talk-card">
        <div slot="header" class="">
            <span>无人回复的话题</span>
        </div>

        <div v-for="(item,index) in items" :key="index">
            <div>
                <div style="display: block">
                    <router-link :to="{ path: '/messageDetail', query: { messageId: item._id }}">
                        {{item.title}}
                    </router-link>
                </div>
                <div style="display: block">
                    <el-tag>{{item.tag}}</el-tag>
                    <span style="float: right">发布于{{dateFormat(item.createTime)}}</span>
                    <!--                <el-divider></el-divider>-->
                </div>
            </div>
            <el-divider></el-divider>
        </div>
    </el-card>
</template>

<script>
    import moment from "moment";

    export default {
        name: "talkCard",
        created() {
            this.init();
        },
        data() {
            return {
                items: this.items,
            }
        },
        methods: {
            init() {
                this.$http.get('/api/message/noComment')
                    .then((res) => {
                        const data = res.data.data;
                        this.items = data;
                    });
            },
            dateFormat(date) {
                return moment(date).format("YYYY-MM-DD")
            }
        }
    }
</script>

<style scoped>
    .talk-card {
        width: auto;
        margin: 10px;
    }
</style>
