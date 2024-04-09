<template>
  <div>
    <xx-header title="测试页面入口" background="none" />
    <div class="home fs_32 pd-b_68 pd-t_92" v-if="showHome">
      <router-link to="/pActivity/timeLimitBuy">测试页面1</router-link>
      <router-link to="/pTest/test/testA">测试页面2</router-link>
    </div>
    <van-button class="btn fs_32" @click="testToA()">去A页面</van-button>
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
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  align-content: flex-start;
  background-color: var(--lc-white);

  a {
    display: block;
    padding: 20px;
    width: 100%;
    height: 60px;
  }
}
</style>
