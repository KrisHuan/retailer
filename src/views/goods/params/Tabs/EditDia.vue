<template>
  <el-dialog
    :title="'编辑' + titleText"
    :visible.sync="dialogVisible"
    width="50%"
    @close="hide"
  >
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
    >
      <el-form-item :label="titleText" prop="attr_name">
        <el-input v-model="ruleForm.attr_name"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="hide">取 消</el-button>
      <el-button type="primary" @click="editParams()">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  props: ["titleText", "selKeys", "activeName"],
  data() {
    return {
      dialogVisible: false,
      // 修改对话框
      ruleForm: {
        attr_name: "",
        attr_id: "",
      },
      rules: {
        attr_name: [{ required: "true" }],
      },
    };
  },
  computed: {
    cateId() {
      return this.selKeys[this.selKeys.length - 1];
    },
  },
  methods: {
    // 点击按钮 修改参数
    show(id) {
      this.dialogVisible = true;
      this.ruleForm.attr_id = id;
      this.getParams(id);
    },
    hide() {
      this.dialogVisible = false;
      this.$refs.ruleForm.resetFields();
    },
    //  根据 ID 查询参数
    async getParams(id) {
      // categories/:id/attributes/:attrId
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes/${id}`,
        {
          params: {
            attr_sel: this.activeName,
          },
        }
      );
      if (res.meta.status !== 200) return this.$message.error("查询参数失败");
      this.$message.success("查询参数成功");
      this.ruleForm = res.data;
    },
    //编辑提交参数
    async editParams() {
      const cat_id = this.selKeys[this.selKeys.length - 1];
      const attr_id = this.ruleForm.attr_id;
      const name = this.activeName;
      const attr_name = this.ruleForm.attr_name;
      const { data: res } = await this.$http.put(
        `categories/${cat_id}/attributes/${attr_id}`,
        {
          attr_name: attr_name,
          attr_sel: name,
        }
      );
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.$message.success(res.meta.msg);
      if (res.meta.status !== 200) return this.$message.error("编辑参数失败");
      this.$message.success("编辑参数成功");
      this.ruleForm = res.data;
      this.hide();

      this.getParams(attr_id);
    },
  },
};
</script>

<style lang="less" scoped></style>
