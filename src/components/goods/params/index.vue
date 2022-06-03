<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- card -->
    <el-card>
      <el-alert
        title="注意 只允许添加三级商品分类的参数"
        :closable="false"
        show-icon=""
        type="warning"
      >
      </el-alert>
      <el-row>
        请选择商品分类
        <!-- cascader -->
        <el-cascader
          v-model="selKeys"
          :options="catelist"
          :props="props"
          @change="handleChange"
        ></el-cascader>
      </el-row>

      <!-- el-tabs -->
      <tabs :isDisabled="isDisabled" :selKeys="selKeys" ref="tabsRef"></tabs>
    </el-card>
  </div>
</template>

<script>
import Tabs from "./Tabs/index.vue";
export default {
  components: {
    Tabs,
  },
  data() {
    return {
      selKeys: [], //sel val
      catelist: [], //data src
      // config
      props: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
        expandTrigger: "hover",
      },
    };
  },
  created() {
    this.getCateList();
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.$http.get("categories");
      if (res.meta.status !== 200) return this.$message.error("失败");
      this.$message.success("获取商品类目成功");
      console.log("res.data", res.data);
      this.catelist = res.data;
    },
    // handleChange
    handleChange() {
      if (this.selKeys.length !== 3) {
        this.selKeys = [];
      }
      // 调用tab 儿子组件 的方法
      this.$refs.tabsRef.getParams();
    },
  },
  computed: {
    isDisabled() {
      return this.selKeys.length === 3 ? false : true;
    },
  },
};
</script>

<style lang="less" scoped>
.el-row {
  margin-top: 10px;
}
</style>