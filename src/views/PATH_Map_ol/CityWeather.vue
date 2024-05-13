<template>
  <div class="weatherInfo">
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="date" label="Date" width="180" />
      <el-table-column prop="name" label="Name" width="180" />
      <el-table-column prop="address" label="Address" />
    </el-table>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router';
const route = useRoute();
const city = route.params.city;
function getData(city){
    
}
</script>

<style lang="scss" scoped></style>
