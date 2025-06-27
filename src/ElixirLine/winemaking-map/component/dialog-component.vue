<script setup>
import { ref, onMounted } from 'vue';
import { WineBatchesApiService } from '../../winemaking-process/services/wine-batches-api.service.js';

const show = ref(false);
const label = ref('');
const selectedBatchId = ref('');
const wineBatches = ref([]);
const loading = ref(false);

const emit = defineEmits(['confirm', 'cancel']);

async function open() {
  show.value = true;
  loading.value = true;
  const api = new WineBatchesApiService();
  try {
    const res = await api.getAll();
    wineBatches.value = res.data;
  } finally {
    loading.value = false;
  }
}

function close() {
  show.value = false;
  label.value = '';
  selectedBatchId.value = '';
}

function confirm() {
  if (!label.value || !selectedBatchId.value) return;
  emit('confirm', { label: label.value, wineBatchId: selectedBatchId.value });
  close();
}

function cancel() {
  emit('cancel');
  close();
}

defineExpose({ open });
</script>

<template>
  <div v-if="show" class="dialog-backdrop">
    <div class="dialog">
      <h3>Nuevo campo</h3>
      <label>
        Etiqueta:
        <input v-model="label" type="text" placeholder="Ej: Campo Norte" />
      </label>
      <label>
        Lote asociado:
        <select v-model="selectedBatchId">
          <option value="" disabled>Seleccione un lote</option>
          <option v-for="batch in wineBatches" :key="batch.id" :value="batch.id">
            {{ batch.internalCode }} - {{ batch.vineyardOrigin }}
          </option>
        </select>
      </label>
      <div v-if="loading">Cargando lotes...</div>
      <div class="dialog-actions">
        <button @click="confirm" :disabled="!label || !selectedBatchId">Guardar</button>
        <button @click="cancel">Cancelar</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dialog-backdrop {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}
.dialog {
  background: #fff;
  padding: 24px 32px;
  border-radius: 8px;
  min-width: 320px;
  box-shadow: 0 2px 16px rgba(0,0,0,0.15);
}
.dialog label {
  display: block;
  margin: 12px 0 8px;
}
.dialog input, .dialog select {
  width: 100%;
  padding: 6px 8px;
  margin-top: 4px;
  margin-bottom: 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.dialog-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>