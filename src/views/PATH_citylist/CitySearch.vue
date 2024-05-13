<template>
  <div id="cityList">
    <div class="search">
      <el-input
        class="search-input"
        v-model="input"
        style="width: 240px"
        placeholder="Please input"
        clearable
      />
    </div>
  </div>
</template>

<script setup>
import { useCityStore } from '@/stores/cityStore';
import { ref, onMounted } from 'vue';
const cityStore = useCityStore();
const input = ref('');
const cityResponse = ref([]);
</script>

<style lang="scss" scoped>

</style>
