<template>
  <div class="bs-wp">
    <!--oper row-->
    <el-row>
      <el-button type="primary" size="small" icon="el-icon-plus" @click="addNode">新增节点</el-button>
      <!--<el-form :model="nodeSrhForm" ref="nodeSrhForm" class="fr">-->
      <el-input v-model="nodeSrhForm.hostName" @keyup.native.enter="searchNodeList" size="small" maxlength="20"
                prefix-icon="el-icon-search" autocomplete="off" class="oper-right-search"></el-input>
      <!-- </el-form>-->
    </el-row>
    <!--list table row-->
    <el-row class="mgtp-10">
      <el-table class="w100" v-loading="loading" :data="nodeData" max-height="580" border>
        <el-table-column prop="hostName" label="主机名称" :resizable="resizable"></el-table-column>
        <el-table-column prop="ip" label="IP" width="200" :resizable="resizable"></el-table-column>
        <el-table-column :formatter="formatNodeType" prop="type" label="节点类型" width="180" :resizable="resizable"></el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="200" :resizable="resizable"></el-table-column>
        <el-table-column label="操作" align="center" width="220" :resizable="resizable">
          <template slot-scope="scope">
            <!--<el-button size="mini" @click="nodeEdit(scope)">编辑</el-button>-->
            <el-button type="danger" size="mini" class="iconfont icon-trash fs-12" @click="nodeDelete(scope)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <!--pagination row-->
    <el-row class="mgtp-10">
      <el-pagination class="fr"
                     @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :current-page.sync="currentPage"
                     :page-sizes="[10, 20, 50]"
                     :page-size="pageSize"
                     layout="total, sizes, prev, pager, next"
                     :total="nodeCount">
      </el-pagination>
    </el-row>
    <!--node add dialog-->
    <el-row>
      <nodeAdd ref="refNodeAddDialog" @refreshListTable="searchNodeList"></nodeAdd>
    </el-row>
  </div>
</template>

<script>
  import {cephNodeAPI} from "@/api/api";
  import nodeAdd from "./nodeAdd";

  export default {
    name: "nodeIndex",
    data() {
      return {
        resizable: false,
        loading: false,
        currentPage: 1,//分页当前页
        pageSize: 10,//分页每页数量
        nodeCount: 0,//数据总计
        nodeData: [],//数据
        nodeSrhForm: {
          hostName: ''
        }
      }
    },
    components: {nodeAdd},
    watch: {
      currentPage: 'searchNodeList',
      pageSize: 'searchNodeList'
    },
    mounted() {
      this.searchNodeList();
    },
    methods: {
      searchNodeList() {
        let vm = this;
        let pm = {
          pageSize: vm.pageSize,
          pageNum: vm.currentPage - 1,
          hostName: vm.nodeSrhForm.hostName
        }
        vm.loading = true;
        cephNodeAPI.search(pm).then(res => {
          vm.nodeData = res.datas;
          vm.nodeCount = res.totalNum;
          vm.loading = false;
        });
      },

      handleSizeChange(cz) {
        this.pageSize = cz;
      },
      handleCurrentChange(cp) {
        this.currentPage = cp;
      },
      formatNodeType(row, column, cellValue, index) {//格式化节点类型
        if (cellValue == '1') {
          return 'ceph-deploy';
        } else if (cellValue == '2') {
          return 'mon';
        } else {
          return 'deploy/mon';
        }
      },
      /*nodeEdit(scope){

      },*/
      nodeDelete(scope) {
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
              cephNodeAPI.del(pm).then(res => {
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
          vm.searchNodeList();//刷新列表
        }).catch(() => {//取消
        });
      },
      addNode() {
        this.$refs['refNodeAddDialog'].nodeAddDialog = true;
      }
    }
  }
</script>

<style scoped>

</style>
