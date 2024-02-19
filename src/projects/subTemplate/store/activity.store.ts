import { defineStore } from 'pinia';
export default defineStore('activityStore', {
  state: () => {
    return {
      testText: '我是测试文案',
    };
  },
  actions: {
    // 更新页面切换动画
    updateTestText(testText: string) {
      this.testText = testText;
    },
  },
  persist: false, // 开启缓存
});
