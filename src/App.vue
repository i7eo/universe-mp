<script lang="ts">
import { defineComponent } from "vue";
import { onHide, onLaunch, onShow } from "@dcloudio/uni-app";

export default defineComponent({
  setup() {
    onLaunch(() => {
      console.log("App Launch");
    });

    onShow(() => {
      console.log("App Show");
    });

    onHide(() => {
      console.log("App Hide");
    });
  },
});
</script>
