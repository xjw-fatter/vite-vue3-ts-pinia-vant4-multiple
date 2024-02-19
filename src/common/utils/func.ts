import { showToast } from 'vant';
import { BridgeInvokeCheckOptions, CommonType } from '@/common/types/index.type';
import { bridgeInvoke } from './index';

export interface EnvList {
  [key: string]: RegExp;
}
/**
 * 是否在某环境
 * @params str 环境标识
 * @returns boolean 环境判断
 */
export const isEnv = (str: string): boolean => {
  const envList: EnvList = {
    weixin: /MicroMessenger/i,
    alipay: /AlipayClient/i,
    qq: /\bqq\/([\d\.]+)/i,
    bestpay: /Bestpay/i,
    unionpay: /unionpay/i,
    ios: /iphone|ipad|ipod/i,
    android: /android/i,
    xiang: /xiang/i,
  };
  return envList[str].test(window.navigator.userAgent.toLowerCase());
};

export const isIOS = (): boolean => {
  const ua = window.navigator.userAgent;
  return !!ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
};

// json 对象 key 字段 非空字段序 排成  key=value&key=value 字符串
export function sortObjByKey(params: any) {
  if (Object.prototype.toString.call(params) !== '[object Object]') return '';
  const keys = Object.keys(params).sort(),
    arr = [],
    length = keys.length;
  for (let i = 0; i < length; i++) {
    if (![null, undefined].includes(params[keys[i]]) && keys[i] !== 'xxx') {
      const value = params[keys[i]];
      if (typeof value === 'object') {
        arr.push(`${keys[i]}=${JSON.stringify(value)}`);
      } else {
        arr.push(`${keys[i]}=${value}`);
      }
    }
  }
  return arr.join('&');
}

/**
 * @parmas obj
 * 判断是否是空对象
 */
export function isEmptyObject(obj: string | object) {
  if (!obj) {
    return true;
  }
  if (typeof obj === 'string') {
    if (obj === '' || obj === '{}') {
      return true;
    }
    obj = JSON.parse(obj);
  }
  const arr = Object.keys(obj);
  return arr.length < 1;
}

/**
 *
 * @param array
 * 判断是否是空数组
 */
export function isEmptyArray(array: string | Array<any>) {
  if (!array) {
    return true;
  }
  if (typeof array === 'string') {
    if (array === '' || array === '[]') {
      return true;
    }
    array = JSON.parse(array);
  }
  return array.length < 1;
}

/**
 *
 * 查找某对象数组中某key的值与value相同项
 * @export
 * @param {string} key 要比对的key值
 * @param {string} value 要比对的value
 * @param {any[]}  list 数组
 * @returns {any}
 */
export function getConstantValue(key: any, value: any, list: any[]) {
  const item = list.find((v: any) => v[key] == value);
  return item ? item.value : '';
}

/*
 * @字符串截取替换
 */
export const strSub = (s: string, l: number, tag: string) => {
  if (s.length > l) {
    return s.substring(0, l) + tag;
  } else {
    return s;
  }
};

/**
 * 将对象转换成url
 */
export function objToUrl(paramObj: { [key: string]: any }): string {
  const sdata = [];
  for (const attr in paramObj) {
    sdata.push(`${attr}=${paramObj[attr]}`);
  }
  return sdata.join('&');
}

/**
 *
 * 检测是否是包含小数
 * @export
 * @param {string} content
 * @returns {boolean}
 */
export function isFloat(content: string): boolean {
  return !/^\d+$/.test(content);
}

/**
 *
 * 检测是否含有特殊字符
 * @export
 * @param {string} content
 * @returns {boolean}
 */
export function haveSpecial(content: string, type?: string): boolean {
  /* eslint-disable-next-line */
  let regEn = /[`~!@#$%^&*()_+<>?:"{},.\/;'[\]]/im;
  // regCn = /[·！#￥（——）：；“”‘、，|《。》？、【】[\]]/im;
  // if(regEn.test(content) || regCn.test(content)) {

  // 根据type，更改校验方式
  switch (type) {
    case 'name': // 名称校验
      regEn = /[`~!@#$%^&*()_+<>?:"{},/;'[\]]/im;
      break;
    default:
      break;
  }

  if (regEn.test(content)) {
    return true;
  }
  return false;
}

/**
 *
 * 检测指定字符
 * @export
 * @param {string} content
 * @param {string} str
 * @returns
 */
export function haveString(content: string, str: string) {
  const reg = new RegExp(str, 'g');
  return reg.test(content);
}

/**
 *
 * 检测表情字符
 * @export
 * @param {string} content
 * @returns
 */
export function haveEmoji(content: string) {
  return /\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g.test(content);
}

/**
 * 校验身份证号
 * @param code  身份证号
 */
export function IdentityCodeValid(code: string) {
  const city: { [key: number]: string } = {
    11: '北京',
    12: '天津',
    13: '河北',
    14: '山西',
    15: '内蒙古',
    21: '辽宁',
    22: '吉林',
    23: '黑龙江 ',
    31: '上海',
    32: '江苏',
    33: '浙江',
    34: '安徽',
    35: '福建',
    36: '江西',
    37: '山东',
    41: '河南',
    42: '湖北 ',
    43: '湖南',
    44: '广东',
    45: '广西',
    46: '海南',
    50: '重庆',
    51: '四川',
    52: '贵州',
    53: '云南',
    54: '西藏 ',
    61: '陕西',
    62: '甘肃',
    63: '青海',
    64: '宁夏',
    65: '新疆',
    71: '台湾',
    81: '香港',
    82: '澳门',
    91: '国外 ',
  };
  let tip = '';
  let pass = true;
  let codes: string[] = [];

  if (!code || !/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i.test(code)) {
    tip = '身份证号格式错误';
    pass = false;
  } else if (!city[Number(code.substr(0, 2))]) {
    tip = '地址编码错误';
    pass = false;
  } else {
    //18位身份证需要验证最后一位校验位
    if (code.length == 18) {
      codes = code.split('');
      //∑(ai×Wi)(mod 11)
      //加权因子
      const factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
      //校验位
      const parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2];
      let sum = 0;
      let ai = 0;
      let wi = 0;
      for (let i = 0; i < 17; i++) {
        ai = Number(codes[i]);
        wi = factor[i];
        sum += ai * wi;
      }
      // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
      const last = parity[sum % 11];
      if (parity[sum % 11] != codes[17]) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
        tip = '校验位错误';
        pass = false;
      }
    }
  }
  return pass;
}

/**
 * 生成  32 位 uuid
 * guid
 */
export function guid(): string {
  function S4() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  }
  return S4() + S4() + S4() + S4() + S4() + S4() + S4() + S4();
}

/**
 * 时间转为数字
 * @param val 时间 eg:18:00
 */
export function time2Num(val: string): number {
  return parseInt(val.replace(/:/g, ''));
}

/**
 * 时间段转数组
 * @param interval 时间段
 */
export function interval2Arr(interval: string) {
  if (!interval) return [];
  const dateInterval = [],
    intervalArr = interval.split('|');
  for (let i = 0; i < intervalArr.length; i++) {
    const intervalArr2 = intervalArr[i].split(',');
    dateInterval.push({
      id: new Date().getTime() + i,
      beginDate: intervalArr2[0],
      endDate: intervalArr2[1],
    });
  }
  return dateInterval;
}

/**
 * backward 回退上一级，如果没有上一级就退出页面
 */
export function backward(): void {
  const historyCountAll = Number(sessionStorage.getItem('countAll')) || 0;
  if (historyCountAll - 1 > 0) {
    history.go(-1);
  } else {
    bridgeInvoke.bbb(); // 没有历史记录，关闭webview
  }
}

/**
 * backHome 返回到入口页(项目首页)
 */
export function backHome(): void {
  const historyCountAll = Number(sessionStorage.getItem('countAll')) || 0;

  if (historyCountAll >= 2) {
    const backStep = historyCountAll - 1;
    history.go(-backStep);
    // 返回多步时 router.beforeEach守卫只走一次 此时减去1步 会计数错误 因此 返回首页时直接重置为2 守卫只走一次会减少到1 replace记录也重置0
    sessionStorage.setItem('countAll', '1');
    sessionStorage.setItem('countReplace', '0');
  } else {
    bridgeInvoke.bbb(); // 已经在首页了 直接关闭webview
  }
}

/**
 * historyGo 返回指定步数(项目首页) replaceCount 中间replace的次数
 */
export function historyGo(step: number, replaceCount = 0): void {
  if (step <= 1) return history.go(-step);
  // step > 2时 返回多步 router.beforeEach守卫只走一次
  const historyCountAll = Number(sessionStorage.getItem('countAll')) || 0;
  sessionStorage.setItem('countAll', String(historyCountAll - step + 1));

  // 返回的层级中有使用过router.replace的次数
  if (replaceCount) {
    const historyCountReplace = Number(sessionStorage.getItem('countReplace')) || 0;
    historyCountReplace && sessionStorage.setItem('countReplace', String(historyCountReplace - replaceCount)); // 返回减去相应的replace次数
  }
  history.go(-step);
}

// base64转file
export function data64toFile(base64: any, filename: string) {
  const Base64Arr = base64.split(',');
  const MIME = Base64Arr[0].match(/:(.*?);/)[1];
  const bstr = atob(Base64Arr[1]);
  let length = bstr.length;
  const u8arr = new Uint8Array(length);
  while (length--) {
    u8arr[length] = bstr.charCodeAt(length);
  }
  return new File([u8arr], filename || 'xxx', { type: MIME });
}

// 获取今日剩余时间 毫秒
export function getTodayTimeRemaining(): number {
  return new Date().setHours(23, 59, 59, 999) - Date.now();
}

export function isVideo(value: string): boolean {
  const VIDEO_REGEXP = /\.(mp4|mpg|mpeg|dat|asf|avi|rm|rmvb|mov|wmv|flv|mkv)/i;
  return VIDEO_REGEXP.test(value);
}

// 链接拼接时间戳
export function addTimertamp(url: string): string {
  const timertampStr = `t=${new Date().getTime()}`;
  const urlStrArr = url.split('?');
  const paramsStr = urlStrArr[1] ? `?${urlStrArr[1]}&t=${timertampStr}` : `?t=${timertampStr}`;
  return urlStrArr[0] + paramsStr;
}

// obj中添加时间戳
export function addTimertampParams(params: CommonType = {}): CommonType {
  return {
    ...params,
    t: new Date().getTime(),
  };
}

// 客户端方法 actionName客户端api名称 actionVersion要校验的版本
export async function bridgeInvokeCheck(options: BridgeInvokeCheckOptions) {
  try {
    const canIUse = await bridgeInvoke.aaa({
      action_name: options.actionName,
      action_version: options.actionVersion || '1',
    });
    if (canIUse === '0') return;
    bridgeInvoke[options.actionName](options.params || {}, options.success);
  } catch (error) {
    showToast(`bridgeInvokeCheck--error:${JSON.stringify(error)}`);
    console.warn(error);
  }
}

export function loadStyles(url: string) {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.type = 'text/css';
  link.href = url;
  const head = document.getElementsByTagName('head')[0];
  head.appendChild(link);
}

// 轮询
export interface PollingOptions {
  query: Function; // 接口service
  handle: (res: any) => boolean; // 接口响应处理
  maxAttempts?: number; // 轮循次数
  delayTime?: number; // 轮循间隔 毫秒 有值则固定间隔 否则 依次为 0s 0s 1s 2s 3s ...
  complete?: Function; // 轮循完成未获取到正确结果
}
export async function polling(options: PollingOptions): Promise<any> {
  const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
  let attempts = 1;
  const maxAttempts = options.maxAttempts || 15;

  while (attempts <= maxAttempts) {
    console.log(attempts);
    try {
      const res = await options.query();
      const sueecss = options.handle(res); // 处理结果
      if (sueecss) return; // 判断接口结果满足条件

      // 延长事件间隔
      const delayTime = options.delayTime || attempts * 1000;
      await delay(delayTime);

      attempts++;
    } catch (error) {
      console.error(error);
      attempts++;
    }
  }
  options.complete && options.complete();
  throw new Error(`接口结果未满足条件，达到最大尝试次数：${maxAttempts}`);
}

/**
 * 本地图片转base64
 * @exports
 * @param {string} name
 * @returns {any}
 */
export function getImgBase64(url: any, callback: any): any {
  const Img = new Image();
  let dataURL = '';
  Img.src = url + '?v=' + Math.random();
  Img.setAttribute('crossOrigin', 'Anonymous');
  Img.onload = function (): any {
    const canvas = document.createElement('canvas') as any;
    const width = Img.width;
    const height = Img.height;
    canvas.width = width;
    canvas.height = height;
    canvas.getContext('2d').drawImage(Img, 0, 0, width, height);
    dataURL = canvas.toDataURL('image/jpeg');
    callback && callback(dataURL);
  };
}
