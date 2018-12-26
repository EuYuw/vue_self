<template>
  <el-container class="h100">
    <el-header>
      <label class="pointer" @click="toHome">数据存储</label>
      <el-dropdown class=" fr" @command="handleCommand" :show-timeout="150" :hide-timeout="250">
        <span class="el-dropdown-link">
          {{userName}}<i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="personMsg">个人信息</el-dropdown-item>
          <el-dropdown-item command="logout">退出</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </el-header>
    <el-container class="el-con">
      <el-aside width="auto">
        <homeNav ref="homeNavCom"></homeNav>
      </el-aside>
      <el-main>
        <!--<transition name="el-fade-in">-->
          <router-view></router-view>
        <!--</transition>-->
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
  import homeNav from "./homeNav";
  import {userAPI} from "@/api/api";
  export default {
    name: "home",
    components: {homeNav},
    data() {
      return {
        userName: ""
      }
    },
    mounted(){
      debugger
      this.userName = JSON.parse(this.$store.getters.userCurrent).userName;
    },
    methods: {
      handleCommand(command){
        if(command === 'logout'){
          this.logout();
        }
      },
      logout() {
        let vm = this;
        vm.$store.dispatch('user/logout').then(() => {
          //vm.$store.commit("user/clearLogin");
          //vm.$store.commit('permission/resetRouter');
          //vm.$refs["homeNavCom"].$store.commit('permission/resetRouter');
          //vm.$router.push('/login');
          location.reload();
        });
      },
      toHome() {
        this.$router.push({path: '/home'});
        let obj = this.$refs['homeNavCom'].$refs['navMenu'];
        obj.updateActiveIndex(0);//取消active
        obj.closeMenu(obj.openedMenus[0]);//折叠nav
      }
    }
  }
</script>

<style scoped>
  .el-con {
    height: calc(100% - 60px);
  }
  .el-dropdown-link{
    color: #409EFF;
    cursor: pointer;
  }
</style>
