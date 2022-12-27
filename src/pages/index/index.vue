<template>
  <view class="content">
    <image class="logo" src="/@/assets/images/logo.png" />
    <view class="text-area">
      <text class="title">Hello {{ username }} </text>
    </view>

    <view class="container">
      <uni-section title="表单校验" type="line">
        <view class="example">
          <!-- 基础表单校验 -->
          <uni-forms ref="valiFormRef" :rules="rules" :model-value="valiFormData">
            <uni-forms-item label="手机号" required name="phone">
              <uni-easyinput v-model="valiFormData.phone" placeholder="请输入手机号" />
            </uni-forms-item>
            <uni-forms-item label="密码" required name="password">
              <uni-easyinput v-model="valiFormData.password" placeholder="请输入密码" />
            </uni-forms-item>
          </uni-forms>
          <button type="primary" :loading="loading" @click="submit">提交</button>
        </view>
      </uni-section>
    </view>
  </view>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, toRefs, unref } from "vue";
import { useUserStore } from "/@/store/user";

export default defineComponent({
  setup() {
    const valiFormRef = ref<any>(null);

    const state = reactive({
      username: "i7eo",
      rules: {
        phone: {
          rules: [
            {
              required: true,
              errorMessage: "手机号不能为空",
            },
          ],
        },
        password: {
          rules: [
            {
              required: true,
              errorMessage: "密码不能为空",
            },
          ],
        },
      },
      valiFormData: {
        phone: "",
        password: "",
      },
      loading: false,
    });

    const userStore = useUserStore();

    async function submit() {
      try {
        const data = await unref(valiFormRef).validate();
        if (!data) return;
        state.loading = true;
        const userInfo = await userStore.login({
          phone: data.phone,
          password: data.password,
          mode: "none",
        });

        if (userInfo) {
          uni.showToast({
            title: `登录成功，欢迎回来 ${userInfo.realName}`,
            icon: "success",
          });
        }
      } catch (e) {
        console.log(e);
      } finally {
        state.loading = false;
      }
    }

    return {
      valiFormRef,
      ...toRefs(state),
      submit,
    };
  },
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
