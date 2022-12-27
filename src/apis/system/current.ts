import { defHttp } from "/@/utils/http";
import { MicroServiceDomain } from "/@/enums/domain";
import type { definitions as TIANTA_SYSTEM_MODEL } from "../models/TIANTA-SYSTEM";

enum Api {
  SYSTEM_CURRENT_USER_ISADMIN = `current/user/isAdmin`, //当前用户是否是管理员
  SYSTEM_CURRENT_USER_GETINFO_REFRESH = `current/user/getInfoRefresh`, //当前用户是否是管理员
  SYSTEM_CURRENT_USER_SYSMENU = `current/user/sysMenu`, //查询当前用户菜单树
  SYSYTEM_REFRESH_CACHE = `sys/cache/refreshAll`, //更新系统缓存
}
export const API__SYSTEM_CURRENT_USER_ISADMIN = () => {
  return defHttp.post<TIANTA_SYSTEM_MODEL["ResultEntity«boolean»"]>({
    url: `/${MicroServiceDomain.TIANTA_SYSTEM}/${Api.SYSTEM_CURRENT_USER_ISADMIN}`,
  });
};
export const API__SYSTEM_CURRENT_USER_GETINFO_REFRESH = () => {
  return defHttp.post<TIANTA_SYSTEM_MODEL["ResultEntity«CurrentUserInfo»"]>({
    url: `/${MicroServiceDomain.TIANTA_SYSTEM}/${Api.SYSTEM_CURRENT_USER_GETINFO_REFRESH}`,
  });
};
export const API__SYSTEM_CURRENT_USER_SYSMENU = () => {
  return defHttp.post<TIANTA_SYSTEM_MODEL["ResultEntity«List«AclTreeVo»»"]>({
    url: `/${MicroServiceDomain.TIANTA_SYSTEM}/${Api.SYSTEM_CURRENT_USER_SYSMENU}`,
  });
};
export const API__SYSYTEM_REFRESH_CACHE = () => {
  return defHttp.post<TIANTA_SYSTEM_MODEL["ResultEntity«object»"]>({
    url: `/${MicroServiceDomain.TIANTA_SYSTEM}/${Api.SYSYTEM_REFRESH_CACHE}`,
  });
};
