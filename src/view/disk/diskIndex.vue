<template>
  <div class="bs-wp">
    <!--handle row-->
    <el-row>
      <el-button type="primary" size="small" icon="el-icon-plus" @click="addDisk">新增磁盘</el-button>
      <el-input v-model="diskSrhForm.diskName" @keyup.native.enter="searchDiskList" size="small" maxlength="20"
                prefix-icon="el-icon-search" autocomplete="off" class="oper-right-search"></el-input>
    </el-row>
    <!--list table row-->
    <el-row class="mgtp-10">
      <el-table class="w100" v-loading="tabLoading" :data="diskData" max-height="580" border>
        <el-table-column prop="diskName" label="磁盘名称" :resizable="resizable"></el-table-column>
        <el-table-column prop="size" label="磁盘大小" width="200" :resizable="resizable"></el-table-column>
        <el-table-column :formatter="formatDiskStatus" prop="status" label="磁盘状态" width="180" :resizable="resizable"></el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="220" :resizable="resizable"></el-table-column>
        <el-table-column label="操作" align="center" width="150" :resizable="resizable">
          <template slot-scope="scope">
            <!--<el-button size="mini" @click="nodeEdit(scope)">编辑</el-button>-->
            <el-button type="danger" size="mini" class="iconfont icon-trash fs-12" @click="diskDelete(scope)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <!--pagination row-->
    <el-row class="mgtp-10">
      <el-pagination class="fr"
                     @size-change="diskPageSizeChange"
                     @current-change="diskPageCurChange"
                     :current-page.sync="diskPageCur"
                     :page-sizes="[10, 20, 50]"
                     :page-size="diskPageSize"
                     layout="total, sizes, prev, pager, next"
                     :total="diskCount">
      </el-pagination>
    </el-row>
    <!--disk add dialog row-->
    <el-row>
      <diskAdd ref="refDiskAddDialog" @refreshListTable="searchDiskList"></diskAdd>
    </el-row>
  </div>
</template>

<script>
  import {cephDiskAPI} from "@/api/api";
  import diskAdd from "./diskAdd";

  export default {
    name: "diskIndex",
    data() {
      return {
        tabLoading: false,
        resizable: false,
        diskData: [],
        diskPageCur: 1,
        diskPageSize: 10,
        diskCount: 0,
        diskSrhForm: {
          diskName: ''
        }
      }
    },
    components: { diskAdd },
    watch: {
      diskPageCur: 'searchDiskList',
      diskPageSize: 'searchDiskList'
    },
    mounted() {
      this.searchDiskList();
    },
    methods: {
      searchDiskList() {
        let vm = this;
        let pm = {
          pageSize: vm.diskPageSize,
          pageNum: vm.diskPageCur - 1,
          diskName: vm.diskSrhForm.diskName
        }
        vm.tabLoading = true;
        cephDiskAPI.search(pm).then(res => {
          vm.diskData = res.datas;
          vm.diskCount = res.totalNum;
          vm.tabLoading = false;
        });
      },
      formatDiskStatus(row, column, cell, index) {
        if(cell == '2'){
          return '未使用';
        }
        if(cell == '1'){
          return '已使用';
        }
      },
      diskDelete(scope) {
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
              cephDiskAPI.del(pm).then(res => {
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
      diskPageSizeChange(cz){
        this.diskPageSize = cz;
      },
      diskPageCurChange(cp){
        this.diskPageCur = cp;
      },
      addDisk(){
        this.$refs['refDiskAddDialog'].diskAddDialogShow = true;
      },
      /*triggerDiskDialogShowHide(val) {
        this.diskAddDialogShow = val.show;
      }*/
    }
  }
</script>

<style scoped>

</style>
