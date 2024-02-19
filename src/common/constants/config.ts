import { CommonType, UserInfo } from '../types/index.type';

// 用户信息
export const loginInfo: UserInfo = {};

// 一些服务地址
export const serverUrl: CommonType = {
  pubLibUrl: import.meta.env.VITE_PUBLIC_URL, // 静态资源地址
  apiUrl: import.meta.env.VITE_API_URL, // API服务
};

// 一些其他配置参数
export const config: CommonType = {
  apiVer: '111', // 版本号
  payType: '222', //  版本号
  imgUrl: import.meta.env.VITE_IMG_URL, //图片域名
};
