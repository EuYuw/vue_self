<template>
  <el-dialog title="创建集群" ref="clusterAddDialog" :close-on-click-modal="!clusterAddDialogShow"
             :show-close="!snBtnLoading"
             :visible.sync="clusterAddDialogShow" @closed="closed">
    <el-steps :active="activeStep">
      <el-step title="添加节点" :status="stepStatus1"></el-step>
      <el-step title="选择deploy节点" :status="stepStatus2"></el-step>
      <el-step title="选择osd" :status="stepStatus3"></el-step>
      <el-step title="创建完成" :status="stepStatus4"></el-step>
    </el-steps>
    <el-row>
      <div class="h400" v-show="activeStep == 1">
        <stepFirst ref="refStepFirst"></stepFirst>
      </div>
      <div class="h400" v-show="activeStep == 2">
        <stepSecond ref="refStepSecond"></stepSecond>
      </div>
      <div class="h400" v-show="activeStep == 3">
        <stepThird ref="refStepThird"></stepThird>
      </div>
      <div class="h400" v-show="activeStep == 4">
        <stepFourth ref="refStepFourth"></stepFourth>
      </div>
    </el-row>
    <el-row class="mgtp-10">
      <el-button type="primary" size="small" :loading="sbBtnLoading" @click="stepBack"
                 v-show="activeStep > 1 && activeStep < 4" icon="el-icon-arrow-left">下一步
      </el-button>
      <el-button type="primary" size="small" :loading="snBtnLoading" @click="beforeStepNext" v-show="activeStep < 4">下一步<i
        class="el-icon-arrow-right el-icon--right"></i></el-button>
      <el-button type="primary" size="small" @click="" v-show="activeStep == 4" icon="el-icon-check">完成</el-button>
    </el-row>
  </el-dialog>
</template>

<script>
  import stepFirst from './stepFirst';
  import stepSecond from './stepSecond';
  import stepThird from './stepThird';
  import stepFourth from './stepFourth';
  import {cephClusterAPI} from "@/api/api";

  export default {
    name: "clusterAdd",
    data() {
      return {
        clusterAddDialogShow: false,
        sbBtnLoading: false,
        snBtnLoading: false,
        activeStep: 1,
        stepStatus1: 'process',
        stepStatus2: 'wait',
        stepStatus3: 'wait',
        stepStatus4: 'wait'
      }
    },
    components: {stepFirst, stepSecond, stepThird, stepFourth},
    updated() {

    },
    mounted() {
      this.$nextTick(() => {
       /* this.$refs['refStepSecond'].searchNodeList();*/
      })
    },
    methods: {
      stepBack() {
        this.activeStep--;
        this['stepStatus' + this.activeStep] = 'process';
        for (let q = this.activeStep + 1; q <= 4; q++) {
          this['stepStatus' + q] = 'wait';
        }
      },
      beforeStepNext() {
        let flag = true, vm = this;
        switch (this.activeStep) {
          case 1:
            let cdArr = vm.$refs['refStepFirst'].choseDataArr;
            if (cdArr.length == 0 || cdArr.length != 3) {
              flag = false;
            } else {
              for (let i = 0; i < cdArr.length; i++) {
                if (cdArr[i]['type'] == '1') {
                  flag = true;
                  break;
                } else {
                  flag = false;
                }
              }
            }
            if (!flag) {
              vm.$message({
                message: '请选择3条节点数据，且至少一个节点类型为ceph-deploy',
                type: 'warning'
              });
            } else {
              vm.snBrnLoading = true;
              cephClusterAPI.verifyNode(cdArr).then(res => {
                vm.snBrnLoading = false;
                if (res.status == 'true') {
                  vm.$message({
                    message: res.msg,
                    type: 'success'
                  });
                  vm.$refs['refStepSecond'].nodeData = cdArr;
                  vm.stepNext();
                } else {
                  vm.$message({
                    message: res.msg,
                    type: 'error'
                  });
                }
              }).catch(() => {
                vm.snBrnLoading = false;
              });
            }
            break;
          case 2:

            break;
          case 3:

            break;
          default:
            break;
        }
      },
      stepNext() {
        this.activeStep++;
        this['stepStatus' + this.activeStep] = 'process';
        for (let q = 1; q < this.activeStep; q++) {
          this['stepStatus' + q] = 'success';
        }
        if (this.activeStep == 4) {
          this.stepStatus4 = 'success';
        }
      },
      closed() {
        this.$refs['refStepFirst'].choseDataArr = [];
        this.$refs['refStepFirst'].$refs['sfNodeTable'].clearSelection();
        //Object.assign(this.$refs['refStepFirst'].$data, this.$refs['refStepFirst'].$options.data());
        Object.assign(this.$refs['refStepSecond'].$data, this.$refs['refStepSecond'].$options.data());
        Object.assign(this.$refs['refStepThird'].$data, this.$refs['refStepThird'].$options.data());
        Object.assign(this.$refs['refStepFourth'].$data, this.$refs['refStepFourth'].$options.data());
        Object.assign(this.$data, this.$options.data());
      },
    },
    destroyed() {
    }
  }
</script>

<style scoped>
  .h400 {
    height: 400px;
    overflow: auto;
  }
</style>
