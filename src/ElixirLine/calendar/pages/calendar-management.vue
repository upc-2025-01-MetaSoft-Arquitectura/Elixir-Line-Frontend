<script setup>
import {ref, computed, onMounted} from 'vue'
import {startOfWeek, addDays, format, isSameDay} from 'date-fns'
import { es } from 'date-fns/locale'
import {TaskApiService} from "../../task-management/services/task-api.service.js";
import {useAuthenticationStore} from "../../security/services/authentication.store.js";
import { EvidenceApiService } from '../../evidence-management/services/evidence-service.js';
import { IncidenceApiService } from '../../evidence-management/services/incidence-service.js';

const today = new Date()
const selectedDate = ref(today)
const tasks = ref([])
const taskService = new TaskApiService() // 2. Instancia el servicio
const selectedTask = ref(null) // 3. Estado para la tarea
const userId = computed(() => useAuthenticationStore().currentUserId)

const weekStart = computed(() =>
    startOfWeek(selectedDate.value, { weekStartsOn: 1 })
)
const days = computed(() =>
    Array.from({ length: 7 }, (_, i) => {
      const date = addDays(weekStart.value, i)
      return {
        name: format(date, 'EEEE', { locale: es }),
        short: format(date, 'EEE', ),
        number: format(date, 'd', { locale: es }),
        date
      }
    })
)

const hours = Array.from({ length: 16 }, (_, i) => `${(i + 6).toString().padStart(2, '0')}:00`)

function goToPrevDay() {
  selectedDate.value = addDays(selectedDate.value, -1)
}
function goToNextDay() {
  selectedDate.value = addDays(selectedDate.value, 1)
}
function isToday() {
  return isSameDay(selectedDate.value, today)
}

const evidenceService = new EvidenceApiService();
const incidenceService = new IncidenceApiService();
const evidences = ref([]);
const incidences = ref([]);

onMounted(async () => {
  // Cargar tareas del usuario actual
  const resTasks = await taskService.getByWinegrowerId(userId.value);
  tasks.value = resTasks.data;
  // Cargar evidencias e incidencias por cada tarea
  const allEvidences = [];
  const allIncidences = [];
  for (const task of tasks.value) {
    try {
      const resEv = await evidenceService.getEvidencesByTaskId(task.id);
      if (Array.isArray(resEv.data)) {
        const mapped = resEv.data.map(ev => ({ ...ev, task }));
        allEvidences.push(...mapped);
      }
    } catch (err) {
      // Si la petición falla (por ejemplo, 404), solo loguea y continúa
      console.warn(`No evidencias para tarea ${task.id}:`, err?.response?.status || err);
    }
    try {
      const resInc = await incidenceService.getIncidencesByTaskId(task.id);
      if (Array.isArray(resInc.data)) {
        const mapped = resInc.data.map(inc => ({ ...inc, task }));
        allIncidences.push(...mapped);
      }
    } catch (err) {
      console.warn(`No incidencias para tarea ${task.id}:`, err?.response?.status || err);
    }
  }
  evidences.value = allEvidences;
  incidences.value = allIncidences;
});

function itemsForDayAndHour(day, hour) {
  const result = [];
  for (const ev of evidences.value) {
    const evDate = new Date(ev.createdAt);
    if (isSameDay(evDate, day) && evDate.getHours() === parseInt(hour)) {
      result.push({
        type: 'evidence',
        ...ev,
        task: ev.task
      });
    }
  }
  for (const inc of incidences.value) {
    const incDate = new Date(inc.createdAt);
    if (isSameDay(incDate, day) && incDate.getHours() === parseInt(hour)) {
      result.push({
        type: 'incidence',
        ...inc,
        task: inc.task
      });
    }
  }
  return result;
}

const showTaskDialog = ref(false);
const selectedCalendarItem = ref(null);

function openTaskDialog(item) {
  selectedCalendarItem.value = item;
  showTaskDialog.value = true;
}
function closeTaskDialog() {
  showTaskDialog.value = false;
  selectedCalendarItem.value = null;
}
</script>


<template>
  <div class="calendar-filters-row">
    <div class="calendar-filters">
      <button @click="goToPrevDay">&#8592;</button>
      <span class="filter-label">
        {{ isToday() ? 'Hoy' : format(selectedDate, 'd MMMM yyyy', { locale: es }) }}
      </span>
      <button @click="goToNextDay">&#8594;</button>
    </div>
    <div class="calendar-legend">
      <span class="legend-color"></span>
      <span class="legend-label">Evidencia</span>
      <span class="legend-color incidence"></span>
      <span class="legend-label incidence">Incidencia</span>
    </div>
  </div>
  <div class="calendar-container">
    <div class="calendar-table-header-wrapper">
      <table class="calendar-table">
        <thead>
        <tr>
          <th class="hour-label-header"></th>
          <th
              v-for="day in days"
              :key="day.date"
              class="day-header"
              :class="{ selected: isSameDay(day.date, selectedDate) }"
          >
            <div class="day-name">{{ (day.short).toUpperCase() }}</div>
            <div class="day-number">{{ day.number }}</div>
          </th>
        </tr>
        </thead>
      </table>
    </div>
    <div class="calendar-table-body-scroll">
      <table class="calendar-table">
        <tbody>
        <tr v-for="hour in hours" :key="hour">
          <td class="hour-label">{{ hour }}</td>
          <td
              v-for="day in days"
              :key="day.date + hour"
              class="calendar-cell"
              :class="{ selected: isSameDay(day.date, selectedDate) }"
          >
            <div v-for="item in itemsForDayAndHour(day.date, hour.split(':')[0])"
                 :key="item.type + '-' + item.id"
                 :class="item.type === 'evidence' ? 'evidence-mini-card' : 'incidence-mini-card'"
                 style="margin-bottom: 4px; padding: 4px 6px; border-radius: 6px; font-size: 12px; display: flex; align-items: center; gap: 6px;"
                 @click="openTaskDialog(item)">
              <img v-if="item.image || item.imageUrl" :src="item.image || item.imageUrl" alt="img" style="width:22px;height:22px;object-fit:cover;border-radius:4px;" />
              <span style="font-weight:600;">{{ item.task?.title || 'Sin título' }}</span>
              <span v-if="item.type === 'evidence'" style="color:#1976d2;">Evidencia</span>
              <span v-if="item.type === 'incidence'" style="color:#ff9800;">Incidencia</span>
            </div>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>

  <div v-if="showTaskDialog" class="dialog-overlay" @click.self="closeTaskDialog">
    <div class="dialog-content">
      <h3>Detalle de {{ selectedCalendarItem?.type === 'evidence' ? 'Evidencia' : 'Incidencia' }}</h3>
      <p><strong>Tarea asociada:</strong> {{ selectedCalendarItem?.task?.id }}</p>
      <p><strong>Nombre tarea:</strong> {{ selectedCalendarItem?.task?.title }}</p>
      <p><strong>Trabajador:</strong> {{ selectedCalendarItem?.task?.assignee }}</p>
      <p><strong>Descripción tarea:</strong> {{ selectedCalendarItem?.task?.description }}</p>
      <p v-if="selectedCalendarItem?.description"><strong>Descripción {{ selectedCalendarItem?.type === 'evidence' ? 'evidencia' : 'incidencia' }}:</strong> {{ selectedCalendarItem?.description }}</p>
      <img v-if="selectedCalendarItem?.image || selectedCalendarItem?.imageUrl" :src="selectedCalendarItem?.image || selectedCalendarItem?.imageUrl" alt="img" style="width:80px;height:80px;object-fit:cover;border-radius:8px;margin:8px 0;" />
      <button @click="closeTaskDialog" style="margin-top:12px;">Cerrar</button>
    </div>
  </div>

  <!--
  <Dialog v-model:visible="showEvidenceDialog" modal :closable="true" @hide="closeEvidenceDialog">
    <div class="dialog-content">
      <h3>Detalle de Evidencia</h3>
      <p><strong>Tarea asociada:</strong> {{ selectedEvidence?.taskId }}</p>
      <div v-if="selectedTask">
        <p><strong>Nombre tarea:</strong> {{ selectedTask.title }}</p>
        <p><strong>Trabajador:</strong> {{ selectedTask.assignee }}</p>
        <p><strong>Descripción tarea:</strong> {{ selectedTask.description }}</p>
      </div>
      <p><strong>Descripción evidencia:</strong> {{ selectedEvidence?.description }}</p>
      <button @click="closeEvidenceDialog">Cerrar</button>
    </div>
  </Dialog>

  <Dialog v-model:visible="showIncidenceDialog" modal :closable="true" @hide="closeIncidenceDialog">
    <div class="dialog-content">
      <h3>Detalle de Incidencia</h3>
      <p><strong>Tarea asociada:</strong> {{ selectedIncidence?.taskId }}</p>
      <div v-if="selectedTask">
        <p><strong>Nombre tarea:</strong> {{ selectedTask.title }}</p>
        <p><strong>Trabajador:</strong> {{ selectedTask.assignee }}</p>
        <p><strong>Descripción tarea:</strong> {{ selectedTask.description }}</p>
      </div>
      <p><strong>Descripción evidencia:</strong> {{ selectedIncidence?.description }}</p>
      <button @click="closeIncidenceDialog">Cerrar</button>
    </div>
  </Dialog>
  -->

</template>

<style scoped>


.dialog-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  background: rgba(30, 30, 30, 0.85); /* gris oscuro con opacidad */
  backdrop-filter: blur(0px);
}

.dialog-content {
  z-index: 10000;
  margin-top: -35px;
  padding: 10px 32px;
  border-radius: 8px;
  min-width: 320px;
}

.calendar-filters {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  gap: 8px;
}
.calendar-filters button {
  background: #e0e7ef;
  border: none;
  border-radius: 4px;
  font-size: 18px;
  padding: 4px 10px;
  cursor: pointer;
}
.filter-label {
  font-weight: bold;
  font-size: 1.1em;
  min-width: 120px;
  text-align: center;
  display: inline-block;
}
.selected {
  background: #e0f3ff !important;
}
.calendar-container {
  width: 100%;
  max-height: 600px;
  overflow-x: auto;
  background: #f5f5f5;
  position: relative;
}
.calendar-table-header-wrapper {
  width: 100%;
  overflow: hidden;
}
.calendar-table-body-scroll {
  max-height: 500px;
  overflow-y: auto;
  width: 100%;
}
.calendar-table {
  min-width: 1000px;
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
  background: #fff;
}
.hour-label-header {
  background: #f0f0f0;
  width: 60px;
}
thead th, .hour-label-header {
  position: sticky;
  top: 0;
  z-index: 2;
  background: #f0f0f0;
  text-align: center;
}
th, td {
  border: 1px solid #ddd;
  text-align: center;
  padding: 4px;
  color: #71717A;
  font-size: 0.95em;
}
th {
  background: #f0f0f0;
  font-weight: bold;
}
.day-header {
  text-align: left;
  min-width: 60px; /* Asegura espacio para el texto */
}
.day-name {
  color: #71717A;
  font-size: 10px;
  font-style: normal;
  font-weight: 700;
  line-height: 12px;
}
.day-number {
  color: #000;
  font-size: 22px;
  font-style: normal;
  font-weight: 600;
  line-height: 32px;
}
.hour-label {
  background: #fafafa;
  width: 60px;
  font-weight: bold;
  text-align: left;
}
.calendar-cell {
  position: relative;
  vertical-align: top;
  background: #fff;
  min-height: 40px;
  padding: 2px 4px;
}

.evidence-item {
  background: #1976d2;
  color: #fff;
  border-radius: 6px;
  padding: 4px 8px;
  margin: 2px 0;
  font-size: 13px;
  font-weight: 500;
  box-shadow: 0 1px 4px rgba(25, 118, 210, 0.10);
  display: inline-block;
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: pointer;
  border: none;
  transition: background 0.2s;
}
.evidence-item:hover {
  background: #1565c0;
}
 .calendar-filters-row {
   display: flex;
   justify-content: space-between;
   align-items: center;
   margin-bottom: 12px;
 }
.calendar-legend {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-right: 8px;
}
.legend-color {
  width: 18px;
  height: 18px;
  background: #1976d2;
  border-radius: 4px;
  display: inline-block;
  border: 1px solid #1565c0;
}
.legend-label {
  font-size: 14px;
  color: #ffffff;
  font-weight: 600;
}
.incidence-item {
  background: #ff9800;
  color: #fff;
  border-radius: 6px;
  padding: 4px 8px;
  margin: 2px 0;
  font-size: 13px;
  font-weight: 500;
  box-shadow: 0 1px 4px rgba(255, 152, 0, 0.10);
  display: inline-block;
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: pointer;
  transition: background 0.2s;
}
.incidence-item:hover {
  background: #f57c00;
}
.legend-color.incidence {
  background: #ff9800;
  border: 1px solid #f57c00;
}
.legend-label.incidence {
  color: #ff9800;
}
.evidence-mini-card {
  background: #e3f0ff;
  border: 1px solid #1976d2;
  color: #1976d2;
}
.incidence-mini-card {
  background: #fff3e0;
  border: 1px solid #ff9800;
  color: #ff9800;
}
</style>