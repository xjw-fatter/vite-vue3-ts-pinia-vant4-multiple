<template>
  <div :id="'videoContent' + index" class="videoContent" style="width: 100vw; height: 375px"></div>
</template>
<script lang="ts" setup name="VideoPlayer">
import Player from 'xgplayer';

const props = defineProps<{ videoUrl: string; index: number }>();

let player = ref<any>();
onMounted(() => {
  player.value && player.value.destroy(true);
  player.value = new Player({
    id: 'videoContent' + props.index,
    url: props.videoUrl,
    fluid: false, // 流式布局
    volume: 0,
    width: '100vw',
    height: 375,
    autoplay: false, // 自动播放
    loop: false, // 循环播放
    videoInit: true, // 初始化显示视频首帧  该配置在移动端无效
    // poster:"", // 封面图

    cssFullscreen: false, // 网页样式全屏
    download: false,
    pip: false, // 画中画
    miniplayer: false,
    miniplayerConfig: {
      bottom: 500,
      right: 0,
      width: 320,
      height: 180,
    },
    // closeInactive: true,
    // closeVideoStopPropagation: true,
    // closeVideoPreventDefault: true,
    // closeVideoDblclick: false,
    // closeVideoTouch: false,
    // closeVideoClick: false,
    // enableVideoDbltouch: true,
    // controlsList: ['nodownload','nofullscreen','noremoteplayback'],
    playbackRate: [0.5, 0.75, 1, 1.5, 2], // 倍速播放
    defaultPlaybackRate: 1, // 默认倍速
    rotate: {
      // 视频旋转按钮配置项
      innerRotate: false, // 只旋转内部video
      clockwise: false, // 旋转方向是否为顺时针
    },
    // rotateFullscreen: true,
    // fitVideoSize: 'fixWidth', // 自适应视频内容宽高
    controls: true,
    // screenShot: true, // 截图
    ignores: ['definition', 'error', 'i18n', 'loading', 'mobile', 'pc', 'poster', 'replay', 'volume'],
    airplay: false,
    playsinline: true,
    'x5-video-player-type': 'h5',
  });
});

onUnmounted(() => {
  player.value && player.value.destroy(true);
});
</script>
<style lang="less" scoped>
.videoContent {
  width: 100vw;
  height: 375px;

  :deep(.xgplayer-playbackrate) {
    display: none;
  }

  :deep(.xgplayer-rotate) {
    display: none;
  }

  :deep(.xgplayer-progress-played) {
    background: #fff !important;
  }
}
</style>
