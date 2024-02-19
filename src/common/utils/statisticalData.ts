export interface StatisticalDataParams {
  type: string; // 类型 -- 页面名称
  operate: string; // 操作 -- 点击/跳转
  label: string; // 标签 -- 描述文案
  path?: string; // 页面路径
  extra?: object; // 额外参数
}

// 百度数据统计  需要在index.html配置百度统计代码
export function statisticalData(params: StatisticalDataParams): Promise<any> {
  return new Promise((resolve) => {
    try {
      (window as any)._hmt.push(['_trackEvent', params.type, params.operate, params.label]); // 百度统计-事件分析
      resolve('send:success');
    } catch (error) {
      console.warn(error);
      // reject(error);
      resolve('send:fail');
    }
  });
}
