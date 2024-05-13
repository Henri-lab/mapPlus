<script setup>
import testApi from './api/testApi.vue';
import testStoreMethod from './components/testStoreMethod.vue';
//
import CityMap from './views/PATH_Map_ol/CityMap.vue';
</script>

<template>
  <city-map></city-map>
  <testApi />
  <testStoreMethod />
  <div id="app"></div>
</template>

<style scoped></style>
