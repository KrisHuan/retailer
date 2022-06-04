<template>
  <!-- 商品列表页面 -->
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            v-model="queryInfo.query"
            @blur="getGoodsList"
            clearable
            @clear="getGoodsList"
          >
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <!-- 添加商品区域 -->
        <el-col :span="4">
          <el-button type="primary" @click="goAddPage">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- 表格区域 -->
      <el-table :data="goods" border stripe style="width: 100%">
        <el-table-column type="index" width="60"> </el-table-column>
        <el-table-column prop="goods_name" label="商品名称" width="180">
        </el-table-column>
        <el-table-column prop="goods_id" label="商品id" width="100">
        </el-table-column>
        <el-table-column prop="goods_number" label="商品数量" width="100">
        </el-table-column>
        <el-table-column prop="goods_price" label="商品价格" width="100">
        </el-table-column>

        <el-table-column prop="add_time" label="添加时间" width="100">
          <template slot-scope="scope">
            {{ scope.row.add_time | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column prop="goods_weight" label="商品重量" width="180">
        </el-table-column>
        <el-table-column label="操作" width="100">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="edit(scope.row)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="del(scope.row.goods_id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- pagination -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background
      >
      </el-pagination>
    </el-card>

    <!-- 编辑框 -->
    <el-dialog title="编辑商品信息" :visible.sync="editDiaVis" width="50%">
      <span>编辑</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDiaVis = false">取 消</el-button>
        <el-button type="primary" @click="editDiaVis = false">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 删除框 -->

    <el-dialog title="删除商品信息" :visible.sync="delDiaVis" width="50%">
      <span>删除</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="delDiaVis = false">取 消</el-button>
        <el-button type="primary" @click="delDiaVis = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //查询参数对象
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 10,
      },
      //商品列表
      goods: [],
      //总数据条数
      total: 0,
      editDiaVis: false,
      delDiaVis: false,
    };
  },
  created() {
    this.getGoodsList();
  },
  methods: {
    async getGoodsList() {
      const { data: res } = await this.$http.get("goods", {
        params: this.queryInfo,
      });
      if (res.meta.status !== 200)
        return this.$message.error("获取商品列表失败");
      this.$message.success("获取商品列表成功");
      console.log("getGoodsList");
      console.log(res.data);
      this.goods = res.data.goods;
      this.pagenum = res.data.pagenum;
      this.total = res.data.total;
    },

    handleCurrentChange(num) {
      this.queryInfo.pagenum = num;
      this.getGoodsList();
    },
    handleSizeChange(size) {
      this.queryInfo.pagesize = size;
      this.getGoodsList();
    },
    // -------------------------------------------------------------------------
    async edit(row) {
      const { data: res } = await this.$http.put(`goods/${row.goods_id}`, {
        params: {
          goods_name: row.goods_name,
          goods_price: row.goods_price,
          goods_number: row.goods_number,
          goods_weight: row.goods_weight,
        },
      });
      if (res.meta.status !== 200) return this.$message.error("失败");
      this.$message.success("成功");
    },
    // -------------------------------------------------------------------------
    async del(id) {
      console.log(id);
      const { data: res } = await this.$http.delete(`goods/${id}`);
      if (res.meta.status !== 200) return this.$message.error("删除失败");
      this.$message.success("删除成功");
      this.getGoodsList();
    },
    goAddPage() {
      this.$router.push("/goods/add");
    },
  },
};
</script>

<style lang="less" scoped>
</style>