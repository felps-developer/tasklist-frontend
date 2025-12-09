<template>
  <v-dialog v-model="dialog" max-width="400" persistent>
    <v-card>
      <v-card-title class="text-h6">
        Confirmar Exclusão
      </v-card-title>
      <v-card-text>
        <p class="text-body-1">
          Tem certeza que deseja excluir esta lista de tarefas?
        </p>
        <p v-if="taskListName" class="text-body-2 text-medium-emphasis mt-2">
          Lista: <strong>{{ taskListName }}</strong>
        </p>
        <v-alert type="warning" variant="tonal" class="mt-4">
          <strong>Atenção:</strong> Todas as tarefas desta lista também serão excluídas.
        </v-alert>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          variant="text"
          @click="handleCancel"
          :disabled="loading"
        >
          Cancelar
        </v-btn>
        <v-btn
          color="error"
          variant="flat"
          @click="handleConfirm"
          :loading="loading"
        >
          Excluir
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

interface Props {
  modelValue: boolean
  taskListName?: string
  loading?: boolean
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'confirm'): void
  (e: 'cancel'): void
}

const props = withDefaults(defineProps<Props>(), {
  taskListName: '',
  loading: false,
})

const emit = defineEmits<Emits>()

const dialog = ref(props.modelValue)

watch(() => props.modelValue, (newValue) => {
  dialog.value = newValue
})

watch(dialog, (newValue) => {
  emit('update:modelValue', newValue)
})

function handleConfirm() {
  emit('confirm')
}

function handleCancel() {
  emit('cancel')
  dialog.value = false
}
</script>

