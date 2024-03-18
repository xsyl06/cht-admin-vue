<template>
  <el-form
    ref="ruleFormRef"
    :model="newFormInline"
    :rules="formRules"
    label-width="82px"
  >
    <el-form-item label="用户名" prop="nickName">
      <el-input
        v-model="newFormInline.nickName"
        disabled
      />
    </el-form-item>

    <el-form-item label="原密码" prop="oldPwd">
      <el-input
        v-model="newFormInline.oldPwd"
        clearable
        show-password
        placeholder="请输入原密码"
      />
    </el-form-item>
    <el-form-item label="新密码" prop="password">
      <el-input
        v-model="newFormInline.password"
        clearable
        show-password
        placeholder="请输入新密码"
      />
    </el-form-item>
    <el-form-item label="重复密码" prop="rePassword">
      <el-input
        v-model="newFormInline.rePassword"
        show-password
        clearable
        placeholder="请再次输入新密码"
      />
    </el-form-item>
    <div class="mt-4 flex">
      <div
        v-for="({ color, text },index) in pwdProgress"
        class="w-[19vw]"
        :style="{'marginLeft':index !==0 ? '4px':0}"
      >
        <ElProgress
          striped
          striped-flow
          :duration="curScore === index ? 6 : 0"
          :percentage="curScore >= index ? 100 : 0"
          :color=color
          :stroke-width=10
          :show-text="false"
        />
        <p class="text-center" :style="{'color':curScore===index?color:''}">
          {{text}}
        </p>
      </div>
    </div>
  </el-form>

</template>

<script setup lang="ts">
import {ref,reactive, watch} from "vue";
import {isAllEmpty} from "@pureadmin/utils";
import {zxcvbn} from "@zxcvbn-ts/core";
import {FormProps} from "@/layout/components/changePwd/changePwdForm";
import {FormRules} from "element-plus";

const pwdProgress = [
  { color: "#e74242", text: "非常弱" },
  { color: "#EFBD47", text: "弱" },
  { color: "#ffa500", text: "一般" },
  { color: "#1bbf1b", text: "强" },
  { color: "#008000", text: "非常强" }
];
// 当前密码强度（0-4）
const curScore = ref();
const props = withDefaults(defineProps<FormProps>(), {
    formInline: () => ({
        nickName: "",
        oldPwd: "",
        password: "",
        rePassword: ""
    })
});
const ruleFormRef = ref();
const newFormInline = ref(props.formInline);

function getRef() {
    return ruleFormRef.value;
}
defineExpose({getRef});
watch(
    ()=>newFormInline.value.password,
    (newValue,oldValue) =>
        (curScore.value = isAllEmpty(newValue) ? -1 : zxcvbn(newValue).score)
);
const validatePass2 = (rule,value,callback) => {
  if(newFormInline.value.password !=='' && value!==newFormInline.value.password){
    callback(new Error("两次输入密码不一致"));
  }else{
    callback();
  }
}
const validatePass = (rule,value,callback) => {
  if(newFormInline.value.rePassword !=='' && value!==newFormInline.value.rePassword){
    callback(new Error("两次输入密码不一致"));
  }else{
    callback();
  }
}

const formRules = reactive(<FormRules>{
  oldPwd: [{ required: true, message: "原密码为必填项", trigger: "blur" }],
  password: [{ required: true, message: "新密码为必填项", trigger: "blur" },{validator:validatePass,trigger:"blur"}],
  rePassword: [{ required: true, message: "重复新密码为必填项", trigger: "blur" },{validator:validatePass2,trigger:"blur"}]
});

</script>

<style scoped>

</style>
