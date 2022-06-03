<template>
  <div></div>
</template>

<script>
export default {
  props: ["cateID"],
  methods: {
    //delete api
    async delete(attr_id) {
      console.log("delete");
      const { data: res } = await this.$http.delete(
        `categories/${this.cateID}/attributes/${attr_id}`
      );
      if (res.meta.status !== 200) return this.$message.error("失败");
      this.$message.success(res.meta.msg);

      // refresh table
      this.$emit("getParams");
    },
    // refesh the param list
  },
};
</script>

<style lang="less" scoped>
</style>