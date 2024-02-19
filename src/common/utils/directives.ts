/**
 * @description 适配iphoneX底部区域 可设置padding,maring,bottom
 * @params 需要设置的值num  | type 设置的类型，比如说padding
 * @useage  v-fit="{ type: 'padding', num: 10 }"
 */

const fit = (el: any, binding: any) => {
  const ua = window.navigator.userAgent;
  const isIos = !!ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
  const num = binding.value.num || 34;
  if (isIos && window.screen.height >= 812) {
    // 在iphonex 中
    switch (binding.value.type) {
      case 'padding':
        el.style.paddingBottom = `${num}px`;
        break;
      case 'margin':
        el.style.marginBottom = `${num}px`;
        break;
      default:
        el.style.bottom = `${num}px`;
        break;
    }
  }
};

export default { fit };
