import { http } from "@/utils/http";
import {Result} from "postcss";

type ResultList={
  success:boolean,
  code:string,
  message:string,
  data?:{
    list:Array<any>,
    total:number
  }
}
type RoleMenus={
  success:boolean,
  code:string,
  message:string,
  data?:Array<any>
}

const baseUrl="/cht/api/role";

export const getRoleList = (data?:object)=>{
  return http.request<ResultList>("post",`${baseUrl}/list`,{data});
}

export const getMenusByRoleId=(data?:number)=>{
  return http.request<RoleMenus>("get", `${baseUrl}/roleMenuList/${data}`);
}

export const getAllMenuList=(data?:number)=>{
  return http.request<RoleMenus>("get", `${baseUrl}/getAllMenuList`);
}

export const addRole=(data?:object)=>{
  return http.request<RoleMenus>("post",`${baseUrl}/add`,{data});
}

export const updateRole=(data?:object)=>{
  return http.request<RoleMenus>("post",`${baseUrl}/update`,{data})
}

export const changeState=(data?:object)=>{
  return http.request<RoleMenus>("post",`${baseUrl}/changeState`,{data})
}

export const deleteRole=(data?:number)=>{
  return http.request<RoleMenus>("get",`${baseUrl}/deleteRole/${data}`);
}

export const getAllRole = ()=>{
  return http.request<RoleMenus>("get", `${baseUrl}/getAllRole`);
}
