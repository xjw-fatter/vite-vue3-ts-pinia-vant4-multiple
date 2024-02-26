<template>
  <div>
    <xx-header :title="'A'" background="none" @left-click="close" />
    <div class="content-wraper header bg_wraper bg_F4F6F9 pd-t_92">
      <van-button class="btn fs_32" @click="testToB()">去B页面</van-button>
    </div>
  </div>
</template>

<script setup lang="ts" name="TestA">
import { emitter, backward } from '@/common/utils/index';
import commonStore from '@/common/store/common.store';

// 顶部图片
const useCommonStore = commonStore();
const { authReadyFlag } = storeToRefs(useCommonStore);
const init = ref<boolean>(false); // 页面初始化

// 返回
const close = () => {
  backward();
};

// 初始化成功后
const initCheck = () => {
  if (init.value) return; // 初始化过
  init.value = true;
};

onMounted(() => {
  // 授权事件完成
  if (authReadyFlag.value) {
    initCheck();
  }
  emitter.on('authReady', initCheck);
});

const router = useRouter();
const testToB = () => {
  router.push({ path: '/test/testB' });
};
</script>

<style lang="less" scoped>
.content-wraper {
  overflow: hidden;
}
</style>
