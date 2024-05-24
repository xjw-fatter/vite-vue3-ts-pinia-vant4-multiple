<template>
  <div class="home fs_32" v-if="showHome">
    <xx-header title="测试页面入口" background="none" />
    <div class="content-wraper pd-t_92">
      <div class="links">
        <router-link to="/pActivity/timeLimitBuy">测试页面1</router-link>
        <router-link to="/pTest/test/testA">测试页面2</router-link>
        <router-link to="/pActivity/bridgeTest">bridge调试</router-link>
      </div>
      <div class="btns">
        <van-button class="btn fs_32" @click="testToA()">去A页面</van-button>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts" name="PageQuickIn">
const showHome = import.meta.env.MODE;

const router = useRouter();
const testToA = () => {
  router.push({ path: '/pTest/testA' });
};
</script>
<style lang="less" scoped>
.home {
  overflow-y: scroll;
  height: 100vh;
  background-color: var(--lc-white);

  .links {
    display: flex;
    flex-wrap: wrap;
    align-content: flex-start;
    align-items: center;

    a {
      display: block;
      padding: 16px;
      margin: 8px;
    }
  }

  .btns {
    display: flex;
    align-items: center;
    flex-wrap: wrap;

    .btn {
      margin: 8px;
    }
  }
}
</style>
