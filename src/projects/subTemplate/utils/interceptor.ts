import axios from 'axios';
import { createInterceptor, Hooks } from '@/common/utils';
import commonStore from '@/common/store/common.store';
import { serverUrl } from '@/common/constants';

axios.defaults.timeout = 15000; // 设置超时时间
axios.defaults.showLoading = false; // 设置请求是否loading
axios.defaults.needCheck = false; // 默认请求不携带auth_token

const axiosInstance = axios.create();
const apiInstance = axios.create({
  baseURL: serverUrl.apiUrl,
});

export const createInterceptorHooks: Hooks = {
  addAuthToken(config) {
    const useCommonStore = commonStore();
    const token = useCommonStore.info.auth_token;
    if (token) {
      config.headers = Object.assign({}, config.headers);
      config.headers.auth_token = token;
    }
  },
  pushReqToken(config) {
    config.cancelToken = new axios.CancelToken((cancel) => {
      const useCommonStore = commonStore();
      useCommonStore.pushToken(cancel);
    });
  },
};

createInterceptor(axiosInstance, createInterceptorHooks);
createInterceptor(apiInstance, createInterceptorHooks);

export const $axios = axiosInstance;
export const $api = apiInstance;
