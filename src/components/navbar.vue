<template>
  <nav class="w-full bg-gray-900 border-b border-gray-800 text-white border-2">
    <div class="mx-auto px-4 z-10">
      <div class="flex h-14 items-center justify-between">
        <RouterLink to="/dashboard" class="font-semibold">Solar Car</RouterLink>
        <div class="flex items-center space-x-6">
          <button @click="returnToDash" class="hover:text-yellow-300">Dashboard</button>
          <button type="button" @click="logout" class="border border-solid border-white rounded-sm cursor-pointer p-2">Logout</button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, defineProps } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '@/stores/auth';

const props = defineProps({
  returnToDash: {
    type: Function,
    required: true
  }
});

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
</script>