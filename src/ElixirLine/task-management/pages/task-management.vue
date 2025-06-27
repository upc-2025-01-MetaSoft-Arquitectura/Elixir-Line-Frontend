<script setup>
import {ref, onMounted, computed, watch} from 'vue';
import {SupplyApiService, TaskApiService, EmployeeApiService} from '../services/task-api.service.js';
import DataManager from "../../../shared/components/data-manager.component.vue";
import { WineBatchesApiService } from '../../winemaking-process/services/wine-batches-api.service.js';

const taskService = new TaskApiService();
const supplyService = new SupplyApiService();
const employeeService = new EmployeeApiService();

const showEditDialog = ref(false);
const showNewTaskDialog = ref(false);

const editTask = ref({});
const newTask = ref({});
const allSupplies = ref([]);
const allEmployees = ref([]);
const tasks = ref([]);
const activeTab = ref('industrial');
const wineBatchesService = new WineBatchesApiService();
const wineBatches = ref([]);
async function openEditTask(task) {
  const [taskRes, suppliesRes, employeesRes] = await Promise.all([
    taskService.getTaskById(task.id),
    supplyService.getAllSupplies(),
    employeeService.getAllEmployees()
  ]);
  // Filtra insumos únicos por id
  const uniqueSupplies = Array.from(
      new Map(suppliesRes.data.map(s => [s.id, s])).values()
  );
  allSupplies.value = uniqueSupplies;
  allEmployees.value = employeesRes.data;
  editTask.value = { ...taskRes.data, supplies: (taskRes.data.supplies || []).map(s => ({ ...s, quantity: s.quantity || 1 })) };
  showEditDialog.value = true;
}
async function openNewTaskDialog() {
  console.log('Evento recibido: abrir diálogo de nueva tarea');
  const [suppliesRes, employeesRes] = await Promise.all([
    supplyService.getAllSupplies(),
    employeeService.getAllEmployees()
  ]);
  allSupplies.value = Array.from(new Map(suppliesRes.data.map(s => [s.id, s])).values());
  allEmployees.value = employeesRes.data;
  newTask.value = {
    assignee: '',
    title: '',
    startDate: '',
    dueDate: '',
    type: '',
    status: 'Pending',
    progress: 0,
    description: '',
    supplies: [],
    suppliesIds: []
  };
  showNewTaskDialog.value = true;
  console.log('Estado inicial de showNewTaskDialog:', showNewTaskDialog.value);
  showNewTaskDialog.value = true;
  console.log('Estado final de showNewTaskDialog:', showNewTaskDialog.value);
}
function getOrCreateSupplyQuantity(supplyId) {
  let found = newTask.value.supplies.find(s => s.id === supplyId);
  if (!found) {
    found = { id: supplyId, quantity: 1 };
    newTask.value.supplies.push(found);
  }
  return found.quantity;
}

watch(() => newTask.value.suppliesIds, (ids) => {
  // Elimina insumos no seleccionados
  newTask.value.supplies = newTask.value.supplies.filter(s => ids.includes(s.id));
});
function toggleSupply(supply) {
  const idx = editTask.value.supplies.findIndex(s => s.id === supply.id);
  if (idx === -1) {
    editTask.value.supplies.push({ ...supply, quantity: 1 });
  } else {
    editTask.value.supplies.splice(idx, 1);
  }
}

function getSupplyQuantity(supplyId) {
  const found = editTask.value.supplies.find(s => s.id === supplyId);
  return found ? found.quantity : 1;
}

function setSupplyQuantity(supplyId, qty) {
  const found = editTask.value.supplies.find(s => s.id === supplyId);
  if (found) found.quantity = qty;
}
function toggleSupplyForm(supply) {
  const idx = newTask.value.supplies.findIndex(s => s.id === supply.id);
  if (idx === -1) {
    newTask.value.supplies.push({ ...supply, quantity: 1 });
  } else {
    newTask.value.supplies.splice(idx, 1);
  }
}
function getSupplyQuantityForm(supplyId) {
  const found = newTask.value.supplies.find(s => s.id === supplyId);
  return found ? found.quantity : 1;
}
function setSupplyQuantityForm(supplyId, qty) {
  const found = newTask.value.supplies.find(s => s.id === supplyId);
  if (found) found.quantity = qty;
}

async function createTask() {
  await taskService.createTask(newTask.value);
  showNewTaskDialog.value = false;
  // Recarga las tareas si es necesario
  const response = await taskService.getAllTasks();
  tasks.value = response.data;
}
async function saveTask() {
  const taskToSend = {
    ...editTask.value,
    supplies: editTask.value.supplies.map(s => ({ id: s.id, quantity: s.quantity }))
  };
  await taskService.updateTask(editTask.value.id, taskToSend);
  showEditDialog.value = false;
  const response = await taskService.getAllTasks();
  tasks.value = response.data;
}

const columns = [
  { field: 'id', header: 'ID' },
  { field: 'relatedId', header: 'ID Relacionado' },
  { field: 'assignee', header: 'Encargado' },
  { field: 'title', header: 'Título' },
  { field: 'dueDate', header: 'Fecha Fin' },
  { field: 'type', header: 'Tipo' },
  
];

onMounted(async () => {
  const tasksResponse = await taskService.getAllTasks();
  tasks.value = tasksResponse.data;
  const wineBatchesResponse = await wineBatchesService.getAll();
  wineBatches.value = wineBatchesResponse.data;
});

const filteredTasks = computed(() =>
    tasks.value.filter(task =>
        activeTab.value === 'industrial'
            ? task.type === 'INDUSTRIAL'
            : task.type === 'CAMPO'
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
  // Si la lista de insumos está vacía, cárgala primero
  if (!allSupplies.value.length) {
    const suppliesRes = await supplyService.getAllSupplies();
    allSupplies.value = Array.from(new Map(suppliesRes.data.map(s => [s.id, s])).values());
  }
  const response = await taskService.getTaskById(task.id);
  const suppliesWithNames = (response.data.supplies || []).map(s => {
    const found = allSupplies.value.find(a => a.id === s.id);
    return {
      ...s,
      name: found ? found.name : 'Insumo desconocido'
    };
  });
  selectedTask.value = { ...response.data, supplies: suppliesWithNames };
  showTaskDialog.value = true;
}
</script>

<template>
  <div class="task-management-container">
    <div class="tabs">
      <button :class="{active: activeTab === 'industrial'}" @click="activeTab = 'industrial'">Ambiente Industrial</button>
      <button :class="{active: activeTab === 'campo'}" @click="activeTab = 'campo'">Ambiente de Campo</button>
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
        <pv-column field="relatedId" header="ID Relacionado" />
        <pv-column field="assignee" header="Encargado" />
        <pv-column field="title" header="Título" />
        <pv-column field="dueDate" header="Fecha Fin">
          <template #body="slotProps">
            {{ formatDate(slotProps.data.dueDate) }}
          </template>
        </pv-column>
        <pv-column field="type" header="Tipo" />
        <pv-column field="status" header="Estado">
          <template #body="slotProps">
            <span
                class="status-badge"
                :class="{
                'status-inprocess': slotProps.data.status === 'InProcess',
                'status-completed': slotProps.data.status === 'Completed'
              }"
            >
              {{ slotProps.data.status }}
            </span>
          </template>
        </pv-column>
        <pv-column header="Avance" field="progress">
          <template #body="slotProps">
            <div class="progress-bar-bg">
              <div class="progress-bar-fill" :style="{ width: slotProps.data.progress + '%' }"></div>
            </div>
            <span class="progress-label">{{ slotProps.data.progress }}%</span>
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
            <label>Encargado:</label>
            <select v-model="newTask.assignee" class="editable-field">
              <option v-for="emp in allEmployees" :key="emp.id" :value="emp.firstName + ' ' + emp.lastName">
                {{ emp.firstName }} {{ emp.lastName }}
              </option>
            </select>
          </p>
          <div>
            <label for="relatedId">Lote de vino:</label>
            <select
                id="relatedId"
                v-model="newTask.relatedId"
                class="editable-field"
                style="width: 220px; margin-bottom: 12px;"
            >
              <option disabled value="">Selecciona un lote</option>
              <option v-for="batch in wineBatches" :key="batch.id" :value="batch.internalCode">
                {{ batch.internalCode }} - {{ batch.vineyardOrigin }}
              </option>
            </select>
          </div>
          <p>
            <label>Título:</label>
            <input v-model="newTask.title" class="editable-field" />
          </p>
          <p>
            <label>Fecha Inicio:</label>
            <input type="date" v-model="newTask.startDate" class="editable-field" />
          </p>
          <p>
            <label>Fecha Fin:</label>
            <input type="date" v-model="newTask.dueDate" class="editable-field" />
          </p>
          <p>
            <label>Tipo:</label>
            <select v-model="newTask.type" class="editable-field">
              <option disabled value="">Selecciona tipo</option>
              <option value="INDUSTRIAL">Industrial</option>
              <option value="CAMPO">Campo</option>
            </select>
          </p>
          <p>
            <label>Descripción:</label>
            <textarea v-model="newTask.description" class="editable-field"></textarea>
          </p>
          <div>
            <label>Insumos:</label>
            <div v-for="(item, idx) in newTask.supplies" :key="idx" style="margin-bottom: 8px;">
              <select v-model="item.id" class="editable-field" style="width: 180px;">
                <option disabled value="">Selecciona insumo</option>
                <option v-for="supply in allSupplies" :key="supply.id" :value="supply.id">
                  {{ supply.name }}
                </option>
              </select>
              <input
                  type="number"
                  min="1"
                  v-model.number="item.quantity"
                  placeholder="Cantidad"
                  class="editable-field"
                  style="width: 90px; margin-left: 8px;"
              />
              <button
                  type="button"
                  class="boton-rojo"
                  @click="newTask.supplies.splice(idx, 1)"
              >
                Quitar
              </button>
            </div>
            <button
                type="button"
                class="boton-verde"
                @click="newTask.supplies.push({ id: '', quantity: 1 })"
            >
              Agregar insumo
            </button>
          </div>
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
          <p><strong>ID Relacionado:</strong> {{ editTask.relatedId }}</p>
          <p><strong>Estado:</strong> {{ editTask.status }}</p>
          <p><strong>Tipo:</strong> {{ editTask.type }}</p>
          <p>
            <label>Encargado:</label>
            <select v-model="editTask.assignee" class="editable-field">
              <option v-for="emp in allEmployees" :key="emp.id" :value="emp.firstName + ' ' + emp.lastName">
                {{ emp.firstName }} {{ emp.lastName }}
              </option>
            </select>
          </p>
          <p>
            <label>Título:</label>
            <input v-model="editTask.title" class="editable-field" />
          </p>
          <p>
            <label>Fecha Inicio:</label>
            <input type="date" v-model="editTask.startDate" class="editable-field" />
          </p>
          <p>
            <label>Fecha Fin:</label>
            <input type="date" v-model="editTask.dueDate" class="editable-field" />
          </p>
          <p>
            <label>Avance:</label>
            <input type="number" v-model="editTask.progress" min="0" max="100" class="editable-field" /> %
          </p>
          <p>
            <label>Descripción:</label>
            <textarea v-model="editTask.description" class="editable-field"></textarea>
          </p>
          <div>
            <label>Insumos:</label>
            <div v-for="(item, idx) in editTask.supplies" :key="item.id" style="margin-bottom: 8px;">
              <select v-model="item.id" class="editable-field" style="width: 180px;">
                <option disabled value="">Selecciona insumo</option>
                <option v-for="supply in allSupplies" :key="supply.id" :value="supply.id">
                  {{ supply.name }}
                </option>
              </select>
              <input
                  type="number"
                  min="1"
                  v-model.number="item.quantity"
                  placeholder="Cantidad"
                  class="editable-field"
                  style="width: 90px; margin-left: 8px;"
              />
              <button
                  type="button"
                  class="boton-rojo"
                  @click="editTask.supplies.splice(idx, 1)"
              >
                Quitar
              </button>
            </div>
            <button
                type="button"
                class="boton-verde"
                @click="editTask.supplies.push({ id: '', quantity: 1 })"
            >
              Agregar insumo
            </button>
          </div>
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
          <p><strong>ID Relacionado:</strong> {{ selectedTask.relatedId }}</p>
          <p><strong>Encargado:</strong> {{ selectedTask.assignee }}</p>
          <p><strong>Título:</strong> {{ selectedTask.title }}</p>
          <p><strong>Fecha Inicio:</strong> {{ formatDate(selectedTask.startDate) }}</p>
          <p><strong>Fecha Fin:</strong> {{ formatDate(selectedTask.dueDate) }}</p>
          <p><strong>Tipo:</strong> {{ selectedTask.type }}</p>
          <p><strong>Estado:</strong> {{ selectedTask.status }}</p>
          <p><strong>Avance:</strong> {{ selectedTask.progress }}%</p>
          <p><strong>Descripción:</strong> {{ selectedTask.description }}</p>
          <p><strong>Insumos:</strong>
            <span v-if="selectedTask.supplies && selectedTask.supplies.length">
    <ul>
      <li v-for="supply in selectedTask.supplies" :key="supply.id">
        {{ supply.name }} <span v-if="supply.quantity">- {{ supply.quantity }}</span>
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
.tabs button {
  padding: 10px 28px;
  border: none;
  background: #eaeaea;
  color: #708090;
  border-radius: 6px 6px 0 0;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
  border-bottom: 3px solid #708090;
}
.tabs button.active {
  background: #8B0000;
  color: #fff;
  border-bottom: 3px solid #DE9595;
}
.progress-bar-bg {
  width: 100px;
  height: 14px;
  background: #eee;
  border-radius: 7px;
  overflow: hidden;
  display: inline-block;
  vertical-align: middle;
  margin-right: 8px;
}
.progress-bar-fill {
  height: 100%;
  background: #47A747;
  transition: width 0.3s;
}
.progress-label {
  font-size: 13px;
  color: #5F6868;
  vertical-align: middle;
}
.status-badge {
  padding: 4px 12px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 13px;
  display: inline-block;
}
.status-inprocess {
  background: #ADCAF9;
  color: #424E59;
}
.status-completed {
  background: #CEFDCE;
  color: #47A747
}
.editable-field {
  border: 1px solid #bdbdbd;
  border-radius: 4px;
  padding: 4px 8px;
  background: #f9f9f9;
  margin-bottom: 6px;
  color: #5F6868;
}
.pv-dialog form {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 10px 0;
}

.pv-dialog form p {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 0;
}

.pv-dialog label {
  min-width: 110px;
  font-weight: 500;
  color: #444;
}

.pv-dialog input[type="text"],
.pv-dialog input[type="date"],
.pv-dialog input[type="number"],
.pv-dialog select,
.pv-dialog textarea {
  flex: 1;
  max-width: 320px;
}

.pv-dialog textarea {
  min-height: 60px;
  resize: vertical;
}

.editable-field {
  border: 1px solid #bdbdbd;
  border-radius: 4px;
  padding: 6px 10px;
  background: #f9f9f9;
  margin-bottom: 0;
  color: #5F6868;
  font-size: 15px;
  width: 100%;
  box-sizing: border-box;
  transition: border 0.2s;
}

.editable-field:focus {
  border: 1.5px solid #8B0000;
  outline: none;
  background: #fff;
}

.pv-dialog [type="checkbox"] {
  margin-right: 6px;
}

.pv-button {
  margin-right: 10px;
}
.insumos-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.boton-verde {
  background: #48b85b !important;
  color: #fff !important;
  border: none !important;
  border-radius: 4px;
  padding: 6px 16px;
  cursor: pointer;
  font-weight: 500;
  margin-top: 8px;
}
.boton-rojo {
  background: #c33535 !important;
  color: #fff !important;
  border: none !important;
  border-radius: 4px;
  padding: 6px 12px;
  cursor: pointer;
  font-weight: 500;
  margin-left: 8px;
}




</style>