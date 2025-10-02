<script setup>
import { ref } from 'vue';

import { useRouter } from 'vue-router';

const router = useRouter();

const username = ref('');
const password = ref('');

const login = () => {
  localStorage.setItem('token', 'your_token_here');
  router.push('/dashboard');
};
</script>

<template>
  <h1>Amazing Login page</h1>
  <form>
    Garbo Data Server login <br>
    <label for="username">Username</label>
    <input
      type="text"
      id="usernameBox"
      name="username"
      required
      minlength="4"
      maxlength="8"
      size="10" /> <br>
    <label for="pwd">Password</label>
    <input
      type="password"
      id="pwd"
      name="pwd"
      required
      minlength="4"
      maxlength="8"
      size="10" />
      <button type="button" @click="login">Login</button>
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

<script>
  export default {}
</script>
