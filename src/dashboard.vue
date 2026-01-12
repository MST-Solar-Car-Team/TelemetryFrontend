<script setup>

import { onMounted, ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '@/stores/auth';
import { http } from '@/lib/http'

import navbar from '@/components/navbar.vue';
import welcomeMessage from '@/components/welcomeMessage.vue';
import telemetryViewer from '@/components/telemetryViewer.vue';

const router = useRouter();
const auth = useAuth();

const username = ref(''); // Display username if available

auth.fetchMe().then(() => {
  if (auth.user) {
    username.value = auth.user.username;
  } else {
    username.value = 'Guest';
    router.push('/');
  }
});

const components = {
  welcomeMessage,
  telemetryViewer,
};

const activeName = ref('welcomeMessage');

const activeComponent = computed(() => components[activeName.value] || null);

const toggleComponent = () => {
  if (activeName.value === 'welcomeMessage') {
    if (!selectedFile.value) {
      return
    }
    activeName.value = "telemetryViewer"
    return
  }
  activeName.value = "welcomeMessage"
}

const fileNames = ref([]);
const selectedFile = ref("");
const filesLoading = ref(false);
const filesError = ref("");
const toggleLabel = computed(() => (
  activeName.value === 'telemetryViewer' ? 'Show Welcome' : 'View'
));

onMounted(async () => {
  filesLoading.value = true;
  filesError.value = "";
  try {
    const files = await http.get('/files');
    fileNames.value = files.data;
  } catch (error) {
    console.error('Failed to fetch file names', error);
    filesError.value = 'Unable to load telemetry files.';
    fileNames.value = [];
  } finally {
    filesLoading.value = false;
  }
});

const returnToDash = () => {
  activeName.value = 'welcomeMessage';
};

</script>

<template>
  <navbar :returnToDash="returnToDash" class="z-50" />
  <div class="text-center my-4 space-y-2">
    <div class="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
      <div class="flex flex-col items-start">
        <label for="file-select" class="text-xs uppercase tracking-wide text-gray-400">Telemetry file</label>
        <select
          id="file-select"
          v-model="selectedFile"
          :disabled="filesLoading || !!filesError"
          class="w-60 rounded-lg border border-gray-600 bg-gray-700 p-3 text-sm text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="" disabled>Select a file...</option>
          <option v-for="file in fileNames" :key="file" :value="file">{{ file }}</option>
        </select>
      </div>
      <button
        @click="toggleComponent"
        class="border border-solid border-white rounded-lg cursor-pointer p-2.5 disabled:opacity-50 disabled:cursor-not-allowed"
        :disabled="activeName !== 'telemetryViewer' && !selectedFile"
      >
        {{ toggleLabel }}
      </button>
    </div>
    <p v-if="filesLoading" class="text-xs text-gray-400">Loading telemetry files...</p>
    <p v-else-if="filesError" class="text-xs text-red-400">{{ filesError }}</p>
    <p v-else-if="fileNames.length === 0" class="text-xs text-gray-400">No telemetry files found.</p>
    <p v-else-if="selectedFile" class="text-xs text-gray-400">Active file: {{ selectedFile }}</p>
  </div>
  <div class="flex-1">
    <component :is="activeComponent" :username="username" :file="selectedFile" />
  </div>
</template>
