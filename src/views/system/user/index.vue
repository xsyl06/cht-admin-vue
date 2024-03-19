<template>
  <div class="main">
    <el-form
      ref="formRef"
      :inline="true"
      :model="form"
      class="search-form bg-bg_color w-[99/100] pl-8 pt-[12px]"
    >
      <el-form-item label="登录名：" prop="userName">
        <el-input
          v-model="form.userName"
          placeholder="请输入登录名"
          clearable
          class="!w-[180px]"
        />
      </el-form-item>
      <el-form-item label="手机号：" prop="phone">
        <el-input
          v-model="form.phone"
          placeholder="请输入手机号"
          :maxlength="11"
          clearable
          class="!w-[180px]"
        />
      </el-form-item>
      <el-form-item label="状态：" prop="state">
        <el-select
          v-model="form.state"
          placeholder="请选择状态"
          clearable
          class="!w-[180px]"
        >
          <el-option label="已启用" value=true />
          <el-option label="已停用" value=false />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          :icon="useRenderIcon('search')"
          :loading="loading"
          @click="onSearch"
        >
          搜索
        </el-button>
        <el-button :icon="useRenderIcon(Refresh)" @click="resetForm(formRef)">
          重置
        </el-button>
      </el-form-item>
    </el-form>
    <el-alert
      title="注意：平台目前只能失效用户，以防止和用户由关联的查询报错"
      type="warning"
      show-icon

    />
    <PureTableBar
      title="用户管理"
      :columns="columns"
      @refresh="onSearch"
    >
      <template #buttons>
        <el-button
          type="primary"
          v-if="hasAuth(MenuPageButton.USER_ADD)"
          :icon="useRenderIcon(AddFill)"
          @click="openDialog()"
        >
          新增用户
        </el-button>
      </template>
      <template v-slot="{ size, dynamicColumns }">
        <pure-table
          align-whole="center"
          showOverflowTooltip
          table-layout="auto"
          :loading="loading"
          :size="size"
          adaptive
          :adaptiveConfig="{ offsetBottom: 108 }"
          :data="dataList"
          :columns="dynamicColumns"
          :pagination="pagination"
          :paginationSmall="size === 'small'"
          :header-cell-style="{
            background: 'var(--el-fill-color-light)',
            color: 'var(--el-text-color-primary)'
          }"
          @page-size-change="handleSizeChange"
          @page-current-change="handleCurrentChange"
        >
          <template #operation="{ row }">
            <el-button
              class="reset-margin"
              v-if="hasAuth(MenuPageButton.USER_UPDATE)"
              link
              type="primary"
              :size="size"
              :icon="useRenderIcon(EditPen)"
              @click="openDialog('修改', row)"
            >
              修改
            </el-button>
            <el-popconfirm
              :title="`是否确认重置[${row.nickName}]的密码`"
              @confirm="resetPwd(row)"
            >
              <template #reference>
                <el-button
                  v-if="hasAuth(MenuPageButton.USER_RESETPWD)"
                  class="reset-margin"
                  link
                  :type="'warning'"
                  :size="size"
                  :icon="useRenderIcon(reset)"
                >
                  重置密码
                </el-button>
              </template>
            </el-popconfirm>
          </template>
        </pure-table>
      </template>
    </PureTableBar>
  </div>
</template>

<script setup lang="ts">

import {useRenderIcon} from "@/components/ReIcon/src/hooks";
import Refresh from "@iconify-icons/ep/refresh";
import AddFill from "@iconify-icons/ri/add-circle-line";
import EditPen from "@iconify-icons/ep/edit-pen";
import reset from "@iconify-icons/mdi/lock-reset";
import {PureTableBar} from "@/components/RePureTableBar";
import {ref} from "vue";
import {useUser} from "@/views/system/user/utils/hook";
import {hasAuth} from "@/router/utils";
import {MenuPageButton} from "@/utils/permissionMenu";

defineOptions({
  name: "User"
});

const formRef = ref();
const {
  form,
  loading,
  columns,
  dataList,
  pagination,
  onSearch,
  resetForm,
  openDialog,
  resetPwd,
  handleSizeChange,
  handleCurrentChange
} = useUser();

</script>

<style scoped lang="scss">
:deep(.el-dropdown-menu__item i) {
  margin: 0;
}

.main-content {
  margin: 24px 24px 0 !important;
}

.search-form {
  :deep(.el-form-item) {
    margin-bottom: 12px;
  }
}
</style>
