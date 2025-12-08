<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <v-app>
    <RouterView />
  </v-app>
</template>

<style scoped>
:deep(.v-application) {
  width: 100%;
  min-height: 100vh;
}
</style>
