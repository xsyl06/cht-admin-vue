<script setup lang="ts">
import { ref } from "vue";
import ReCol from "@/components/ReCol";
import { formRules } from "./utils/rule";
import { FormProps } from "./utils/types";
import { usePublicHooks } from "../hooks";

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    title: "新增",
    id: null,
    nickName: "",
    userName: "",
    allRoleList:[],
    roleList:[],
    phone: "",
    email: "",
    state: true
  })
});
const ruleFormRef = ref();
const { switchStyle } = usePublicHooks();
const newFormInline = ref(props.formInline);
function getRef() {
  return ruleFormRef.value;
}

defineExpose({getRef});
</script>

<template>
  <el-form
    ref="ruleFormRef"
    :model="newFormInline"
    :rules="formRules"
    label-width="82px"
  >
    <el-row :gutter="30">
      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="登录名" prop="userName">
          <el-input
            v-model="newFormInline.userName"
            clearable
            :disabled="newFormInline.title === '修改' "
            placeholder="请输入登录名"
          />
        </el-form-item>
      </re-col>
      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="用户名称" prop="nickName">
          <el-input
            v-model="newFormInline.nickName"
            clearable
            placeholder="请输入用户名"
          />
        </el-form-item>
      </re-col>
      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="手机号" prop="phone">
          <el-input
            v-model="newFormInline.phone"
            :maxlength="11"
            clearable
            placeholder="请输入手机号"
          />
        </el-form-item>
      </re-col>

      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="邮箱" prop="email">
          <el-input
            v-model="newFormInline.email"
            clearable
            placeholder="请输入邮箱"
          />
        </el-form-item>
      </re-col>
      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="角色列表" prop="ids">
          <el-select
            v-model="newFormInline.roleList"
            placeholder="请选择"
            class="w-full"
            collapse-tags
            collapse-tags-tooltip
            :max-collapse-tags="3"
            clearable
            multiple
          >
            <el-option
              v-for="(item, index) in newFormInline.allRoleList"
              :key="index"
              :value="item.id"
              :label="item.roleName"
            >
              <span style="float: left">{{ item.roleName }}</span>
              <span
                v-if="!item.state"
                style="float: right;color: var(--el-color-danger);font-size: 13px;"
              >已停用</span>
            </el-option>
          </el-select>
        </el-form-item>
      </re-col>

      <re-col
        :value="12"
        :xs="24"
        :sm="24"
      >
        <el-form-item label="用户状态">
          <el-switch
            v-model="newFormInline.state"
            inline-prompt
            :active-value="true"
            :inactive-value="false"
            active-text="启用"
            inactive-text="停用"
            :style="switchStyle"
          />
        </el-form-item>
      </re-col>
    </el-row>
  </el-form>
</template>
