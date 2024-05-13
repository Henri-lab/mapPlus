<template>
  <div id="map">
    <div class="navi">
      <router-link to="/">home</router-link><br />
      <router-link to="/citySearch">citySearch</router-link>
    </div>

    <city-map></city-map>
    <CityZoomTo></CityZoomTo>
    <city-weather></city-weather>
    <city-poly></city-poly>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import CityMap from '@/views/PATH_Map_ol/CityMap.vue';
import CityZoomTo from '@/views/PATH_Map_ol/CityZoomTo.vue';
import CityWeather from './CityWeather.vue';
import cityPoly from './cityPoly.vue';
import { useOlMapStore } from '@/stores/olMapStore';
import { useCityStore } from '@/stores/cityStore';
const olMapStore = useOlMapStore();
const cityStore = useCityStore();
onMounted(() => {
  cityStore.getCache();
  olMapStore.getCache();
});
</script>

<style lang="scss" scoped></style>
