import editForm from "../form.vue";
import { handleTree } from "@/utils/tree";
import { message } from "@/utils/message";
import { addDialog } from "@/components/ReDialog";
import { reactive, ref, onMounted, h } from "vue";
import type { FormItemProps } from "../utils/types";
import { cloneDeep, isAllEmpty } from "@pureadmin/utils";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { addMenu, getMenuList, updateMenu, deleteMenu } from "@/api/menu";
import {usePublicHooks} from "@/views/system/hooks";

export function useMenu() {
  const form = reactive({
    menuTitle: ""
  });
  const {tagStyle} = usePublicHooks();
  const formRef = ref();
  const dataList = ref([]);
  const loading = ref(true);

  const getMenuType = (type, text = false) => {
    switch (type) {
      case 0:
        return text ? "菜单" : "primary";
      case 1:
        return text ? "iframe" : "warning";
      case 2:
        return text ? "外链" : "danger";
      case 3:
        return text ? "按钮" : "info";
    }
  };

  const columns: TableColumnList = [
    {
      label: "菜单名称",
      prop: "menuTitle",
      align: "left",
      cellRenderer: ({ row }) => (
        <>
          <span class="inline-block mr-1">
            {h(useRenderIcon(row.icon), {
              style: { paddingTop: "1px" }
            })}
          </span>
          <span>{row.menuTitle}</span>
        </>
      )
    },
    {
      label: "菜单类型",
      prop: "menuType",
      width: 80,
      cellRenderer: ({ row, props }) => (
        <el-tag
          size={props.size}
          type={getMenuType(row.menuType)}
          effect="plain"
        >
          {getMenuType(row.menuType, true)}
        </el-tag>
      )
    },
    {
      label: "路由名称",
      prop: "menuName"
    },
    {
      label: "路由路径",
      prop: "menuPath"
    },
    {
      label: "权限标识",
      prop: "auths"
    },
    {
      label: "状态",
      prop: "state",
      minWidth: 100,
      cellRenderer: ({ row, props }) => (
        <el-tag size={props.size} style={tagStyle.value(row.state)}>
          {row.state ? "启用" : "停用"}
        </el-tag>
      )
    },
    {
      label: "排序",
      prop: "rank",
      width: 80
    },
    {
      label: "隐藏",
      prop: "showLink",
      formatter: ({ showLink }) => (showLink ? "否" : "是"),
      width: 100
    },
    {
      label: "操作",
      fixed: "right",
      width: 210,
      slot: "operation"
    }
  ];

  function handleSelectionChange(val) {
    console.log("handleSelectionChange", val);
  }

  function resetForm(formEl) {
    if (!formEl) return;
    formEl.resetFields();
    onSearch();
  }

  async function onSearch() {
    loading.value = true;
    const { data } = await getMenuList(); // 这里是返回一维数组结构，前端自行处理成树结构，返回格式要求：唯一id加父节点parentId，parentId取父节点id
    let newData = data;
    if (!isAllEmpty(form.menuTitle)) {
      // 前端搜索菜单名称
      let a = newData.filter(item => {
        return item.menuTitle.includes(form.menuTitle);
      });
      newData = a;
    }
    dataList.value = handleTree(newData); // 处理成树结构
    setTimeout(() => {
      loading.value = false;
    }, 500);
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

  function openDialog(title = "新增", row?: FormItemProps) {
    addDialog({
      title: `${title}菜单`,
      props: {
        formInline: {
          menuType: row?.menuType ?? 0,
          higherMenuOptions: formatHigherMenuOptions(cloneDeep(dataList.value)),
          parentId: row?.parentId ?? null,
          menuTitle: row?.menuTitle ?? "",
          menuName: row?.menuName ?? "",
          menuPath: row?.menuPath ?? "",
          rank: row?.rank ?? 99,
          icon: row?.icon ?? "",
          extraIcon: row?.extraIcon ?? "",
          auths: row?.auths ?? "",
          frameSrc: row?.frameSrc ?? "",
          keepAlive: row?.keepAlive ?? false,
          showLink: row?.showLink ?? true,
          showParent: row?.showParent ?? true,
          state: row?.state ?? true
        }
      },
      width: "45%",
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
              addMenu(curData).then(r => {
                if (r.success) {
                  message(r.message, { type: "success" });
                } else {
                  message(r.message, { type: "error" });
                }
                chores();
              });
            } else {
              curData.id = row.id;
              updateMenu(curData).then(r => {
                if (r.success) {
                  message(r.message, { type: "success" });
                } else {
                  message(r.message, { type: "error" });
                }
                chores();
              });
            }
          }
        });
      }
    });
  }

  function handleDelete(row) {
    console.log(row);
    deleteMenu(row.id).then(r => {
      if (r.success) {
        message(r.message, { type: "success" });
      } else {
        message(r.message, { type: "error" });
      }
      onSearch();
    });
  }

  onMounted(() => {
    onSearch();
  });

  return {
    form,
    loading,
    columns,
    dataList,
    /** 搜索 */
    onSearch,
    /** 重置 */
    resetForm,
    /** 新增、修改菜单 */
    openDialog,
    /** 删除菜单 */
    handleDelete,
    handleSelectionChange
  };
}
