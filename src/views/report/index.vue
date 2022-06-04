<template>
  <!-- 数据报表页面 -->
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!-- 为 ECharts 准备一个定义了宽高的 DOM -->
      <div ref="e" style="width: 1000px; height: 500px"></div>
    </el-card>
  </div>
</template>

<script>
import echarts from "echarts";
import _ from "lodash";
export default {
  data() {
    return {
      // 服务器返回对象
      eOption: {},
      // 需要合并的外部对象
      options: {
        color: ["#80FFA5", "#00DDFF", "#37A2FF", "#FF0087", "#FFBF00"],
        title: {
          text: "用户来源",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#E9EEF3",
            },
          },
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: [
          {
            boundaryGap: false,
          },
        ],
        yAxis: [
          {
            type: "value",
          },
        ],

        series: [
          {
            symbol: "none", //去掉折线图中的节点
            smooth: false, //true 为平滑曲线，false为直线
          },
        ],
      },
    };
  },
  computed: {
    mergeOpt() {
      return _.merge(this.options, this.eOption);
    },
  },

  mounted() {
    this.getOption();
  },

  created() {},
  methods: {
    async getOption() {
      const { data: res } = await this.$http.get(`reports/type/1`);
      this.eOption = res.data;
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.$message.success(res.meta.msg);
      this.initChart();
    },

    initChart() {
      var myChart = echarts.init(this.$refs.e, "dark");
      console.log(this.eOption);
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(this.mergeOpt);
    },
  },
};
</script>

<style lang="less" scoped>
</style>

