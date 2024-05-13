<template>
  <div class="zoomTo">
    <!-- <slot :data="data"></slot> -->
  </div>
</template>

<script setup>
import { ref, inject, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useOlMapStore } from '@/stores/olMapStore';
const data = {};
const olMapStore = useOlMapStore();
const app = inject('app');
let $map = null;
// const props = defineProps(['city']);
// const _city = props.city;
const route = useRoute();
onMounted(() => {
  $map = app.config.globalProperties.$map;
  const city = route.params.city;
  olMapStore.zoomToByCityName(city, $map);
  olMapStore.getCache();
  olMapStore.setCache();
  // test
  // olMapStore.zoomToByCityName('上海市',$map)
  // console.log(_city);
});
</script>

<style lang="scss" scoped></style>
