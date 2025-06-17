<script setup>
import { ref, computed } from 'vue'
import {startOfWeek, addDays, format, isSameDay} from 'date-fns'
import { es } from 'date-fns/locale'


const today = new Date()
const selectedDate = ref(today)

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

const hours = Array.from({ length: 12 }, (_, i) => `${i + 8}:00`)
function goToPrevDay() {
  selectedDate.value = addDays(selectedDate.value, -1)
}
function goToNextDay() {
  selectedDate.value = addDays(selectedDate.value, 1)
}
function isToday() {
  return isSameDay(selectedDate.value, today)
}
</script>


<template>
  <div class="calendar-filters">
    <button @click="goToPrevDay">&#8592;</button>
    <span class="filter-label">
      {{ isToday() ? 'Hoy' : format(selectedDate, 'd MMMM yyyy', { locale: es }) }}
    </span>
    <button @click="goToNextDay">&#8594;</button>
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
        ></td>
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
  height: 100vh;
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
  height: 100%;
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
  height: 60px;
  cursor: pointer;
}
</style>