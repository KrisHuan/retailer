<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!-- 搜索 添加 -->
      <el-row :gutter="20">
        <el-col :span="8"
          ><el-input
            clearable
            placeholder="请输入内容"
            v-model="queryInfo.query"
            @keyup.enter.native="getUserList()"
            @clear="getUserList()"
          >
          </el-input
        ></el-col>
        <el-col :span="4"
          ><el-button type="primary">添加用户</el-button></el-col
        >
      </el-row>
      <!-- 用户列表区域 -->
      <el-table :data="userlist" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态" prop="mg_state">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.mg_state"
              @change="userStateChange(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <!-- edit -->
        <el-table-column label="操作" width="170px">
          <el-button-group>
            <!-- xiu gai -->
            <el-tooltip content="修改角色" placement="top">
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
              ></el-button>
            </el-tooltip>
            <!-- del -->
            <el-tooltip content="删除角色" placement="top">
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
              ></el-button>
            </el-tooltip>
            <!-- dispatch -->

            <el-tooltip
              content="分配角色"
              placement="top"
              class="item"
              effect="dark"
              :enterable="false"
            >
              <el-button
                type="primary"
                icon="el-icon-setting"
                size="mini"
              ></el-button>
            </el-tooltip>
          </el-button-group>
        </el-table-column>
      </el-table>

      <!-- pagination -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next"
        :total="total"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  methods: {
    async userStateChange(userinfo) {
      // console.log(state);//false or ture
      // get a put reqeust
      const { data: res } = await this.$http.put(
        `users/${userinfo.id}/state/${userinfo.mg_state}`
      );

      if (res.meta.status !== 200) {
        userinfo.mg_state = !userinfo.mg_state;
        this.$message("更新失败");
      } else {
        this.$message({
          type: "success",
          message: "更新成功",
        });
      }
    },
    // 监听page size的改变 一页多少条
    handleSizeChange(newSize) {
      // console.log(newSize);
      this.queryInfo.pagesize = newSize;
      // 参数改变重新发起请求
      this.getUserList();
    },
    // 监听页码值的改变
    handleCurrentChange(pagenum) {
      this.queryInfo.pagenum = pagenum;
      this.getUserList();
    },
    // get user list
    async getUserList() {
      const { data: res } = await this.$http.get("users", {
        params: this.queryInfo,
      });
      console.log(res);
      if (res.meta.status !== 200)
        return this.$message.error("获取用户列表失败");
      this.userlist = res.data.users;
      this.total = res.data.total;
      // console.log(this.userlist);
    },
  },
  data() {
    return {
      //获取用户列表的参数对象
      queryInfo: {
        query: "",
        // 页码值
        pagenum: 1,
        // pagesize 一页显示多少条
        pagesize: 3,
        // // keywords
        // keywords: "",
      },
      userlist: [],

      total: 0,
    };
  },
  created() {
    this.getUserList();
  },
};
</script>

<style lang="less" scoped>
</style>