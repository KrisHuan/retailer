<template>
  <div class="rights">
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <el-table :data="showData" style="width: 100%" stripe border>
        <el-table-column type="index" label="#" width="100"> </el-table-column>
        <el-table-column prop="authName" label="权限名称" width="180">
        </el-table-column>
        <el-table-column prop="path" label="路径" width="200">
        </el-table-column>
        <el-table-column prop="level" label="等级" width="200">
          <template slot-scope="scope">
            <el-tag :type="scope.row.level | id2style">{{
              scope.row.level | id2txt
            }}</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[5, 10]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="rightsData.length"
    >
    </el-pagination>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rightsData: [],
      showData: [],
      currentPage: 1,
      pageSize: 10,
    };
  },
  created() {
    this.getRightsList();
  },
  methods: {
    async getRightsList() {
      const { data: res } = await this.$http.get("rights/list");
      console.log(res.data);
      this.rightsData = res.data;
      this.getShowData();
    },
    getShowData() {
      this.showData = this.rightsData.slice(
        (this.currentPage - 1) * this.pageSize,
        this.currentPage * this.pageSize
      );
    },
    handleSizeChange(size) {
      this.pageSize = size;
      this.currentPage = 1;
      this.getShowData();
    },
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage;
      this.getShowData();
    },
  },

  filters: {
    id2txt(id) {
      switch (id) {
        case "0":
          return "一级";
        case "1":
          return "二级";
        case "2":
          return "三级";
        default:
          break;
      }
    },
    id2style(id) {
      switch (id) {
        case "0":
          return "default";
        case "1":
          return "success";
        case "2":
          return "warning";
        default:
          break;
      }
    },
  },
};
</script>

<style>
</style>