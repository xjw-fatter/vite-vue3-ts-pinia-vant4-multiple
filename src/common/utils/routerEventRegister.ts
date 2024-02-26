import { RouteLocationRaw, Router } from 'vue-router';

export const routerEventConfig = {
  pushName: 'push',
  goName: 'go',
  replaceName: 'replace',
  backName: 'back',
  forwardName: 'forward',
};

export const myHistoty = {
  action: routerEventConfig.pushName,
};

// 劫持router的各种跳转事件
const routerEventRegister = (router: Router) => {
  const routerPush = router.push.bind(router);
  const routerGo = router.go.bind(router);
  const routerReplace = router.replace.bind(router);
  const routerBack = router.back.bind(router);
  const routerForward = router.forward.bind(router);

  router.push = (to: RouteLocationRaw) => {
    myHistoty.action = routerEventConfig.pushName;
    return routerPush(to);
  };

  router.go = (n: number) => {
    myHistoty.action = routerEventConfig.goName;
    routerGo(n);
  };

  router.replace = (to: RouteLocationRaw) => {
    myHistoty.action = routerEventConfig.replaceName;
    return routerReplace(to);
  };

  router.back = () => {
    myHistoty.action = routerEventConfig.backName;
    routerBack();
  };

  router.forward = () => {
    myHistoty.action = routerEventConfig.forwardName;
    routerForward();
  };
};

export default routerEventRegister;
