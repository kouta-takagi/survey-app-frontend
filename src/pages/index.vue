<script setup lang="ts">
import Surveys from "../components/Surveys.vue";
import SignUp from "../components/SignUp.vue";
import Login from "../components/Login.vue";
import { provide, ref } from "vue";

const pageType = ref<string>("login");

function handleToggle() {
  if (pageType.value === "login") {
    pageType.value = "signup";
  } else {
    pageType.value = "login";
  }
}

provide("pageType", pageType);
</script>

<template>
  <Surveys v-if="pageType === 'surveys'" />
  <SignUp v-else-if="pageType === 'signup'" />
  <Login v-else-if="pageType === 'login'" />
  <button v-if="pageType !== 'surveys'" v-on:click="handleToggle()">
    {{ pageType === "login" ? "新規作成へ" : "ログイン画面へ" }}
  </button>
</template>
