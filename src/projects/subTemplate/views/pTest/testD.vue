<template>
  <div>
    <xx-header :title="'D'" background="none" @left-click="close" />
    <div class="content-wraper header bg_wraper bg_F4F6F9 pd-t_92">
      <van-button class="btn fs_32" @click="testToE()">去E页面</van-button>
    </div>
  </div>
</template>

<script setup lang="ts" name="TestD">
import { backward } from '@/common/utils/index';

// 返回
const close = () => {
  backward();
};

onMounted(() => {});
const router = useRouter();
const testToE = () => {
  router.push({ path: '/test/testE' });
};
</script>

<style lang="less" scoped>
.content-wraper {
  overflow: hidden;
}
</style>
