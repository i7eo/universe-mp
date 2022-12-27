import { API__USER_TOKEN_VALID } from "/@/apis/user";
import { defineStore } from "pinia";
import { APP_LOCAL_CACHE_KEY as lsKey, TOKEN_KEY as lsTokenKey } from "/@/enums/cache";
import { useGlobSetting } from "/@/hooks/setting";
import { getQueryParam, removeQueryParam, resetHashUrl } from "/@/utils/url";
import { MicroServiceDomain } from "/@/enums/domain";
import { defHttp } from "/@/utils/http";
import { useUserStore } from "/@/store/user";
import { isProdMode } from "/@/utils/env";
import { getCache, setCache } from "/@/utils/cache";
import type { definitions } from "/@/apis/models/TIANTA-SYSTEM";

const { appId, mainAppId } = useGlobSetting();
const API__ENVIRONMENT_PROD = () => {
  return defHttp.post<definitions["ResultEntity«Map«string,object»»"]>({
    url: `/${MicroServiceDomain.TIANTA_SYSTEM}/open/environment/pord?_t=${new Date().getTime()}`,
  });
};
const isProd = isProdMode();

interface LS {
  _: Record<string, any> | null;
  token: Record<"at" | "rd", string> | null;
}

export interface SSOState {
  /** 主系统 ai（门户） */
  mainAppId: string;
  /** 其他系统 ai */
  appId: string;
  /** 记录主系统 url */
  mainUrl: string;
  /** 记录其他系统 url */
  url: string;
  /** 是否开启单点登录，来自后端 data.prod */
  isOpen: boolean;
  /** 主系统跳转的其他系统地址，来自后端 data.prodUrls */
  redirectUrlRecords: Record<string, any> | null;
  /** 是否为主系统（门户） */
  isMainSite: boolean;
  /**
   * @property sso             标识单点登录状态，默认为 "true"
   * @property sso_logout      标识单点登录退出状态，默认为 "false"
   * @property sso_redirect    标识单点登录后要跳转的其他系统路径，默认为 ""
   * @property sso_router      标识单点登录后要跳转的其他系统路径中的 hash，默认为 ""
   * @property sso_renew       标识单点登录由401引起的跳转去主系统拿最新的token续费，一半存在于子系统跳主系统，默认为 "false"
   */
  params: Record<"sso" | "sso_logout" | "sso_redirect" | "sso_router" | "sso_renew", string> | null;
}

export const useSSOStore = defineStore({
  id: "app-sso",
  state: (): SSOState => ({
    mainAppId: "",
    appId: "",
    mainUrl: "",
    url: "",
    isOpen: false,
    redirectUrlRecords: null,
    isMainSite: false,
    params: null,
  }),
  getters: {
    getMainAppId(): string {
      return this.mainAppId || mainAppId;
    },
    getAppId(): string {
      return this.appId || appId;
    },
    getMainUrl(): string {
      return this.mainUrl;
    },
    getUrl(): string {
      return this.url;
    },
    getIsOpen(): boolean {
      return this.isOpen;
    },
    getRedirectUrlRecords(): SSOState["redirectUrlRecords"] {
      return this.redirectUrlRecords;
    },
    getIsMainSite(): boolean {
      return this.isMainSite || mainAppId === appId;
    },
    getParams(): SSOState["params"] {
      return this.params;
    },
  },
  actions: {
    setMainAppId(mainAppId: string) {
      this.mainAppId = mainAppId;
    },
    setAppId(appId: string) {
      this.appId = appId;
    },
    setMainUrl(mainUrl: string) {
      this.mainUrl = mainUrl;
    },
    setUrl(url?: string) {
      this.url = url || window.location.href;

      const sso = getQueryParam("sso", this.url);
      // eslint-disable-next-line camelcase
      const sso_logout = getQueryParam("sso_logout", this.url);
      // eslint-disable-next-line camelcase
      const sso_redirect = getQueryParam("sso_redirect", this.url);
      // eslint-disable-next-line camelcase
      const sso_router = getQueryParam("sso_router", this.url);
      // eslint-disable-next-line camelcase
      const sso_renew = getQueryParam("sso_renew", this.url);
      this.setParams({
        sso: window.decodeURIComponent(sso),
        sso_logout: window.decodeURIComponent(sso_logout),
        sso_redirect: window.decodeURIComponent(sso_redirect),
        sso_router: window.decodeURIComponent(sso_router),
        sso_renew: window.decodeURIComponent(sso_renew),
      });
    },
    setIsOpen(isOpen: boolean) {
      this.isOpen = isOpen;
    },
    setRedirectUrlRecords(redirectUrlRecords: SSOState["redirectUrlRecords"]) {
      this.redirectUrlRecords = redirectUrlRecords;
    },
    setIsMainSite(isMainSite: boolean) {
      this.isMainSite = isMainSite;
    },
    setParams(params: SSOState["params"]) {
      this.params = params;
    },
    resetState() {
      this.mainAppId = "";
      this.appId = "";
      this.url = "";
      this.isOpen = false;
      this.redirectUrlRecords = null;
      this.isMainSite = false;
    },
    getLs(): LS["_"] {
      const ls = !uni
        ? window.localStorage.getItem(lsKey)
          ? JSON.parse(window.localStorage.getItem(lsKey)!)
          : null
        : getCache<string>(lsKey);

      return ls;
    },
    getLsToken(): LS["token"] {
      const ls = this.getLs();

      if (ls && ls.value && ls.value[lsTokenKey]) {
        if (ls.value[lsTokenKey].value) {
          return JSON.parse(ls.value[lsTokenKey].value);
        }
        return null;
      } else {
        return null;
      }
    },
    getUrlToken(): LS["token"] {
      const at = getQueryParam("at", this.getUrl);
      const rd = getQueryParam("rd", this.getUrl);

      if (at && rd) {
        return {
          at: window.decodeURIComponent(at),
          rd: window.decodeURIComponent(rd),
        };
      } else {
        return null;
      }
    },
    /**
     * 把 token 设置进 ls
     *
     * @param token
     */
    setLsToken(token: string) {
      if (!token) return;
      const ls = this.getLs();
      let lsValue: Record<string, any> = {};
      if (!ls) {
        lsValue = {
          expire: null,
          time: 1000 * 60 * 60 * 24 * 7,
          value: {
            [lsTokenKey]: {
              value: token,
            },
          },
        };
      } else {
        lsValue = ls;
        if (lsValue.value) {
          lsValue.value[lsTokenKey] = { value: token };
        } else {
          lsValue["value"] = {
            [lsTokenKey]: { value: token },
          };
        }
      }

      !uni ? window.localStorage.setItem(lsKey, JSON.stringify(lsValue)) : setCache(lsKey, lsValue);
    },
    clearLsToken() {
      const ls = this.getLs();
      let lsValue: Record<string, any> = {};
      if (ls) {
        lsValue = ls;
        if (lsValue.value) {
          lsValue.value[lsTokenKey] = {};
        }
      }
      !uni ? window.localStorage.setItem(lsKey, JSON.stringify(lsValue)) : setCache(lsKey, lsValue);
    },
    getHostnameByRegExp(url: string) {
      // eslint-disable-next-line no-useless-escape
      const regexp = /(([^:]+:)\/\/(([^:\/\?#]+)(:\d+)?))(\/[^?#]*)?(\?[^#]*)?(#.*)?/;
      const matches = regexp.exec(url);

      if (matches && matches[4]) {
        return matches[4];
      } else {
        return "";
      }
    },
    isSSORedirect() {
      const urls: string[] = this.getRedirectUrlRecords
        ? Object.values(this.getRedirectUrlRecords)
        : [];
      const isSSORedirect = urls.some((url) => {
        const result = this.getHostnameByRegExp(url);
        if (
          result &&
          (this.getParams?.sso_redirect || getQueryParam("redirect", this.getUrl)).includes(result)
        ) {
          return true;
        } else {
          return false;
        }
      });
      return isSSORedirect;
    },
    /**
     * 从主系统跳转回其他系统或者其他系统跳回主系统时要更新内存中的 token，虽然拦截器目前已经改为读 ls token
     *
     * 以防万一，防止某些代码直接取内存中的 token
     */
    updateMemoryToken() {
      const lsToken = this.getLsToken();
      const userStore = useUserStore();
      lsToken && userStore.setToken(JSON.stringify(lsToken));
    },
    /**
     * 重置url保证当前系统中 hash 添加在路由正确位置
     */
    handleUrlHashPos() {
      const correctUrl = resetHashUrl();
      window.history.replaceState({}, "", correctUrl);
    },
    /**
     * 如果用户直接在地址栏输入如：poe.haixingdata.com/dashboard/workbench
     *
     * vue-router 的 hash 会自动将其转为 poe.haixingdata.com/dashboard/workbench#/ 此时需要手动修正
     */
    handleUrlPathname(): string {
      const pathName = window.location.pathname;
      if (pathName !== "/") {
        const correctHash = window.location.hash + pathName.slice(1);
        const correctUrl = `${window.location.origin}/${correctHash}`;
        window.history.replaceState({}, "", correctUrl);
        return correctUrl;
      } else {
        return window.location.href;
      }
    },
    /**
     * 发送请求判断当前存的 ls token 是否过期，如果 401 直接走拦截器逻辑去登录，没过期则继续执行
     *
     * @returns
     */
    async isLsTokenOvertime() {
      try {
        const { success } = await API__USER_TOKEN_VALID();
        if (success) {
          return false;
        }
        return true;
      } catch (e) {
        return true;
      }
    },
    /**
     * 跳转去主系统（门户），通过 url 参数的方式携带单点登录状态
     *
     * 注意：因为一个url中只能出现一个 hash 所以将其他系统 hash 转为 url 参数 router
     *
     * @param url
     * @param redirect
     * @param logout
     * @returns
     */
    handleJumpToMainApp(url: string, redirect: string, logout = false, is401 = false): string {
      const target = redirect.match(/\/#\/.*/g);
      let _redirect = redirect.replace(/\/#\//g, "");
      let router = "";

      if (target && target.length && target[0] && target[0] !== "/#/") {
        router = target[0].replace(/\/#\//g, "");
        _redirect = redirect.replace(/\/#\/.*/g, "");
      }

      let mainAppUrl = `${url}?sso=true&sso_logout=${logout}&sso_redirect=${window.encodeURIComponent(
        _redirect
      )}`;

      if (is401) {
        mainAppUrl = `${mainAppUrl}&sso_renew=true`;
      }

      if (router) {
        mainAppUrl = `${mainAppUrl}&sso_router=${window.encodeURIComponent(router)}`;
      }

      return mainAppUrl;
    },
    /**
     * 跳转去除主系统（门户）外的其他系统
     *
     * @param token
     * @param redirect
     * @param isVaild 是否需要验证
     */
    async handleJumpToApp(token: LS["token"], redirect: string, isVaild = false): Promise<string> {
      if (!token || !redirect) return "";

      if (isVaild) {
        const isLsTokenOvertime = await this.isLsTokenOvertime();
        if (isLsTokenOvertime) return "";
      }

      const _token = `at=${window.encodeURIComponent(token.at)}&rd=${window.encodeURIComponent(
        token.rd
      )}`;
      let _redirect = window.decodeURIComponent(redirect);

      if (this.getParams?.sso_router) {
        _redirect = `${_redirect.replace(/\/#\//g, "")}/#/${this.getParams.sso_router}`;
      }

      const appUrl = _redirect.includes("?") ? `${_redirect}&${_token}` : `${_redirect}?${_token}`;

      return appUrl;
    },
    /**
     * 驾驶舱登陆成功直接进驾驶舱，其他系统进门户
     */
    async handleCockpitLogin() {
      const redirect = this.getParams?.sso_redirect || getQueryParam("redirect");
      if (!redirect) return;

      const cockpitUrl = this.getRedirectUrlRecords!["10099"];
      const result = this.getHostnameByRegExp(cockpitUrl);
      if (result && redirect.indexOf(result) > -1) {
        const appUrl = await this.handleJumpToApp(this.getLsToken(), redirect, true);
        window.location.href = appUrl;
      }
    },
    /**
     * 供 store/user.ts 调用，专门处理单点登录与非单点登录的登录，originalHandler为原系统登录逻辑
     *
     * @param originalHandler
     * @param goHome
     */
    async handleLogin(originalHandler: (...args: any) => any, goHome?: boolean) {
      if (this.getIsOpen) {
        // sso 单点登录踢用户相关逻辑，因为 safrai bug 暂时注释
        // (window as any).__SITE.token = this.getToken;
        // 在门户登陆成功后，停留在门户，从门户点击后才能跳转到相应系统，暂时注释
        // if (
        //   (window as any).__SITE.sso.isProd &&
        //   (window as any).__SITE.sso.url.indexOf("sso") > -1
        // ) {
        //   (window as any).__SITE.sso.jumpBack(
        //     this.getToken,
        //     (window as any).__SITE.sso.utils.getQueryParam("redirect")
        //   );
        // } else {
        //   goHome && (await router.replace(userInfo?.homePath || PageEnum.BASE_HOME));
        // }

        const url = removeQueryParam(["sso_logout"], this.getUrl);
        // 如果 token 过期走入拦截器401会掉logout()，然后拼上logout=true此时登陆需要把全局存储的(window as any).__SITE.sso.url中logout=true删除掉，保证能登陆
        this.setUrl(url);
        // 驾驶舱单独处理
        await this.handleCockpitLogin();
        // // 其他系统跳回去
        // const appUrl = await this.handleJumpToApp(this.getLsToken(), this.getParams!.redirect, true);
        // window.location.href = appUrl;
        // 主系统（门户）登陆后停留在主系统
        originalHandler();
      } else {
        originalHandler();
      }
    },
    /**
     * 供 store/user.ts 调用，专门处理单点登录与非单点登录的退出，originalHandler为原系统登出逻辑
     *
     * 注意拦截器中401也会跳logout，原登出逻辑不变，这里做统一的单点登录退出处理
     *
     * @param originalHandler
     * @param goLogin
     */
    handleLogout(originalHandler: (...args: any) => any, goLogin = false, is401 = false) {
      if (this.getIsOpen) {
        if (this.getMainAppId === this.getAppId) {
          // 在门户登陆成功后，停留在门户，从门户点击后才能跳转到其他系统，暂时注释
          // if (
          //   (window as any).__SITE.sso.isProd &&
          //   (window as any).__SITE.sso.url.indexOf("sso") > -1
          // ) {
          //   const redirectParam = (window as any).__SITE.sso.utils.getQueryParam("redirect");
          //   const routerParam = (window as any).__SITE.sso.utils.getQueryParam("router");
          //   goLogin &&
          //     router.push({
          //       query: {
          //         redirect: routerParam
          //           ? `${redirectParam}?router=${routerParam}`
          //           : `${redirectParam}`
          //       }
          //     });
          // } else {
          //   goLogin && router.push(PageEnum.BASE_LOGIN);
          // }

          // 退出登录删除logout后其他标识保留，保留redirect
          const paramStr = this.getUrl.match(/\?.*/g);
          const url = `${window.location.origin}/#/login${
            paramStr && paramStr.length > 0 ? paramStr[0] : ""
          }`;
          this.setUrl(removeQueryParam(["sso_logout"], url));
          goLogin && (window.location.href = `${this.getUrl}`);
        } else {
          // 其他系统退出后跳回门户登陆
          const mainAppUrl = this.handleJumpToMainApp(
            this.getMainUrl,
            window.location.href,
            true,
            is401
          );
          mainAppUrl && (window.location.href = mainAppUrl);
        }
      } else {
        originalHandler();
      }
    },
    /**
     * 供 router/guard/permissionGuard.ts 调用，专门处理单点登录下无 token 的情况
     *
     * 非单点登录携带 token 遵循原系统逻辑，详情请查看 router/guard/permissionGuard.ts
     */
    handleJumpFromAppAfterRouterGuardHasNotToken(
      originalHandler: (...args: any) => any,
      redirectData: {
        path: string;
        replace: boolean;
        query?: Record<string, any>;
      }
    ) {
      const isJumpFromAppWithLogin = !!(
        (!this.getParams?.sso_logout || this.getParams?.sso_logout === "false") &&
        this.getParams?.sso &&
        this.getParams?.sso === "true" &&
        this.getParams?.sso_redirect
      );

      if (this.getIsOpen && isJumpFromAppWithLogin) {
        let redirect = "";

        if (this.getParams?.sso_redirect) {
          redirect = `${window.encodeURIComponent(this.getParams.sso_redirect)}`;
        }

        if (this.getParams?.sso_router) {
          redirect = `${redirect}?sso_router=${window.encodeURIComponent(
            this.getParams.sso_router
          )}`;
        }

        redirectData.query = {
          ...redirectData.query,
          redirect,
        };
      } else {
        originalHandler();
      }
    },
    /**
     * 供 router/guard/permissionGuard.ts 调用，专门处理单点登录下有 token 的情况
     *
     * 非单点登录携带 token 遵循原系统逻辑，详情请查看 router/guard/permissionGuard.ts
     *
     * 一般针对于主系统已经存在token（即登录过）直接新开标签页输入地址的场景
     */
    async handleJumpFromAppAfterRouterGuardHasToken() {
      // 在门户登陆成功后，停留在门户，从门户点击后才能跳转到相应系统，暂时注释
      // const response = await API__USER_TOKEN_VALID();
      // // 判断 token 是否过期
      // if (response.success) {
      //   if (
      //     (window as any).__SITE.sso.isProd &&
      //     (window as any).__SITE.sso.url.indexOf("sso") > -1
      //   ) {
      //     // 退出后在当前标签页登陆
      //     if ((window as any).__SITE.sso.url.indexOf("logout=true") > -1) {
      //       // // redirect login page
      //       // const redirectData: { path: string; replace: boolean; query?: Recordable<string> } = {
      //       //   path: LOGIN_PATH,
      //       //   replace: true
      //       // };

      //       // if (to.query && to.query.redirect) {
      //       //   redirectData.query = {
      //       //     ...redirectData.query,
      //       //     redirect:
      //       //       to.query.router && (to.query.redirect as string).indexOf("router") === -1
      //       //         ? `${encodeURIComponent(
      //       //             to.query.redirect as string
      //       //           )}?router=${encodeURIComponent(to.query.router as string)}`
      //       //         : `${encodeURIComponent(to.query.redirect as string)}`
      //       //   };
      //       // }

      //       // next(redirectData);
      //       // return;

      //       userStore.logout(true);
      //     } else {
      //       (window as any).__SITE.sso.jumpBack(
      //         token,
      //         (window as any).__SITE.sso.utils.getQueryParam("redirect")
      //       );
      //     }
      //   } else {
      //     // 退出后在其他标签页登陆，在当前标签页刷新
      //     if (
      //       (window as any).__SITE.sso.isProd &&
      //       (window as any).__SITE.sso.url.indexOf("redirect=http") > -1
      //     ) {
      //       (window as any).__SITE.sso.jumpBack(
      //         token,
      //         (window as any).__SITE.sso.utils.getQueryParam("redirect")
      //       );
      //     }
      //   }
      // } else {
      //   userStore.logout(true);
      // }

      const isJumpFromAppWithLogout = !!(
        this.getParams?.sso_logout &&
        this.getParams?.sso_logout === "true" &&
        this.getParams?.sso &&
        this.getParams?.sso === "true" &&
        this.getLsToken()?.at &&
        this.getLsToken()?.rd
      );
      const userStore = useUserStore();
      const isJumpFromAppWithLogin = !!(
        (!this.getParams?.sso_logout || this.getParams?.sso_logout === "false") &&
        this.getParams?.sso &&
        this.getParams?.sso === "true" &&
        this.getParams?.sso_redirect
      );

      if (this.getIsOpen) {
        // if (isJumpFromAppWithLogout) {
        //   userStore.logout(true);
        // }

        if (isJumpFromAppWithLogin) {
          // 驾驶舱单独处理
          await this.handleCockpitLogin();
          // // 其他系统跳回去
          // const appUrl = await this.handleJumpToApp(this.getLsToken(), this.getParams!.redirect, true);
          // window.location.href = appUrl;
        }
      }
    },
    /**
     * 处理从其他系统点击退出或者401跳转至主系统（门户）的情况
     *
     * 注意401的特殊处理，先判断主系统是否有token如果有则直接跳回去可以理解为给token续费
     *
     * 如果没有则直接调logout
     */
    async handleJumpFromAppHasLogout() {
      const isJumpFromAppWithLogout = !!(
        this.getParams?.sso_logout &&
        this.getParams?.sso_logout === "true" &&
        this.getParams?.sso &&
        this.getParams?.sso === "true"
      );
      const userStore = useUserStore();

      if (isJumpFromAppWithLogout) {
        // 401 触发 logout 后如果有页签已经登录过，这里就不用退出只需要续费即可
        if (
          this.getParams?.sso_renew &&
          this.getParams?.sso_renew === "true" &&
          this.getLsToken()
        ) {
          const url = removeQueryParam(["sso_logout"], this.getUrl);
          this.setUrl(url);
          if (this.getParams?.sso_redirect) {
            // 续费后停留在当前系统
            const appUrl = await this.handleJumpToApp(
              this.getLsToken(),
              this.getParams.sso_redirect,
              true
            );
            window.location.href = appUrl;
          }
          return false;
        }

        await userStore.clearInfo(true);

        return true;
      }

      return false;
    },
    /**
     * 处理从其他系统点击登陆跳转至主系统（门户）的情况
     *
     * 注意 isJumpFromAppWithLogin = true 中的跳转逻辑都在 pg 中处理
     */
    async handleJumpFromAppHasNoLogout() {
      const isJumpFromAppWithLogin = !!(
        (!this.getParams?.sso_logout || this.getParams?.sso_logout === "false") &&
        this.getParams?.sso &&
        this.getParams?.sso === "true" &&
        this.getParams?.sso_redirect
      );

      if (!this.getLsToken()) {
        // 无 token，未登陆。此时不论是单点登录还是普通登录都会进入主系统登录页面
        // 此时走 router/guard/permissionGuard.ts 逻辑，每个系统都有该文件对router进行劫持，自动判断后进行跳转

        if (isJumpFromAppWithLogin) {
          // 单点登录处理 详情请查看 handleJumpFromAppAfterRouterGuardHasNotToken
        } else {
          // 非单点登录处理，查看 router/guard/permissionGuard.ts 中的原逻辑
        }
      } else {
        // 有 token，已登陆。
        // 其他系统（除驾驶舱外）暂时直接进入主系统（门户），后期应该根据 redirect 直接跳入其他系统
        // 此时走 router/guard/permissionGuard.ts 逻辑，每个系统都有该文件对router进行劫持，自动判断后进行跳转

        if (isJumpFromAppWithLogin) {
          // 单点登录处理，详情请查看 handleJumpFromAppAfterRouterGuardHasToken
        } else {
          // 非单点登录处理，详情请查看 router/guard/permissionGuard.ts 中的原逻辑
        }
      }
    },
    handleJumpToAppHasNoLogout() {
      if (!this.getLsToken()) {
        // 无 token，未登陆。此时不论是单点登录还是普通登录都会进入主系统登录页面
        window.location.href = this.handleJumpToMainApp(this.getMainUrl, this.handleUrlPathname());
      } else {
        // 如果url上有token先清空
        if (this.getUrlToken()) {
          const url = removeQueryParam(["at", "rd"], this.getUrl);
          window.location.href = url;
        }

        // 有 token 走各系统正常登录逻辑
      }
    },
    /**
     * 主逻辑
     *
     * 主流程：bootstrap => main => router/guard/permissionGuard.ts => store/user.ts
     */
    async main() {
      // 如果 url 上有 token 那么就写入 ls
      const urlToken = this.getUrlToken();
      if (urlToken) this.setLsToken(JSON.stringify(urlToken));
      this.updateMemoryToken();

      if (this.getIsMainSite) {
        // 主系统（门户）处理逻辑
        const hasLogout = await this.handleJumpFromAppHasLogout();
        if (!hasLogout) {
          await this.handleJumpFromAppHasNoLogout();
        }
      } else {
        // 其他系统处理逻辑
        this.handleJumpToAppHasNoLogout();
      }
    },
    /**
     * 入口逻辑
     */
    async bootstrap() {
      try {
        const { success, data } = await API__ENVIRONMENT_PROD();
        if (success && data) {
          const { prod, prodUrls } = data;
          if (prod && prodUrls) {
            /* :==============================: 变量处理 :==============================: */
            const redirectUrlRecords: SSOState["redirectUrlRecords"] = {
              ...prodUrls,
            };
            if (!isProd) {
              for (const [k, v] of Object.entries(prodUrls)) {
                // eslint-disable-next-line no-useless-escape
                redirectUrlRecords[k] = v.replace(/\:\d+/g, `:${k}`);
              }
            }
            this.setMainAppId(mainAppId);
            this.setAppId(appId);
            this.setMainUrl((redirectUrlRecords as SSOState["redirectUrlRecords"])![mainAppId]);
            this.setUrl();
            this.setIsOpen(prod as boolean);
            this.setRedirectUrlRecords(redirectUrlRecords as SSOState["redirectUrlRecords"]);
            this.setIsMainSite(mainAppId === appId);
            /* :==============================: 变量处理 :==============================: */

            /* :==============================: 主逻辑处理 :==============================: */
            if (this.getIsOpen) {
              this.handleUrlHashPos();
              await this.main();
            }
            /* :==============================: 主逻辑处理 :==============================: */
          }
        }
      } catch (error) {
        console.error(
          `System[${this.getAppId}] SSO has error, please check request: API__ENVIRONMENT_PROD`
        );
      }
    },
  },
});
