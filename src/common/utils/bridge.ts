import { UserInfo } from '../types/index.type';
import { showToast } from 'vant';

const rejectMessage = (data: any, reject: (msg: string) => void) => {
  showToast(typeof data === 'string' ? data : data.msg);
  reject(data);
};

const invoke = <T = any>(api: string, params: any = {}, success?: Function) => {
  return new Promise<T>((resolve, reject) => {
    if (!window.yourBridgeNameJsBridge) {
      if (import.meta.env.DEV) return;
      return rejectMessage('当前yourBridgeNameJsBridge还未注入', reject);
    }
    window.yourBridgeNameJsBridge.invoke(
      api,
      { params: typeof params === 'string' ? params : JSON.stringify(params) },
      (error: number | string, data: any) => {
        if (+error !== 0) return rejectMessage(data, reject);
        success && success(data);
        resolve(data.result as T);
      },
    );
  });
};

export default {
  getInfo: () => invoke<UserInfo>('TestInfo'),
  canIUse: (params: any, success?: Function) => invoke('canIUse', params, success),
  closeWebview: () => invoke('closeWebview'),
};
