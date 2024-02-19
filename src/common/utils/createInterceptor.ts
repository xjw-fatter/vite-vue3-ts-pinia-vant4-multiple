import { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import axios from 'axios';
import { showLoadingToast, showFailToast } from 'vant';
import { serverUrl } from '../constants';

axios.defaults.timeout = 15000; // 设置超时时间
axios.defaults.showLoading = false; // 设置请求是否loading
axios.defaults.needCheck = false; // 默认请求不携带auth_token
axios.defaults.needResponseAll = false; // 是否需要返回response中的 状态码 config 等字段

declare module 'axios' {
  interface AxiosRequestConfig {
    showLoading?: boolean;
    loadingText?: string;
    needCheck?: boolean;
    needResponseAll?: boolean;
  }
}

export interface Hooks {
  addAuthToken?: (config: InternalAxiosRequestConfig) => void;
  pushReqToken?: (config: InternalAxiosRequestConfig) => void;
  success?: () => boolean;
  error?: () => boolean;
}

let toast: any;
const loadingGif = `${serverUrl.pubLibUrl}images/loading.gif`;

export const createInterceptor = (instance: AxiosInstance, hooks: Hooks = {}): void => {
  instance.interceptors.request.use(
    function (config) {
      config.needCheck && hooks.addAuthToken && hooks.addAuthToken(config);
      hooks.pushReqToken && hooks.pushReqToken(config);
      if (config.showLoading && !toast) {
        toast = showLoadingToast({
          duration: 0, // 持续展示 toast
          forbidClick: true, // 禁用背景点击
          icon: loadingGif,
          message: config.loadingText || '加载中...',
        });
      }
      return config;
    },
    function (error) {
      if (toast && error.showLoading) {
        toast.close();
        toast = null;
      }
      showFailToast('网络错误');
      return Promise.reject(error);
    },
  );

  instance.interceptors.response.use(
    function (response) {
      if (toast || (response.config && response.config.showLoading)) {
        toast && toast.close();
        toast = null;
      }

      // 区分接口返回的几种情况
      const res = response.config.needResponseAll ? response : response.data; // 某些接口 需要返回整个response

      // 1: result_code  return_code
      if (response.data.hasOwnProperty('result_code') && response.data.hasOwnProperty('return_code')) {
        if (response.data.result_code !== '01' || response.data.return_code !== '01') {
          showFailToast(response.data.return_msg || '请求出错啦');
          return Promise.reject(res);
        }
        return res;
      }

      // 2: success message
      if (response.data.hasOwnProperty('success') && response.data.hasOwnProperty('message')) {
        if (!response.data.success) {
          showFailToast(response.data.message || '请求出错啦');
          return Promise.reject(res);
        }
        return res;
      }

      // 3:无
      return res;
    },
    function (error) {
      if (toast || (error.config && error.config.showLoading)) {
        toast && toast.close();
        toast = null;
        showFailToast(error.message || '请求失败');
      }
      return Promise.reject(error);
    },
  );
};

const apiInstance = axios.create({
  baseURL: serverUrl.apiUrl,
});

const axiosInstance = axios.create();
createInterceptor(apiInstance);
createInterceptor(axiosInstance);

export const $api = apiInstance;
export const $axios = axiosInstance;
