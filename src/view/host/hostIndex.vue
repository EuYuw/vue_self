<template>
  <div class="bs-wp">
    <!--oper row-->
    <el-row>
      <el-button type="primary" size="small" icon="el-icon-plus" @click="addHost">新增主机</el-button>
      <el-input v-model="hostSrhForm.hostName" @keyup.native.enter="searchHostList" size="small" maxlength="20"
                prefix-icon="el-icon-search" autocomplete="off" class="oper-right-search"></el-input>
    </el-row>
    <!--list table row-->
    <el-row class="mgtp-10">
      <el-table class="w100" v-loading="tabLoading" :data="hostData" max-height="580" border>
        <el-table-column prop="hostName" label="主机名称" :resizable="resizable"></el-table-column>
        <el-table-column prop="ip" label="IP" width="200" :resizable="resizable"></el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="220" :resizable="resizable"></el-table-column>
        <el-table-column label="操作" align="center" width="250" :resizable="resizable">
          <template slot-scope="scope">
            <!--<el-button size="mini" @click="nodeEdit(scope)">编辑</el-button>-->
            <el-button type="primary" size="mini" class="iconfont icon-browse fs-12" @click="hostViewDevice(scope)">查看存储设备</el-button>
            <el-button type="danger" size="mini" class="iconfont icon-trash fs-12" @click="hostDelete(scope)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <!--pagination row-->
    <el-row class="mgtp-10">
      <el-pagination class="fr"
                     @size-change="hostPageSizeChange"
                     @current-change="hostPageCurChange"
                     :current-page.sync="hostPageCur"
                     :page-sizes="[10, 20, 50]"
                     :page-size="hostPageSize"
                     layout="total, sizes, prev, pager, next"
                     :total="hostCount">
      </el-pagination>
    </el-row>
    <!--host add dialog-->
    <el-row>
      <hostAdd ref="refHostAddDialog" @refreshListTable="searchHostList"></hostAdd>
    </el-row>
  </div>
</template>

<script>
  import hostAdd from './hostAdd';
  import {cephHostAPI} from "@/api/api";

  export default {
    name: "hostIndex",
    data() {
      return {
        tabLoading: false,
        resizable: false,
        hostData: [],
        hostPageCur: 1,
        hostPageSize: 10,
        hostCount: 0,
        hostSrhForm: {
          hostName: ''
        }
      }
    },
    components: {hostAdd},
    watch: {
      hostPageSize: 'searchHostList',
      hostPageCur: 'searchHostList'
    },
    mounted() {
      debugger
      this.searchHostList();
    },
    methods: {
      searchHostList() {
        let vm = this;
        let pm = {
          pageSize: vm.hostPageSize,
          pageNum: vm.hostPageCur - 1,
          hostName: vm.hostSrhForm.hostName
        }
        vm.tabLoading = true;
        cephHostAPI.search(pm).then(res => {
          vm.hostData = res.datas;
          vm.hostCount = res.totalNum;
          vm.tabLoading = false;
        });
      },
      hostViewDevice(scope){

      },
      hostDelete(scope) {
        let vm = this;
        let pm = {
          id: scope.row.id
        };
        vm.$confirm('确定删除吗？', '提示', {
          closeOnClickModal: false,
          distinguishCancelAndClose: true,
          confirmButtonLoading: false,
          type: 'warning',
          beforeClose: (action, instance, done) => {
            if(action == 'confirm'){
              instance.confirmButtonLoading = true;
              cephHostAPI.del(pm).then(res => {
                if (res.msg == 'ok') {
                  instance.$message({
                    message: '删除成功',
                    type: 'success'
                  });
                  done();
                }else{
                  instance.$message({
                    message: res.msg,
                    type: 'error'
                  });
                }
              }).catch(() => {
                instance.confirmButtonLoading = false;
              });
            }else{
              done();
            }
          }
        }).then(() => {//确定
          vm.searchHostList();//刷新列表
        }).catch(() => {//取消
        });
      },
      hostPageSizeChange(cz) {
        this.hostPageSize =  cz;
      },
      hostPageCurChange(cp) {
        this.hostPageCur = cp;
      },
      addHost() {
        this.$refs['refHostAddDialog'].hostAddDialogShow = true;
      }
    }
  }
</script>

<style scoped>

</style>
