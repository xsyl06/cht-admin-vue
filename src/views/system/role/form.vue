<script setup lang="ts">
import {ref} from "vue";
import {formRules} from "./utils/rule";
import {FormProps} from "./utils/types";
import {usePublicHooks} from "@/views/system/hooks";

const {switchStyle} = usePublicHooks();

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    id:null,
    roleName: "",
    roleCode: "",
    higherMenuOptions: [],
    menuList:[],
    state: true
  })
});
const ruleFormRef = ref();
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
    <el-form-item label="角色名称" prop="roleName">
      <el-input
          v-model="newFormInline.roleName"
          clearable
          placeholder="请输入角色名称"
      />
    </el-form-item>

    <el-form-item label="角色标识" prop="roleCode">
      <el-input
          v-model="newFormInline.roleCode"
          clearable
          placeholder="请输入角色标识"
      />
    </el-form-item>
    <el-form-item label="角色权限">
      <el-tree-select
        v-model="newFormInline.menuList"
        :data="newFormInline.higherMenuOptions"
        multiple
        show-checkbox
        check-strictly
        collapse-tags
        default-expand-all
        collapse-tags-tooltip
        :max-collapse-tags="4"
        check-on-click-node
        :empty-text="'暂无数据'"
        :render-after-expand="false"
        />
    </el-form-item>
    <el-form-item label="角色状态">
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

  </el-form>
</template>
