import editForm from "./changePwd.vue";
import {FormItemProps} from "./changePwdForm";
import {addDialog} from "@/components/ReDialog/index";
import {h, ref} from "vue";
import {changeUserPwd} from "@/api/userinfo";
import {message} from "@/utils/message";
const formRef = ref();
export function changePwd(nickName:string) {
    addDialog({
        title: `修改密码`,
        props: {
            formInline: {
                nickName: nickName,
                oldPwd: "",
                password: "",
                rePassword: "",
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
            }
            FormRef.validate(valid => {
                if (valid) {
                  changeUserPwd(curData).then(res => {
                    if (res.success) {
                      message(res.message, { type: "success" });
                      chores();
                    } else {
                      message(res.message, { type: "error" });
                    }
                  });
                }
            });
        }
    });
}

