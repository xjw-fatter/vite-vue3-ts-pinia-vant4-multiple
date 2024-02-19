<template>
  <router-view v-slot="{ Component, route }">
    <transition :name="transitionClass" mode="default">
      <keep-alive :include="keepAliveComponents">
        <component :is="Component" :key="route.fullPath" class="router-view" />
      </keep-alive>
    </transition>
  </router-view>
</template>
<script setup lang="ts">
import router from './router';
// components
import { showFailToast } from 'vant';
// utils
import { debounce } from 'lodash';
import { bridgeInvoke, emitter, isEnv } from '@/common/utils/index';
import { useEventListener } from '@/common/hooks/index';
// type & services
// store
import commonStore from '@/common/store/common.store';

const isxiang = isEnv('xiang');
const useCommonStore = commonStore();
const { direction, keepAliveComponents } = storeToRefs(useCommonStore);
const transitionClass = computed(() => {
  return `slide-${direction.value}`;
});

// 调试模式 不在相应环境
watch(
  () => router.currentRoute.value.path,
  (newValue: string) => {
    if (!isxiang && newValue !== '/') {
      setTimeout(() => {
        useCommonStore.updateFlag(true);
        emitter.emit('authReady'); // 触发用户信息获取完成事件
        console.log('非xxx 调试模式');
      }, 1000);
    }
  },
  { immediate: true },
);

const authReady = debounce(async () => {
  try {
    const userInfo = await bridgeInvoke.getInfo();
    console.log(userInfo);
    useCommonStore.updateInfo(userInfo);
    useCommonStore.updateFlag(true);
    emitter.emit('authReady');
  } catch (error) {
    console.error('authReady', error);
    showFailToast('获取登录用户信息失败');
  }
}, 200);
useEventListener(document, 'xiangJsBridgeReady', authReady);
</script>
<style lang="less">
@import url('../../assets/styles/entrance.less');
</style>
