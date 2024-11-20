<template>
  <v-app>
    <v-main>
      <FlashMessage />
      <router-view />
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
import FlashMessage from "./components/FlashMessage.vue";
</script>
