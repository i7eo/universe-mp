<template>
  <view class="content">
    <image class="logo" src="/@/assets/images/logo.png" />
    <view class="text-area">
      <text class="title">{{ title }}i7eo123213</text>

      <view class="button-sp-area">
        <button type="primary">页面主操作 Normal</button>
        <button type="primary" loading="true">页面主操作 Loading</button>
        <button type="primary" disabled="true">页面主操作 Disabled</button>
        <button type="default">页面次要操作 Normal</button>
        <button type="default" disabled="true">页面次要操作 Disabled</button>
        <button type="warn">警告类操作 Normal</button>
        <button type="warn" disabled="true">警告类操作 Disabled</button>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from "vue";
const title = ref("Hello");
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
