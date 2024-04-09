import { createRouter, RouteRecordRaw, createWebHashHistory } from 'vue-router';
import { generateRoutes, routerCountAndDirection } from '@/common/utils';
import pageMates from './pages.meta';
// import pActivityRoute from './pActivity.route';
// import pTestRoute from './pTest.route';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'PageQuickIn',
    meta: {
      title: '',
      keepAlive: false,
    },
    component: () => import('../views/pageQuickIn.vue'),
    // redirect: '/test/test',
    children: [],
  },
  // ...pActivityRoute,
  // ...pTestRoute,
  ...generateRoutes(import.meta.glob('../views/pTest/**/*.vue'), pageMates),
  ...generateRoutes(import.meta.glob('../views/pActivity/**/*.vue'), pageMates),
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

routerCountAndDirection(router); // 页面过渡动画计数

export default router;
