<script setup>
import {ref, computed, onMounted} from 'vue'
import {startOfWeek, addDays, format, isSameDay} from 'date-fns'
import { es } from 'date-fns/locale'
import { EvidenceApiService } from '../../evidence-management/services/evidence-service.js'
import { IncidenceApiService } from '../../evidence-management/services/incidence-service.js'
import {TaskApiService} from "../../task-management/services/task-api.service.js";
import Dialog from "primevue/dialog";

const today = new Date()
const selectedDate = ref(today)
const incidences = ref([])
const incidenceService = new IncidenceApiService() // 2. Instancia el servicio

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


const showEvidenceDialog = ref(false)
const selectedEvidence = ref(null)

const taskService = new TaskApiService() // 2. Instancia el servicio
const selectedTask = ref(null) // 3. Estado para la tarea

async function openEvidenceDialog(evidence) {
  selectedEvidence.value = evidence
  showEvidenceDialog.value = true
  if (evidence.taskId) {
    const task = await taskService.getTaskById(evidence.taskId)
    selectedTask.value = task.data
  } else {
    selectedTask.value = null
  }
}
function closeEvidenceDialog() {
  showEvidenceDialog.value = false
  selectedEvidence.value = null
  selectedTask.value = null
}

const showIncidenceDialog = ref(false)
const selectedIncidence = ref(null)

async function openIncidenceDialog(incidence) {
  selectedIncidence.value = incidence
  showIncidenceDialog.value = true
  if (incidence.taskId) {
    const task = await taskService.getTaskById(incidence.taskId)
    selectedTask.value = task.data
  } else {
    selectedTask.value = null
  }
}
function closeIncidenceDialog() {
  showIncidenceDialog.value = false
  selectedIncidence.value = null
  selectedTask.value = null
}



const hours = Array.from({ length: 16 }, (_, i) => `${i + 6}:00`)
function goToPrevDay() {
  selectedDate.value = addDays(selectedDate.value, -1)
}
function goToNextDay() {
  selectedDate.value = addDays(selectedDate.value, 1)
}
function isToday() {
  return isSameDay(selectedDate.value, today)
}
const evidences = ref([])
const evidenceService = new EvidenceApiService()

onMounted(async () => {
  const resEvidences = await evidenceService.getAllEvidences()
  evidences.value = resEvidences.data

  const resIncidences = await incidenceService.getAllIncidences() // 3. Carga incidencias
  incidences.value = resIncidences.data
})

// Devuelve evidencias para una fecha específica
function evidencesForDay(day) {
  return evidences.value.filter(ev =>
      isSameDay(new Date(ev.createdAt), day)
  )
}
function evidencesForDayAndHour(day, hour) {
  return evidences.value.filter(ev => {
    const evDate = new Date(ev.createdAt)
    return isSameDay(evDate, day) && evDate.getHours() === parseInt(hour)
  })
}
function incidencesForDayAndHour(day, hour) {
  return incidences.value.filter(inc => {
    const incDate = new Date(inc.createdAt)
    return isSameDay(incDate, day) && incDate.getHours() === parseInt(hour)
  })
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
    <table class="calendar-table">
      <thead>
      <tr>
        <th></th>
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
      <tbody>
      <tr v-for="hour in hours" :key="hour">
        <td class="hour-label">{{ hour }}</td>
        <td
            v-for="day in days"
            :key="day.date + hour"
            class="calendar-cell"
            :class="{ selected: isSameDay(day.date, selectedDate) }"
        >
          <button
              v-for="evidence in evidencesForDayAndHour(day.date, hour.split(':')[0])"
              :key="evidence.id"
              class="evidence-item"
              type="button"
              @click="openEvidenceDialog(evidence)"
          >
            {{ evidence.description }}
          </button>

          <button
              v-for="incidence in incidencesForDayAndHour(day.date, hour.split(':')[0])"
              :key="incidence.id"
              class="incidence-item"
              type="button"
              @click="openIncidenceDialog(incidence)"
          >
            {{ incidence.description }}
          </button>

        </td>
      </tr>
      </tbody>
    </table>





    <!--<PvDialog v-model:visible="showEvidenceDialog" modal :closable="true" @hide="closeEvidenceDialog">
      <div class="dialog-content">
        <h3>Detalle de Evidencia</h3>
        <p><strong>Tarea asociada:</strong> {{ selectedEvidence?.taskId }}</p>
        <div v-if="selectedTask">
          <p><strong>Nombre tarea:</strong> {{ selectedTask.title }}</p>
          <p><strong>Trabajador:</strong> {{ selectedTask.assignee }}</p>
          <p><strong>Descripción tarea:</strong> {{ selectedTask.description }}</p>
          Agrega más campos si lo necesitas
        </div>
        <p><strong>Descripción evidencia:</strong> {{ selectedEvidence?.description }}</p>
        <button @click="closeEvidenceDialog">Cerrar</button>
      </div>
    </PvDialog> -->
  </div>

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

</template>

<style scoped>


.dialog-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  background: rgba(0, 0, 0, 0.01);
  backdrop-filter: blur(0px);
}

.dialog-content {
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
  max-height: 600px; /* Altura máxima visible */
  overflow-x: auto;
  overflow-y: auto;
  display: flex;
  align-items: stretch;
  justify-content: stretch;
  background: #f5f5f5;
}
.calendar-table {
  min-width: 1000px; /* Aumenta el ancho mínimo */
  min-height: 600px;
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
  background: #fff;
}
th, td {
  border: 1px solid #ddd;
  text-align: center;
  padding: 4px; /* Reduce el padding */
  color: #71717A;
  font-size: 0.95em; /* Reduce el tamaño de fuente */
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
</style>