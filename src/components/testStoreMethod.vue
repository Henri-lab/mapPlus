<template></template>

<script setup>
import { useCityStore } from '@/stores/cityStore';
import { useOlMapStore } from '@/stores/olMapStore';
import { onMounted ,inject} from 'vue';
const app = inject('app')
const cityStore = useCityStore();
const olMapStore = useOlMapStore();
import { reactive } from 'vue';
const form = reactive({});
onMounted(async () => {
  // 请求测试
  // const res=await cityStore.getCityResponse('wa');
  // console.log(res)
  // const res=await cityStore.getWeatherByCityName('北京')
  // console.log(res)

  // cityInfo的缓存测试
  //   const res = await cityStore.getCityCoordinates('北京')
  //   console.log(res)
  //   cityStore.setCache()
  //   await cityStore.getCityCoordinates('上海')
  //   cityStore.setCache()
  //   await cityStore.getCityCoordinates('上海')
  //   cityStore.setCache()
  //   await cityStore.getCityCoordinates('武汉')
  //   cityStore.setCache()

  // 测试飞行到目标地区+缓存测试
  async function Fly() {
    let $map = app.config.globalProperties.$map
    console.log($map);
    await cityStore.getCityCoordinates('上海')
    cityStore.setCache()
    await cityStore.getCityCoordinates('武汉')
    cityStore.setCache()
    // olMapStore.zoomToByCityName('上海市',$map);
    // olMapStore.zoomToByCityName('武汉市',$map);
    // olMapStore.zoomToByCityName('成都市',$map);

  }
 await Fly();
});
</script>

<style lang="scss" scoped></style>
