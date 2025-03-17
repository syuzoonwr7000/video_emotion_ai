<template>
  <div>
    <RadarChart :data="chartData" />
  </div>
</template>

<script lang="ts">
import RadarChart from './RadarChart.vue';

export default {
  props: {
    chartData: Object,
  },
  components: {
    RadarChart,
  },
};
</script>
