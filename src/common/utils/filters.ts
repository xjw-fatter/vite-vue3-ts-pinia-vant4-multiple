import { accDiv, accMul } from './money';

/**
 *
 * 手机号脱敏
 * @export string
 * @param {*} string
 */
export function mobileEncrypt(val: string): string {
  if (!val) return '';
  return val.replace(/(\d{3})\d*(\d{4})/, '$1****$2');
}

/**
 *
 * 手机号脱敏+空格
 * @export string
 * @param {*} string
 */
export function mobileFilter(val: string): string {
  if (!val) return '';
  return val.replace(/(\d{3})\d*(\d{4})/, '$1 **** $2');
}

/**
 *
 * 手机号或者银行卡号保留最后4位
 * @export string
 * @param {*} string
 */
export function keepEndnumber(val: string): string {
  if (!val) return '';
  return val.substring(val.length - 4, val.length);
}

/**
 *
 * 身份证号脱敏
 * @export string
 * @param {*} string
 */
export function idCardEncrypt(val: string): string {
  if (!val) return '';
  return val.replace(/(\d{3})\d*(\d{4})/, '$1***********$2');
}

/**
 *
 * 10以下数字加0
 * @export string
 * @param {*} number
 */
export function addZero(time: number): string {
  if (!time) return '00';
  return time < 10 ? `0${time}` : `${time}`;
}

//格式化租借时间
export function formatShowLeaseTime(minutes: number) {
  if (!minutes) return '0分钟';
  const hourNum = parseInt(String(Math.floor(accDiv(minutes, 60))));
  const hour = hourNum > 0 ? hourNum : minutes;
  const minute = hour > 0 ? Math.floor(minutes - accMul(hour, 60)) : minutes;
  let time = '';
  if (hourNum > 0) {
    time += hour + '小时';
  } else {
    time += hour + '分钟';
  }
  if (minute > 0) time += minute + '分钟';
  return time;
}
