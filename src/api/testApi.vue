<template>
  <div></div>
</template>

<script setup>
import { onMounted } from 'vue';
import {
  getIpAddress,
  getGeoByAddress,
  getReGeoByLocation,
  getCityAndHotCity,
  getWeatherByAdcode,
} from './index';

onMounted(() => {
  
  // getIpAddress().then((res) => {
  //   console.log(res, 'ip地址');
  // });

  // getGeoByAddress('北京').then((res) => {
  //   console.log(res, 'geo');
  // });

  // getReGeoByLocation(116.407387,39.904179).then((res) => {
  //   console.log(res, 'regeo');
  // });

  // getCityAndHotCity().then((res) => {
  //   console.log(res, 'cityAndHotCity');
  //   console.log(res.cities, 'cityAndHotCity-cities');
  // });

  //   getCityAndHotCity().then((res) => {
  //     for (let key in res.cities) {
  //       if (key === 'A') {
  //         console.log(res.cities[key]);
  //       }
  //     }
  //   });

  // getCityAndHotCity().then((res) => {
  //   for (let key in res.cities) {
  //     res.cities[key].forEach((item) => {
  //       if(item.spell.startsWith('wa'))
  //       console.log(item.spell,item.name);
  //     });
  //   }
  //   // console.log(res.cities, 'cityAndHotCity-cities');
  // });

  // getWeatherByAdcode(420100,'base').then((res) => {
  //   console.log(res);
  // });
});
</script>

<style lang="scss" scoped></style>
