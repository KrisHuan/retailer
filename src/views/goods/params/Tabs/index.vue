<template>
  <div>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <!-- 动态参数 -->
      <el-tab-pane label="动态参数" name="many">
        <el-button type="primary" :disabled="isDisabled" @click="showDia"
          >添加动态参数</el-button
        >
        <!-- --------------------------------------------------------------------- -->
        <!-- 动态参数 -->
        <el-table :data="manyTableData" border stripe>
          <el-table-column type="index"> </el-table-column>
          <el-table-column type="expand">
            <!-- 展开行 -->
            <template slot-scope="scope">
              <el-tag
                v-for="(item, i) in scope.row.attr_vals"
                :key="i"
                closable
                @close="handleClose(i, scope.row)"
                >{{ item }}</el-tag
              >
              <!-- add tag -->
              <el-input
                class="input-new-tag"
                v-if="scope.row.inputVisible"
                v-model="scope.row.inputValue"
                @keyup.enter.native="handleInputConfirm(scope.row)"
                @blur="handleInputConfirm(scope.row)"
              >
              </el-input>
              <el-button
                v-else
                class="button-new-tag"
                @click="showInput(scope.row)"
                >+ New Tag</el-button
              >
            </template>
          </el-table-column>
          <el-table-column label="参数名称" prop="attr_name"> </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                type="primary"
                size="mini"
                icon="el-icon-edit"
                @click="showEditDia(scope.row.attr_id)"
                >编辑</el-button
              >
              <el-button
                type="warning"
                size="mini"
                icon="el-icon-delete"
                @click="removeParam(scope.row.attr_id)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <!-- --------------------------------------------------------------------- -->
      <!-- 静态属性 -->
      <el-tab-pane label="静态属性" name="only">
        <el-button type="primary" :disabled="isDisabled" @click="showDia"
          >添加静态参数</el-button
        >
        <!-- --------------------------------------------------------------------- -->
        <el-table :data="onlyTableData" border stripe>
          <el-table-column type="index"> </el-table-column>
          <el-table-column type="expand"> </el-table-column>
          <el-table-column label="参数名称" prop="attr_name"> </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                type="primary"
                size="mini"
                icon="el-icon-edit"
                @click="showEditDia(scope.row.attr_id)"
                >编辑</el-button
              >
              <el-button
                type="warning"
                size="mini"
                icon="el-icon-delete"
                @click="removeParam(scope.row.attr_id)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
    <!-- --------------------------------------------------------------------- -->
    <!-- 添加 框 -->
    <el-dialog
      :title="'添加' + titleText"
      :visible.sync="dialogVisible"
      width="50%"
      @close="diaClose"
    >
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleFormRef"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="ruleForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showDia('add')">取 消</el-button>
        <el-button type="primary" @click="addParams()">确 定</el-button>
      </span>
    </el-dialog>
    <!-- --------------------------------------------------------------------- -->
    <!-- 编辑 框 -->
    <edit-dia
      ref="editRef"
      :titleText="titleText"
      :activeName="activeName"
      :selKeys="selKeys"
    ></edit-dia>
    <!-- --------------------------------------------------------------------- -->
    <!-- 删除 框 -->
    <del-dia ref="delRef" :cateID="cateID" @getParams="getParams"></del-dia>
  </div>
</template>

<script>
import EditDia from "./EditDia.vue";
import DelDia from "./DelDia.vue";
export default {
  components: {
    EditDia,
    DelDia,
  },
  props: ["isDisabled", "selKeys"],
  data() {
    return {
      activeName: "many",
      manyTableData: [],
      onlyTableData: [],
      //form 添加参数的表单数据对象
      ruleForm: {
        attr_name: "",
      },
      //rules 验证规则对象
      rules: {
        attr_name: [{ required: true, massage: "参数名必填" }],
      },
      //dialogVisible
      dialogVisible: false,
      //控制添加tag的显示和隐藏
      inputVisible: false,
      // 内容
      inputValue: "",
    };
  },
  created() {},
  computed: {
    titleText() {
      if (this.activeName === "many") return "动态参数";
      return "静态属性";
    },
    cateID() {
      return this.selKeys[this.selKeys.length - 1];
    },
  },
  methods: {
    handleInputConfirm(row) {
      console.log(row);
      let inputValue = row.inputValue;
      if (inputValue) {
        row.attr_vals.push(inputValue);
      }
      row.inputVisible = false;
      row.inputValue = "";
      this.saveAttrVals(row);
    },
    //save attr values
    async saveAttrVals(row) {
      const { data: res } = await this.$http.put(
        `categories/${this.cateID}/attributes/${row.attr_id}`,
        {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join(" "),
        }
      );
      if (res.meta.status !== 200) return this.$message.error("失败");
      this.$message.success("成功");
    },
    //handleClosed
    handleClose(i, row) {
      row.attr_vals.splice(i, 1);
      this.saveAttrVals(row);
    },
    showInput(row) {
      row.inputVisible = true;
    },
    handleClick() {
      console.log(this.activeName);
      this.getParams();
    },

    // 获取参数
    getParams() {
      this.$nextTick(async () => {
        const { data: res } = await this.$http.get(
          `categories/${this.selKeys[this.selKeys.length - 1]}/attributes`,
          {
            params: {
              sel: this.activeName,
            },
          }
        );
        res.data.forEach((item) => {
          item.attr_vals = item.attr_vals ? item.attr_vals.split(" ") : [];
          console.log(item.attr_vals);
          item.inputVisible = false;
          item.inputValue = "";
        });

        if (res.meta.status !== 200)
          return this.$message.error("获取参数列表失败");
        this.$message.success("获取参数列表成功");
        if (this.activeName === "many") {
          this.manyTableData = res.data;
        } else {
          this.onlyTableData = res.data;
        }
      });
    },

    //showDia()
    showDia() {
      this.dialogVisible = !this.dialogVisible;
    },
    diaClose() {
      this.$refs.ruleFormRef.resetFields();
    },
    // 点击按钮 添加参数
    addParams() {
      this.$refs.ruleFormRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$http.post(
          `categories/${this.selKeys[this.selKeys.length - 1]}/attributes`,
          {
            attr_name: this.ruleForm.attr_name,
            attr_sel: this.activeName,
          }
        );
        if (res.meta.status !== 201) return this.$message.error("添加参数失败");
        this.$message.success("添加参数成功");
      });
      this.showDia();
      this.getParams();
    },

    //showEditDia
    showEditDia(id) {
      this.$refs.editRef.show(id);
    },
    //removeParam
    removeParam(attr_id) {
      this.$refs.delRef.delete(attr_id);
      // this.getParams();
    },
  },
};
</script>

<style lang="less" scoped>
.el-tag {
  margin: 5px;
}
.input-new-tag {
  width: 120px;
}
</style>