import { defineStore } from "pinia";
import { JSEncrypt } from "jsencrypt";
import { getCache, setCache } from "/@/utils/cache";
import { ROLES_KEY, TOKEN_KEY, USER_INFO_KEY } from "/@/enums/cache";
import {
  API__USER_ENCRYPT,
  API__USER_INFO,
  // API__USER_INFO_LATEST,
  API__USER_LOGIN,
  API__USER_LOGOUT,
  API__USER_ROLES,
} from "/@/apis/user";
import { API__SYSTEM_CURRENT_USER_ISADMIN } from "/@/apis/system/current";
import type { RoleEnum } from "/@/enums/role";
import type { ErrorMessageMode } from "/#/axios";

export interface LoginParams {
  username?: string;
  phone: string;
  password: string;
}

export interface RoleInfo {
  roleName: string;
  value: string;
}

/**
 * @description: Login interface return value
 */
export interface LoginResultModel {
  userId: string | number;
  token: string;
  role: RoleInfo;
}

/**
 * @description: Get user information return value
 */
export interface GetUserInfoModel {
  roles: RoleInfo[];
  // 用户id
  userId: string | number;
  // 用户名
  username: string;
  // 真实名字
  realName: string;
  // 头像
  avatar: string;
  // 介绍
  desc?: string;
}

export interface UserInfo {
  userId: string | number;
  username: string;
  realName: string;
  avatar: string;
  phone?: string;
  desc?: string;
  homePath?: string;
  roles: RoleInfo[];
  isAdmin: boolean;
  resourceMap?: { [key: string]: string };
}

export interface UserStore {
  userInfo: UserInfo | null;
  token?: string;
  roleList: RoleEnum[];
  sessionTimeout?: boolean;
  lastUpdateTime: number;
}

/**
 *
 * @param param 需要加密的字段值
 * @param publicKey 公钥
 * @returns 返回加密值
 */
function encryptParma(param: string, publicKey: string): string {
  const Encryptor = new JSEncrypt();
  Encryptor.setPublicKey(publicKey);
  return Encryptor.encrypt(param) as string;
}

const Avators = [
  "http://m.imeitou.com/uploads/allimg/2019080515/he0mvtgkbu3.jpg",
  "http://m.imeitou.com/uploads/allimg/2019080515/ilnzrrqglxp.jpg",
  "http://m.imeitou.com/uploads/allimg/2019080515/jhzvqecaiva.jpg",
  "http://m.imeitou.com/uploads/allimg/2019080515/3i1vb11cz51.jpg",
  "http://m.imeitou.com/uploads/allimg/2019080515/ikyq0erbl2o.jpg",
  "http://m.imeitou.com/uploads/allimg/2019080515/nhp2lycyysg.jpg",
  "http://m.imeitou.com/uploads/allimg/2019080515/otllv1al21i.jpg",
  "http://m.imeitou.com/uploads/allimg/2019080515/h23grtl50ah.jpg",
  "http://m.imeitou.com/uploads/allimg/2019080515/2w34ercytby.jpg",
  "http://m.imeitou.com/uploads/allimg/2019080515/bi5qvugt0tf.jpg",
  "http://m.imeitou.com/uploads/allimg/2019080515/l5jpmzgjlie.jpg",
  "http://m.imeitou.com/uploads/allimg/2019080515/oxkac0z4jej.jpg",
  "http://m.imeitou.com/uploads/allimg/2019080515/1czvpvhw542.jpg",
  "http://m.imeitou.com/uploads/allimg/2019080515/mb1e0p551uv.jpg",
  "http://m.imeitou.com/uploads/allimg/2019080515/qxihmdr3nij.jpg",
  "http://m.imeitou.com/uploads/allimg/2019080515/wae3mci4xj5.jpg",
  "http://m.imeitou.com/uploads/allimg/2019080515/slf03ics0ug.jpg",
  "http://m.imeitou.com/uploads/allimg/2019080515/dxvzuvmwgoh.jpg",
  "http://m.imeitou.com/uploads/allimg/2019080515/qiwhw03diqs.jpg",
  "http://m.imeitou.com/uploads/allimg/2019080515/nvhphr5bcvi.jpg",
  "http://m.imeitou.com/uploads/allimg/2019080515/1ovqc5kow3q.jpg",
  "http://m.imeitou.com/uploads/allimg/2019080515/hm4dxkzatzp.jpg",
  "http://m.imeitou.com/uploads/allimg/2019080515/xjjevjx45mc.jpg",
  "http://m.imeitou.com/uploads/allimg/2019080515/icnljgcpt53.jpg",
  "http://m.imeitou.com/uploads/allimg/2019080515/x1fjmmr20iv.jpg",
  "http://m.imeitou.com/uploads/allimg/2019080515/ml4e1en1htc.jpg",
  "http://m.imeitou.com/uploads/allimg/2019080515/eyahy5wi0pj.jpg",
  "http://m.imeitou.com/uploads/allimg/2019080515/h0efn5w1uz2.jpg",
  "http://m.imeitou.com/uploads/allimg/2019080515/nnyvqw55iue.jpg",
  "http://m.imeitou.com/uploads/allimg/2019080515/fguxgv4cv1b.jpg",
];

export const useUserStore = defineStore({
  id: "app-user",
  state: (): UserStore => ({
    // user info
    userInfo: null,
    // token
    token: undefined,
    // roleList
    roleList: [],
    // Whether the login expired
    sessionTimeout: false,
    // Last fetch time
    lastUpdateTime: 0,
  }),
  getters: {
    getUserInfo(): UserInfo {
      return this.userInfo || getCache<UserInfo>(USER_INFO_KEY) || {};
    },
    getToken(): string {
      return this.token || getCache<string>(TOKEN_KEY);
    },
    getRoleList(): RoleEnum[] {
      return this.roleList.length > 0 ? this.roleList : getCache<RoleEnum[]>(ROLES_KEY);
    },
    getSessionTimeout(): boolean {
      return !!this.sessionTimeout;
    },
    getLastUpdateTime(): number {
      return this.lastUpdateTime;
    },
  },
  actions: {
    setToken(info: string | undefined) {
      this.token = info ? info : ""; // for null or undefined value
      setCache(TOKEN_KEY, info);
    },
    setRoleList(roleList: RoleEnum[]) {
      this.roleList = roleList;
      setCache(ROLES_KEY, roleList);
    },
    setUserInfo(info: UserInfo | null) {
      this.userInfo = info;
      this.lastUpdateTime = new Date().getTime();
      setCache(USER_INFO_KEY, info);
    },
    setSessionTimeout(flag: boolean) {
      this.sessionTimeout = flag;
    },
    resetState() {
      this.userInfo = null;
      this.token = "";
      this.roleList = [];
      this.sessionTimeout = false;
    },
    /**
     * @description: login
     */
    async login(
      params: LoginParams & {
        goHome?: boolean;
        mode?: ErrorMessageMode;
      }
    ): Promise<GetUserInfoModel | null> {
      try {
        const { goHome = true, mode, ...loginParams } = params;
        // mormal mode
        const { data } = await API__USER_ENCRYPT();
        console.log(123);
        const encryptPassword = encryptParma(params.password, data!.publicKey!); // 加密密码
        const { success: loginSuccess } = await API__USER_LOGIN(
          { keyId: data!.keyId!, phone: loginParams.phone, password: encryptPassword },
          mode
        );
        if (loginSuccess) {
          console.log(
            `::====================          登陆成功！😄         ====================::`
          );
          console.log(`::==================== Powered by: castianta-admin ====================::`);
        }
        // save token，因为token被后端在响应头中返回在axios中直接处理所以这里先注释
        // this.setToken(token);
        return this.afterLoginAction(goHome, params.password);
      } catch (error) {
        return Promise.reject(error);
      }
    },
    async afterLoginAction(goHome?: boolean, password = ""): Promise<GetUserInfoModel | null> {
      if (!this.getToken) return null;
      // get user info
      const userInfo = await this.getUserInfoAction();

      const sessionTimeout = this.sessionTimeout;
      if (sessionTimeout) {
        this.setSessionTimeout(false);
      } else {
        // const permissionStore = usePermissionStore();
        // if (!permissionStore.isDynamicAddedRoute) {
        //   const routes = await permissionStore.buildRoutesAction();
        //   routes.forEach((route) => {
        //     router.addRoute(route as unknown as RouteRecordRaw);
        //   });
        //   router.addRoute(PAGE_NOT_FOUND_ROUTE as unknown as RouteRecordRaw);
        //   permissionStore.setDynamicAddedRoute(true);
        // }
        // const ssoStore = useSSOStoreWithOut();
        // ssoStore.handleLogin(async () => {
        //   // 子系统原逻辑
        //   if (password == "123456" && import.meta.env.MODE === "production") {
        //     const { createWarningModal } = useMessage();
        //     createWarningModal({
        //       content: "您的密码过于简单，请尽快修改密码",
        //       async onOk() {
        //         await router.replace("/usercenter/index/password");
        //       },
        //     });
        //   } else {
        //     goHome && (await router.replace(userInfo?.homePath || PageEnum.BASE_HOME));
        //   }
        // }, goHome);
      }
      return userInfo;
    },
    async getUserInfoAction(): Promise<UserInfo | null> {
      if (!this.getToken) return null;
      // normal mode
      const { data } = await API__USER_INFO();
      // const { data } = await API__USER_INFO();
      const id = data?.id;
      const name = data?.name;
      const phone = data?.phone;
      const resourceMap = data?.resourceMap;
      const _roles = (data as any).roles ?? [];
      const isAdmin = await API__SYSTEM_CURRENT_USER_ISADMIN().then(
        ({ data = false }) => data as boolean
      );
      const userInfo: UserInfo = {
        userId: id as number,
        username: name as string,
        realName: name as string,
        phone: phone as string,
        avatar: Avators[Math.floor(Math.random() * Avators.length + 1)],
        resourceMap,
        roles: _roles,
        isAdmin,
      };
      // // 把resourceMap存入 permission store
      // const permissionStore = usePermissionStore();
      // // 按钮的code
      // permissionStore.setPermCodeList(Object.keys(resourceMap));
      // // 按钮的code对应的详细信息
      // permissionStore.setPermCodeInfo(resourceMap);

      const { roles = [] } = userInfo;
      if (Array.isArray(roles)) {
        const roleList = roles.map((item) => item.value) as RoleEnum[];
        this.setRoleList(roleList);
      } else {
        userInfo.roles = [];
        this.setRoleList([]);
      }
      // @ts-ignore
      userInfo.roles = await API__USER_ROLES().then(({ data = [] }) => data as string[]);
      this.setUserInfo(userInfo);
      return userInfo;
    },
    clearInfo(goLogin = false, is401 = false) {
      this.setToken(undefined);
      this.setSessionTimeout(false);
      this.setUserInfo(null);

      // const ssoStore = useSSOStoreWithOut();
      // ssoStore.clearLsToken();
      // ssoStore.handleLogout(
      //   () => {
      //     goLogin && router.push(PageEnum.BASE_LOGIN);
      //   },
      //   goLogin,
      //   is401
      // );
    },
    /**
     * @description: logout
     */
    async logout(goLogin = false, is401 = false) {
      if (this.getToken) {
        try {
          //normal mode
          const { success: logoutSuccess } = await API__USER_LOGOUT();
          if (logoutSuccess) {
            console.log(
              `::====================          登出成功！😄         ====================::`
            );
            console.log(
              `::==================== Powered by: castianta-admin ====================::`
            );
          }
        } catch {
          console.log("注销Token失败");
        }
      }
      this.clearInfo(goLogin, is401);
    },
    /**
     * @description: Confirm before logging out
     */
    confirmLoginOut() {
      uni.showModal({
        title: "温馨提醒",
        content: "是否确认退出系统？",
        success: async (res) => {
          if (res.confirm) {
            await this.logout(true);
          }
        },
      });
    },
  },
});
