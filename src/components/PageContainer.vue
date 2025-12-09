<template>
  <v-container fluid class="pa-4">
    <v-row>
      <v-col cols="12" md="10" lg="8" xl="6" class="mx-auto">
        <v-card>
          <slot name="header" />
          <v-card-text class="pa-4">
            <slot />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
// Componente reutilizável para o layout padrão de páginas
</script>

