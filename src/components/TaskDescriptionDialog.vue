<template>
  <v-dialog v-model="dialog" max-width="600" persistent scrollable>
    <v-card>
      <v-card-title class="d-flex align-center pa-4">
        <span class="text-h5">Descrição da Tarefa</span>
        <v-spacer />
        <v-btn
          icon="mdi-close"
          variant="text"
          @click="handleClose"
        />
      </v-card-title>
      <v-card-text class="pa-4">
        <p class="text-body-1" style="white-space: pre-wrap">{{ description }}</p>
      </v-card-text>
      <v-card-actions class="pa-4">
        <v-spacer />
        <v-btn
          color="primary"
          variant="flat"
          @click="handleClose"
        >
          Fechar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

interface Props {
  modelValue: boolean
  description?: string
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'closed'): void
}

const props = withDefaults(defineProps<Props>(), {
  description: '',
})

const emit = defineEmits<Emits>()

const dialog = ref(props.modelValue)

watch(() => props.modelValue, (newValue) => {
  dialog.value = newValue
})

watch(dialog, (newValue) => {
  emit('update:modelValue', newValue)
  if (!newValue) {
    emit('closed')
  }
})

function handleClose() {
  dialog.value = false
}
</script>

