import { http } from "@/utils/http";

type Result = {
  success: boolean;
  data: Array<any>;
};
const baseUrl = "/cht/api";
export const getAsyncRoutes = () => {
  return http.request<Result>("get", `${baseUrl}/getAsyncRoutes`);
};
