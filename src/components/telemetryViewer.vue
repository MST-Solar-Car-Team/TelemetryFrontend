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

const selectXaxis = ref('time');
const selectYaxis = ref('time')
// var selectCols = ref(selectXaxis.value+','+selectYaxis.value) // change to your column names
const whereSql = ref('TRUE')
const columns = ref([])
const rows = ref([])

async function load() {
  // Arrow fast path
  const res = await http.get(`/files/${props.file}/data`, {
    format: 'arrow',
    select: selectXaxis.value+','+selectYaxis.value,
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
  const xCol = selectXaxis.value//selectCols.value.split(',')[0].trim()
  const yCol = selectYaxis.value//selectCols.value.split(',')[1].trim()
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
    <div class="flex items-center gap-3 justify-center">
      <select
        v-model="selectXaxis"
        class="bg-gray-50 text-gray-900 text-sm rounded-lg w-60 p-3 text-white bg-gray-700 border border-gray-600 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
      >
        <option value="">Select X-Axis...</option>
        <option v-for="col in columns" :key="col" :value="col">{{ col }}</option>
      </select>
      <select
        v-model="selectYaxis"
        class="bg-gray-50 text-gray-900 text-sm rounded-lg w-60 p-3 text-white bg-gray-700 border border-gray-600 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
      >
        <option value="">Select Y-Axis...</option>
        <option v-for="col in columns" :key="col" :value="col">{{ col }}</option>
      </select>
      <!-- <input v-model="selectCols" class="input text-center border border-solid rounded-sm" placeholder="time_s,voltage_v"> -->
      <!-- <input v-model="whereSql" class="input text-center border border-solid rounded-sm" placeholder="time_s BETWEEN 0 AND 600"> -->
      <!-- <button class="btn" @click="load">Load</button> -->
    </div>

    <div v-if="rows.length === 0">No data (try different filters)</div>

    <div v-else class="grid md:grid-cols-2 gap-6">
      <div class="overflow-auto border rounded max-h-[500px]">
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
