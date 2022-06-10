<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->

    <el-card>
      <el-row>
        <el-button type="primary" @click="showDia()">添加分类</el-button>
      </el-row>
      <!-- t-table -->
      <cate-card :cateList="cateList" @getCateList="getCateList()"></cate-card>
    </el-card>

    <!-- 分页区域 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[2, 5, 10]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      background
    >
    </el-pagination>

    <!-- 对话框 -->
    <cate-dia ref="dia"></cate-dia>
  </div>
</template>

<script>
import CateCard from "./CateCard.vue";
import CateDia from "./CateDia.vue";

export default {
  components: {
    CateCard,
    CateDia,
  },
  created() {
    this.getCateList();
  },
  data() {
    return {
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5,
      },
      cateList: [],
      total: 10,
    };
  },
  methods: {
    async getCateList() {
      console.log(1);
      const { data: res } = await this.$http.get("categories", {
        params: this.queryInfo,
      });
      if (res.meta.status != 200) return this.$notify.success(res.meta.msg);
      this.cateList = res.data.result;
      this.$notify.success(res.meta.msg);
      this.total = res.data.total;
    },

    showDia() {
      this.$refs.dia.dialogVisible = true;
    },
    handleCurrentChange(num) {
      this.queryInfo.pagenum = num;
      this.getCateList();
    },
    handleSizeChange(size) {
      this.queryInfo.pagesize = size;
      this.getCateList();
    },
  },
};
</script>

<style lang="less" scoped>
</style>