import { MicroServiceDomain } from "/@/enums/domain";
import { defHttp } from "/@/utils/http";
import type { definitions as TIANTA_SYSTEM_MODEL } from "./models/TIANTA-SYSTEM";

enum Api {
  USER_ENCRYPT = `login/getKey`,
  USER_LOGIN = `login/enter`,
  USER_LOGOUT = `login/out`,
  USER_INFO = `current/user/getInfo`,
  USER_INFO_LATEST = `current/user/getInfoRefresh`,
  USER_MENU = `current/user/sysMenu`,
  USER_ROLES = `current/user/roles`,
  LOGIN_SENDCODEMSG = `login/sendCodeMsg`, //发送验证码短信
  LOGIN_ENTERBYCODE = `login/enterByCode`, //验证码登录
  LOGIN_FOGETPWD_SENDCODE = `login/forgetpwd/sendCode`, // 忘记密码-发送验证码
  LOGIN_FORGETPWD_VERIFY = `login/forgetpwd/verify`, // 忘记密码-验证验证码
  LOGIN_FORGETPWD_RESETPWD = `login/forgetpwd/resetpwd`, // 忘记密码-重置密码
  USER_TOKEN_VALID = `current/user/valid`,
}

export const API__USER_ENCRYPT = () => {
  return defHttp.post<TIANTA_SYSTEM_MODEL["ResultEntity«LoginKeyVo»"]>({
    url: `/${MicroServiceDomain.TIANTA_SYSTEM}/${Api.USER_ENCRYPT}`,
  });
};
