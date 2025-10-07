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
  }
});

const logout = () => {
  auth.logout();
  router.push('/');
}

const randomSize = (e) => {
  e.target.style.width = Math.floor(Math.random() * 100) + '%';
}

</script>

<template>
  <h1>Fantastic Dashboard</h1>
  <h2>Hello, {{ username }}</h2>
  <img id="devLogo" @click="randomSize" src= "./images/devArt.png" alt="100% the Solar Car logo" width="10%" class="center">
  <button type="button" @click="logout">Logout</button>
</template>

<style scoped>   

form {
  background-color: pink;
  width: min-content;
  min-width: 30%;
  border-style: dashed;
  border-color: greenyellow;
  border-width: 5px;
  border-radius: 20px;
  text-align: center;
}

  input {
  width: 70%;
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

<script>
  export default {}
</script>
