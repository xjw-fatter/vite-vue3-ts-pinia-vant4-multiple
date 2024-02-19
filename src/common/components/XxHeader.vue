<template>
  <div class="header pt_f">
    <van-nav-bar
      @click-left="$emit('leftClick')"
      @click-right="$emit('rightClick')"
      :class="{ 'white-title': whiteTitle }"
      :style="{ background: background }"
      :border="border"
    >
      <template #left>
        <slot name="headerLeft"> <img class="van-nav-bar__left-icon" :src="whiteTitle ? backIconWhite : backIcon" /> </slot>
      </template>
      <template #right>
        <slot name="headerRight"></slot>
      </template>
      <template #title>
        <slot name="headerTitle">{{ title }}</slot>
      </template>
    </van-nav-bar>
  </div>
</template>

<script lang="ts" setup name="XxHeader">
/**
 * header
 * @description 标题导航栏
 * @property {String} title 标题文字
 * @property {Boolean} whiteTitle 白色标题文案 返回箭头
 * @property {Boolean} border 白色标题文案 返回箭头
 * @property {String} background 背景色 透明时传none或transparent即可
 * @event {Function} leftClick 按钮触发事件
 * @event {Function} rightClick 按钮触发事件
 *
 */

interface Props {
  title?: string;
  whiteTitle?: boolean;
  background?: string;
  border?: boolean;
}

defineEmits(['leftClick', 'rightClick']);
withDefaults(defineProps<Props>(), {
  title: '标题',
  whiteTitle: false,
  border: false,
  background: '#fff',
});
const backIconWhite = new URL('../../assets/images/iconBackWhite.png', import.meta.url).href;
const backIcon = new URL('../../assets/images/iconBack.png', import.meta.url).href;
</script>

<style lang="less" scoped>
.header {
  z-index: 9999;
  width: 100%;

  .white-title {
    :deep(.van-nav-bar__title) {
      color: #fff;
    }
  }

  .van-nav-bar__left-icon {
    width: 48px;
    height: 48px;
    vertical-align: middle;
  }

  :deep(.van-nav-bar__title) {
    height: 92px;
    line-height: 92px;
    font-weight: 600;
    font-size: 34px;
    color: var(--xx-black);
  }
}
</style>
