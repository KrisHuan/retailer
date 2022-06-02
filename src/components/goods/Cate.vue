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
      <cate-card></cate-card>
    </el-card>

    <!-- 分页区域 -->

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
  data() {
    return {};
  },
  methods: {
    showDia() {
      this.$refs.dia.dialogVisible = true;
      this.$refs.dia.getParentCate();
    },
  },
};
</script>

<style lang="less" scoped>
</style>