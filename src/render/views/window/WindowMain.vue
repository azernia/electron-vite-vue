<template>
    <BarLeft/>
    <div class="page-box">
        <router-view/>
    </div>
</template>

<script lang="ts" setup>
import BarLeft from '../../components/BarLeft.vue';
</script>

<style lang="scss" scoped>
.page-box {
  flex: 1;
  height: 100%;
  border-top: 1px solid #e6e6e6;
  box-sizing: border-box;
  display: flex;
  margin-top: -1px;
}
</style>
