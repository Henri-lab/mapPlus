<template>
  <div class="weatherInfo">
    <!-- <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="city" label="城市" width="180" />
      <el-table-column prop="weather" label="天气" width="180" />
      <el-table-column prop="winddirection" label="风向" />
      <el-table-column prop="windpower" label="风力" />
    </el-table> -->
    <table>
      <tr v-for="item in tableData" :key="item.city">
        <td>{{ item.city }}</td>
        <td>{{ item.weather }}</td>
        <td>{{ item.winddirection }}</td>
        <td>{{ item.windpower }}</td>
      </tr>
    </table>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router';
import { useCityStore } from '@/stores/cityStore';
import { ref, onMounted } from 'vue';
const route = useRoute();
const cityStore = useCityStore();
const tableData = ref([]);

async function getTableData(city) {
  const res = await cityStore.getWeatherByCityName(city);
  tableData.value = [];
  tableData.value.push = res;
}

onMounted(() => {
  const city = route.params.city;
  getTableData(city);

  // test
  // getTableData('成都市');
});
</script>

<style lang="scss" scoped></style>
