<template>
    <el-row>
      <el-table class="w100" ref="sfNodeTable" v-loading="tabLoading" :data="nodeData" @selection-change="handleSelectChange" max-height="400" border>
        <el-table-column type="selection" width="50" align="center" :resizable="resizable"></el-table-column>
        <el-table-column prop="hostName" label="主机名称" :resizable="resizable"></el-table-column>
        <el-table-column prop="ip" label="IP" width="200" :resizable="resizable"></el-table-column>
        <el-table-column :formatter="formatNodeType" prop="type" label="节点类型" width="180" :resizable="resizable"></el-table-column>
      </el-table>
    </el-row>
</template>

<script>
  import {cephNodeAPI} from "@/api/api";
  import {formatUtils} from "@/utils/utils";

  export default {
    name: "stepFirst",
    data() {
      return {
        tabLoading: false,
        resizable: false,
        nodeData: [],//节点列表 array
        choseDataArr: []//checked array
      }
    },
    created() {
    },
    beforeCreate() {
    },
    beforeUpdate(){
    },
    mounted() {
      this.$nextTick(() => {
        this.searchNodeList();
      });
    },
    methods: {
      searchNodeList() {
        let vm = this;
        let pm = {
          pageSize: 100,
          pageNum: 0
        }
        vm.tabLoading = true;
        cephNodeAPI.search(pm).then(res => {
          vm.nodeData = res.datas;
          vm.tabLoading = false;
        });
      },
      handleSelectChange(tv) {
        this.choseDataArr = tv;
      },
      formatNodeType(row, column, cellValue, index){
        if (cellValue == '1') {
          return 'ceph-deploy';
        } else if (cellValue == '2') {
          return 'mon';
        } else {
          return 'deploy/mon';
        }
      }
    }
  }
</script>

<style scoped>

</style>
