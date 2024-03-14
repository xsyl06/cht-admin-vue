import { http } from "@/utils/http";

type ResultList = {
  code: string;
  success: boolean;
  message: string;
  data?: Array<any>;
};

type MenuResult = {
  code: string;
  success: boolean;
  message: string;
  data?: {
    menuTitle: string;
    icon: string;
    menuType: number;
    menuName: string;
    menuPath: string;
    auths: string;
    rank: string;
    showLink: boolean;
  };
};
const baseUrl = "/cht/api/menu";
export const getMenuList = (data?: object) => {
  return http.request<ResultList>("get", `${baseUrl}/list`, { data });
};

export const addMenu = (data?: object) => {
  return http.request<ResultList>("post", `${baseUrl}/save`, { data });
};
export const updateMenu = (data?: object) => {
  return http.request<ResultList>("post", `${baseUrl}/update`, { data });
};

export const deleteMenu = (data?: object) => {
  return http.request<ResultList>("get", `${baseUrl}/delete/${data}`);
};
