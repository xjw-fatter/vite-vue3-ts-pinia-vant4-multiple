<template>
  <div>
    <xx-header :title="'E'" background="none" @left-click="close" />
    <div class="content-wraper header bg_wraper bg_F4F6F9 pd-t_92">
      <van-button class="btn fs_32" @click="back()">返回上一页</van-button>
      <van-button class="btn fs_32" @click="back2()">返回到A 返回2页 B-C-D replace了 </van-button>
      <van-button class="btn fs_32" @click="back3()">返回到首页</van-button>
    </div>
  </div>
</template>

<script setup lang="ts" name="TestE">
import { backHome, backward, historyGo } from '@/common/utils/index';

// 返回
const close = () => {
  backward();
};

onMounted(() => {});
// const router = useRouter();

const back = () => {
  backward();
};
const back2 = () => {
  // history.go(-2);
  historyGo(2);
};
const back3 = () => {
  backHome();
};
</script>

<style lang="less" scoped>
.content-wraper {
  overflow: hidden;
}
</style>
