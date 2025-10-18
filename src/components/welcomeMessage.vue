<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  username: {
    type: String,
    required: true
  }
});
</script>

<template>
  <div class="flex flex-col items-center size-full justify-center space-y-4">
    <h1 class="text-2xl mb-2">Welcome!</h1>
    <h2 class="text-xl">Hello, {{ username }}</h2>
  </div>
</template>