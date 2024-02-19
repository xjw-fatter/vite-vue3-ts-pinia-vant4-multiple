<template>
  <div class="activity">
    <xx-header title="测试页面" @left-click="backward" />
    <div class="content-wraper">
      <div class="pd-t_92 ta_c">activity-store--{{ testText }}</div>
    </div>
    <van-floating-bubble icon="chat" />
    <van-floating-panel :content-draggable="false">
      <div style="padding: 15px; text-align: center">
        <p>内容不可拖拽</p>
      </div>
    </van-floating-panel>
  </div>
</template>

<script setup lang="ts" name="TimeLimitBuy">
// components
// import Header from '@/common/components/Header.vue';
// utils
import { backward, emitter, polling } from '@/common/utils/index';
// services
import activityService from './services';
// store
import activityStore from '../../store/activity.store';
import { showToast } from 'vant';

const useActivityStore = activityStore();
const { testText } = storeToRefs(useActivityStore);

const init = ref<boolean>(false);

const getTest = async () => {
  try {
    let res = await activityService.$test();
    console.log(res);
  } catch (error) {
    console.error(error);
  }
};

const initCheck = () => {
  if (init.value) return; // 初始化过
  init.value = true;
  console.log('initCheck over', testText);

  getTest();
  setTimeout(() => {
    useActivityStore.updateTestText('我是新的测试文案');
  }, 3000);
  console.log('initCheck over');

  polling({
    query: activityService.$test,
    handle: (res) => {
      console.log(res);
      if (res.return_code === '03') {
        // do something
        return true;
      }
      return false;
    },
    complete: () => {
      showToast('接口结果未满足条件，达到最大尝试次数：3');
    },
    maxAttempts: 3,
    delayTime: 3000,
  });
};

const { proxy }: any = getCurrentInstance();

// 生命周期
onMounted(() => {
  console.log(proxy.$dayjs().format('YYYY-MM-DD'));
  emitter.on('authReady', initCheck);
});
</script>
<style lang="less" scoped>
.login {
  display: flex;
  align-items: center;
  flex-direction: column;
  width: 100vw;
  height: 100vh;

  &__content {
    width: 690px;
    height: calc(100vh - 92px);
  }
}
</style>
