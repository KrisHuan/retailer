<template>
  <el-dialog
    title="添加商品分类"
    :visible.sync="dialogVisible"
    width="50%"
    @close="resetForm()"
  >
    <!--表单 -->
    <el-form
      :model="ruleForm"
      status-icon
      :rules="rules"
      ref="cateFormRef"
      label-width="100px"
    >
      <!-- prop就是ruleform的key -->
      <el-form-item label="分类名称" prop="cat_name">
        <el-input v-model="ruleForm.cat_name"></el-input>
      </el-form-item>
      <!-- prop就是ruleform的key -->
      <el-form-item label="父级分类" prop="cat_pid">
        <el-cascader
          v-model="selKeys"
          :options="pCateList"
          :props="casProps"
          @change="handleChange"
          clearable
        ></el-cascader>
      </el-form-item>
    </el-form>

    <span slot="footer" class="dialog-footer">
      <el-button @click="hide">取 消</el-button>
      <el-button type="primary" @click="addCate()">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import axios from "axios";
export default {
  // props: ["dialogVisible"],
  data() {
    return {
      dialogVisible: false,
      // 添加表单对象
      ruleForm: {
        cat_name: "",
        cat_pid: 0,
        cat_level: 0, //0 is the highest class
      },
      // 验证规则
      rules: {
        cat_name: [{ required: true }],
      },
      // 父级分类数组
      pCateList: [],
      //casProps
      casProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
        expandTrigger: "hover",
      },
      //cascader绑定的值
      selKeys: [],
    };
  },
  methods: {
    //hide
    hide() {
      this.dialogVisible = false;
    },
    //getParentCate
    async getParentCate() {
      const { data: res } = await this.$http.get("categories", {
        params: {
          type: 3,
        },
      });
      if (res.meta.status !== 200) return this.$message.error("失败");
      this.pCateList = res.data;
      this.$message.success("成功");
    },
    // handleChange
    handleChange() {
      if (this.selKeys.length > 0) {
        let temp = this.selKeys[this.selKeys.length - 1];
        //父 分类的id
        this.ruleForm.cat_pid = temp;
        //为当前分类的等级赋值
        this.ruleForm.cat_level = this.selKeys.length - 1;
      } else {
        //父 分类的id
        this.ruleForm.cat_pid = 0;
        //为当前分类的等级赋值
        this.ruleForm.cat_level = 0;
      }
    },

    //addCate
    addCate() {
      console.log(this.ruleForm);
      this.$refs.cateFormRef.validate(async (valid) => {
        if (!valid) return;
        // request
        const { data: res } = await this.$http.post(
          "categories",
          this.ruleForm
        );
        // handle
        if (res.meta.status !== 201) return this.$message.error("添加分类失败");
        this.$message.success("添加分类成功");
        // refresh catelist
        this.hide();
        // this.$parent.getParentCate();???
        //!!!数据未更新成功
      });
    },
    // clear form data when dia close
    resetForm() {
      this.$refs.cateFormRef.resetFields();
      // reset cascader
      this.selKeys = [];
      this.ruleForm = {
        // cat_name: "",
        cat_pid: 0,
        cat_level: 0, //0 is the highest class
      };
    },
  },
};
</script>

<style lang="less" scoped>
</style>