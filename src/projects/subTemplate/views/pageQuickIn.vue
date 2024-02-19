<template>
  <div class="home fs_32 pd-b_68" v-if="showHome">
    <router-link to="/scoreMall/timeLimitBuy">限时购</router-link>
  </div>
</template>
<script setup lang="ts" name="PageQuickIn">
const showHome = import.meta.env.MODE;
</script>
<style lang="less" scoped>
.home {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  align-content: flex-start;
  background-color: var(--xx-white);

  a {
    display: block;
    padding: 20px;
    height: 60px;
  }
}
</style>
