<template>
  <div class="bridge">
    <xx-header title="bridge调试页面" @left-click="backward" />
    <div class="content-wraper pd-t_92">
      <van-cell v-for="item in bridges" :key="item.api" :title="item.name" is-link :value="item.apiName" @click="bridgeTest(item)" />
    </div>
  </div>
</template>

<script setup lang="ts" name="bridgeTest">
// components
import { showFailToast, showToast } from 'vant';
// utils
import { backward, emitter, bridgeInvoke } from '@/common/utils/index';
import { AppActionName } from '@/common/types/index.type';

interface bridgeItem {
  name: string;
  api: string;
  apiName: AppActionName;
  params: any;
}

const init = ref<boolean>(false);

const bridges = reactive<bridgeItem[]>([
  {
    name: '获取APP用户信息',
    api: 'GetInfo',
    apiName: 'getInfo',
    params: {},
  },
  {
    name: '更改状态栏',
    api: 'changeStatus',
    apiName: 'changeBarStatus',
    params: { topImage: '', topColor: '#4470B7' },
  },
  {
    name: '隐藏状态栏',
    api: 'hideStatusbar',
    apiName: 'hideStatusbar',
    params: {},
  },
  {
    name: '调起手机扫码',
    api: 'webScanInfo',
    apiName: 'webScanInfo',
    params: {},
  },
]);

const bridgeTest = async (item: bridgeItem) => {
  if (!init.value) return;
  try {
    const res = await bridgeInvoke[item.apiName](item.params);
    showToast('调用' + item.apiName + '成功');
    console.log(`${item.name}--success: ${JSON.stringify(res)}`);
  } catch (error) {
    console.error(`${item.name}--error:`, error);
    showFailToast('调用' + item.apiName + '失败' + JSON.stringify(error));
  }
};

const initCheck = () => {
  if (init.value) return; // 初始化过
  init.value = true;
  console.log('APPWeb初始化成功');
};

// 生命周期
onMounted(() => {
  emitter.on('authReady', initCheck);
});
</script>
<style lang="less" scoped>
.bridge {
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
