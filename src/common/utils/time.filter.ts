/**
 * 分钟转小时
 * @param {Number} minutes 分钟
 * @return 整数时显示小时 否则分钟
 */
export const transMinute = (minutes: number) => {
  if (minutes >= 60 && minutes % 60 === 0) {
    return Math.floor(minutes / 60) + '小时';
  } else {
    return minutes + '分钟';
  }
};

/**
 *  获取距离某时间(默认当前时间)的 (天数/小时数/分钟数)
 * @param {*} timesData  '2018-05-17 16:58:00'
 * @returns
 */
export const timesDiff = (timesData: string, finshTimesData?: string) => {
  if (!timesData) return '';
  console.log(timesData, finshTimesData);
  const dateEnd = finshTimesData ? new Date(finshTimesData.replace(/-/g, '/')) : new Date(); // 获取当前时间
  const dateBegin = new Date(timesData.replace(/-/g, '/')); //将-转化为/，使用new Date
  const dateDiff = dateEnd.getTime() - dateBegin.getTime(); //时间差的毫秒数
  const days = Math.floor(dateDiff / (24 * 3600 * 1000)); //计算出相差天数
  const leave1 = dateDiff % (24 * 3600 * 1000); //计算天数后剩余的毫秒数
  const hours = Math.floor(leave1 / (3600 * 1000)); //计算出小时数
  const leave2 = leave1 % (3600 * 1000); // 计算小时数后剩余的毫秒数
  const minutes = Math.floor(leave2 / (60 * 1000)); //计 算相差分钟数
  const leave3 = leave2 % (60 * 1000); // 计算分钟后剩余的毫秒数
  const seconds = Math.floor(leave3 / 1000); //计 算相差秒数
  const diffObj = {
    days: '',
    hours: '',
    minutes: '',
    seconds: '',
  };

  days != 0 && (diffObj.days = `${days}天`);
  hours != 0 && (diffObj.hours = `${hours}小时`);
  minutes != 0 && (diffObj.minutes = `${minutes}分钟`);
  seconds != 0 && (diffObj.seconds = `${seconds}秒`);

  const res = diffObj.days + diffObj.hours + diffObj.minutes;
  return res || diffObj.seconds; // 不足一分钟时显示秒
};
