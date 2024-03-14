import {http} from "@/utils/http";

type UserList={
  success:boolean,
  code:string,
  message:string,
  data?:{
    total:number,
    list:Array<any>
  }
}
type UserInfo={
  success:boolean,
  code:string,
  message:string,
  data?:Array<any>
}

const baseUrl="/cht/api/user"
export const getUserList = (data?:object)=>{
  return http.request<UserList>("post",`${baseUrl}/list`,{data});
}

export const changeUseState = (data?:object)=>{
  return http.request<UserInfo>("post",`${baseUrl}/changeState`,{data});
}

export const getUserRoles = (data?: number)=>{
  return http.request<UserInfo>("get",`${baseUrl}/getUserRoles/${data}`);
}

export const addUser = (data?:object)=>{
  return http.request<UserInfo>("post", `${baseUrl}/add`, {data});
}

export const updateUser = (data?:object) =>{
  return http.request<UserInfo>("post",`${baseUrl}/update`,{data});
}

export const resetUserPwd = (data?:number) =>{
  return http.request<UserInfo>("get",`${baseUrl}/resetPwd/${data}`);
}
