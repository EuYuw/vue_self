<template>
  <el-dialog title="新增节点" :close-on-click-modal="!nodeAddDialog" :show-close="!btnSubLoading" width="600px" :visible.sync="nodeAddDialog" @close="close">
    <el-form v-model="nodeAddForm" ref="nodeAddForm">
      <el-form-item label="主机名称" :label-width="formLabelWidth">
        <el-input v-model="nodeAddForm.hostName" maxlength="20" autocomplete="off" @blur="formatHostName"></el-input>
      </el-form-item>
      <el-form-item label="IP" :label-width="formLabelWidth">
        <el-input v-model="nodeAddForm.ip" maxlength="20" autocomplete="off" @blur="formatIP"></el-input>
      </el-form-item>
      <el-form-item label="密码" :label-width="formLabelWidth">
        <el-input type="password" v-model="nodeAddForm.password" maxlength="20" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="类型" :label-width="formLabelWidth">
        <el-select class="w100" v-model="nodeAddForm.type" placeholder="请选择">
          <el-option
            v-for="item in typeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="nodeAddDialog = false" v-show="!btnSubLoading">取 消</el-button>
      <el-button type="primary" :loading="btnSubLoading" @click="subNodeAddForm">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import {cephNodeAPI} from "@/api/api";
  import {formatUtils} from "@/utils/utils";

  export default {
    name: "nodeAdd",
    data() {
      return {
        nodeAddDialog: false,
        btnSubLoading: false,
        formLabelWidth: '120px',
        typeOptions: [{
          value: '1',
          label: 'ceph-deploy'
        }, {
          value: '2',
          label: 'mon'
        }, {
          value: '3',
          label: 'deploy/mon'
        }],
        nodeAddForm: {
          hostName: '',
          ip: '',
          password: '',
          type: ''
        },
      }
    },
    mounted() {
    },
    methods: {
      subNodeAddForm() {
        let vm = this;
        if (vm.nodeAddForm.hostName == '') {
          vm.$message({
            message: '主机名称不能为空',
            type: 'warning'
          });
        } else if (vm.nodeAddForm.ip == '') {
          vm.$message({
            message: 'IP不能为空',
            type: 'warning'
          });
        } else if (vm.nodeAddForm.password == '') {
          vm.$message({
            message: '密码不能为空',
            type: 'warning'
          });
        } else if (vm.nodeAddForm.type == '') {
          vm.$message({
            message: '类型不能为空',
            type: 'warning'
          });
        } else {
          vm.btnSubLoading = true;
          cephNodeAPI.add(vm.nodeAddForm).then(res => {
            vm.btnSubLoading = false;
            if (res.msg == 'ok') {
              vm.$message({
                message: '新增成功',
                type: 'success'
              });
              vm.dialogFormShow = false;
              vm.$emit('refreshListTable', {});//刷新列表
            } else {
              vm.$message({
                message: res.msg,
                type: 'error'
              });
            }
          }).catch(() =>{
            vm.btnSubLoading = false;
          })
        }
      },
      formatIP() {//格式化IP
        this.nodeAddForm.ip = formatUtils.numPoint(this.nodeAddForm.ip);
      },
      formatHostName() {//格式化主机名称
        this.nodeAddForm.hostName = formatUtils.noCHNAndSpec(this.nodeAddForm.hostName);
      },
      close() {
        Object.assign(this.$data, this.$options.data());//拷贝,重新初始化data值
      }
    }
  }
</script>

<style scoped>

</style>
