import { reactive } from "vue";
import type { FormRules } from "element-plus";

/** 自定义表单规则校验 */
export const formRules = reactive(<FormRules>{
  menuTitle: [{ required: true, message: "菜单名称为必填项", trigger: "blur" }],
  menuName: [{ required: true, message: "路由名称为必填项", trigger: "blur" }],
  menuPath: [{ required: true, message: "路由路径为必填项", trigger: "blur" }],
  auths: [{ required: true, message: "权限标识为必填项", trigger: "blur" }]
});
