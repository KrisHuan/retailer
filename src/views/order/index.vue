
<template>
  <!-- 订单页面 -->
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索按钮 -->
    <el-card>
      <!-- 搜索 -->
      <el-row>
        <el-col :span="8">
          <el-input>
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!-- 列表 -->
      <el-table :data="goods" stripe style="width: 100%" border>
        <el-table-column label="索引" type="index" width="50">
        </el-table-column>
        <el-table-column prop="order_number" label="订单编号" width="180">
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货" width="100">
        </el-table-column>
        <el-table-column prop="order_price" label="商品价格 " width="100">
        </el-table-column>
        <el-table-column prop="pay_status" label="是否付款" width="100">
          <template slot-scope="scope">
            <el-tag type="default" v-if="scope.row.pay_status === '1'"
              >已付款</el-tag
            >
            <el-tag type="danger" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货" width="100">
        </el-table-column>
        <el-table-column prop="create_time" label="下单时间" width="180">
          <template slot-scope="scope">
            {{ scope.row.create_time | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="250">
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-edit"
            @click="showGeoDia()"
            >编辑地址</el-button
          >
          <el-button
            type="success"
            size="mini"
            icon="el-icon-location"
            @click="showProgressDia()"
            >进度查询</el-button
          >
        </el-table-column>
      </el-table>

      <!-- pagination -->
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum - 0"
        :page-sizes="[3, 5, 10, total]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next"
        :total="total"
      >
      </el-pagination>
      <!-- 地理位置对话框 -->
      <GeoDia ref="geoDia" />
      <ProgressDia ref="progressDia" />
    </el-card>
  </div>
</template>

<script>
import GeoDia from "./GeoDia.vue";
import ProgressDia from "./ProgressDia.vue";
export default {
  components: {
    GeoDia,
    ProgressDia,
  },
  data() {
    return {
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 10,
      },
      goods: [],
      total: 1,
    };
  },
  created() {
    this.getOrderList();
  },
  methods: {
    async getOrderList() {
      const { data: res } = await this.$http.get("orders", {
        params: this.queryInfo,
      });
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.$message.success(res.meta.msg);
      this.goods = res.data.goods;
      this.queryInfo.pagenum = res.data.pagenum;
      this.total = res.data.total;
      console.log(res);
    },
    // handleSizeChange
    handleSizeChange(pagesize) {
      this.queryInfo.pagesize = pagesize;
      this.getOrderList();
    },
    // handleCurrentChange
    handleCurrentChange(pagenum) {
      this.queryInfo.pagenum = pagenum;
      this.getOrderList();
    },
    // showdGeoDia
    showGeoDia() {
      this.$refs.geoDia.show();
    },
    // showProgressDia()
    showProgressDia() {
      this.$refs.progressDia.show();
    },
  },
};
</script>

<style lang="less" scoped>
</style>