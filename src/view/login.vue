<template>
  <el-container class="h100">
    <el-header><img src="../assets/logo.png" width="44px" /></el-header>
    <el-main>
      <el-form :style="loginFormCss" status-icon :model="loginForm" :rules="rules" ref="loginForm" label-width="100px"
               label-position="right">
        <el-form-item label="用户名" prop="name">
          <el-input v-model="loginForm.name" type="text" autocomplete="off"><i slot="prefix" class="el-input__icon el-icon-search"></i>
          </el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="loginForm.password" type="password" autocomplete="off"><i slot="prefix"
                                                                    class="el-input__icon el-icon-view"></i></el-input>
        </el-form-item>
        <el-form-item>
          <el-button class="w100" type="primary" :loading="btnLoginLoading" @click="submitForm('loginForm')">登录</el-button>
        </el-form-item>
      </el-form>
    </el-main>
    <el-footer></el-footer>
  </el-container>
</template>

<script>
  import { userAPI } from "@/api/api";
  export default {
    name: 'login',
    data() {
      let checkName = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('用户名不能为空'));
        } else {
          callback();
        }
      }
      let checkPsd = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('密码不能为空'));
        } else if (value.length < 6 || value.length > 18) {
          return callback(new Error('密码长度为6-18位'));
        } else {
          callback();
        }
      }
      return {
        btnLoginLoading: false,
        loginFormCss: {
          position: 'absolute',
          top: '50%',
          left: '50%',
          'margin-top': '-100px',
          width: '400px',
          height: '200px'
        },
        loginForm: {
          name: '',
          password: ''
        },
        rules: {
          name: [
            {validator: checkName, trigger: 'blur'}
          ],
          password: [
            {validator: checkPsd, trigger: 'blur'}
          ]
        }
      };
    },
    methods: {
      submitForm(form) {
        let vm = this;
        vm.$refs[form].validate((valid) => {
          if (valid) {
            let pm = {
              username: vm.loginForm.name,
              password: vm.loginForm.password
            }
            vm.btnLoginLoading = true;
            setTimeout(() => {
              vm.btnLoginLoading = false;
            }, 1000);
            userAPI.login(pm).then(res => {
              if (res) {
                sessionStorage.removeItem('routerAuth');//router历史表
                vm.$store.commit("user/saveLogin", res);
                vm.$router.push({path: '/home'});
              }
            }).catch(() =>{
            });
          } else {
            return false;
          }
        });
      }
    }
  }
</script>
<style scoped lang="scss">

</style>
