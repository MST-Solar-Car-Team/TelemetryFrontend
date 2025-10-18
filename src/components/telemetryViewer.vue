<script setup>
import { ref, defineProps, onMounted, computed, watch } from 'vue';
import { http } from '@/lib/http'
import LineChart from '@/components/LineChart.vue'

const props = defineProps({
  username: {
    type: String,
    required: true
  },
  file: {
    type: String,
    required: true
  }
});

const selectCols = ref('time_s,voltage_v') // change to your column names
const whereSql = ref('TRUE')
const columns = ref([])
const rows = ref([])

async function load() {
  // Arrow fast path
  const res = await http.get(`/files/${props.file}/data`, {
    format: 'arrow',
    select: selectCols.value,
    where: whereSql.value,
    order: 'time_s ASC',
    limit: 50000
  })
  console.log(res)
  console.log(res.data)
  columns.value = Object.keys(res.data[0])
  rows.value = res.data//.map(r => Object.values(r))
  console.log(rows.value)

  console.log('Loaded', rows.value.length, 'rows')

}

const chartData = computed(() => {
  if (rows.value.length === 0 || columns.value.length < 2) {
    return { labels: [], datasets: [] }
  }
  const xCol = columns.value[0]
  const yCol = columns.value[1]
  return {
    labels: rows.value.map(r => r[xCol]),
    datasets: [
      {
        label: `${yCol}`,
        data: rows.value.map(r => r[yCol]),
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        pointRadius: 5,
        tension: 0.0
      }
    ]
  }
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: { x: { ticks: { maxTicksLimit: 8 } } }
}

onMounted(load)
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center gap-3">
      <input v-model="selectCols" class="input" placeholder="time_s,voltage_v">
      <input v-model="whereSql" class="input" placeholder="time_s BETWEEN 0 AND 600">
      <button class="btn" @click="load">Load</button>
    </div>

    <div v-if="rows.length === 0">No data (try different filters)</div>

    <div v-else class="grid md:grid-cols-2 gap-6">
      <div class="overflow-auto border rounded">
        <table class="min-w-full text-sm">
          <thead class="bg-transparent">
            <tr>
              <th v-for="c in columns" :key="c" class="px-3 py-2 text-left font-semibold">{{ c }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(r, i) in rows.slice(0, 100)" :key="i" class="border-t">
              <td v-for="c in columns" :key="c" class="px-3 py-1">{{ r[c] }}</td>
            </tr>
          </tbody>
        </table>
        <p class="p-2 text-xs text-gray-500">Showing first {{ Math.min(rows.length, 100) }} of {{ rows.length }} rows</p>
      </div>

      <div class="p-2 border rounded">
        <LineChart :data="chartData" :options="chartOptions" />
      </div>
    </div>
  </div>
</template>