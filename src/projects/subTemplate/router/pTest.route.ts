import { RouteRecordRaw } from 'vue-router';
const testA = (): any => import('../views/pTest/testA.vue');
const testB = (): any => import('../views/pTest/testB.vue');
const testC = (): any => import('../views/pTest/testC.vue');
const testD = (): any => import('../views/pTest/testD.vue');
const testE = (): any => import('../views/pTest/testE.vue');

const routes: Array<RouteRecordRaw> = [
  {
    path: '/test/testA',
    name: 'TestA',
    meta: {
      title: 'TestA',
      keepAlive: false,
    },
    component: testA,
  },
  {
    path: '/test/testB',
    name: 'TestB',
    meta: {
      title: 'TestB',
      keepAlive: false,
    },
    component: testB,
  },
  {
    path: '/test/testC',
    name: 'TestC',
    meta: {
      title: 'TestC',
      keepAlive: false,
    },
    component: testC,
  },
  {
    path: '/test/testD',
    name: 'TestD',
    meta: {
      title: 'TestD',
      keepAlive: false,
    },
    component: testD,
  },
  {
    path: '/test/testE',
    name: 'TestE',
    meta: {
      title: 'TestE',
      keepAlive: false,
    },
    component: testE,
  },
];
export default routes;
