<script setup>
import {ref, onMounted, computed, watch} from 'vue';
import {InputApiService, TaskApiService, FieldWorkerApiService} from '../services/task-api.service.js';
import DataManager from "../../../shared/components/data-manager.component.vue";
import { WineBatchesApiService } from '../../winemaking-process/services/wine-batches-api.service.js';
import {useAuthenticationStore} from "../../security/services/authentication.store.js";

const taskService = new TaskApiService();
const inputService = new InputApiService();
const fieldWorkerService = new FieldWorkerApiService();

const showEditDialog = ref(false);
const showNewTaskDialog = ref(false);

const editTask = ref({});
const newTask = ref({});
const allInputs = ref([]);
const allFieldWorkers = ref([]);
const tasks = ref([]);
const activeTab = ref('industrial');
const wineBatchesService = new WineBatchesApiService();
const wineBatches = ref([]);

const winegrowerIdField = 1;
const winegrowerIdIndustry = 2;

const userId = computed(() => useAuthenticationStore().currentUserId);
async function openEditTask(task) {
  const [taskRes, inputsRes, fieldWorkersRes] = await Promise.all([
    taskService.getTaskById(task.id),
    inputService.getAllInputs(),
    fieldWorkerService.getAllFieldWorkers()
  ]);
  // Filtra insumos únicos por id
  const uniqueInputs = Array.from(
      new Map(inputsRes.data.map(i => [i.id, i])).values()
  );
  allInputs.value = uniqueInputs;
  allFieldWorkers.value = fieldWorkersRes.data;
  editTask.value = { 
    ...taskRes.data, 
    inputs: (taskRes.data.inputs || []).map(i => ({ ...i, quantity: i.quantity || 1 })),
    fieldWorkerId: taskRes.data.fieldWorkerId || null,
    inputsIds: (taskRes.data.suppliesIds || taskRes.data.inputsIds || (taskRes.data.inputs ? taskRes.data.inputs.map(i => i.id) : []))
  };
  showEditDialog.value = true;
}
async function openNewTaskDialog() {
  console.log('Evento recibido: abrir diálogo de nueva tarea');
  const [inputsRes, fieldWorkersRes] = await Promise.all([
    inputService.getAllInputs(),
    fieldWorkerService.getAllFieldWorkers()
  ]);
  allInputs.value = Array.from(new Map(inputsRes.data.map(i => [i.id, i])).values());
  allFieldWorkers.value = fieldWorkersRes.data;
  newTask.value = {
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    winegrowerId: '',
    fieldWorkerName: '',
    batchId: '',
    inputsIds: [],
    progressPercentage: 0,
    status: 'IN_PROGRESS',
    type: '',
    inputs: []
  };
  showNewTaskDialog.value = true;
  console.log('Estado inicial de showNewTaskDialog:', showNewTaskDialog.value);
  showNewTaskDialog.value = true;
  console.log('Estado final de showNewTaskDialog:', showNewTaskDialog.value);
}
function getOrCreateInputQuantity(inputId) {
  let found = newTask.value.inputs.find(i => i.id === inputId);
  if (!found) {
    found = { id: inputId, quantity: 1 };
    newTask.value.inputs.push(found);
  }
  return found.quantity;
}
async function loadTasks() {
  if (activeTab.value === 'industrial') {
    const res = await taskService.getByWinegrowerAndType(userId.value, 'TASK_INDUSTRY');
    tasks.value = res.data;
  } else {
    const res = await taskService.getByWinegrowerAndType(userId.value, 'TASK_FIELD');
    tasks.value = res.data;
  }
}
watch(() => newTask.value.inputsIds, (ids) => {
  newTask.value.inputs = newTask.value.inputs.filter(i => ids.includes(i.id));
});
watch(activeTab, async () => {
  await loadTasks();
});

async function createTask() {
  // Buscar el nombre del trabajador seleccionado
  const selectedWorker = allFieldWorkers.value.find(fw => fw.id === newTask.value.fieldWorkerId);
  const fieldWorkerName = selectedWorker ? `${selectedWorker.name} ${selectedWorker.lastName}` : '';
  const taskToSend = {
    ...newTask.value,
    winegrowerId: userId.value,
    fieldWorkerName,
    suppliesIds: newTask.value.inputsIds
  };
  await taskService.createTask(taskToSend);
  showNewTaskDialog.value = false;
  
}
async function saveTask() {
  // Buscar el nombre del trabajador seleccionado
  const selectedWorker = allFieldWorkers.value.find(fw => fw.id === editTask.value.fieldWorkerId);
  const fieldWorkerName = selectedWorker ? `${selectedWorker.name} ${selectedWorker.lastName}` : '';
  const taskToSend = {
    ...editTask.value,
    fieldWorkerName,
    suppliesIds: editTask.value.inputsIds
  };
  await taskService.updateTask(editTask.value.id, taskToSend);
  showEditDialog.value = false;
  
}

const columns = [
  { field: 'id', header: 'ID' },
  { field: 'batchId', header: 'Lote' },
  { field: 'fieldWorkerName', header: 'Trabajador' },
  { field: 'title', header: 'Título' },
  { field: 'endDate', header: 'Fecha Fin' },
  { field: 'type', header: 'Tipo' },
];

onMounted(async () => {
  await loadTasks();
  const wineBatchesResponse = await wineBatchesService.getAll();
  wineBatches.value = wineBatchesResponse.data;
});

const filteredTasks = computed(() =>
    tasks.value.filter(task =>
        activeTab.value === 'industrial'
            ? task.type === 'TASK_INDUSTRY'
            : task.type === 'TASK_FIELD'
    )
);

const title = { singular: 'tarea', plural: 'tareas' };
function formatDate(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
}
const showTaskDialog = ref(false);
const selectedTask = ref(null);
async function previewTask(task) {
  if (!allInputs.value.length) {
    const inputsRes = await inputService.getAllInputs();
    allInputs.value = Array.from(new Map(inputsRes.data.map(i => [i.id, i])).values());
  }
  const response = await taskService.getTaskById(task.id);
  const inputsWithNames = (response.data.inputs || []).map(i => {
    const found = allInputs.value.find(a => a.id === i.id);
    return {
      ...i,
      name: found ? found.name : 'Insumo desconocido'
    };
  });
  selectedTask.value = { ...response.data, inputs: inputsWithNames };
  showTaskDialog.value = true;
}
</script>

<template>
  <div class="task-management-container">
    <div class="tabs">
      <button :class="['tab-button', { 'active-tab': activeTab === 'industrial' }]" @click="activeTab = 'industrial'">Industrial</button>
      <button :class="['tab-button', { 'active-tab': activeTab === 'campo' }]" @click="activeTab = 'campo'">Campo</button>
    </div>
    <data-manager
        :items="filteredTasks"
        :title="title"
        label-name="Nueva tarea"
        @edit-item-requested-manager="openEditTask"
        @new-item-requested-manager="openNewTaskDialog"
    >
      <template #custom-columns-manager>
        <pv-column field="id" header="ID" />
        <pv-column field="batchId" header="Lote" />
        <pv-column field="fieldWorkerName" header="Trabajador" />
        <pv-column field="title" header="Título" />
        <pv-column field="endDate" header="Fecha Fin">
          <template #body="slotProps">
            {{ formatDate(slotProps.data.endDate) }}
          </template>
        </pv-column>
        <pv-column field="type" header="Tipo" />
        <pv-column field="status" header="Estado" />
        <pv-column header="Avance" field="progressPercentage">
          <template #body="slotProps">
            <div class="progress-bar-bg">
              <div class="progress-bar-fill" :style="{ width: slotProps.data.progressPercentage + '%' }"></div>
            </div>
            <span class="progress-label">{{ slotProps.data.progressPercentage }}%</span>
          </template>
        </pv-column>
      </template>
      <template #actions="slotProps">
        <pv-button
            icon="pi pi-eye"
            outlined
            rounded
            severity="info"
            class="mr-2"
            @click="previewTask(slotProps.data)"
        />
      </template>
    </data-manager>
    <pv-dialog v-model:visible="showNewTaskDialog">
      <template #default>
        <h3>Nueva tarea</h3>
        <form @submit.prevent="createTask">
          <p>
            <select v-model="newTask.fieldWorkerId" class="editable-field" :placeholder="'Trabajador'">
              <option disabled value="">Selecciona un trabajador</option>
              <option v-for="fw in allFieldWorkers" :key="fw.id" :value="fw.id">
                {{ fw.name }} {{ fw.lastName }}
              </option>
            </select>
          </p>
          <div>
            <select
                id="batchId"
                v-model="newTask.batchId"
                class="editable-field"
                :placeholder="'Lote de vino'"
                style="width: 220px; margin-bottom: 12px;"
            >
              <option disabled value="">Selecciona un lote</option>
              <option v-for="batch in wineBatches" :key="batch.id" :value="batch.id">
                {{ batch.vineyardCode }} - {{ batch.vineyardOrigin }}
              </option>
            </select>
          </div>
          <p>
            <input v-model="newTask.title" class="editable-field" placeholder="Título" />
          </p>
          <p>
            <pv-calendar v-model="newTask.startDate" dateFormat="yy-mm-dd" class="editable-field" placeholder="Fecha Inicio" />
          </p>
          <p>
            <pv-calendar v-model="newTask.endDate" dateFormat="yy-mm-dd" class="editable-field" placeholder="Fecha Fin" />
          </p>
          <p>
            <select v-model="newTask.type" class="editable-field" :placeholder="'Tipo'">
              <option disabled value="">Selecciona tipo</option>
              <option value="TASK_INDUSTRY">Industrial</option>
              <option value="TASK_FIELD">Campo</option>
            </select>
          </p>
          <p>
            <textarea v-model="newTask.description" class="editable-field" placeholder="Descripción"></textarea>
          </p>
          <p>
            <pv-multi-select
              v-model="newTask.inputsIds"
              :options="allInputs"
              optionLabel="name"
              optionValue="id"
              placeholder="Buscar y seleccionar insumos"
              display="chip"
              class="editable-field"
              style="width: 220px;"
            />
          </p>
          <pv-button label="Guardar" type="submit" />
          <pv-button label="Cancelar" severity="secondary" @click="showNewTaskDialog = false" />
        </form>
      </template>
    </pv-dialog>
    <pv-dialog v-model:visible="showEditDialog">
      <template #default>
        <h3>Editar tarea</h3>
        <form @submit.prevent="saveTask">
          <p><strong>ID:</strong> {{ editTask.id }}</p>
          <p>
            <label>Trabajador:</label>
            <select v-model="editTask.fieldWorkerId" class="editable-field">
              <option v-for="fw in allFieldWorkers" :key="fw.id" :value="fw.id">
                {{ fw.name }} {{ fw.lastName }}
              </option>
            </select>
          </p>
          <div>
            <label for="batchId">Lote de vino:</label>
            <select
                id="batchId"
                v-model="editTask.batchId"
                class="editable-field"
                style="width: 220px; margin-bottom: 12px;"
            >
              <option disabled value="">Selecciona un lote</option>
              <option v-for="batch in wineBatches" :key="batch.id" :value="batch.id">
                {{ batch.vineyardCode }} - {{ batch.vineyardOrigin }}
              </option>
            </select>
          </div>
          <p>
            <label>Título:</label>
            <input v-model="editTask.title" class="editable-field" />
          </p>
          <p>
            <label>Fecha Inicio:</label>
            <pv-calendar v-model="editTask.startDate" dateFormat="yy-mm-dd" class="editable-field" />
          </p>
          <p>
            <label>Fecha Fin:</label>
            <pv-calendar v-model="editTask.endDate" dateFormat="yy-mm-dd" class="editable-field" />
          </p>
          <p>
            <label>Tipo:</label>
            <select v-model="editTask.type" class="editable-field">
              <option disabled value="">Selecciona tipo</option>
              <option value="TASK_INDUSTRY">Industrial</option>
              <option value="TASK_FIELD">Campo</option>
            </select>
          </p>
          <p>
            <label>Descripción:</label>
            <textarea v-model="editTask.description" class="editable-field"></textarea>
          </p>
          <p>
            <label>Insumos:</label>
            <pv-multi-select
              v-model="editTask.inputsIds"
              :options="allInputs"
              optionLabel="name"
              optionValue="id"
              placeholder="Buscar y seleccionar insumos"
              display="chip"
              class="editable-field"
              style="width: 220px;"
            />
          </p>
          <p>
            <label>Avance:</label>
            <input type="number" v-model="editTask.progressPercentage" min="0" max="100" class="editable-field" disabled /> %
          </p>
          <pv-button label="Guardar" type="submit" />
          <pv-button label="Cancelar" severity="secondary" @click="showEditDialog = false" />
        </form>
      </template>
    </pv-dialog>
    <pv-dialog v-model:visible="showTaskDialog">
      <template #default>
        <h3>Previsualización de tarea</h3>
        <div class="task-details">
          <p><strong>ID:</strong> {{ selectedTask.id }}</p>
          <p><strong>Lote:</strong> {{ selectedTask.batchId }}</p>
          <p><strong>Trabajador:</strong> {{ selectedTask.fieldWorkerName }}</p>
          <p><strong>Título:</strong> {{ selectedTask.title }}</p>
          <p><strong>Fecha Inicio:</strong> {{ formatDate(selectedTask.startDate) }}</p>
          <p><strong>Fecha Fin:</strong> {{ formatDate(selectedTask.endDate) }}</p>
          <p><strong>Tipo:</strong> {{ selectedTask.type }}</p>
          <p><strong>Estado:</strong> {{ selectedTask.status }}</p>
          <p><strong>Avance:</strong> {{ selectedTask.progressPercentage }}%</p>
          <p><strong>Descripción:</strong> {{ selectedTask.description }}</p>
          <p><strong>Insumos:</strong>
            <span v-if="selectedTask.supplies && selectedTask.supplies.length">
              <ul>
                <li v-for="supply in selectedTask.supplies" :key="supply.id">
                  {{ supply.name }}
                </li>
              </ul>
            </span>
            <span v-else> Sin insumos</span>
          </p>
        </div>
        <pv-button label="Cerrar" @click="showTaskDialog = false" />
      </template>
    </pv-dialog>
  </div>
</template>

<style scoped>
.custom-btn {
  background: #556B2F !important;
  color: white !important;
  border: none !important;
}
.tabs {
  display: flex;
  margin-bottom: 28px;
  justify-content: flex-start;
}
.tab-button {
  color: #708090 !important;
  padding: 10px 20px;
  border: none !important;
  background-color: transparent !important;
  transition: background-color 0.3s ease, color 0.3s ease;
  font-weight: 500;
  border-radius: 6px 6px 0 0;
  cursor: pointer;
}
.tab-button.active-tab {
  color: #DAA520 !important;
  background-color: rgba(255, 255, 255, 0.1);
}
.pv-dialog form {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 10px 0;
  align-items: center;
}
.pv-dialog form p, .pv-dialog form div {
  width: 100%;
  margin: 0;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}
.editable-field,
.pv-dialog select.editable-field,
.pv-dialog textarea.editable-field,
.pv-dialog input.editable-field,
.pv-dialog .pv-multi-select.editable-field,
.pv-dialog .pv-calendar.editable-field {
  font-family: 'Inter', 'Segoe UI', Arial, sans-serif !important;
  font-size: 16px !important;
  min-width: 320px !important;
  max-width: 320px !important;
  width: 320px !important;
  box-sizing: border-box;
}
.editable-field {
  border: 1.5px solid #444;
  border-radius: 6px;
  padding: 10px 14px;
  background: #23272f;
  color: #e0e0e0;
  font-size: 16px;
  width: 320px;
  box-sizing: border-box;
  margin-bottom: 0;
  transition: border 0.2s;
}
.editable-field:focus {
  border: 2px solid #8B0000;
  outline: none;
  background: #23272f;
}
.editable-field::placeholder {
  color: #bdbdbd;
  opacity: 1;
}
.pv-dialog select.editable-field, .pv-dialog textarea.editable-field, .pv-dialog input.editable-field {
  min-width: 320px;
  max-width: 320px;
}
.pv-dialog .pv-multi-select.editable-field {
  min-width: 320px !important;
  max-width: 320px !important;
}
.pv-dialog .pv-calendar.editable-field {
  min-width: 320px;
  max-width: 320px;
}
.pv-button {
  margin-right: 10px;
}
</style>