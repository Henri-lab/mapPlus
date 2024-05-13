<template>
  <div id="map">
    <div class="navi">
      <router-link to="/">home</router-link><br>
      <router-link to="/citySearch">citySearch</router-link>
    </div>

    <city-map></city-map>
    <CityZoomTo></CityZoomTo>
    <city-weather></city-weather>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import CityMap from '@/views/PATH_Map_ol/CityMap.vue';
import CityZoomTo from '@/views/PATH_Map_ol/CityZoomTo.vue';
import CityWeather from './CityWeather.vue';

onMounted(() => {});
</script>

<style lang="scss" scoped></style>
