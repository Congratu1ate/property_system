<template>
  <div id="app">
    <router-view></router-view> <!-- 这里是显示当前匹配的组件 -->
<!--    <BillManagement/>-->
  </div>
</template>

<script>
import BillManagement from './components/BillManagement.vue';

// export default {
//   components: {
//     BillManagement,
//   },
// };
</script>

<style>
/* 全局样式 */
body {
  font-family: Arial, sans-serif;
  margin: 20px;
}
</style>
