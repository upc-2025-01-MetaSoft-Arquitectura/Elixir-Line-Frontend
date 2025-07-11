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
    <div class="dialog-component minimal-dialog">
      <div class="dialog-component-title">Nuevo campo</div>
      <label class="dialog-component-label">
        Etiqueta:
        <input v-model="label" type="text" placeholder="Ej: Campo Norte" class="dialog-component-input" />
      </label>
      <label class="dialog-component-label">
        Lote asociado:
        <select v-model="selectedBatchId" class="dialog-component-input">
          <option value="" disabled>Seleccione un lote</option>
          <option v-for="batch in wineBatches" :key="batch.id" :value="batch.id">
            {{ batch.internalCode }} - {{ batch.vineyardOrigin }}<span v-if="batch.grapeVariety"> ({{ batch.grapeVariety }})</span>
          </option>
        </select>
      </label>
      <div v-if="loading" style="margin-bottom: 10px; color: #1976d2; font-size: 15px;">Cargando lotes...</div>
      <div class="dialog-component-actions">
        <button @click="confirm" :disabled="!label || !selectedBatchId" class="dialog-component-btn">Guardar</button>
        <button @click="cancel" class="dialog-component-btn dialog-component-cancel">Cancelar</button>
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
.success-dialog {
  position: fixed;
  top: 32px;
  right: 38px;
  background: linear-gradient(90deg, #43ea7c 0%, #2ecc71 100%);
  color: #fff;
  font-weight: 600;
  font-size: 16px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(67,234,124,0.18);
  padding: 12px 32px 12px 18px;
  z-index: 99999;
  display: flex;
  align-items: center;
  gap: 10px;
  animation: fadeInOut 1.8s;
}
.create-success-dialog {
  top: 72px;
  right: 38px;
  background: linear-gradient(90deg, #43ea7c 0%, #2ecc71 100%);
  color: #fff;
  font-weight: 600;
  font-size: 16px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(67,234,124,0.18);
  padding: 12px 32px 12px 18px;
  z-index: 99999;
  display: flex;
  align-items: center;
  gap: 10px;
  animation: fadeInOut 1.8s;
}
.dialog-component {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(24,144,255,0.18);
  padding: 32px 38px 24px 38px;
  min-width: 320px;
  max-width: 90vw;
  display: flex;
  flex-direction: column;
  gap: 18px;
  align-items: center;
  justify-content: center;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 99999;
}
.dialog-component.minimal-dialog {
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 6px 32px rgba(24,144,255,0.18);
  padding: 28px 32px 20px 32px;
  min-width: 320px;
  max-width: 90vw;
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: center;
  justify-content: center;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 99999;
}
.dialog-component-title {
  font-size: 21px;
  font-weight: 700;
  color: #1976d2;
  margin-bottom: 10px;
  text-align: center;
}
.dialog-component-label {
  font-size: 15px;
  color: #222;
  margin-bottom: 6px;
  text-align: center;
}
.dialog-component-input {
  padding: 9px 13px;
  border-radius: 7px;
  border: 1px solid #b3d8ff;
  font-size: 15px;
  background: #f7faff;
  margin-bottom: 10px;
  width: 100%;
  transition: border 0.2s;
  color: #222;
}
.dialog-component-actions {
  display: flex;
  gap: 14px;
  justify-content: center;
  margin-top: 8px;
}
.dialog-component-btn {
  background: #1976d2;
  color: #fff;
  border: none;
  padding: 9px 22px;
  border-radius: 7px;
  font-weight: 600;
  font-size: 15px;
  cursor: pointer;
  box-shadow: 0 1px 4px rgba(24,144,255,0.08);
  transition: background 0.2s;
}
.dialog-component-btn:hover {
  background: #1565c0;
}
.dialog-component-cancel {
  background: #e0e7ef;
  color: #333;
}
.dialog-component-cancel:hover {
  background: #b3d8ff;
}
</style>