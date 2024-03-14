import  dayjs  from "dayjs";
import {h, onMounted, reactive, ref, toRaw} from "vue";
import {usePublicHooks} from "@/views/system/hooks";
import {PaginationProps} from "@pureadmin/table";
import {ElMessageBox} from "element-plus";
import editForm from "../form.vue";
import {message} from "@/utils/message";
import {addUser, changeUseState, getUserList, getUserRoles, resetUserPwd, updateUser} from "@/api/userinfo";
import {hideTextAtIndex} from "@pureadmin/utils";
import {getAllRole} from "@/api/role";
import {FormItemProps} from "@/views/system/user/utils/types";
import {addDialog} from "@/components/ReDialog/index";

export function useUser(){
  const form = reactive({
    userName: "",
    phone: "",
    state: null,
    pageSize: 10,
    currentPage: 1
  });
  const formRef = ref();
  const dataList = ref([]);
  const loading = ref(true);
  const switchLoadMap = ref({});
  const allRoleList = ref([]);
  const roleList = ref([]);
  const {switchStyle} = usePublicHooks();
  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });

  const columns:TableColumnList=[
    {
      label: "用户编号",
      prop: "id",
      width: 90
    },
    {
      label: "登录名",
      prop: "userName",
      minWidth: 130
    },
    {
      label: "用户名",
      prop: "nickName",
      minWidth: 130
    },
    {
      label: "手机号码",
      prop: "phone",
      minWidth: 90,
      formatter: ({ phone }) => hideTextAtIndex(phone, { start: 3, end: 6 })
    },
    {
      label: "状态",
      prop: "state",
      minWidth: 90,
      cellRenderer: scope => (
        <el-switch
          size={scope.props.size === "small" ? "small" : "default"}
          loading={switchLoadMap.value[scope.index]?.loading}
          v-model={scope.row.state}
          active-value={true}
          inactive-value={false}
          active-text="已启用"
          inactive-text="已停用"
          inline-prompt
          style={switchStyle.value}
          onChange={() => onChange(scope as any)}
        />
      )
    },
    {
      label: "创建用户名",
      prop: "createUserName",
      minWidth: 130
    },
    {
      label: "创建时间",
      minWidth: 90,
      prop: "createTime",
      formatter: ({ createTime }) =>
        dayjs(createTime).format("YYYY-MM-DD HH:mm:ss")
    },
    {
      label: "操作",
      fixed: "right",
      width: 180,
      slot: "operation"
    }
  ];
  function onChange({row, index}) {
    ElMessageBox.confirm(
      `确认要<strong>${
        row.state ? "启用" : "停用"
      }</strong><strong style='color:var(--el-color-primary)'>[${
        row.nickName
      }]</strong>吗?`,
      "系统提示",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        dangerouslyUseHTMLString: true,
        draggable: true
      }
    )
      .then(() => {
        switchLoadMap.value[index] = Object.assign(
          {},
          switchLoadMap.value[index],
          {
            loading: true
          }
        );
        changeUseState(row).then(res=>{
          switchLoadMap.value[index] = Object.assign(
            {},
            switchLoadMap.value[index],
            {
              loading: false
            }
          );
          if (res.success) {
            message(`已${row.state ? "启用" : "停用"}${row.nickName}`, {
              type: "success"
            });
            onSearch();
          }else {
            message(res.message,{type: "error"});
            row.state ? (row.state = false) : (row.state = true);
          }
        })
      })
      .catch(res => {
        row.state ? (row.state = false) : (row.state = true);
      });
  }
  function handleSizeChange(val: number) {
    form.pageSize = val;
    onSearch();
  }

  function handleCurrentChange(val: number) {
    form.currentPage = val;
    onSearch();
  }

  async function onSearch() {
    loading.value = true;
    await getUserList(toRaw(form)).then(res => {
      if (res.success) {
        const data = res.data;
        dataList.value = data.list;
        pagination.total = data.total;
      } else {
        message(res.message, {type: "error"});
      }
      loading.value = false;
    });
  }

  async function getUserRoleIds(id: number) {
    await getUserRoles(id).then(res=>{
      if (res.success && res.data) {
        roleList.value = res.data;
      }
    })
  }
  async function openDialog(title = "新增", row?: FormItemProps) {
    roleList.value = [];
    if (row) {
      await getUserRoleIds(row.id);
    }
    addDialog({
      title: `${title}用户`,
      props: {
        formInline: {
          title:title,
          id:row?.id ?? null,
          nickName: row?.nickName ?? "",
          userName: row?.userName ?? "",
          allRoleList:allRoleList.value,
          roleList:roleList.value,
          phone: row?.phone ?? "",
          email: row?.email ?? "",
          state: row?.state ?? true
        }
      },
      width: "46%",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(editForm, { ref: formRef }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        const curData = options.props.formInline as FormItemProps;
        function chores() {
          done(); // 关闭弹框
          onSearch(); // 刷新表格数据
        }
        FormRef.validate(valid => {
          if (valid) {
            // 表单规则校验通过
            if (title === "新增") {
              // 实际开发先调用新增接口，再进行下面操作
              addUser(curData).then(res=>{
                if (res.success) {
                  message(res.message, {type: "success"});
                }else {
                  message(res.message, {type: "error"});
                }
                chores();
              })
            } else {
              updateUser(curData).then(res=>{
                if (res.success) {
                  message(res.message, {type: "success"});
                }else {
                  message(res.message, {type: "error"});
                }
                chores();
              })
            }
          }
        });
      }
    });
  }

  async function searchRole(){
    await getAllRole().then(res=>{
      if (res.success) {
        allRoleList.value = res.data;
      }else {
        message(res.message, {type: "error"});
      }
    })
  }

  function resetPwd(row?: FormItemProps) {
    resetUserPwd(row.id).then(res=>{
      if (res.success) {
        message(res.message, {type: "success"});
      }else {
        message(res.message, {type: "error"});
      }
    })
  }

  const resetForm = formEl => {
    if (!formEl) return;
    formEl.resetFields();
    onSearch();
  };

  onMounted(() => {
    onSearch();
    searchRole();
  });
  return {
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
  };
}
