<script setup>
import { ref } from 'vue';

import { useRoute, useRouter } from 'vue-router';

import { useAuth } from '@/stores/auth';

const router = useRouter();
const auth = useAuth();
const route = useRoute();

const username = ref('');
const password = ref('');
const loading = ref(false);
const error = ref('');

async function submit() {
  loading.value = true
  error.value = ''
  try {
    await auth.login(username.value, password.value)
    router.push((route.query.redirect) || '/dashboard')
  } catch {
    error.value = 'Login failed'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="flex flex-col items-center justify-center min-h-screen">
    <h1 class="text-2xl mb-2">Please Log In</h1>
    <form @submit.prevent="submit" class="w-full max-w-sm flex flex-col items-center space-y-4">
      <input v-model="username" type="text" placeholder="username" class="min-w-sm border border-gray-300 rounded-md bg-transparent text-center p-2" required>
      <input v-model="password" type="password" placeholder="password" class="min-w-sm border border-gray-300 rounded-md bg-transparent text-center p-2" required>
      <button :disabled="loading" class="border border-solid border-white rounded-sm cursor-pointer p-2">{{ loading ? '...' : 'Log In' }}</button>
      <p v-if="error" class="text-red-500">{{ error }}</p>
    </form>
  </div>
</template>