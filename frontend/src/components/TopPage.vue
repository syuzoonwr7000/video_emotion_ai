<template>
  <div>
    <h1>Emotion Analysis</h1>
    <EmotionChart :emotionData="emotionData" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import EmotionChart from './EmotionChart.vue'; // 正しいパスを確認

export default defineComponent({
  name: 'TopPage',
  components: {
    EmotionChart,
  },
  data() {
    return {
      emotionData: [50, 60, 30, 80, 90], // 例: 感情スコアデータ
    };
  },
});
</script>
