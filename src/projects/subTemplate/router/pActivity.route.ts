import { RouteRecordRaw } from 'vue-router';

// 限时秒杀
const timeLimitBuy = (): any => import('../views/pActivity/timeLimitBuy.vue');

const routes: Array<RouteRecordRaw> = [
  {
    path: '/scoreMall/timeLimitBuy',
    name: 'TimeLimitBuy',
    meta: {
      title: '限时秒杀',
      keepAlive: false,
    },
    component: timeLimitBuy,
  },
];
export default routes;
