<template>
    <el-container style="height: 100%; border: 1px solid #eee">
        <el-header style="vertical-align: center;">
            <v-head></v-head>
        </el-header>
        <el-main>
            <el-table :data="tableData" stripe class="msgTable">
                <el-table-column prop="date" label="日期" width="140">
                </el-table-column>
                <el-table-column prop="nickname" label="姓名" width="120">
                </el-table-column>
                <el-table-column prop="content" label="留言内容">
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button
                                size="mini"
                                @click="handleEdit(scope.$index, scope.row)">编辑
                        </el-button>
                        <el-button
                                size="mini"
                                type="danger"
                                @click="handleDelete(scope.$index, scope.row)">删除
                        </el-button>
                    </template>
                </el-table-column>

            </el-table>
        </el-main>
        <div class="block">
            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="4"
                    :page-sizes="[100, 200, 300, 400]"
                    :page-size="100"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="400">
            </el-pagination>
        </div>
    </el-container>
</template>

<script>
    import vHead from '../common/Header.vue';

    export default {
        name: "MessageBoard",
        data() {
            const item = {
                date: '2016-05-02',
                nickname: '王小虎',
                content: '上海市普陀区金沙江路 1518 弄'
            };
            return {
                tableData: Array(20).fill(item),
            };
        },
        components: {
            vHead,
        },
        methods: {
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
    .msgTable {
        height: 100%;
        width: 100%;
    }
</style>
