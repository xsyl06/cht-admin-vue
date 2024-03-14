// 虽然字段很少 但是抽离出来 后续有扩展字段需求就很方便了

interface FormItemProps {
  title: string;
  id?:number;
  /** 登录名 */
  userName: string;
  /** 用户名 */
  nickName: string;
  /**
   * 用户手机号
   */
  phone:string;
  /**
   * 用户邮箱
   */
  email:string;
  allRoleList:Array<any>;
  /**
   * 角色列表
   */
  roleList: Array<number>;
  /** 状态*/
  state: boolean;
}
interface FormProps {
  formInline: FormItemProps;
}

export type { FormItemProps, FormProps };
