<template>
  <div id="myMap"></div>
</template>

<script setup>
import { ref, onMounted, watch, computed, inject } from 'vue';
import { useOlMapStore } from '@/stores/olMapStore';
const app = inject('app');
const olMapStore = useOlMapStore();
// ol data
let $map = null;
let gdXYZ = new ol.source.XYZ({
  url: olMapStore.gdXYZ_url,
  wrapX: olMapStore.gdXYZ_wrapX,
});
let gdTile = new ol.layer.Tile({
  name: ' 高德矢量底图',
  source: gdXYZ,
});
let defaultView = new ol.View({
  center: ol.proj.fromLonLat([olMapStore.longtitude, olMapStore.latitude]),
  zoom: olMapStore.zoom,
});
//🌏创建
function loadMap() {
  return new ol.Map({
    title: 'openmap',
    target: 'myMap',
    view: defaultView,
    layers: [gdTile],
  });
}
onMounted(() => {
  $map = loadMap();
  app.config.globalProperties.$map = $map;
});



</script>

<style lang="scss" scoped></style>
