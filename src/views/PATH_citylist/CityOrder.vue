<template>
  <div class="cityOrder">
    <!-- <van-index-bar>
      <div v-for="(arr, index) in cityLists" :key="index">
        <van-index-anchor index="A" />
        <van-cell
          :title="item.name"
          v-for="item in arr[1]"
          :key="item.id"
          @click="$emit('handleItem', sunItem.name)"
        />
      </div>
    </van-index-bar> -->
  </div>
</template>

<script setup>
import { onMounted ,ref} from 'vue';

const cityLists = ref([]);
onMounted(() => {


});
</script>

<style lang="scss" scoped></style>
