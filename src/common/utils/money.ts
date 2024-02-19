// 处理金额的通用工具函数

/**
 * @param m 金额 单位为元
 * @return type number 金额 单位为分
 */
export const transY2F = (m: string | number | undefined) => {
  if (!m) {
    return 0;
  }
  return accMul(parseFloat(`${m}`), 100);
};

/**
 * @param m 金额 单位为分
 * @return type number 金额 单位为元
 */
export const transF2Y = (m: string | number | undefined) => {
  if (!m) {
    return 0;
  }
  return accDiv(parseFloat(`${m}`), 100);
};

//除法函数，用来得到精确的除法结果
//说明：javascript的除法结果会有误差，在两个浮点数相除的时候会比较明显。这个函数返回较为精确的除法结果。
export function accDiv(arg1: number | string, arg2: number | string) {
  let t1 = 0,
    t2 = 0;
  try {
    t1 = arg1.toString().split('.')[1] ? arg1.toString().split('.')[1].length : 0;
  } catch (e) {
    console.error(e);
  }
  try {
    t2 = arg2.toString().split('.')[1] ? arg2.toString().split('.')[1].length : 0;
  } catch (e) {
    console.error(e);
  }
  const r1 = Number(arg1.toString().replace('.', ''));
  const r2 = Number(arg2.toString().replace('.', ''));
  return (r1 / r2) * Math.pow(10, t2 - t1);
}

//乘法函数，用来得到精确的乘法结果
//说明：javascript的乘法结果会有误差，在两个浮点数相乘的时候会比较明显。这个函数返回较为精确的乘法结果。
export function accMul(arg1: number | string, arg2: number | string) {
  let m = 0;
  const s1 = arg1.toString(),
    s2 = arg2.toString();
  try {
    m += s1.split('.')[1] ? s1.toString().split('.')[1].length : 0;
  } catch (e) {
    console.error(e);
  }
  try {
    m += s2.split('.')[1] ? s2.toString().split('.')[1].length : 0;
  } catch (e) {
    console.error(e);
  }
  return (Number(s1.replace('.', '')) * Number(s2.replace('.', ''))) / Math.pow(10, m);
}

//加法函数，用来得到精确的加法结果
//说明：javascript的加法结果会有误差，在两个浮点数相加的时候会比较明显。这个函数返回较为精确的加法结果。
export const accAdd = (a: number | string, b: number | string) => {
  let c, d, e;
  try {
    c = a.toString().split('.')[1].length;
  } catch (f) {
    c = 0;
  }
  try {
    d = b.toString().split('.')[1].length;
  } catch (f) {
    d = 0;
  }
  return (e = Math.pow(10, Math.max(c, d))), (accMul(a, e) + accMul(b, e)) / e;
};

//减法函数，用来得到精确的减法结果
//说明：javascript的减法结果会有误差，在两个浮点数相减的时候会比较明显。这个函数返回较为精确的减法结果。
export const accSub = (a: number | string, b: number | string) => {
  let c, d, e;
  try {
    c = a.toString().split('.')[1].length;
  } catch (f) {
    c = 0;
  }
  try {
    d = b.toString().split('.')[1].length;
  } catch (f) {
    d = 0;
  }
  return (e = Math.pow(10, Math.max(c, d))), (accMul(a, e) - accMul(b, e)) / e;
};

//设置数字金额过滤器，自动加逗号
export function addcomma(arg: string) {
  if (!arg) return '0.00';
  if (typeof arg != 'string') {
    arg = String(arg);
  }
  const intPart = arg.split('.')[0]; //获取整数部分
  const intPartFormat = intPart.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,'); //将整数部分逢三一断
  const floatPart = arg.split('.')[1] || '00';
  return intPartFormat + '.' + floatPart;
}
export function isInteger(num: number) {
  return num % 1 === 0;
}
//100000转为10.00万，100000000转为1.00亿,不四舍五入
export function moneyFilter(val: string | number) {
  let value;
  if (Number(val) >= 10000 && 100000000 > Number(val)) {
    //6~8位数
    value = accDiv(val, 10000);
  }
  if (Number(val) >= 100000000) {
    //9位数及以上
    value = accDiv(val, 100000000);
  }
  const arr: string[] = String(value).split('.'); //将除以10000的返回值分割成数组
  if (arr.length === 1) {
    //代表为整数直接补.00
    return String(value) + '.00';
  } else {
    if (arr[1].length === 1) {
      return String(value) + '0';
    } else {
      return arr[0] + '.' + arr[1].substring(0, 2);
    }
  }
}

export function unitFilter(val: string) {
  const value = Math.abs(Number(val));
  if (value >= 10000 && 100000000 > value) {
    //6~8位数
    return '万';
  } else if (value >= 100000000) {
    //9位数及以上
    return '亿';
  } else {
    return '';
  }
}

//金额小数点前和笔数不需要保留两位小数
export function computedNum(val: string) {
  const value = addcomma(val);
  return value.split('.')[0];
}

// 计算金额方法
export function computedMoney(val: string) {
  let moneyArr: string[] = [];

  if (val === undefined || val === null) {
    return;
  }
  if (Number(val) === 0) {
    return '00';
  }
  if (val) {
    const value = val.toString();
    moneyArr = value.split('.');
    if (!moneyArr[1]) {
      return '00';
    } else {
      const count = Number(moneyArr[1]);

      if (count > 10 && ![1, 2, 3, 4, 5, 6, 7, 8, 9].includes(count)) {
        return moneyArr[1];
      }
      if (count < 10) {
        if (['01', '02', '03', '04', '05', '06', '07', '08', '09'].includes(moneyArr[1])) {
          return moneyArr[1];
        } else {
          return moneyArr[1] + '0';
        }
      }
    }
  }
}

// 计算百分比
export function computedMoneyRate(a: number | string, b: number | string) {
  const _a = Number(a);
  const _b = Number(b);
  if (_a === _b) return 0;
  if (!_a && _b) return -100;
  if (_a !== _b) {
    const c = accSub(_a, _b); //两数相减
    const d = accDiv(c, _a); //两数相除
    if (d < 1 && d > 0) {
      return accMul(d, 100); //乘以100 得到百分比
    } else if (d <= -1) {
      return -100;
    } else if (d >= 1) {
      return 100;
    } else {
      return accMul(d, 100); //乘以100 得到百分比
    }
  }
}

// moneyFilter过滤后的返回值进行拆分 小数点后两位数字号变小
export function getMoneyInteger(val: string) {
  //获取整数部分
  const data = moneyFilter(val);
  const integer = data.split('.')[0];
  return integer;
}

export function getMoneyDecimals(val: string) {
  //获取小数部分
  const data = moneyFilter(val);
  const decimals = data.split('.')[1];
  return decimals;
}
