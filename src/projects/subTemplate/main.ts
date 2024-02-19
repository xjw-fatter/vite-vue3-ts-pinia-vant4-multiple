import App from './App.vue';
import pinia from '@/common/store';
import router from './router';
import dayjs from 'dayjs';
import { directives, isEnv, loadStyles } from '@/common/utils';
import 'vant/es/toast/style';
import 'vant/es/dialog/style';
import '@/assets/styles/reset.less';
import '@/assets/styles/common.less';
import '@/assets/styles/fonts/font.css';
import '@/assets/styles/color.root.less';
import '@/assets/styles/van.root.less';
import '@carelj/metacss/dist/index.half.min.css';

if (isEnv('ios')) {
  // ios字重较安卓轻 重新覆盖
  loadStyles(new URL('../../assets/styles/fwIos.css', import.meta.url).href);
}

const app = createApp(App);
app.config.globalProperties.$dayjs = dayjs;

// 全局自定义指令
Object.keys(directives).forEach((item: string) => {
  const directive = directives as any;
  app.directive(item, directive[item]); // 注册
});

// 公共组件
import XxHeader from '@/common/components/XxHeader.vue';
app.component('XxHeader', XxHeader);

import { Lazyload } from 'vant';
app.use(Lazyload);

// import { VueMasonryPlugin } from 'vue-masonry'; // 瀑布流
// app.use(VueMasonryPlugin);

app.use(pinia);
app.use(router);
app.mount('#app');
