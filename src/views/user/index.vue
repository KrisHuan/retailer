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
          ><el-button type="primary" @click="dialogVisible = true"
            >添加用户</el-button
          ></el-col
        >
      </el-row>

      <!-- 添加用户的对话框  -->

      <el-dialog
        title="添加用户"
        :visible.sync="dialogVisible"
        width="50%"
        @close="addDiaClose"
      >
        <!-- content -->
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          label-width="100px"
        >
          <!-- ph9one -->
          <!-- prop绑定校验规则 -->
          <el-form-item label="用户名" prop="username">
            <el-input v-model="ruleForm.username"></el-input>
          </el-form-item>
          <!-- password -->
          <el-form-item label="密码" prop="password">
            <el-input v-model="ruleForm.password"></el-input>
          </el-form-item>
          <!-- email -->
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="ruleForm.email"></el-input>
          </el-form-item>
          <!-- mobile-->
          <el-form-item label="手机" prop="mobile">
            <el-input v-model="ruleForm.mobile"></el-input>
          </el-form-item>
        </el-form>

        <!-- footer -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addUser">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 修改用户的对话框 -->
      <el-dialog
        title="修改用户"
        :visible.sync="editDialogVisible"
        width="50%"
        @close="editFormClosed"
      >
        <!-- //form -->
        <el-form
          ref="editFormRef"
          :model="editForm"
          label-width="80px"
          :rules="editFormRules"
        >
          <el-form-item label="姓名">
            <el-input v-model="editForm.username" disabled></el-input>
          </el-form-item>

          <el-form-item label="邮箱" prop="email">
            <el-input v-model="editForm.email"></el-input>
          </el-form-item>

          <el-form-item label="手机">
            <el-input v-model="editForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <!-- // cancel -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editUserInfo()">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 分配角色的对话框 -->
      <el-dialog
        title="分配角色"
        :visible.sync="setRoleDialogVisible"
        width="50%"
      >
        <div>
          <p>当前用户:{{ userInfo.username }}</p>
          <p>当前角色:{{ userInfo.role_name }}</p>

          <p>
            分配新角色:
            <el-select v-model="selectedRoleId">
              <el-option
                v-for="item in roleData"
                :key="item.id"
                :label="item.roleName"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </p>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="setRoleDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="savRoleInfo()">确 定</el-button>
        </span>
      </el-dialog>

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
        <el-table-column label="操作" width="280px">
          <template slot-scope="scope">
            <!-- xiu gai -->
            <el-tooltip content="修改角色" placement="top">
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="showEditDialog(scope.row.id)"
              ></el-button>
            </el-tooltip>
            <!-- del -->
            <el-tooltip content="删除角色" placement="top">
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="deleteUser(scope.row.id)"
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
                @click="setRole(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
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
  data() {
    // cheak email rules
    var checkEmail = (rule, value, cb) => {
      const regEmail = /@/;
      if (regEmail.test(value)) {
        return cb();
      } else {
        cb(new Error("格式不对"));
      }
    };
    return {
      // 查询到的用户信息对象
      editForm: {},
      //控制编辑弹框显示
      editDialogVisible: false,
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
      dialogVisible: false,
      total: 0,
      ruleForm: {
        username: "",
        password: "",
        email: "",
        mobile: "",
      },
      rules: {
        username: [{ required: true, trigger: "blur" }, { min: 2 }],
        email: [
          { required: true, trigger: "blur" },
          { min: 2 },
          { validator: checkEmail, trigger: "blur" },
        ],
      },

      editFormRules: {
        email: [
          { required: true, trigger: "blur" },
          { min: 2 },
          { validator: checkEmail, trigger: "blur" },
        ],
      },

      //setRoleDialogVisible 控制分配角色对话框的显示与隐藏

      setRoleDialogVisible: false,
      userInfo: {},
      // 所有的角色列表
      roleData: [],
      // 选中的角色id
      selectedRoleId: "",
    };
  },
  created() {
    this.getUserList();
  },
  methods: {
    // 展示编辑用户的对话框
    async showEditDialog(id) {
      const { data: res } = await this.$http.get(`/users/${id}`);
      console.log(res.data);
      this.editForm = res.data;
      this.editDialogVisible = true;
    },
    // 对话框关闭
    addDiaClose() {
      this.$refs.ruleForm.resetFields();
    },
    addUser() {
      this.$refs.ruleForm.validate(async (valid) => {
        // console.log(valid);
        if (!valid) return;
        // request add users
        const { data: res } = await this.$http.post("users", this.ruleForm);
        if (res.meta.status !== 201) {
          this.$message.warning("添加失败了哦");
        }
        this.$message.success("添加用户成功了, 666");
        this.dialogVisible = false;
        this.getUserList();
      });
    },
    // //handle close
    // handleClose(e) {
    //   console.log(e);
    // },

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

    //editFormClosed
    editFormClosed() {
      this.$refs.editFormRef.resetFields();
    },
    //editDialogVisible = false
    editUserInfo() {
      // valid before req
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) return this.$message.warning("验证不通过");
        // requeset to put edit user info
        const { email, mobile } = this.editForm;
        const res = await this.$http.put("users/" + this.editForm.id, {
          email,
          mobile,
        });
        this.$message.success("更新成功");
        this.getUserList();

        console.log(res);
      });
      this.editDialogVisible = false;
    },

    // deleteUser
    deleteUser(id) {
      this.$confirm("此操作将永久删除该用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          // dele req
          const { data: res } = await this.$http.delete("users/" + id);
          console.log(res);
          if (1) {
            this.$message({
              type: "success",
              message: "删除成功!",
            });
          }
          this.getUserList();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },

    // 分配角色
    async setRole(userInfo) {
      // 在展示对话框之前 获取所有角色列表

      const { data: res } = await this.$http.get("roles");
      if (res.meta.status != 200) return this.$message.error("获取数据失败");
      // console.log("--------------");
      // console.log(res);
      this.roleData = res.data; //???
      // 展示对话框
      this.setRoleDialogVisible = true;
      this.userInfo = userInfo;
      // console.log(userInfo);
    },

    //点击按钮 分配角色
    async savRoleInfo() {
      // console.log(this.selectedRoleId);
      const { data: res } = await this.$http.put(
        `users/${this.userInfo.id}/role`,
        {
          rid: this.selectedRoleId,
        }
      );
      console.log(res.data);
      if (res.meta.status !== 200)
        return this.$message.error("更新用户数据失败"); //???
      this.message.$success("更新用户数据成功");
      this.getUserList();
      this.setRoleDialogVisible = false;
    },
  },
};
</script>

<style lang="less" scoped>
</style>