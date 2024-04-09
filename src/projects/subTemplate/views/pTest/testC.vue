<template>
  <div>
    <xx-header :title="'C'" background="none" @left-click="close" />
    <div class="content-wraper header bg_wraper bg_F4F6F9 pd-t_92">
      <van-button class="btn fs_32" @click="testToD()">去D页面</van-button>
    </div>
  </div>
</template>

<script setup lang="ts" name="TestC">
import { backward } from '@/common/utils/index';

// 返回
const close = () => {
  backward();
};

onMounted(() => {});
const router = useRouter();
const testToD = () => {
  // router.push({ path: '/pTest/testD' });
  router.replace({ path: '/pTest/testD' });
};
</script>

<style lang="less" scoped>
.content-wraper {
  overflow: hidden;
}
</style>
