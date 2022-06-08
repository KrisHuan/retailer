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
          <el-button type="primary" @click="addRole()"> 添加 </el-button>
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
                <el-tag closable @close="delRights(scope.row, item1.id)">
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
                      @close="delRights(scope.row, item2.id)"
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
                          @close="delRights(scope.row, item3.id)"
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
        <el-table-column type="index" label="#" width="100"> </el-table-column>
        <el-table-column label="角色名字" prop="roleName" width="220">
        </el-table-column>
        <el-table-column label="角色描述" prop="roleDesc" width="294">
        </el-table-column>

        <el-table-column label="操作" width="500">
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-edit"
              @click="showEditDia(scope.row)"
              >编辑</el-button
            >
            <el-button
              type="warning"
              size="mini"
              icon="el-icon-delete"
              @click="delRole(scope.row)"
              >删除</el-button
            >
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-setting"
              @click="showSetRightDialog(scope.row.id)"
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
        :default-checked-keys="defKeys"
        ref="treeRef"
      ></el-tree>

      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑角色对话框 -->
    <del-role :delDiaVisible="delDiaVisible"></del-role>
    <!-- 删除角色对话框 -->
    <edit-role ref="editRole"></edit-role>
    <!-- 添加角色对话框 -->
    <add-role ref="addRole"></add-role>
  </div>
</template>

<script>
import DelRole from "./DelRole.vue";
import EditRole from "./EditRole.vue";
import AddRole from "./AddRole.vue";
export default {
  components: {
    EditRole,
    DelRole,
    AddRole,
  },
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
      // 控制删除角色对话框显示
      delDiaVisible: false,
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
    // 删除角色
    async delRole(role) {
      this.roleId = role.id;
      const isConfirm = await this.$confirm(
        "此操作将永久删除该角色, 是否继续?",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      if (isConfirm !== "confirm") return;
      const res = await this.$http.delete(`roles/${this.roleId}`);
      console.log(res);
    },

    // delRights 删除角色指定权限
    async delRights(role, rightId) {
      const roleId = role.id;
      const { data: res } = await this.$http.delete(
        `roles/${roleId}/rights/${rightId}`
      );
      if (res.meta.status !== 200)
        return this.$messaparamse.error(res.meta.msg);
      this.$message.success(res.meta.msg);
      this.getRolesData();
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
      const { data: res } = await this.$http.post(
        `roles/${this.roleId}/rights`,
        {
          rids: idStr,
        }
      );
      console.log(res);
      if (res.meta.status != 200) return this.$message("失败");
      this.setRightDialogVisible = false;
    },

    showDelDia() {
      this.delDiaVisible = true;
    },
    // 展示编辑对话框
    showEditDia(row) {
      this.$refs.editRole.show(row);
    },

    /// addRole 添加角色
    async addRole() {
      const { data: res } = await this.$http.post(`roles`, {
        roleName: "admin2",
        roleDesc: "admin2Desc",
      });

      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.$message.success(res.meta.msg);
    },
    addRole() {
      this.$refs.addRole.show();
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