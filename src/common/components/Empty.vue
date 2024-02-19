<template>
  <div class="empty row-h_sb pd-h_32 bg_white pd-t_28 ta_c">
    <img class="img--empty mg-b_20" :src="imgSrc" />
    <p class="fs_28 c_9 ta_c">{{ title }}</p>
    <p class="fs_28 c_9 ta_c">{{ desc }}</p>
  </div>
</template>
<script setup lang="ts" name="Empty">
import { serverUrl } from '../constants';
/**
 * address-list
 * @description
 * @property {String}imgSrc 图片 描述
 * @property {String} title 第一行描述
 * @property {String} desc 第二行描述
 *
 */

interface Props {
  imgSrc?: string; //图片
  title?: string; //标题
  desc?: string; //副标题
}

withDefaults(defineProps<Props>(), {
  imgSrc: `${serverUrl.pubLibUrl}images/empty.png`,
  title: '暂无记录哦~',
  desc: '',
});
</script>
<style lang="less" scoped>
.empty {
  flex-direction: column;
  min-height: 460px;

  .img--empty {
    margin: 0 auto;
    width: 360px;
    height: 360px;
  }
}
</style>
