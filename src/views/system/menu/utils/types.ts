interface FormItemProps {
  /** 菜单类型（0代表菜单、1代表iframe、2代表外链、3代表按钮）*/
  id?: number;
  menuType: number;
  higherMenuOptions: Record<string, unknown>[];
  parentId: number;
  menuTitle: string;
  menuName: string;
  menuPath: string;
  rank: number;
  icon: string;
  extraIcon: string;
  auths: string;
  frameSrc: string;
  keepAlive: boolean;
  showLink: boolean;
  showParent: boolean;
  state: boolean;
}
interface FormProps {
  formInline: FormItemProps;
}

export type { FormItemProps, FormProps };
