<template>
  <div>
    <!-- t-table -->
    <t-table
      class="t-table"
      :data="cateList"
      :columns="columns"
      :show-index="true"
      :expand-type="false"
      :selection-type="false"
      :border="true"
    >
      <template slot="isok" slot-scope="scope">
        <!-- {{ scope }} -->
        <i class="el-icon-success" v-if="scope.row.cate_deleted !== false"></i>
        <i class="el-icon-error" v-else></i>
      </template>

      <template slot="order" slot-scope="scope">
        <el-tag> {{ scope.row.cat_level | level2txt }}</el-tag>
      </template>
      <template slot="option">
        <el-button type="primary" icon="el-icon-edit">编辑</el-button>
        <el-button type="danger" icon="el-icon-delete">删除</el-button>
      </template>
    </t-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      queryInfo: {
        type: 3,
        pageNum: 1,
        pagesize: 5,
      },
      cateList: [],
      columns: [
        {
          label: "分类名称",
          prop: "cat_name",
        },
        {
          label: "是否有效",
          type: "template", // 将当前列定义为模板列
          template: "isok", //当前这一列使用模板名称
        },
        {
          label: "排序",
          type: "template", // 将当前列定义为模板列
          template: "order", //当前这一列使用模板名称
        },
        {
          label: "操作",
          type: "template", // 将当前列定义为模板列
          template: "option", //当前这一列使用模板名称
        },
      ],
    };
  },
  created() {
    this.getCateList();
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.$http.get("categories", {
        params: this.queryInfo,
      });
      if (res.meta.status != 200) return this.$message.error("失败");
      console.log("res.data", res.data);
      this.cateList = res.data;
      this.$message.success("成功");
    },
  },
  filters: {
    level2txt(level) {
      switch (level) {
        case 0:
          return "一级";
        case 1:
          return "二级";
        case 2:
          return "三级";
        default:
          break;
      }
    },
  },
};
</script>

<style lang="less" scoped>
.t-table {
  margin-top: 10px;
}
</style>