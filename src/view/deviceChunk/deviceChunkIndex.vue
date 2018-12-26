<template>
  <div class="bs-wp">
    <!--handle row-->
    <el-row>
      <el-button type="primary" size="small" icon="el-icon-plus" @click="addDevice">新增设备块</el-button>
      <el-input v-model="deviceSrhForm.blockName" @keyup.native.enter="" size="small" maxlength="20"
                prefix-icon="el-icon-search" autocomplete="off" class="oper-right-search"></el-input>
    </el-row>
    <!--list table row-->
    <el-row class="mgtp-10">
      <el-table class="w100" v-loading="tabLoading" :data="deviceData" max-height="580" border>
        <el-table-column prop="blockName" label="设备名称" :resizable="resizable"></el-table-column>
        <el-table-column prop="ip" label="IP" width="140" :resizable="resizable"></el-table-column>
        <el-table-column prop="mountPoint" label="挂载点" width="200" :resizable="resizable"></el-table-column>
        <el-table-column prop="映射" label="池名称" width="220" :resizable="resizable"></el-table-column>
        <el-table-column prop="size" label="大小" width="120" :resizable="resizable"></el-table-column>
        <el-table-column :formatter="formatDeviceStatus" prop="status" label="状态" width="140" :resizable="resizable"></el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="180" :resizable="resizable"></el-table-column>
        <el-table-column label="操作" align="center" width="240" :resizable="resizable">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" v-if="scope.row.status == '2'" class="iconfont icon-lock fs-12" @click="deviceMount(scope)">挂载</el-button>
            <el-button type="danger" size="mini" v-if="scope.row.status == '1'" class="iconfont icon-unlock fs-12" @click="deviceUnMount(scope)">卸载</el-button>
            <el-button type="danger" size="mini" icon="el-icon-delete" @click="deviceDelete(scope)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <!--pagination row-->
    <el-row class="mgtp-10">
      <el-pagination class="fr"
                     @size-change="devicePageSizeChange"
                     @current-change="devicePageCurChange"
                     :current-page.sync="devicePageCur"
                     :page-sizes="[10, 20, 50]"
                     :page-size="devicePageSize"
                     layout="total, sizes, prev, pager, next"
                     :total="deviceCount">
      </el-pagination>
    </el-row>
    <!--device add dialog row-->
    <el-row>
      <deviceChunkAdd ref="refDeviceAddDialog" @refreshListTable="searchDeviceList"></deviceChunkAdd>
    </el-row>
  </div>
</template>

<script>
  import {blockDeviceAPI} from "@/api/api";
  import deviceChunkAdd from "./deviceChunkAdd";

  export default {
    name: "deviceChunkIndex",
    data() {
      return {
        deviceSrhForm: {
          blockName: ''
        },
        resizable: false,
        tabLoading: false,
        deviceData: [],
        devicePageCur: 1,
        devicePageSize: 10,
        deviceCount: 0
      }
    },
    components: {deviceChunkAdd},
    watch: {
      devicePageCur: 'searchDeviceList',
      devicePageSize: 'searchDeviceList'
    },
    mounted() {
      this.searchDeviceList();
    },
    methods: {
      searchDeviceList() {
        let vm = this;
        let pm = {
          pageSize: vm.devicePageSize,
          pageNum: vm.devicePageCur - 1,
          blockName: vm.deviceSrhForm.blockName
        }
        vm.tabLoading = true;
        blockDeviceAPI.search(pm).then(res => {
          vm.deviceData = res.datas;
          vm.deviceCount = res.totalNum;
          vm.tabLoading = false;
        });
      },
      devicePageSizeChange(cz) {
        this.devicePageSize = cz;
      },
      devicePageCurChange(cp) {
        this.devicePageCur = cp;
      },
      formatDeviceStatus(row, column, cell, index) {
        if (cell == '1') {
          return '已挂载';
        }
        if (cell == '2') {
          return '未挂载';
        }
      },
      deviceMount(scope) {

      },
      deviceUnMount(scope) {

      },
      deviceDelete(scope) {
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
            if (action == 'confirm') {
              instance.confirmButtonLoading = true;
              blockDeviceAPI.del(pm).then(res => {
                if (res.msg == 'ok') {
                  instance.$message({
                    message: '删除成功',
                    type: 'success'
                  });
                  done();
                } else {
                  instance.$message({
                    message: res.msg,
                    type: 'error'
                  });
                }
              }).catch(() => {
                instance.confirmButtonLoading = false;
              });
            } else {
              done();
            }
          }
        }).then(() => {//确定
          vm.searchDeviceList();//刷新列表
        }).catch(() => {//取消
        });
      },
      addDevice() {
        this.$refs['refDeviceAddDialog'].deviceAddDialogShow = true;
      }
    }
  }
</script>

<style scoped>

</style>
