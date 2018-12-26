<template>
  <el-row>
    <el-row>
      <el-table class="w100" :data="nodeData"  max-height="400" border>
        <el-table-column type="selection" width="50" align="center" :resizable="resizable"></el-table-column>
        <el-table-column prop="hostName" label="主机名称" :resizable="resizable"></el-table-column>
        <el-table-column prop="ip" label="IP" width="200" :resizable="resizable"></el-table-column>
        <el-table-column :formatter="formatNodeType" prop="type" label="节点类型" width="180" :resizable="resizable"></el-table-column>
      </el-table>
    </el-row>
  </el-row>
</template>

<script>
  export default {
    name: "stepSecond",
    data() {
      return {
        resizable: false,
        nodeData: []
      }
    },
    mounted() {

    },
    methods: {
      formatNodeType(row, column, cellValue, index){
        if (cellValue == '1') {
          return 'ceph-deply';
        } else if (cellValue == '2') {
          return 'mon';
        } else {
          return 'deply/mon';
        }
      }
    }
  }
</script>

<style scoped>

</style>
