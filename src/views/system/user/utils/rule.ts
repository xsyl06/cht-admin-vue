import { reactive } from "vue";
import type { FormRules } from "element-plus";

/** 自定义表单规则校验 */
export const formRules = reactive(<FormRules>{
  userName: [{ required: true, message: "登录名为必输项", trigger: "blur" }],
  nickName: [{ required: true, message: "用户名为必输项", trigger: "blur" }],
  phone:[
    {required:true,message:"手机号为必输项",trigger:"blur"},
    {max:18,message:"手机号长度不能超过18位",trigger:"blur"},
    {pattern:/^1[3-9]\d{9}$/,message:"请输入正确的手机号",trigger:"blur"}
  ]
});
