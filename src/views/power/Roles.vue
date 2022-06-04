<template>
  <div>
    <!-- //breadcrumb -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- card -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary"> 添加 </el-button>
        </el-col>
      </el-row>

      <el-table :data="rolesData" style="width: 100%" stripe border>
        <el-table-column type="expand" width="50">
          <template slot-scope="scope">
            <!-- 渲染权限 -->
            <el-row
              :span="5"
              v-for="(item1, index) in scope.row.children"
              :key="item1.id"
              :class="['bdbottom', index == 0 ? 'bdtop' : '', 'vcenter']"
            >
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag closable @close="remove(scope.row, item1.id)">
                  {{ item1.authName }}
                </el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二级和三级权限 -->
              <el-col :span="19">
                <el-row
                  v-for="(item2, index2) in item1.children"
                  :key="item2.id"
                  :class="[index2 == 0 ? '' : 'bdtop', 'vcenter']"
                >
                  <!-- 二级权限 -->
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="remove(scope.row, item2.id)"
                    >
                      {{ item2.authName }}
                    </el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>

                  <!-- 三级权限 -->
                  <el-col :span="18">
                    <el-row
                      v-for="(item3, index3) in item2.children"
                      :key="item3.id"
                      :class="[index3 == 0 ? '' : 'bdtop', 'vcenter']"
                    >
                      <el-col>
                        <el-tag
                          type="warning"
                          closable
                          @close="remove(scope.row, item3.id)"
                        >
                          {{ item3.authName }}
                        </el-tag>
                      </el-col>
                    </el-row>
                  </el-col>
                  <!-- -------------- -->
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" label="#" width="50"> </el-table-column>
        <el-table-column label="角色名字" prop="roleName" width="180">
        </el-table-column>
        <el-table-column label="角色描述" prop="roleDesc" width="180">
        </el-table-column>

        <el-table-column label="操作" width="300">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" icon="el-icon-edit"
              >编辑</el-button
            >
            <el-button type="warning" size="mini" icon="el-icon-delete"
              >删除</el-button
            >
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-setting"
              @click="showSetRightDialog(scope.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 分配权限对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="setRightDialogVisible"
      width="50%"
      @close="setRightDialogClosed"
    >
      <!-- tree -->
      <el-tree
        :data="rightsList"
        :props="treeProps"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="defKeys"
        ref="treeRef"
      ></el-tree>

      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rolesData: [],
      //setRightDialogVisible
      setRightDialogVisible: false,
      // all  rights data
      rightsList: [],
      // tree props
      treeProps: {
        children: "children",
        label: "authName",
      },
      //defKeys
      defKeys: [105, 116],
      //roleId
      roleId: "",
    };
  },
  created() {
    this.getRolesData();
  },
  methods: {
    async getRolesData() {
      const { data: res } = await this.$http.get("roles");
      this.rolesData = res.data;
    },
    // delete role
    async remove(role, rightId) {
      const isConfirm = await this.$confirm(
        "此操作将永久删除该角色, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);

      if (isConfirm !== "confirm") return;
      const { data: res } = await this.$http.delete(
        `roles/${role.id}/rights/${rightId}`
      );
      role.children = res.data;
    },

    //showSetRightDialog
    async showSetRightDialog(role) {
      this.roleId = role.id;
      const { data: res } = await this.$http.get(`rights/tree`);
      // reserve the data to rightsList
      this.rightsList = res.data;
      // 递归获取三级节点的ID
      this.getLeafKeys(role, this.defKeys);
      this.setRightDialogVisible = true;
    },
    // getLeafKeys
    getLeafKeys(node, arr) {
      if (!node.children) {
        return arr.push(node.id);
      }
      node.children.forEach((item) => {
        this.getLeafKeys(item, arr);
      });
    },
    //setRightDialogClosed
    setRightDialogClosed() {
      this.defKeys = [];
    },
    // allotRights
    async allotRights() {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys(),
      ];
      const idStr = keys.join(",");
      console.log(idStr);
      const { data: res } = await this.$http.post(
        `roles/${this.roleId}/rights`,
        {
          rids: idStr,
        }
      );
      // console.log(res);
      if (res.meta.status != 200) return this.$message("失败");
      this.setRightDialogVisible = false;
    },
  },
};
</script>

<style lang="less" scoped>
.el-col {
  margin-top: 5px;
  margin-bottom: 5px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}

.vcenter {
  display: flex;
  align-items: center;
}
</style>