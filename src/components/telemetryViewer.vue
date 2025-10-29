<script setup>
import { ref, defineProps, computed, watch } from 'vue';
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

const selectXaxis = ref('')
const selectYaxis = ref('')
const availableColumns = ref([])
const tableRows = ref([])
const chartRows = ref([])

async function loadTablePreview(file) {
  if (!file || file === 'Select...') {
    return
  }
  try {
    const res = await http.get(`/files/${file}/data`, {
      params: {
        limit: 500
      }
    })
    let dataRows = []
    if (Array.isArray(res.data)) {
      dataRows = res.data
    } else if (res.data && Array.isArray(res.data.rows)) {
      dataRows = res.data.rows
    }
    let candidateColumns = []
    const firstRow = dataRows[0]
    if (firstRow && typeof firstRow === 'object') {
      candidateColumns = Object.keys(firstRow)
    } else if (res.data && typeof res.data === 'object' && Array.isArray(res.data.columns)) {
      candidateColumns = res.data.columns
    } else if (
      res.data &&
      typeof res.data === 'object' &&
      res.data.schema &&
      Array.isArray(res.data.schema.fields)
    ) {
      candidateColumns = res.data.schema.fields
        .map(field => field && field.name)
        .filter(Boolean)
    }
    availableColumns.value = candidateColumns
    tableRows.value = dataRows
  } catch (error) {
    console.error('Failed to load available telemetry columns', error)
    availableColumns.value = []
    tableRows.value = []
  }
}

async function loadChartData() {
  const file = props.file
  if (!file || file === 'Select...' || !selectXaxis.value || !selectYaxis.value) {
    chartRows.value = []
    return
  }
  if (
    !availableColumns.value.includes(selectXaxis.value) ||
    !availableColumns.value.includes(selectYaxis.value)
  ) {
    chartRows.value = []
    return
  }
  try {
    const res = await http.get(`/files/${file}/data`, {
      params: {
        format: 'arrow',
        select: `${selectXaxis.value},${selectYaxis.value}`,
        order: `${selectXaxis.value} ASC`,
        limit: 50000
      }
    })
    let data = []
    if (Array.isArray(res.data)) {
      data = res.data
    } else if (res.data && Array.isArray(res.data.rows)) {
      data = res.data.rows
    }
    chartRows.value = data
  } catch (error) {
    console.error('Failed to load telemetry data', error)
    chartRows.value = []
  }
}

function setYAxisFromColumn(column) {
  if (!column || selectYaxis.value === column) {
    return
  }
  if (!availableColumns.value.includes(column)) {
    return
  }
  selectYaxis.value = column
}

function setXAxisFromColumn(column) {
  if (!column || selectXaxis.value === column) {
    return
  }
  if (!availableColumns.value.includes(column)) {
    return
  }
  selectXaxis.value = column
}

function handleHeaderClick(event, column) {
  if (event.metaKey || event.ctrlKey) {
    event.preventDefault()
    setXAxisFromColumn(column)
    return
  }
  setYAxisFromColumn(column)
}

function handleHeaderKey(event, column) {
  if (event.metaKey || event.ctrlKey) {
    event.preventDefault()
    setXAxisFromColumn(column)
  } else {
    setYAxisFromColumn(column)
  }
}

const headerButtonClass = column => {
  const classes = [
    'flex w-full items-center justify-between rounded-md border px-2 py-1 text-left text-xs uppercase tracking-wide transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900'
  ]
  if (selectYaxis.value === column) {
    classes.push('bg-blue-500/10 text-blue-200 ring-1 ring-inset ring-blue-400/40')
  } else {
    classes.push('text-gray-300 hover:bg-blue-500/5 hover:text-blue-200')
  }

  if (selectXaxis.value === column) {
    classes.push('border-emerald-400/60 shadow-[0_0_0_1px_rgba(16,185,129,0.3)]')
  } else {
    classes.push('border-transparent')
  }

  return classes.join(' ')
}

watch(
  () => props.file,
  async newFile => {
    selectXaxis.value = ''
    selectYaxis.value = ''
    chartRows.value = []
    tableRows.value = []
    availableColumns.value = []
    if (!newFile || newFile === 'Select...') {
      return
    }
    await loadTablePreview(newFile)
  },
  { immediate: true }
)

watch([selectXaxis, selectYaxis], () => {
  if (!selectXaxis.value || !selectYaxis.value) {
    chartRows.value = []
    return
  }
  loadChartData()
})

const needsAxisSelection = computed(() => !selectXaxis.value || !selectYaxis.value)

const chartData = computed(() => {
  if (needsAxisSelection.value || chartRows.value.length === 0) {
    return { labels: [], datasets: [] }
  }
  const xCol = selectXaxis.value
  const yCol = selectYaxis.value
  return {
    labels: chartRows.value.map(r => r[xCol]),
    datasets: [
      {
        label: `${yCol}`,
        data: chartRows.value.map(r => r[yCol]),
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
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center gap-3 mt-4 justify-center">
      <select
        v-model="selectXaxis"
        class="w-60 rounded-lg border border-gray-600 bg-gray-800 px-4 py-2.5 text-sm text-gray-100 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">Select X-Axis...</option>
        <option v-for="col in availableColumns" :key="col" :value="col">{{ col }}</option>
      </select>
      <select
        v-model="selectYaxis"
        class="w-60 rounded-lg border border-gray-600 bg-gray-800 px-4 py-2.5 text-sm text-gray-100 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">Select Y-Axis...</option>
        <option v-for="col in availableColumns" :key="col" :value="col">{{ col }}</option>
      </select>
    </div>

    <div class="grid gap-6 md:grid-cols-2">
      <div class="max-h-[480px] overflow-auto rounded-xl border border-gray-700 bg-gray-900/60 shadow-inner backdrop-blur">
        <template v-if="tableRows.length">
          <table class="min-w-full table-auto text-sm text-gray-100">
            <thead class="sticky top-0 z-10 bg-gray-900/90 text-[0.7rem] uppercase tracking-wide text-gray-400 backdrop-blur">
              <tr class="border-b border-gray-700">
                <th
                  v-for="c in availableColumns"
                  :key="c"
                  class="px-4 py-3 text-left font-semibold text-gray-300"
                >
                  <button
                    type="button"
                    :class="headerButtonClass(c)"
                    @click="handleHeaderClick($event, c)"
                    @keydown.enter="handleHeaderKey($event, c)"
                    @keydown.space.prevent="handleHeaderKey($event, c)"
                    title="Click to set Y axis, Ctrl+Click to set X axis"
                  >
                    <span class="font-semibold normal-case text-sm">{{ c }}</span>
                    <div class="ml-2 flex items-center gap-1">
                      <span
                        v-if="selectYaxis === c"
                        class="rounded-sm bg-blue-500/20 px-1.5 py-0.5 text-[0.55rem] font-semibold uppercase text-blue-200"
                      >
                        Y
                      </span>
                      <span
                        v-if="selectXaxis === c"
                        class="rounded-sm bg-emerald-500/20 px-1.5 py-0.5 text-[0.55rem] text-center font-semibold uppercase text-emerald-200"
                      >
                        X
                      </span>
                    </div>
                  </button>
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-800">
              <tr
                v-for="(r, i) in tableRows.slice(0, 100)"
                :key="i"
                class="transition-colors even:bg-gray-800/40 hover:bg-blue-500/10"
              >
                <td
                  v-for="c in availableColumns"
                  :key="c"
                  class="whitespace-nowrap px-4 py-2 align-middle font-mono text-xs text-gray-200"
                >
                  {{ r[c] }}
                </td>
              </tr>
            </tbody>
          </table>
          <p class="px-4 py-3 text-right text-xs text-gray-400">
            Showing first {{ Math.min(tableRows.length, 100) }} of {{ tableRows.length }} rows
          </p>
        </template>
        <div v-else class="flex h-full items-center justify-center p-6">
          <p class="text-sm text-gray-500 text-center">No telemetry rows loaded yet.</p>
        </div>
      </div>

      <div class="min-h-[240px] rounded-xl border border-gray-700 bg-gray-900/60 p-4 shadow-inner backdrop-blur">
        <div
          v-if="needsAxisSelection"
          class="h-full flex items-center justify-center text-sm text-gray-400 text-center"
        >
          Select both axes to render the chart.
        </div>
        <div
          v-else-if="chartRows.length === 0"
          class="h-full flex items-center justify-center text-sm text-gray-400 text-center"
        >
          No data returned for the chosen axes.
        </div>
        <LineChart v-else :data="chartData" :options="chartOptions" />
      </div>
    </div>
  </div>
</template>
