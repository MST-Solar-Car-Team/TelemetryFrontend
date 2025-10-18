<script setup>

import { onMounted, watch, ref, computed } from 'vue';
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

const logout = () => {
  auth.logout();
  // wait for logout to complete
  auth.fetchMe().then(() => {
    username.value = 'Guest';
    router.push('/');
  });
}

const components = {
  welcomeMessage,
  telemetryViewer,
};

const activeName = ref('welcomeMessage');

const activeComponent = computed(() => components[activeName.value] || null);

const switchTo = (name) => {
  if (components[name]) {
    activeName.value = name;
  } else {
    console.warn('Unknown component', name);
  }
};

const toggleComponent = () => {
  if (activeName.value === 'welcomeMessage') {
    activeName.value = "telemetryViewer"
    return
  }
  activeName.value = "welcomeMessage"
}

const fileNames = ref([]);
const selectedFile = ref("Select...");

onMounted(async () => {
  try {
    const files = await http.get('/files');
    fileNames.value = files.data;
  } catch (error) {
    console.error('Failed to fetch file names', error);
  }
});

</script>

<template>
  <navbar />
  <div v-if="activeName !== 'telemetryViewer'" class="text-center my-4">
    <select v-model="selectedFile" class="bg-gray-50 text-gray-900 text-sm rounded-lg w-60 p-3 mr-4 text-white bg-gray-700 border-gray-600 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500">
        <option>Select...</option>
        <option v-for="file in fileNames" :key="file" :value="file">{{ file }}</option>
    </select>
    <button @click="toggleComponent" class="border border-solid border-white rounded-lg cursor-pointer p-2.5" :disabled="selectedFile === 'Select...'">View</button>
  </div>
  <div class="flex-1">
    <component :is="activeComponent" :username="username" :file="selectedFile" />
  </div>
</template>
