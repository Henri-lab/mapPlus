<template>
  <div class="cityPoly"></div>
</template>

<script setup>
import { inject, onMounted } from 'vue';
import { useOlMapStore } from '@/stores/olMapStore';
import { setFeaturesStyleSingle, featureStyle } from '@/util/setFeatureStyle';
import { useRoute } from 'vue-router';
const olMapStore = useOlMapStore();
const route = useRoute();
const app = inject('app');
let $map = null;
let adcode = null;
const red_03_ftSty = featureStyle({
  fillColor: 'rgba(255, 255, 255, 0.3)',
});
async function getAdcode(city) {
  let adcode = null;
  const cityCache = olMapStore.getCache();
  if (cityCache.length > 0 && cityCache.find((item) => item.city == city)) {
    adcode = cityCache.find((item) => item.city == city).adcode;
  } else {
    adcode = olMapStore.getCityAdcode(city);
  }
  return adcode;
}
function clearLayersByName($map, layerName) {
  $map
    .getLayers()
    .getArray()
    .forEach((layer) => {
      if (layer.get('name') === layerName) {
        $map.removeLayer(layer);
      }
    });
}
// 🙄
async function getPoly(adcode) {
  let ft = null;
  const utl = olMapStore.getUrlAliyun(adcode);
  fetch(utl)
    .then((res) => res.json())
    .then((res) => {
      ft = res.features;
      return ft;
    });
}
function randomIntFromInterval(min, max) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}
onMounted(async () => {
  $map = app.config.globalProperties.$map;
  const city = route.params.city;
  adcode = await getAdcode(city);
  const layerAliyun = await olMapStore.getLayerWithPolygonByAdcodeByAliyun(
    'https://datav.aliyun.com/' + `adcode:${adcode}`,
    adcode
  );
  clearLayersByName($map, 'https://datav.aliyun.com/' + `adcode:${adcode}`);
  $map.addLayer(layerAliyun);

  layerAliyun.setStyle(
    new ol.style.Style({
      fill: new ol.style.Fill({
        color: `rgba(100,100,100,0.5)`,
      }),
    })
  );
  // 闪  
  //   const time = setInterval(() => {
  //     let opacity = randomIntFromInterval(0.3, 0.301);
  //     let a = randomIntFromInterval(100, 101);
  //     let b = randomIntFromInterval(100, 101);
  //     let c = randomIntFromInterval(0, 50);
  //     layerAliyun.setStyle(
  //       new ol.style.Style({
  //         fill: new ol.style.Fill({
  //           color: `rgba(${a},${b},${c}, ${opacity})`,
  //         }),
  //       })
  //     );
  //   }, 1000);

  //   $map.on('click', () => {
  //     clearInterval(time);
  //   });


  
  //test
  //   const lay = await olMapStore.getLayerWithPolygonByAdcodeByAliyun(
  //     'testCity' + 'https://datav.aliyun.com/' + `adcode${adcode}`,
  //     100000
  //   );
  //   $map.addLayer(lay);
});
</script>

<style lang="scss" scoped></style>
