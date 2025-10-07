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
  <h1>Amazing Login page</h1>
  <form @submit.prevent="submit" class="login">
    <input v-model="username" type="text" placeholder="username" required>
    <input v-model="password" type="password" placeholder="password" required>
    <button :disabled="loading">{{ loading ? '...' : 'Log in' }}</button>
    <p v-if="error" style="color:red">{{ error }}</p>
  </form>
  <img id="devLogo" src= "./images/devArt.png" alt="100% the Solar Car logo" width="10%" class="center">
</template>

<style scoped>    
  input {
  width: 15%;
  border: 1px solid green;
  padding: 1px;
  margin: 5px;
  text-align: center;
}
 .center {
  display: block;
  margin-top: 10%;
  margin-left: auto;
  margin-right: auto;
  }</style>