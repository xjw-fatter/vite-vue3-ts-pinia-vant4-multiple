import { defineStore } from 'pinia';
import { UserInfo } from '@/common/types/index.type';
import { loginInfo } from '@/common/constants';
export default defineStore('commonStore', {
  state: () => {
    return {
      keepAliveComponents: [],
      cancelTokenArr: [],
      direction: '',
      authReadyFlag: false, // 是否已经获取信息
      info: ref<UserInfo>(loginInfo), // 从app端获取的用户信息
    };
  },
  actions: {
    // 更新页面切换动画
    updateDirection(direction: string) {
      this.direction = direction;
    },
    // 更新登陆信息
    updateInfo(payload: UserInfo) {
      this.info = Object.assign({}, this.info, payload);
    },
    // 更新授权状态
    updateFlag(payload: boolean) {
      this.authReadyFlag = payload;
    },
    // 需要缓存
    keepAlive(component: any) {
      // 注：防止重复添加（当然也可以使用Set）
      !(this.keepAliveComponents as any[]).includes(component) && (this.keepAliveComponents as any[]).push(component);
    },
    // 不需要缓存
    noKeepAlive(component: any) {
      const index = (this.keepAliveComponents as any[]).indexOf(component);
      index !== -1 && this.keepAliveComponents.splice(index, 1);
    },
    // 传入请求的token
    pushToken(payload: any) {
      (this.cancelTokenArr as any[]).push(payload);
    },
    clearToken() {
      this.cancelTokenArr.forEach((item: any) => {
        item('路由跳转取消请求');
      });
      this.cancelTokenArr = [];
    },
  },
  persist: false, // 是否开启缓存 具体配置pinia-plugin-persistedstate https://prazdevs.github.io/pinia-plugin-persistedstate/zh/guide/
});
