<template>
  <el-dialog title="新增磁盘" :close-on-click-modal="!diskAddDialogShow" :show-close="!btnSubLoading" width="600px" :visible.sync="diskAddDialogShow"
             @close="close">
    <el-form v-model="diskAddForm" ref="diskAddForm">
      <el-form-item label="磁盘名称" :label-width="formLabelWidth">
        <el-input v-model="diskAddForm.diskName" maxlength="20" autocomplete="off" @blur="formatDiskName"></el-input>
      </el-form-item>
      <el-form-item label="磁盘大小" :label-width="formLabelWidth">
        <el-input v-model="diskAddForm.size" maxlength="20" autocomplete="off" @blur="formatDiskSize"></el-input>
      </el-form-item>
      <el-form-item label="状态" :label-width="formLabelWidth">
        <el-select class="w100" v-model="diskAddForm.status" placeholder="请选择">
          <el-option
            v-for="item in statusOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <!--<el-form-item label="类型">
        <el-select class="w100" v-model="nodeAddForm.type" placeholder="请选择">
          <el-option
            v-for="item in typeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>-->
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="diskAddDialogShow = false" v-show="!btnSubLoading">取 消</el-button>
      <el-button type="primary" :loading="btnSubLoading" @click="subDiskAddForm">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import {cephDiskAPI} from "@/api/api";
  import {formatUtils} from "@/utils/utils";

  export default {
    name: "diskAdd",
    data() {
      return {
        formLabelWidth: '120px',
        diskAddDialogShow: false,
        btnSubLoading: false,
        statusOptions: [
          {
            value: '1',
            label: '已使用'
          },
          {
            value: '2',
            label: '未使用'
          }
        ],
        diskAddForm: {
          diskName: '',
          size: '',
          status: '2'
        }
      }
    },
   /* props: ['diskAddDialogShow'],*/
    methods: {
      subDiskAddForm() {
        let vm = this;
        if(vm.diskAddForm.diskName == ''){
          vm.$message({
            message: '磁盘名称不能为空',
            type: 'warning'
          });
        }else if(vm.diskAddForm.size == ''){
          vm.$message({
            message: '磁盘大小不能为空',
            type: 'warning'
          });
        }else{
          vm.btnSubLoading = true;
          cephDiskAPI.add(vm.diskAddForm).then(res => {
            vm.btnSubLoading = false;
            if (res.msg == 'ok') {
              vm.$message({
                message: '新增成功',
                type: 'success'
              });
              vm.diskAddDialogShow = false;
              vm.$emit('refreshListTable', {});// $emit 触发父组件的自定义事件
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
      formatDiskName(){//格式化磁盘名称
        this.diskAddForm.diskName = formatUtils.noCHNAndSpec(this.diskAddForm.diskName);
      },
      formatDiskSize() {//格式化磁盘大小
        this.diskAddForm.size = formatUtils.num(this.diskAddForm.size);
      },
      close() {
        Object.assign(this.$data, this.$options.data());//拷贝,重新初始化data值
      }
      /*diskAddCancel() {
        this.$emit('showHideDiskAddDialog', {show: false})
      }*/
    }
  }
</script>

<style scoped>

</style>
