import { PageEnum } from "/@/enums/page";
import { NavigateTypeEnum } from "/@/enums/navigate";
// import { useUserStore } from "/@/store/user";
import { isIgnoreAuth, jumpLogin } from "./utils";

/**
 * 路由跳转前拦截
 * @param path
 * @return boolean
 */

export function routerBeforeEach(path: string): boolean {
  const isIgnore = isIgnoreAuth(path);
  if (isIgnore) return true;
  // todo 直接获取飞书扫码人的用户信息
  // const userStore = useUserStore();
  // if (userStore.getUserInfo) return true;
  // jumpLogin(path);
  // return false;
  return true;
}

/**
 * 添加拦截器
 * 微信小程序端uni.switchTab拦截无效, 已在api中拦截
 * 微信小程序原生tabbar请使用onShow
 * 微信小程序端 <navigator>拦截无效,请使用api
 * @param routerName
 * @export void
 */
function addInterceptor(routerName: string) {
  uni.addInterceptor(routerName, {
    // 跳转前拦截
    invoke: (args) => {
      const flag = routerBeforeEach(args.url);
      return flag ? args : false;
    },
    // 成功回调拦截
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    success: () => {},
    // 失败回调拦截
    fail: (err: any) => {
      let reg: RegExp;
      /* #ifdef MP-WEIXIN */
      reg = /(.*)?(fail page ")(.*)(" is not found$)/;
      /* #endif */
      /* #ifndef MP-WEIXIN */
      reg = /(.*)?(fail page `)(.*)(` is not found$)/;
      /* #endif */
      if (reg.test(err.errMsg)) {
        const go = err.errMsg.replace(reg, "$3") || "";
        uni.navigateTo({
          url: `${PageEnum.NOT_FOUND_PAGE}?redirect=${PageEnum.HOME_PAGE}&go=${go}`,
        });
      }
      return false;
    },
    // 完成回调拦截
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    complete: () => {},
  });
}

/**
 * 添加路由拦截器
 */
export function addRouterInterceptor() {
  Object.values(NavigateTypeEnum).forEach((item) => {
    addInterceptor(item);
  });
}

/**
 * 移除路由拦截器
 */
export function removeRouterInterceptor() {
  Object.values(NavigateTypeEnum).forEach((item) => {
    uni.removeInterceptor(item);
  });
}
