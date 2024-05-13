<template>
  <div>
    <slot :data="data"></slot>
  </div>
</template>

<script setup>
import { ref, inject, onMounted } from 'vue';
import { useRoute } from 'vue-router';
const data = {};
const app = inject('app');
let $map = null;
// const props = defineProps(['city']);
// const _city = props.city;
const route = useRoute();
onMounted(() => {
  $map = app.config.globalProperties.$map;
  console.log(route.params.city);
//   console.log(_city);
});
</script>

<style lang="scss" scoped></style>
