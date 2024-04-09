import { RouteRecordRaw } from 'vue-router';

/**
 * 动态生成路由
 * @param viteModules
 */
export function generateRoutes(viteModules: Record<string, () => Promise<any>>, metas: any = {}): Array<RouteRecordRaw> {
  // https://blog.csdn.net/hbiao68/article/details/131577642
  const routes: Array<RouteRecordRaw> = Object.entries(viteModules).map(([modulePath, component]) => {
    const path = modulePath.replace('../views', '').replace('.vue', '') || '/'; // 页面路由 目录路径 如：/pTest/testA
    const nameArr = path.split('/'); // ['',pTest,testA],['',pTest,test,testA],
    const subPackageName = nameArr[1]; // pTest
    const routeNameArr = nameArr.splice(2, nameArr.length - 1); // [testA],[test,testA]
    const name = routeNameArr
      .map((_e) => {
        return _e.replace(/^[a-z]/, (match) => match.toUpperCase());
      })
      .join(''); // 页面name 路径拼接 首字母大写 TestA TestTestA
    const meta = metas[subPackageName] ? metas[subPackageName][routeNameArr.join('/')] || {} : {};
    return {
      path,
      name,
      meta,
      component,
    };
  });
  console.log(routes);
  return routes;
}
