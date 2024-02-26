import { RouteRecordRaw } from 'vue-router';

// 限时秒杀
const test = (): any => import('../views/pActivity/timeLimitBuy.vue');

const routes: Array<RouteRecordRaw> = [
  {
    path: '/test/test',
    name: 'Test',
    meta: {
      title: '限时秒杀',
      keepAlive: false,
    },
    component: test,
  },
];
export default routes;
