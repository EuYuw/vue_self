<template>
  <!--oper row-->
  <div class="bs-wp">
    <el-row>
      <el-button type="primary" size="small" icon="el-icon-plus" @click="addCluster">创建集群</el-button>
    </el-row>
    <!-- cluster add dialog -->
    <el-row>
      <clusterAdd ref="refClusterAddDialog"></clusterAdd>
    </el-row>
  </div>
</template>

<script>
  import clusterAdd from "./clusterAdd";

  export default {
    name: "clusterIndex",
    data() {
      return {

      }
    },
    components: {clusterAdd},
    methods: {
      addCluster() {
        this.$refs['refClusterAddDialog'].clusterAddDialogShow = true;
        this.$refs['refClusterAddDialog'].activeStep = 1;
      }
    }
  }
</script>

<style scoped>

</style>
