<script setup>
import { storeToRefs } from 'pinia'
import { useAuth } from '@/stores/auth'

const auth = useAuth()
const { error: authError } = storeToRefs(auth)
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <div v-if="authError" class="bg-red-700 text-white text-center py-2 px-4">
      {{ authError }}
    </div>
    <router-view />
  </div>
</template>
