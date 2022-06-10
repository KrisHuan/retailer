<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/goods' }">商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- ----------------------------------------------------------------------------- -->
    <el-card>
      <el-alert title="添加商品信息" type="warning" show-icon :closable="false">
      </el-alert>
      <!-- ------------------------------------------------------------------------- -->
      <el-steps
        :space="200"
        :active="activeIndex - 0"
        finish-status="success"
        align-center
      >
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <!-- ------------------------------------------------------------------------- -->

      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addForm"
        label-width="100px"
      >
        <!-- tabs栏区域 -->
        <el-tabs
          :tab-position="'left'"
          style="height: 100%"
          v-model="activeIndex"
          :before-leave="beforeTabLeave"
          @tab-click="tabClick"
        >
          <!-- 基本信息 -->
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" props="goods_name" autofocus>
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" props="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" props="goods_number" type="number">
              <el-input v-model="addForm.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" props="goods_weight" type="number">
              <el-input v-model="addForm.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品类别" props="goods_cat">
              <!-- ------------------------------------------------------------------------- -->
              <!-- option:级联选择器数据源 -->
              <el-cascader
                v-model="addForm.goods_cat"
                :options="cateList"
                :props="cateProps"
                @change="handleChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <!-- 商品参数 attr -->
          <el-tab-pane label="商品参数" name="1">
            <!-- 渲染表单的item项 -->
            <el-form-item
              :label="item.attr_name"
              v-for="(item, index) in manyTableData"
              :key="index"
            >
              <!-- 渲染多选框组 -->

              <!-- attr_vals: "30核HDR,55吋4K超薄曲面 人工智能,65吋4K超薄曲面" -->
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  :label="item2"
                  v-for="(item2, index2) in item.attr_vals"
                  :key="index2"
                  border
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <!-- 商品属性 -->
          <el-tab-pane label="商品属性" name="2">
            <el-form-item
              label-width="200"
              v-for="item in onlyTableData"
              :key="item.attr_id"
              :label="item.attr_name"
            >
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <!-- action表示要上传的图片地址 -->
            <el-upload
              action="http://127.0.0.1:8888/api/private/v1/upload"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :headers="headerObj"
              :on-success="handleSuccess"
              list-type="picture"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <quill-editor v-model="addForm.goods_introduce"></quill-editor>
            <el-button type="primary" class="addbBtn" @click="postGoods"
              >添加商品</el-button
            >
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>

    <!-- 图片预览对话框 -->
    <el-dialog title="图片预览" :visible.sync="picDiaVisible" width="30%">
      <img :src="picUrl" alt="图片" width="100%" />
    </el-dialog>
  </div>
</template>

<script>
import _ from "lodash";
export default {
  data() {
    return {
      activeIndex: "0",
      addForm: {
        goods_name: "",
        goods_cat: "",
        goods_price: null,
        goods_number: null,
        goods_weight: null,
        // 商品所属的分类id数组
        goods_cat: [],
        // 图片的数组
        pics: [],
        // 富文本 商品详情
        goods_introduce: "",
      },
      addFormRules: {
        goods_name: [{ required: true, trigger: "blur" }],
      },
      cateList: [],
      manyTableData: [],
      onlyTableData: [],
      // check box
      checkList: [],
      // -------------------------------------------------------------------------
      //级联选择器属性
      cateProps: {
        label: "cat_name",
        value: "cat_id",
        chidren: "children",
        expandTrigger: "hover",
      },
      // 图片上传组件的headers请求头对象
      headerObj: {
        Authorization: sessionStorage.getItem("token"),
      },
      previewPath: "",
      // 图片预览地址
      picUrl: "",
      picDiaVisible: false,
    };
  },
  computed: {
    cateID() {
      if (this.addForm.goods_cat.length === 3) return this.addForm.goods_cat[2];
      return null;
    },
  },
  created() {
    this.getCateList();
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.$http.get(`categories`);
      if (res.meta.status !== 200) return this.$message.error("失败");
      this.$message.success("获取商品分类成功");
      this.cateList = res.data;
    },
    // 级联选择器发生变化 会触发这个函数
    handleChange() {
      if (this.addForm.goods_cat.length !== 3) {
        return this.$message.warning("请先选择商品分类");
      }
    },
    beforeTabLeave(xin, oldActiveName) {
      if (oldActiveName === "0" && this.addForm.goods_cat.length !== 3) {
        this.$message.warning("请先选择商品分类");
        return false;
      }
    },
    async tabClick() {
      //   访问动态参数面板
      if (this.activeIndex === "1") {
        const { data: res } = await this.$http.get(
          `categories/${this.cateID}/attributes`,
          {
            params: { sel: "many" },
          }
        );
        res.data.forEach((item) => {
          item.attr_vals =
            item.attr_vals.length === 0 ? [] : item.attr_vals.split(" ");
        });
        console.log(res.data);
        this.manyTableData = res.data;
        if (res.meta.status !== 200)
          return this.$message.error("获取商品参数失败");
        return this.$message.success("获取商品参数成功");
      }

      // -------------------------------------------------------------------------
      //   访问静态属性面板
      if (this.activeIndex === "2") {
        const { data: res } = await this.$http.get(
          `categories/${this.cateID}/attributes`,
          {
            params: { sel: "only" },
          }
        );
        console.log(res);
        this.onlyTableData = res.data;
        if (res.meta.status !== 200)
          return this.$message.error("获取静态属性列表失败");
        return this.$message.success("静态属性列表成功");
      }
      // -------------------------------------------------------------------------
      if (this.activeIndex === "3") {
      }
    },
    // -------------------------------------------------------------------------
    // 处理图片预览
    handlePreview(file) {
      // previewPath
      this.picUrl = file.response.data.url;
      this.picDiaVisible = true;
    },
    //处理图片移除
    handleRemove(file) {
      console.log(this.addForm.pics);
      const path = file.response.data.tmp_path;
      const index = this.addForm.pics.findIndex((item) => {
        item.pics === path;
      });
      this.addForm.pics.splice(index, 1);
      console.log(this.addForm.pics);
    },
    // -------------------------------------------------------------------------
    // 上传成功的回调
    handleSuccess(response) {
      console.log(response);
      // 拼接得到一个图片信息对象
      const picInfo = {
        pics: response.data.tmp_path,
      };
      // push到pic数组中
      this.addForm.pics.push(picInfo);
      //   console.log(this.addForm.pics);
    },
    // 添加商品
    async postGoods() {
      const form = _.cloneDeep(this.addForm);
      form.goods_cat = form.goods_cat.join(",");

      // 处理动态参数
      this.manyTableData.forEach((item) => {
        const newInfo = { attr_id: item.attr_id, attr_value: item.attr_val };
        this.addForm.attrs.push(newInfo);
      });
      // 处理静态属性
      this.onlyTableData.forEach((item) => {
        const newInfo = { attr_id: item.attr_id, attr_value: item.attr_val };
        this.addForm.attrs.push(newInfo);
      });
      form.attrs = this.addForm.attrs;
      console.log(form);
      // 发起请求
      const { data: res } = await this.$http.post("goods", form);
      if (res.meta.status !== 201) return this.$message.error("添加商品失败");
      this.$message.success("添加商品成功");
      this.$router.push("/goods");
    },
  },
};
</script>

<style lang="less" scoped>
.el-steps {
  margin: 10px auto;
}
.addbBtn {
  margin-top: 10px;
}
</style>