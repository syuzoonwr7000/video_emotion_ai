<template>
  <div class="radar-chart-container">
    <canvas ref="radarChart"></canvas>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import { Chart, RadarController, CategoryScale, LinearScale, ArcElement, Title, Tooltip, Legend } from 'chart.js';

// Chart.js のモジュールを登録
Chart.register(RadarController, CategoryScale, LinearScale, ArcElement, Title, Tooltip, Legend);

export default defineComponent({
  name: 'RadarChart',
  props: {
    emotionData: {
      type: Array,
      required: true,
    },
  },
  setup(props) {
    const radarChart = ref<HTMLCanvasElement | null>(null);

    // コンポーネントがマウントされた後にチャートを描画
    onMounted(() => {
      if (radarChart.value) {
        const ctx = radarChart.value.getContext('2d');
        if (ctx) {
          new Chart(ctx, {
            type: 'radar',
            data: {
              labels: ['Joyful', 'Happy', 'Fear', 'Sad', 'Surprise'],
              datasets: [
                {
                  label: '感情スコア',
                  data: props.emotionData,
                  backgroundColor: 'rgba(0, 123, 255, 0.2)',
                  borderColor: 'rgba(0, 123, 255, 1)',
                  borderWidth: 1,
                },
              ],
            },
            options: {
              scales: {
                r: {
                  suggestedMin: 0,
                  suggestedMax: 100,
                },
              },
            },
          });
        }
      }
    });

    return {
      radarChart,
    };
  },
});
</script>

<style scoped>
.radar-chart-container {
  max-width: 400px;
  margin: 0 auto;
}
</style>
