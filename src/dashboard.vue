<script setup>

import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '@/stores/auth';

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

const randomSize = (e) => {
  e.target.style.width = Math.floor(Math.random() * 100) + '%';
}

</script>

<template>
  <nav class="w-full bg-gray-900 border-b border-gray-800 text-white">
    <div class="max-w-7xl mx-auto px-4">
      <div class="flex h-14 items-center justify-between">
        <RouterLink to="/dashboard" class="font-semibold">Solar Car</RouterLink>
        <div class="flex items-center space-x-6">
          <RouterLink to="/dashboard" class="hover:text-yellow-300">Dashboard</RouterLink>
          <button type="button" @click="logout" class="border border-solid border-white rounded-sm cursor-pointer p-2">Logout</button>
        </div>
      </div>
    </div>
  </nav>
  <div class="flex flex-col items-center justify-center min-h-screen space-y-4">
    <h1 class="text-2xl mb-2">Fantastic Dashboard</h1>
    <h2 class="text-xl">Hello, {{ username }}</h2>
    <img id="devLogo" @click="randomSize" src= "./images/devArt.png" alt="100% the Solar Car logo" width="10%" class="center">
  </div>
</template>
