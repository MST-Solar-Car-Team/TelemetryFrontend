<template>
  <Line
    id="my-chart-id"
    :options="resolvedOptions"
    :data="resolvedData"
  />
</template>

<script>
import { Line } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale)

export default {
  name: 'LineChart',
  components: { Line },
  props: {
    data: { type: Object, default: null },
    options: { type: Object, default: null }
  },
  computed: {
    resolvedData() {
      // Fallback demo data if parent doesn't pass anything
      return this.data ?? {
        labels: ['January', 'February', 'March'],
        datasets: [{ data: [40, 20, 12] }]
      }
    },
    resolvedOptions() {
      return this.options ?? { responsive: true }
    }
  }
}
</script>