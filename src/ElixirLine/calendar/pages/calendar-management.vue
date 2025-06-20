<script setup>
import {ref, computed, onMounted} from 'vue'
import {startOfWeek, addDays, format, isSameDay} from 'date-fns'
import { es } from 'date-fns/locale'
import { EvidenceApiService } from '../../evidence-management/services/evidence-service.js'
import { IncidenceApiService } from '../../evidence-management/services/incidence-service.js' // 1. Importa el servicio


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
          <div
              v-for="evidence in evidencesForDayAndHour(day.date, hour.split(':')[0])"
              :key="evidence.id"
              class="evidence-item"
          >
            {{ evidence.description }}
          </div>
          <div
              v-for="incidence in incidencesForDayAndHour(day.date, hour.split(':')[0])"
              :key="incidence.id"
              class="incidence-item"
          >
            {{ incidence.description }}
          </div>
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
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