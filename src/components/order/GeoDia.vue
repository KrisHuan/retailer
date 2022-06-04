<template>
  <el-dialog title="请选择省(市)/县" :visible.sync="dialogVisible" width="50%"
  @close="close()"
  >
    <!-- content -->
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
    >
      <el-form-item label="省(市)/县" prop="area">
        <!-- 绑定的数组 -->
        <!-- 数据源 -->
        <!-- 配置属性 -->
        <el-cascader
          v-model="ruleForm.area"
          :options="cityData"
          :props="areaProps"
          @change="handleChange"
        ></el-cascader>
      </el-form-item>
      <el-form-item label="详细地址" prop="address">
        <el-input v-model="ruleForm.address"></el-input>
      </el-form-item>
    </el-form>

    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import cityData from "./citydata";
export default {
  data() {
    return {
      dialogVisible: false,
      ruleForm: {
        area: [],
        address: "",
      },
      rules: {
        area: [{ required: true }],
        address: [{}],
      },
      cityData,
      areaProps: {
        expandTrigger: "hover",
      },
    };
  },
  methods: {
    show() {
      this.dialogVisible = true;
    },
    handleChange() {
      console.log(this.ruleForm.area);
    },
    // when dia close
    close(){
      this.$refs.ruleForm.resetFields()
    }
  },
};
</script>

<style lang="less" scoped>
</style>