// 虽然字段很少 但是抽离出来 后续有扩展字段需求就很方便了

interface FormItemProps {
  id?:number;
  /** 角色名称 */
  roleName: string;
  /** 角色编号 */
  roleCode: string;
  /**
   * 角色权限列表
   */
  menuList: Array<number>;
  higherMenuOptions: Array<any>;
  /** 状态*/
  state: boolean;
}
interface FormProps {
  formInline: FormItemProps;
}

export type { FormItemProps, FormProps };
