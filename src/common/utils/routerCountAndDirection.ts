import { Router } from 'vue-router';
import commonStore from '../store/common.store';

/**
 * 路由切换动画计数
 * @param router
 */
export function routerCountAndDirection(router: Router) {
  // 页面过渡动画
  const storage = window.sessionStorage;
  storage.clear();

  let historyCount = storage.getItem('count') || 0; // 历史页面数量
  storage.setItem('/', '0');

  router.beforeEach((to, from, next) => {
    const toIndex = storage.getItem(to.fullPath);
    const fromIndex = storage.getItem(from.fullPath);
    const historyCountAll = Number(storage.getItem('countAll')) || 0;
    const historyCountReplace = Number(storage.getItem('countReplace')) || 0;
    const useCommonStore = commonStore();

    if (to.meta && to.meta.keepAlive) {
      useCommonStore.keepAlive(to.name);
    }

    if (toIndex) {
      //上一页
      if (fromIndex === null || !fromIndex) {
        // 入口页不过渡
        useCommonStore.updateDirection('');
      } else if (Number(toIndex) < Number(fromIndex)) {
        useCommonStore.updateDirection('out');
        historyCountAll > 1 && storage.setItem('countAll', String(historyCountAll - 1));
        if (from.query.replace && historyCountReplace) {
          storage.setItem('countReplace', String(historyCountReplace - 1)); // 返回记录减1 中间有多次连续replace时 返回时只会走一次 此时会有问题
        }
      } else {
        useCommonStore.updateDirection('in');
        storage.setItem('countAll', String(historyCountAll + 1));
      }
    } else {
      // 下一页
      historyCount = Number(historyCount) + 1; // 总数+1
      storage.setItem('count', String(historyCount));
      to.fullPath !== '/' && storage.setItem(to.fullPath, String(historyCount));
      if (to.query.replace) {
        storage.setItem('countReplace', String(historyCountReplace + 1)); // replace的记录增加一次
      } else {
        storage.setItem('countAll', String(historyCountAll + 1)); // replace的不增加计数
      }
      useCommonStore.updateDirection(!from.name ? '' : 'in'); // 入口页不过渡 否则为进场动画
    }
    useCommonStore.clearToken(); // 页面切换取消请求
    next();
  });

  router.afterEach((to) => {
    setTimeout(() => {
      to.meta && to.meta.title && (document.title = to.meta.title as string);
      // ios native title 设置不生效的 hack
      if (/iP(ad|hone|od)/.test(window.navigator.userAgent)) {
        const iframe = document.createElement('iframe');
        iframe.style.visibility = 'hidden';
        iframe.style.width = '1px';
        iframe.style.height = '1px';
        iframe.onload = function () {
          setTimeout(function () {
            document.body.removeChild(iframe);
          }, 0);
        };
        document.body.appendChild(iframe);
      }
    }, 0);
  });
}
