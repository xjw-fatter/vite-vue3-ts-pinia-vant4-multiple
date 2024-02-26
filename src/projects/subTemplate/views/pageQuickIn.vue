<template>
  <div class="home fs_32 pd-b_68" v-if="showHome">
    <router-link to="/test/test">测试页面</router-link>
  </div>
  <van-button class="btn fs_32" @click="testToA()">去A页面</van-button>
</template>
<script setup lang="ts" name="PageQuickIn">
const showHome = import.meta.env.MODE;

const router = useRouter();
const testToA = () => {
  router.push({ path: '/test/testA' });
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
