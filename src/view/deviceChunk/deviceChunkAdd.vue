<template>
  <el-dialog title="新增设备块" :close-on-click-modal="!deviceAddDialogShow" :show-close="!btnSubLoading" width="600px"
             :visible.sync="deviceAddDialogShow" @close="close">
    <el-form v-model="deviceAddForm" ref="deviceAddForm">
      <el-form-item label="设备块名称" :label-width="formLabelWidth">
        <el-input v-model="deviceAddForm.blockName" maxlength="48" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="IP" :label-width="formLabelWidth">
        <el-input v-model="deviceAddForm.ip" maxlength="20" autocomplete="off" @blur="formatDeviceIP"></el-input>
      </el-form-item>
      <el-form-item label="密码" :label-width="formLabelWidth">
        <el-input v-model="deviceAddForm.password" type="password" maxlength="20" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="挂载点" :label-width="formLabelWidth">
        <el-input v-model="deviceAddForm.mountPoint" maxlength="20" autocomplete="off" @blur="formatDeviceIP"></el-input>
      </el-form-item>
      <el-form-item label="映射" :label-width="formLabelWidth">
        <el-input v-model="deviceAddForm.poolName" maxlength="20" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="设备块大小" :label-width="formLabelWidth">
        <el-input v-model="deviceAddForm.size" maxlength="20" autocomplete="off" @blur="formatDeviceSize"></el-input>
      </el-form-item>
      <el-form-item label="状态" :label-width="formLabelWidth">
        <el-select class="w100" v-model="deviceAddForm.status" placeholder="请选择">
          <el-option
            v-for="item in statusOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="deviceAddDialogShow = false" v-show="!btnSubLoading">取 消</el-button>
      <el-button type="primary" :loading="btnSubLoading" @click="subDeviceAddForm">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import {blockDeviceAPI} from "@/api/api";
  import {formatUtils} from "@/utils/utils";

  export default {
    name: "deviceChunkAdd",
    data() {
      return {
        deviceAddDialogShow: false,
        formLabelWidth: '120px',
        btnSubLoading: false,
        statusOptions: [
          {
            value: '1',
            label: '已挂载'
          },
          {
            value: '2',
            label: '未挂载'
          }
        ],
        deviceAddForm: {
          blockName: '',
          ip: '',
          password: '',
          mountPoint: '',
          poolName: '',
          size: '',
          status: '2'
        }
      }
    },
    methods: {
      subDeviceAddForm() {
        let vm = this, msg = null;
        if(vm.deviceAddForm.blockName == ''){
          msg = '设备块名称不能为空';
        }else if(vm.deviceAddForm.ip == ''){
          msg = 'IP不能为空';
        }else if(vm.deviceAddForm.password == ''){
          msg = '密码不能为空';
        }else if(vm.deviceAddForm.mountPoint == ''){
          msg = '挂载点不能为空';
        }else if(vm.deviceAddForm.poolName == ''){
          msg = '映射不能为空';
        }else if(vm.deviceAddForm.size == ''){
          msg = '设备块大小不能为空';
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
          blockDeviceAPI.add(vm.deviceAddForm).then(res => {
            vm.btnSubLoading = false;
            if (res.msg == 'ok') {
              vm.$message({
                message: '新增成功',
                type: 'success'
              });
              vm.deviceAddDialogShow = false;
              vm.$emit('refreshListTable', {});// $emit 触发父组件的自定义事件
            } else {
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
      close() {
        Object.assign(this.$data, this.$options.data());//拷贝,重新初始化data值
      },
      formatDeviceIP() {
        this.deviceAddForm.ip = formatUtils.numPoint(this.deviceAddForm.ip);
      },
      formatDeviceSize() {
        this.deviceAddForm.size = formatUtils.num(this.deviceAddForm.size);
      }
    }
  }
</script>

<style scoped>

</style>
