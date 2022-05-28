<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/users">用户管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!-- 搜索與添加區域 -->
      <el-row :gutter="20">
        <el-col :span="8"
          ><el-input placeholder="请输入内容">
            <el-button
              slot="append"
              icon="el-icon-search"
            ></el-button> </el-input
        ></el-col>
        <el-col :span="4"
          ><el-button type="primary">添加用户</el-button></el-col
        >
      </el-row>
      <!-- 用戶列表區域 -->
      <el-table :data="userlist" border stripe
        ><el-table-column lable="姓名" prop="username"></el-table-column
        ><el-table-column
          lable="邮箱"
          prop="email"
        ></el-table-column> </el-table
    ></el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //获取用户列表的参数对象
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 2,
      },
      userlist: [],
      total: 0,
    };
  },
  created() {
    this.getUserList();
  },
  methods: {
    async getUserList() {
      const { data: res } = await this.$http.get("users", {
        params: this.queryInfo,
      });
      if (res.meta.status !== 200)
        return this.$message.error("获取用户列表失败");
      this.userList = res.userList;
      this.total = res.meta.total;
      console.log(res);
    },
  },
};
</script>

<style lang="less" scoped>
</style>>

</style>>
</style>