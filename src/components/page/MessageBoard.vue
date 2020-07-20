<template>
    <el-container class="container">
        <el-header style="vertical-align: center;">
            <v-head></v-head>
        </el-header>
        <el-main>
            <el-row>

            </el-row>
            <el-table :data="items" stripe :show-header="false" class="msgTable">
                <el-table-column prop="creator.nickname" label="用户" width="120">
                    <template slot-scope="scope">
                        <img :src="scope.row.creator.avatar" width="40" height="40" />
                    </template>
                </el-table-column>
                <el-table-column label="类型" width="120">
                    <el-tag>分享</el-tag>
                </el-table-column>
                <el-table-column prop="content" max-height="20" show-overflow-tooltip tooltip-effect="light"
                                 label="留言内容">
                </el-table-column>
                <el-table-column prop="createTime" type="datetime" :formatter="dateFormat" min-width="5" fixed="right">
                </el-table-column>
            </el-table>
        </el-main>
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
    </el-container>
</template>

<script>
    import vHead from '../common/Header.vue';
    import moment from 'moment';

    export default {
        name: "MessageBoard",
        created() {
            this.$http.get('/api/message')
                .then((res) => {
                    const data = res.data.data;
                    this.items = data.items;
                    this.total = data.total;
                });

        },
        data() {
            return {
                items: this.items,
                total: this.total,
            };
        },
        components: {
            vHead,
        },
        methods: {
            dateFormat: function (row, column) {
                const date = row[column.property];
                if (date === undefined) {
                    return "";
                }
                return moment(date).format("YYYY-MM-DD");
            },
            handleEdit(index, row) {
                console.log(index, row);
            },
            handleDelete(index, row) {
                console.log(index, row);
            },
            handleSizeChange(val) {
                console.log(`每页 ${val} 条`);
            },
            handleCurrentChange(val) {
                console.log(`当前页: ${val}`);
            }
        }
    }
</script>

<style scoped>
    .container {
        height: 100%;
        width: 80%;
        margin: auto;
    }

    .msgTable {
        height: 100%;
        width: 100%;
    }
</style>
