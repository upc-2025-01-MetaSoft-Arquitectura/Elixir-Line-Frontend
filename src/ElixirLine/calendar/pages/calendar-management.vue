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
const deadlines = ref([]);

onMounted(async () => {
  // Cargar tareas del usuario actual
  const resTasks = await taskService.getByWinegrowerId(userId.value);
  tasks.value = resTasks.data;
  // Cargar evidencias por cada tarea
  const allEvidences = [];
  const allDeadlines = [];
  for (const task of tasks.value) {
    try {
      const resEv = await evidenceService.getEvidencesByTaskId(task.id);
      if (Array.isArray(resEv.data)) {
        const mapped = resEv.data.map(ev => ({ ...ev, task }));
        allEvidences.push(...mapped);
      }
    } catch (err) {
      console.warn(`No evidencias para tarea ${task.id}:`, err?.response?.status || err);
    }
    // Guardar fecha límite si existe (endDate)
    if (task.endDate) {
      allDeadlines.push({
        task,
        deadline: new Date(task.endDate)
      });
    }
  }
  evidences.value = allEvidences;
  deadlines.value = allDeadlines;

  // Cargar incidencias de todos los tipos
  let allIncidences = [];
  try {
    const resInd = await incidenceService.getIndustrialIncidences();
    if (Array.isArray(resInd.data)) {
      allIncidences = allIncidences.concat(resInd.data.map(inc => ({ ...inc })));
    }
  } catch (err) {
    console.warn('No incidencias industriales:', err?.response?.status || err);
  }
  try {
    const resField = await incidenceService.getFieldIncidences();
    if (Array.isArray(resField.data)) {
      allIncidences = allIncidences.concat(resField.data.map(inc => ({ ...inc })));
    }
  } catch (err) {
    console.warn('No incidencias de campo:', err?.response?.status || err);
  }
  // Asocia cada incidencia con su tarea
  const incidencesWithTask = allIncidences.map(inc => {
    const task = tasks.value.find(t => t.id === inc.taskId);
    return { ...inc, task };
  });
  incidences.value = incidencesWithTask;
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
  // Mostrar fecha límite de la tarea en rojo
  for (const dl of deadlines.value) {
    if (isSameDay(dl.deadline, day) && dl.deadline.getHours() === parseInt(hour)) {
      result.push({
        type: 'deadline',
        task: dl.task,
        deadline: dl.deadline
      });
    }
  }
  return result;
}

const showTaskDialog = ref(false);
const selectedCalendarItem = ref(null);
const fieldWorkerName = ref('');

async function openTaskDialog(item) {
  selectedCalendarItem.value = item;
  fieldWorkerName.value = '';
  try {
    const res = await taskService.getTaskById(item.task.id);
    fieldWorkerName.value = res.data.fieldWorkerName || '';
  } catch (e) {
    fieldWorkerName.value = '';
  }
  showTaskDialog.value = true;
}
function closeTaskDialog() {
  showTaskDialog.value = false;
  selectedCalendarItem.value = null;
  fieldWorkerName.value = '';
}

function formatPeruTime(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  // Ajusta a hora Perú (GMT-5)
  const peruOffset = -5 * 60; // minutos
  const localOffset = date.getTimezoneOffset();
  const peruDate = new Date(date.getTime() + (peruOffset - localOffset) * 60000);
  return format(peruDate, "d MMM yyyy, HH:mm", { locale: es });
}

const showDatePicker = ref(false);
function onDateChange(e) {
  const val = e.target.value;
  if (val) {
    selectedDate.value = new Date(val + 'T00:00:00');
    showDatePicker.value = false;
  }
}

const showCellDialog = ref(false);
const cellDialogItems = ref([]);
const cellDialogDay = ref(null);
const cellDialogHour = ref(null);

function openCellDialog(day, hour) {
  cellDialogDay.value = day;
  cellDialogHour.value = hour;
  cellDialogItems.value = itemsForDayAndHour(day, hour);
  showCellDialog.value = true;
}
function closeCellDialog() {
  showCellDialog.value = false;
  cellDialogItems.value = [];
  cellDialogDay.value = null;
  cellDialogHour.value = null;
}
</script>


<template>
  <div class="calendar-filters-row">
    <div class="calendar-filters">
      <button class="calendar-nav-btn" @click="goToPrevDay" title="Día anterior">🢀</button>
      <span class="filter-label">
        {{ isToday() ? 'Hoy' : format(selectedDate, 'd MMMM yyyy', { locale: es }) }}
      </span>
      <button class="calendar-nav-btn" @click="goToNextDay" title="Día siguiente">🢂</button>
      <button :class="['calendar-picker-btn', { active: showDatePicker }]" @click="showDatePicker = !showDatePicker" title="Ir a un día">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ff9800" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="4"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
      </button>
      <transition name="fade">
        <input v-if="showDatePicker" type="date" class="calendar-date-input" :value="format(selectedDate, 'yyyy-MM-dd')" @change="onDateChange" @blur="showDatePicker = false" />
      </transition>
    </div>
    <div class="calendar-legend">
      <span class="legend-color"></span>
      <span class="legend-label">Evidencia</span>
      <span class="legend-color incidence"></span>
      <span class="legend-label incidence">Incidencia</span>
      <span class="legend-color deadline"></span>
      <span class="legend-label deadline">Fecha Límite</span>
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
            <template v-if="itemsForDayAndHour(day.date, hour.split(':')[0]).length > 3">
              <div v-for="item in itemsForDayAndHour(day.date, hour.split(':')[0]).slice(0,2)"
                   :key="item.type + '-' + item.id + '-' + item.task?.id"
                   :class="item.type === 'evidence' ? 'evidence-mini-card' : item.type === 'incidence' ? 'incidence-mini-card' : 'deadline-mini-card'"
                   style="margin-bottom: 4px; padding: 4px 6px; border-radius: 6px; font-size: 12px; display: flex; align-items: center; gap: 6px;"
                   @click="item.type !== 'deadline' && openTaskDialog(item)">
                <img v-if="item.image || item.imageUrl" :src="item.image || item.imageUrl" alt="img" style="width:22px;height:22px;object-fit:cover;border-radius:4px;" />
                <span style="font-weight:600;" v-if="item.task">{{ item.task?.title || 'Sin título' }}</span>
                <span v-if="item.type === 'evidence'" style="color:#1976d2;">Evidencia</span>
                <span v-if="item.type === 'incidence'" style="color:#ff9800;">Incidencia</span>
                <span v-if="item.type === 'deadline'" style="color:#ff2d2d;font-weight:700;">Fecha límite</span>
              </div>
              <button class="cell-more-btn" @click="openCellDialog(day.date, hour.split(':')[0])">
                Ver +{{ itemsForDayAndHour(day.date, hour.split(':')[0]).length - 2 }}
              </button>
            </template>
            <template v-else>
              <div v-for="item in itemsForDayAndHour(day.date, hour.split(':')[0])"
                   :key="item.type + '-' + item.id + '-' + item.task?.id"
                   :class="item.type === 'evidence' ? 'evidence-mini-card' : item.type === 'incidence' ? 'incidence-mini-card' : 'deadline-mini-card'"
                   style="margin-bottom: 4px; padding: 4px 6px; border-radius: 6px; font-size: 12px; display: flex; align-items: center; gap: 6px;"
                   @click="item.type !== 'deadline' && openTaskDialog(item)">
                <img v-if="item.image || item.imageUrl" :src="item.image || item.imageUrl" alt="img" style="width:22px;height:22px;object-fit:cover;border-radius:4px;" />
                <span style="font-weight:600;" v-if="item.task">{{ item.task?.title || 'Sin título' }}</span>
                <span v-if="item.type === 'evidence'" style="color:#1976d2;">Evidencia</span>
                <span v-if="item.type === 'incidence'" style="color:#ff9800;">Incidencia</span>
                <span v-if="item.type === 'deadline'" style="color:#ff2d2d;font-weight:700;">Fecha límite</span>
              </div>
            </template>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>

  <div v-if="showCellDialog" class="dialog-overlay" @click.self="closeCellDialog">
    <div class="cell-dialog">
      <h3 class="cell-dialog-title">Cards de la celda</h3>
      <div class="cell-dialog-list">
        <div v-for="item in cellDialogItems" :key="item.type + '-' + item.id + '-' + item.task?.id"
             class="cell-dialog-list-item"
             @click="item.type !== 'deadline' && openTaskDialog(item)">
          <span>{{ item.task?.title || 'Sin título' }}</span>
          <span v-if="item.type === 'evidence'" style="color:#1976d2; margin-left:8px;">Evidencia</span>
          <span v-if="item.type === 'incidence'" style="color:#ff9800; margin-left:8px;">Incidencia</span>
          <span v-if="item.type === 'deadline'" style="color:#ff2d2d; margin-left:8px;">Fecha límite</span>
        </div>
      </div>
      <button @click="closeCellDialog" class="cell-dialog-close-btn">Cerrar</button>
    </div>
    <!-- Diálogo de detalle sobrepuesto -->
    <div v-if="showTaskDialog" class="dialog-overlay task-dialog-overlay">
      <div class="dialog-content calendar-dialog">
        <h3 class="dialog-title">Detalle de {{ selectedCalendarItem?.type === 'evidence' ? 'Evidencia' : 'Incidencia' }}</h3>
        <div class="dialog-row">
          <span class="dialog-label">Tarea asociada:</span>
          <span>{{ selectedCalendarItem?.task?.id }}</span>
        </div>
        <div class="dialog-row">
          <span class="dialog-label">Nombre tarea:</span>
          <span>{{ selectedCalendarItem?.task?.title }}</span>
        </div>
        <div class="dialog-row">
          <span class="dialog-label">Descripción tarea:</span>
          <span>{{ selectedCalendarItem?.task?.description }}</span>
        </div>
        <div class="dialog-row" v-if="selectedCalendarItem?.description">
          <span class="dialog-label">Descripción {{ selectedCalendarItem?.type === 'evidence' ? 'evidencia' : 'incidencia' }}:</span>
          <span>{{ selectedCalendarItem?.description }}</span>
        </div>
        <div class="dialog-row">
          <span class="dialog-label">Fecha y hora de creación:</span>
          <span>{{ formatPeruTime(selectedCalendarItem?.createdAt) }}</span>
        </div>
        <div class="dialog-row">
          <span class="dialog-label">Trabajador asignado:</span>
          <span>{{ fieldWorkerName.split(' ')[0] }}</span>
        </div>
        <img v-if="selectedCalendarItem?.image || selectedCalendarItem?.imageUrl" :src="selectedCalendarItem?.image || selectedCalendarItem?.imageUrl" alt="img" class="dialog-img" />
        <button @click="closeTaskDialog" class="dialog-close-btn">Cerrar</button>
      </div>
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

.calendar-filters-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 18px;
  padding: 0 8px;
  background: #232323;
}
.calendar-filters {
  position: relative;
  display: flex;
  align-items: center;
  gap: 6px;
  background: none;
  border-radius: 0;
  padding: 0 4px;
  min-height: 38px;
  height: 38px;
}
.calendar-nav-btn {
  background: none;
  border: none;
  color: #ff9800;
  font-size: 18px;
  padding: 2px 6px;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.2s;
  height: 32px;
  width: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.calendar-nav-btn:hover {
  background: #e3f0ff;
}
.filter-label {
  font-weight: 600;
  font-size: 1em;
  min-width: 100px;
  text-align: center;
  color: #ff9800;
  background: none;
  padding: 0 4px;
  height: 32px;
  display: flex;
  align-items: center;
}
.calendar-picker-btn {
  background: none;
  border: none;
  padding: 2px 6px;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: background 0.2s, border 0.2s;
  height: 32px;
  width: 32px;
  justify-content: center;
  border: 2px solid transparent;
}
.calendar-picker-btn.active {
  background: #fff3e0;
  border: 2px solid #ff9800;
}
.calendar-picker-btn:hover {
  background: #fff3e0;
  border: 2px solid #ff9800;
}
.calendar-date-input {
  position: absolute;
  top: 40px;
  right: 0;
  left: auto;
  min-width: 140px;
  max-width: 180px;
  background: #fff;
  border: 2px solid #ff9800;
  border-radius: 10px;
  padding: 6px 12px;
  font-size: 16px;
  color: #1976d2;
  box-shadow: 0 4px 16px rgba(255,152,0,0.12);
  outline: none;
  transition: box-shadow 0.2s, border 0.2s;
  animation: fadeIn 0.2s;
  z-index: 1001;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
.calendar-container {
  width: 100%;
  max-height: 600px;
  overflow-x: auto;
  background: #232323;
  position: relative;
}
.calendar-table-header-wrapper {
  width: 100%;
  overflow: hidden;
  border-radius: 16px 16px 0 0;
  background: #232323;
}
.calendar-table-body-scroll {
  max-height: 500px;
  overflow-y: auto;
  width: 100%;
  border-radius: 0 0 16px 16px;
  background: #232323;
}
.calendar-table {
  min-width: 1000px;
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  table-layout: fixed;
  background: #232323;
  box-shadow: 0 2px 16px rgba(24,144,255,0.08);
  border-radius: 16px;
  overflow: hidden;
}
.hour-label-header {
  background: #f0f0f0;
  width: 60px;
}
thead th, .hour-label-header {
  position: sticky;
  top: 0;
  z-index: 2;
  background: #232323;
  text-align: center;
  font-size: 15px;
  font-weight: 700;
  color: #ff9800;
  border-bottom: 2px solid #444;
  padding: 10px 0;
}
th, td {
  border: 1px solid #333;
  text-align: center;
  padding: 8px 4px;
  color: #e0e0e0;
  font-size: 1em;
  background: #232323;
  transition: background 0.2s;
}
th {
  background: #232323;
  font-weight: bold;
}
.day-header {
  text-align: left;
  min-width: 70px;
  border-right: 2px solid #444;
  background: #232323;
}
.day-name {
  color: #ff9800;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.5px;
  margin-bottom: 2px;
}
.day-number {
  color: #fff;
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 2px;
}
.hour-label {
  background: #232323;
  width: 70px;
  font-weight: bold;
  text-align: left;
  color: #ffffff;
  font-size: 15px;
  border-right: 2px solid #444;
}
.calendar-cell {
  position: relative;
  vertical-align: top;
  background: #232323;
  min-height: 44px;
  padding: 4px 6px;
  transition: background 0.2s;
}
.calendar-cell.selected {
  background: #292929 !important;
}
.evidence-mini-card {
  background: #232a36;
  border: 1px solid #1976d2;
  color: #fff;
  box-shadow: 0 2px 8px rgba(25,118,210,0.08);
  transition: box-shadow 0.2s, background 0.2s;
  cursor: pointer;
}
.evidence-mini-card:hover {
  background: #1a2230;
  box-shadow: 0 4px 16px rgba(25,118,210,0.16);
}
.incidence-mini-card {
  background: #2d2323;
  border: 1px solid #ff9800;
  color: #fff;
  box-shadow: 0 2px 8px rgba(255,152,0,0.08);
  transition: box-shadow 0.2s, background 0.2s;
  cursor: pointer;
}
.incidence-mini-card:hover {
  background: #3a2323;
  box-shadow: 0 4px 16px rgba(255,152,0,0.16);
}
.deadline-mini-card {
  background: #2d2323;
  border: 1px solid #ff2d2d;
  color: #ff2d2d;
  font-weight: 700;
  box-shadow: 0 2px 8px rgba(255,45,45,0.08);
  transition: box-shadow 0.2s, background 0.2s;
  cursor: default;
}
.cell-more-btn {
  background: #232323;
  color: #ff9800;
  border: 1px solid #ff9800;
  border-radius: 6px;
  padding: 4px 10px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 2px;
  transition: background 0.2s, color 0.2s;
}
.cell-more-btn:hover {
  background: #ff9800;
  color: #232323;
}
.calendar-legend {
  display: flex;
  align-items: center;
  gap: 10px;
  background: #232323;
  border-radius: 8px;
  padding: 8px 18px;
  box-shadow: none;
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
  color: #e0e0e0;
  font-weight: 600;
}
.legend-color.incidence {
  background: #ff9800;
  border: 1px solid #f57c00;
}
.legend-label.incidence {
  color: #ff9800;
}
.legend-color.deadline {
  background: #e91e63;
  border: 1px solid #c2185b;
}
.legend-label.deadline {
  color: #e91e63;
}
.calendar-dialog {
  background: #232323;
  box-shadow: 0 4px 24px rgba(24,144,255,0.18);
  border-radius: 16px;
  padding: 32px 38px 24px 38px;
  min-width: 340px;
  min-height: 220px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  position: relative;
}
.dialog-title {
  font-size: 22px;
  font-weight: 700;
  color: #ff9800;
  margin-bottom: 18px;
  letter-spacing: 0.5px;
  text-align: left;
}
.dialog-row {
  font-size: 15px;
  color: #ffffff;
  margin-bottom: 10px;
  width: 100%;
  display: flex;
  justify-content: flex-start;
  gap: 12px;
}
.dialog-label {
  font-weight: 600;
  color: #ff9800;
  min-width: 140px;
}
.dialog-img {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
  margin: 8px 0;
  box-shadow: 0 2px 8px rgba(24,144,255,0.10);
}
.dialog-close-btn {
  margin-top: 18px;
  background: #2f2f2f;
  color: #ff9800;
  border: none;
  padding: 10px 24px;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 1px 4px rgba(24,144,255,0.08);
  transition: background 0.2s;
}
.dialog-close-btn:hover {
  background: #5c5c5c;
}
.cell-dialog {
  background: #232323;
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(24,144,255,0.18);
  padding: 28px 32px 18px 32px;
  min-width: 340px;
  min-height: 120px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  position: relative;
}
.cell-dialog-title {
  font-size: 20px;
  font-weight: 700;
  color: #ff9800;
  margin-bottom: 14px;
  letter-spacing: 0.5px;
  text-align: left;
}
.cell-dialog-list {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.cell-dialog-list-item {
  background: #232a36;
  border-radius: 7px;
  padding: 8px 12px;
  font-size: 15px;
  color: #fff;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}
.cell-dialog-list-item:hover {
  background: #1a2230;
}
.cell-dialog-close-btn {
  margin-top: 18px;
  background: #2f2f2f;
  color: #ff9800;
  border: none;
  padding: 8px 18px;
  border-radius: 6px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 1px 4px rgba(24,144,255,0.08);
  transition: background 0.2s;
}
.cell-dialog-close-btn:hover {
  background: #5c5c5c;
}
.task-dialog-overlay {
  z-index: 2000 !important;
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(30, 30, 30, 0.92);
}
</style>