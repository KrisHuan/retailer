<template>
  <!-- 编辑角色弹框 -->
  <div>
    <el-dialog title="编辑角色弹框" :visible.sync="editDiaVisible" width="30%">
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
      <span slot="footer">
        <el-button @click="hide()">取 消</el-button>
        <el-button type="primary" @click="hide()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      editDiaVisible: false,
      row: {},
      //
    };
  },
  methods: {
    show(row) {
      this.row = row;
      this.editDiaVisible = true;
      this.editRole();
    },
    hide() {
      this.editDiaVisible = false;
    },
    async editRole() {
      console.log(this.row);
      const id = this.row.id;
      const { data: res } = await this.$http.put(`roles/${id}`, this.row);
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.$message.success(res.meta.msg);
      // 添加完关闭对话框
      this.hide();
    },
  },
};
</script>

<style lang="less" scoped>
</style>