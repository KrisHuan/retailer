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
        <el-tag :type="scope.row.cat_level | level2txt | txt2style">
          {{ scope.row.cat_level | level2txt }}</el-tag
        >
      </template>
      <template slot="option" slot-scope="scope">
        <el-button type="primary" icon="el-icon-edit" size="mini"
          >编辑</el-button
        >
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          @click="remove(scope.row.cat_id)"
          >删除</el-button
        >
      </template>
    </t-table>
  </div>
</template>

<script>
export default {
  props: ["cateList"],
  data() {
    return {
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

  methods: {
    async remove(cateId) {
      const isConfirm = await this.$confirm(
        "此操作将永久删除这个分类, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((e) => {
        return e;
      });
      console.log(isConfirm);
      if (isConfirm === "confirm") {
        // 删除分类id
        const { data: res } = await this.$http.delete(`categories/${cateId}`);
        if (res.meta.status === 200) return this.$message.success(res.meta.msg);
        this.$message.error(res.meta.msg);
      }
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
    txt2style(level) {
      switch (level) {
        case "一级":
          return "";
        case "二级":
          return "info";
        case "三级":
          return "warning";
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