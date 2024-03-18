interface FormItemProps {
    nickName: string;
    oldPwd: string;
    password: string;
    rePassword: string;
}
interface FormProps {
    formInline: FormItemProps;
}

export type {FormItemProps, FormProps};
