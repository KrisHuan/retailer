<template>
  <!-- 添加角色弹框 -->
  <div>
    <el-dialog title="添加角色弹框" :visible.sync="addDiaVisible" width="30%">
      <el-form ref="form" :model="row" label-width="80px">
        <!-- name -->
        <el-form-item label="角色名称">
          <el-input v-model="row.roleName"></el-input>
        </el-form-item>
        <!-- desc -->
        <el-form-item label="角色描述">
          <el-input v-model="row.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span>{{ row }}</span>
      <span slot="footer">
        <el-button @click="hide()">取 消</el-button>
        <el-button type="primary" @click="addRole()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      addDiaVisible: false,
      row: {},
    };
  },
  methods: {
    show() {
      this.addDiaVisible = true;
    },
    hide() {
      this.addDiaVisible = false;
    },
    async addRole() {
      let roleName = this.row.roleName;
      let roleDesc = this.row.roleDesc;
      const { data: res } = await this.$http.post(`roles`, {
        roleName,
        roleDesc,
      });
      if (res.meta.status !== 201) return this.$message.error(res.meta.msg);
      this.$message.success(res.meta.msg);
      // 添加完毕后关闭对话框
      this.hide();
    },
  },
};
</script>

<style lang="less" scoped>
</style>