import dayjs from "dayjs";
import editForm from "../form.vue";
import {message} from "@/utils/message";
import {ElMessageBox} from "element-plus";
import {usePublicHooks} from "../../hooks";
import {addDialog} from "@/components/ReDialog";
import type {FormItemProps} from "../utils/types";
import type {PaginationProps} from "@pureadmin/table";
import {reactive, ref, onMounted, h, toRaw} from "vue";
import {addRole, changeState, deleteRole, getAllMenuList, getMenusByRoleId, getRoleList, updateRole} from "@/api/role";
import {cloneDeep} from "@pureadmin/utils";
import {hasAuth} from "@/router/utils";
import {MenuPageButton} from "@/utils/permissionMenu";

export function useRole() {
  const form = reactive({
    roleName: "",
    roleCode: "",
    state: null,
    pageSize: 10,
    currentPage: 1
  });
  const formRef = ref();
  const dataList = ref([]);
  const loading = ref(true);
  const switchLoadMap = ref({});
  const allMenuList = ref([]);
  const menuList = ref([]);
  const {switchStyle} = usePublicHooks();
  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });
  const columns: TableColumnList = [
    {
      label: "角色编号",
      prop: "id",
      minWidth: 100
    },
    {
      label: "角色名称",
      prop: "roleName",
      minWidth: 120
    },
    {
      label: "角色标识",
      prop: "roleCode",
      minWidth: 150
    },
    {
      label: "状态",
      minWidth: 130,
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
      label: "创建用户",
      prop: "createUserName",
      minWidth: 150
    },
    {
      label: "创建时间",
      minWidth: 180,
      prop: "createTime",
      formatter: ({createTime}) =>
        dayjs(createTime).format("YYYY-MM-DD HH:mm:ss")
    },
    {
      label: "操作",
      fixed: "right",
      width: 240,
      slot: "operation"
    }
  ];


  function onChange({row, index}) {
    ElMessageBox.confirm(
      `确认要<strong>${
        row.state ? "启用" : "停用"
      }</strong><strong style='color:var(--el-color-primary)'>${
        row.roleName
      }</strong>吗?`,
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
        changeState(row).then(res=>{
          switchLoadMap.value[index] = Object.assign(
            {},
            switchLoadMap.value[index],
            {
              loading: false
            }
          );
          if (res.success) {
            message(`已${row.state ? "启用" : "停用"}${row.roleName}`, {
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

  function handleDelete(row) {
    deleteRole(row.id).then(res=>{
      if (res.success) {
        message(`已删除${row.roleName}的角色及角色关联的权限`, {
          type: "success"
        });
      }else {
        message(res.message,{type: "error"});
      }
    })
    onSearch();
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
    await getRoleList(toRaw(form)).then(res => {
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

  const resetForm = formEl => {
    if (!formEl) return;
    formEl.resetFields();
    onSearch();
  };

  async function searchAllMenuList() {
    await getAllMenuList()
      .then(res => {
        if (res.success) {
          allMenuList.value = res.data;
        } else {
          message(res.message, {type: "error"});
        }
      });
  }

  async function queryMenuListByRoleId(id?: number) {
    await getMenusByRoleId(id)
      .then(res => {
        if (res.success) {
          menuList.value = res.data;
        } else {
          message(res.message, {type: "error"});
        }
      })
  }

  async function openDialog(title = "新增", row?: FormItemProps) {
    menuList.value = [];
    if (row) {
      await queryMenuListByRoleId(row.id);
    }
    //查询该角色菜单权限
    addDialog({
      title: `${title}角色`,
      props: {
        formInline: {
          id:row?.id ?? null,
          roleName: row?.roleName ?? "",
          higherMenuOptions: formatHigherMenuOptions(cloneDeep(allMenuList.value)),
          menuList: menuList.value,
          roleCode: row?.roleCode ?? "",
          state: row?.state ?? true
        }
      },
      width: "40%",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(editForm, {ref: formRef}),
      beforeSure: (done, {options}) => {
        const FormRef = formRef.value.getRef();
        const curData = options.props.formInline as FormItemProps;

        function chores() {
          done(); // 关闭弹框
          onSearch(); // 刷新表格数据
        }

        FormRef.validate(valid => {
          if (valid) {
            console.log("curData", curData);
            // 表单规则校验通过
            if (title === "新增") {
              // 实际开发先调用新增接口，再进行下面操作
                addRole(curData).then(res=>{
                    if (res.success) {
                        message(res.message, {type: "success"});
                    }else {
                        message(res.message, {type: "error"});
                    }
                    chores();
                })

            } else {
              // 实际开发先调用修改接口，再进行下面操作
              updateRole(curData).then(res=>{
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

  function formatHigherMenuOptions(treeList) {
    if (!treeList || !treeList.length) return;
    const newTreeList = [];
    for (let i = 0; i < treeList.length; i++) {
      formatHigherMenuOptions(treeList[i].children);
      newTreeList.push(treeList[i]);
    }
    return newTreeList;
  }

  onMounted(() => {
    onSearch();
    searchAllMenuList();
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
    handleDelete,
    handleSizeChange,
    handleCurrentChange
  };
}
