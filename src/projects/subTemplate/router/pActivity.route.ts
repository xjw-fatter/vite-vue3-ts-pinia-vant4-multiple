import { RouteRecordRaw } from 'vue-router';

// 限时秒杀
const test = (): any => import('../views/pActivity/timeLimitBuy.vue');
const bridgeTest = (): any => import('../views/pActivity/bridgeTest.vue');

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
  {
    path: '/subTemplate/bridgeTest',
    name: 'bridgeTest',
    meta: {
      title: 'bridge调试',
      keepAlive: false,
    },
    component: bridgeTest,
  },
];
export default routes;
