<template>
  <div>
    <div class="openlayer"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, inject } from 'vue';
import { useOlMapStore } from '@/stores/olMapStore';
import {
  getFeatureAtPixel,
  getPropsFromFeatureByAliyun,
} from '@/util/getOlObj/getFeature';
import sleep from '@/util/sleep';
const app = inject('app');
const olMapStore = useOlMapStore();
let $map = null;
let isMapCilcked = ref(false);
let islayerNextLevelLoaded = ref(false);

onMounted(() => {
  $map = app.config.globalProperties.$map;
  $map.on('pointermove', function (e) {
    let pixel = $map.getEventPixel(e.originalEvent);
    let hit = $map.hasFeatureAtPixel(pixel);
    $map.getTargetElement().style.cursor = hit ? 'pointer' : '';
  });
  const click_isMapClicked = $map.on('click', function (e) {
    isMapCilcked.value = !isMapCilcked.value;
  });
  $map.getView().on('change:resolution', function (e) {
    let currentZoom = $map.getView().getZoom();
    if (currentZoom < 5) {
    }
  });
  olMapStore.addUniqueLayerWithPolygonByAdcodeByAliyun(
    $map,
    100000,
    'entranceLayer'
  );
  olMapStore.loadLayerWithPolygonByAdcodeByAliyun(
    $map,
    100000,
    'cityPolygon_aliyun',
    'layerLevel'
  );
});

let adcodeLevel = null;
let adcodeNextLevel = null;
let ftPix_in_Level = null; //feature at pixel in layer named layerLevel
let ftPix_in_NextLevel = null; //feature at pixel in layer named layerNextLevel
const cityNameLevel = ref('');
const cityNameNextLevel = ref('');
const currentAdcodeLevel = ref(0);
const currentAdcodeNextLevel = ref(0);
// 漫游地图时收集鼠标位置城市adcode
watch(
  () => currentAdcodeLevel.value,
  (newV) => {
    adcodeLevel = newV;
  }
);
// 点击地图--挂载nextLevel图层
watch(
  () => isMapCilcked.value,
  async () => {
    islayerNextLevelLoaded = false;
    let layerName = 'layerNextLevel';
    await olMapStore.loadUniqueLayerWithPolygonByAdcodeByAliyun(
      $map,
      adcodeLevel,
      layerName
    );
    islayerNextLevelLoaded = true;
  }
);
// 事件发生时，收集鼠标位置城市的矢量信息adcode，cityName
function handleCurrentFeatureProps_in_LayerNameIsLevel(e) {
  const layerName = 'layerLevel';
  let featureArr = getFeatureAtPixel(e, $map, layerName);
  ftPix_in_Level = featureArr[0];

  if (ftPix_in_Level) {
    const prop = getPropsFromFeatureByAliyun([ftPix_in_Level])[0];
    cityNameLevel.value = prop.name;
    adcodeLevel = prop.adcode;
    adcodeLevel !== null && (currentAdcodeLevel.value = adcodeLevel);
  }
}

function zoomToCurrentCityClicked_in_LayerNextLevel(e) {
  const layerName = 'layerNextLevel';
  let featureArr = getFeatureAtPixel(e, $map, layerName);

  if (featureArr.length > 0) {
    featureArr.forEach(async (feature) => {
      if (feature) {
        currentNextLevel = featureArr[0];
        const prop = getPropsFromFeatureByAliyun([feature])[0];

        cityNameNextLevel.value = prop.name;
        olMapStore.ZoomToByCityName(prop.name, $map);

        adcodeNextLevel = prop.adcode;
        adcodeNextLevel != null &&
          (currentAdcodeNextLevel.value = adcodeNextLevel);
      }
    });
  }
}
// Pointermove_a事件--->执行handleCurrentFeatureProps_in_LayerNameIsLevel
let flag_isPointermove_a_Triggered = 1;
function goDeeper() {
  const pointerMove_a = $map.on('pointermove', (e) => {
    if (flag_isPointermove_a_Triggered) {
      handleCurrentFeatureProps_in_LayerNameIsLevel(e);
    }
  });
  const click_zoomTo = $map.on('click', async (e) => {
    flag_isPointermove_a_Triggered = 0;
    if (islayerNextLevelLoaded) {
      $map
        .getLayers()
        .getArray()
        .forEach((layer) => {
          if (layer.get('name') === 'layerNextLevel') {
            zoomToCurrentCityClicked_in_LayerNextLevel(e);
            $map
              .getLayers()
              .getArray()
              .forEach((layer) => {
                if (layer.get('name') === 'layerLevel') $map.removeLayer(layer);
                if (layer.get('name') === 'layerNextLevel')
                  layer.set('name', 'layerLevel');
              });
          }
        });
    }

    await sleep(1000);
    flag_isPointermove_a_Triggered = 1;
  });
}
</script>

<style lang="scss" scoped></style>
