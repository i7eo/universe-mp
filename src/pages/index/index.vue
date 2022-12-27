<template>
  <view class="content">
    <image class="logo" src="/@/assets/images/logo.png" />
    <view class="text-area">
      <text class="title">{{ title }}i7eo123213</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useUserStore } from "/@/store/user";

const title = ref("Hello");

const userStore = useUserStore();
onMounted(() => {
  userStore.confirmLoginOut();
  // uni.showModal({
  //   title: "错误提示",
  //   content: "test",
  // });
});
</script>

<style lang="scss">
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.logo {
  width: 200rpx;
  height: 200rpx;
  margin-top: 200rpx;
  margin-right: auto;
  margin-bottom: 50rpx;
  margin-left: auto;
}

.text-area {
  display: flex;
  justify-content: center;
}

.title {
  font-size: 36rpx;
  color: #8f8f94;
}
</style>
