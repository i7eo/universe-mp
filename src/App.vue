<script lang="ts">
import { defineComponent } from "vue";
import { onHide, onLaunch, onShow } from "@dcloudio/uni-app";
// import { useUserStore } from "/@/store/user";
import { useRouterStore } from "/@/store/router";
import { addRouterInterceptor, removeRouterInterceptor } from "/@/router/interceptor";

export default defineComponent({
  setup() {
    // const userStore = useUserStore();
    const routerStore = useRouterStore();

    function setupRouterInterceptor() {
      removeRouterInterceptor();
      addRouterInterceptor();
      routerStore.setup();
    }

    onLaunch(() => {
      console.log("App Launch");
      setupRouterInterceptor();
    });

    onShow(() => {
      console.log("App Show");

      // 获取飞书用户信息，存入userinfo以及token
      // userStore.getUserInfo
    });

    onHide(() => {
      console.log("App Hide");
    });
  },
});
</script>
