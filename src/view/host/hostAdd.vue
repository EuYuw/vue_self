<template>
  <el-dialog title="新增主机" :close-on-click-modal="!hostAddDialogShow" :show-close="!btnSubLoading" width="600px" :visible.sync="hostAddDialogShow" @close="close">
    <el-form v-model="hostAddForm" ref="hostAddForm">
      <el-form-item label="主机名称" :label-width="formLabelWidth">
        <el-input v-model="hostAddForm.hostName" maxlength="20" autocomplete="off" @blur="formatHostName"></el-input>
      </el-form-item>
      <el-form-item label="IP" :label-width="formLabelWidth">
        <el-input v-model="hostAddForm.ip" maxlength="20" autocomplete="off" @blur="formatHostIP"></el-input>
      </el-form-item>
      <el-form-item label="密码" :label-width="formLabelWidth">
        <el-input v-model="hostAddForm.password" type="password" maxlength="20" autocomplete="off"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="hostAddDialogShow = false" v-show="!btnSubLoading">取 消</el-button>
      <el-button type="primary" :loading="btnSubLoading" @click="subHostAddForm">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import {formatUtils} from "@/utils/utils";
  import {cephHostAPI} from "@/api/api";

  export default {
    name: "hostAdd",
    data() {
      return {
        hostAddDialogShow: false,
        formLabelWidth: '120px',
        btnSubLoading: false,
        hostAddForm: {
          hostName: '',
          ip: '',
          password: ''
        }
      }
    },
    methods: {
      subHostAddForm() {
        let vm = this, msg = null;
        if(vm.hostAddForm.hostName == ''){
          msg = '主机名称不能为空';
        }else if(vm.hostAddForm.ip == ''){
          msg = 'IP不能为空';
        }else if(vm.hostAddForm.password == ''){
          msg = '密码不能为空';
        }else{
          msg = null;
        }
        if(msg){
          vm.$message({
            message: msg,
            type: 'warning'
          });
        }else{
          vm.btnSubLoading = true;
          cephHostAPI.add(vm.hostAddForm).then(res => {
            vm.btnSubLoading = false;
            if(res.msg == 'ok'){
              vm.$message({
                message: '新增成功',
                type: 'success'
              });
              vm.hostAddDialogShow = false;
              vm.$emit('refreshListTable', {});
            }else{
              vm.$message({
                message: res.msg,
                type: 'error'
              });
            }
          }).catch(() => {
            vm.btnSubLoading = false;
          });
        }
      },
      formatHostName() {
        this.hostAddForm.hostName = formatUtils.noCHNAndSpec(this.hostAddForm.hostName);
      },
      formatHostIP() {
        this.hostAddForm.ip = formatUtils.numPoint(this.hostAddForm.ip);
      },
      close() {
        Object.assign(this.$data, this.$options.data());//拷贝,重新初始化data值
      }
    }
  }
</script>

<style scoped>

</style>
