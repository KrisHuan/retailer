<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 图片区域 -->
      <div class="login_img">欢迎登录</div>
      <!-- 登录表单 -->
      <el-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginFormRules"
        label-width="20%"
        class="login_form"
      >
        <!-- 用户名 -->
        <el-form-item label="用户名:" prop="username"
          ><el-input
            v-model="loginForm.username"
            prefix-icon="el-icon-user-solid"
          ></el-input
        ></el-form-item>

        <!-- 密码 -->
        <el-form-item prop="password" label="密码:"
          ><el-input
            type="password"
            v-model="loginForm.password"
            prefix-icon="el-icon-lock"
          ></el-input
        ></el-form-item>
        <!-- 忘记密码 -->
        <el-form-item>
          <div class="forget"><a href="#">忘记密码</a></div>
        </el-form-item>
        <!-- 按钮 -->
        <el-form-item class="login_text" label-width="0px">
          <div class="center">
            <el-button type="primary" @click="login">登录</el-button>
          </div>
          <!-- <el-button type="info" @click="resetLoginForm">重置</el-button> -->
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loginForm: {
        username: "admin",
        password: "123456",
      },
      loginFormRules: {
        username: [
          {
            required: true,
            message: "请输入用户名",
            trigger: "blur",
          },
          {
            min: 3,
            max: 10,
            message: "长度在 3 到 10 个字符",
            trigger: "blur",
          },
        ],
        password: [
          {
            required: true,
            message: "请输入密码",
            trigger: "blur",
          },
          {
            min: 5,
            max: 15,
            message: "长度在 5 到 15 个字符",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    resetLoginForm() {
      this.$refs.loginFormRef.resetFields();
    },
    login() {
      this.$refs.loginFormRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$http.post("login", this.loginForm);
        if (res.meta.status !== 200) return this.$message.error("登录失败");
        this.$message.success("登录成功");
        window.sessionStorage.setItem("token", res.data.token);
        this.$router.push("/home");
      });
    },
  },
};
</script>

<style lang="less" scoped>
.login_container {
  background-color: #ffe4c4;
  background-image: linear-gradient(to bottom, #274276, #6c5d80);

  height: 100%;
}
.login_box {
  width: 600px;
  height: 450px;
  background-color: #fff;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);

  .login_img {
    width: 600px;
    height: 150px;
    background-color: #e5baba;
    text-align: center;
    line-height: 150px;
    color: white;
    font-size: 40px;
    text-shadow: 5px 5px 5px #ff0000;
  }
}
.center > .el-button {
  margin-left: 50%;
  transform: translateX(-50%);
  width: 200px;
  background-color: #004f9d;
}
.login_form {
  position: absolute;
  bottom: 0px;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}
.login_text {
  margin-bottom: 40px;
  margin-top: 60px;
}
.el-form-item {
  .forget {
    position: absolute;
    right: 12px;
    font-size: 14px;
  }
}
</style>
