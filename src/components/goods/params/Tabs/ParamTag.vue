<template>
  <div>
    <el-tag v-for="(item, i) in dyScope.row.attr_vals" :key="i">{{
      item
    }}</el-tag>
    {{ dyScope }}
  </div>
</template>

<script>
export default {
  props: ["dyScope"],
  data() {
    return {};
  },
  created() {
    console.log(this.dyScope.row);
  },
  methods: {},
};
</script>

<style lang="less" scoped>
</style>