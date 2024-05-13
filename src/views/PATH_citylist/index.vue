<template>
    <div id="citySearch">
        <city-navi></city-navi>
        <city-table></city-table>
        <city-order></city-order>
    </div>
</template>

<script setup>
import { onMounted } from 'vue';
import CityNavi from './CityNavi.vue';
import CityTable from './CityTable.vue';
import CityOrder from './CityOrder.vue';



onMounted(()=>{
   
})
</script>

<style lang="scss" scoped>

</style>