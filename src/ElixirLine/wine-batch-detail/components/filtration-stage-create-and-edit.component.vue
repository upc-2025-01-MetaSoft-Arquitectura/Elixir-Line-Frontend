<script>

import CreateAndEdit from "../../../shared/components/create-and-edit.component.vue";

export default {
  name: 'filtration-stage-create-and-edit',

  components: {CreateAndEdit},

  props: {
    item: null,
    edit : Boolean,
    visible: Boolean,
  },

  data() {
    return {
      submitted: false
    }
  },


  methods:{

    onCancelRequested() {
      this.$emit('cancel-requested');
    },

    onSaveRequested() {
      this.submitted = true;

      console.log('batches-create-and-edit onSaveRequested',this.item);

      this.$emit('save-requested', this.item);
    }
  },

}

</script>

<template>

  <!-- Etapa: Filtración -->
  <create-and-edit
      :entity="item"
      :edit="edit"
      :visible="visible"
      :entity-name="'Filtración'"
      @canceled-shared="onCancelRequested"
      @saved-shared="onSaveRequested($event)"
  >


    <!-- Datos usados para el formulario de filtración
 {
   "employee": "string",
   "startDate": "2025-07-07",
   "endDate": "2025-07-07",
   "filterType": "string",
   "filterMedium": "string",
   "porosity": 0.1,
   "initialTurbidity": 0.1,
   "finalTurbidity": 0.1,
   "temperature": 0.1,
   "pressure": 0.1,
   "filteredVolume": 0.1,
   "sterileFiltration": true,
   "changedFiltration": true,
   "changeReason": "string",
   "comment": "string"
 }
 -->

    <template #content>
      <div class="field">

        <!-- Campo: Registrado por -->
        <pv-float-label class="field mt-5">
          <label for="employee">Registrado por</label>
          <pv-input-text
              class="w-full"
              id="employee"
              v-model="item.employee"
              :class="{ 'p-invalid': submitted && !item.employee }"
          />
        </pv-float-label>

        <!-- Fecha de inicio -->
        <pv-float-label class="field mt-5">
          <label for="startDate">Fecha de inicio</label>
          <pv-calendar
              class="w-full"
              id="startDate"
              v-model="item.startDate"
              :class="{ 'p-invalid': submitted && !item.startDate }"
          />
        </pv-float-label>

        <!-- Fecha de fin -->
        <pv-float-label class="field mt-5">
          <label for="endDate">Fecha de fin</label>
          <pv-calendar
              class="w-full"
              id="endDate"
              v-model="item.endDate"
              :class="{ 'p-invalid': submitted && !item.endDate }"
          />
        </pv-float-label>

        <!-- Tipo de filtro -->
        <pv-float-label class="field mt-5">
          <label for="filterType">Tipo de filtro</label>
          <pv-input-text
              class="w-full"
              id="filterType"
              v-model="item.filterType"
              :class="{ 'p-invalid': submitted && !item.filterType }"
          />
        </pv-float-label>

        <!-- Medio filtrante -->
        <pv-float-label class="field mt-5">
          <label for="filterMedium">Medio filtrante</label>
          <pv-input-text
              class="w-full"
              id="filterMedium"
              v-model="item.filterMedium"
              :class="{ 'p-invalid': submitted && !item.filterMedium }"
          />
        </pv-float-label>

        <!-- Porosidad -->
        <pv-float-label class="field mt-5">
          <label for="porosity">Porosidad</label>
          <pv-input-text
              class="w-full"
              id="porosity"
              v-model.number="item.porosity"
              :class="{ 'p-invalid': submitted && item.porosity === null }"
          />
        </pv-float-label>

        <!-- Turbidez inicial -->
        <pv-float-label class="field mt-5">
          <label for="initialTurbidity">Turbidez inicial</label>
          <pv-input-text
              class="w-full"
              id="initialTurbidity"
              v-model.number="item.initialTurbidity"
              :class="{ 'p-invalid': submitted && item.initialTurbidity === null }"
          />
        </pv-float-label>

        <!-- Turbidez final -->
        <pv-float-label class="field mt-5">
          <label for="finalTurbidity">Turbidez final</label>
          <pv-input-text
              class="w-full"
              id="finalTurbidity"
              v-model.number="item.finalTurbidity"
              :class="{ 'p-invalid': submitted && item.finalTurbidity === null }"
          />
        </pv-float-label>

        <!-- Temperatura -->
        <pv-float-label class="field mt-5">
          <label for="temperature">Temperatura (°C)</label>
          <pv-input-text
              class="w-full"
              id="temperature"
              v-model.number="item.temperature"
              :class="{ 'p-invalid': submitted && item.temperature === null }"
          />
        </pv-float-label>

        <!-- Presión -->
        <pv-float-label class="field mt-5">
          <label for="pressure">Presión (bar)</label>
          <pv-input-text
              class="w-full"
              id="pressure"
              v-model.number="item.pressure"
              :class="{ 'p-invalid': submitted && item.pressure === null }"
          />
        </pv-float-label>

        <!-- Volumen filtrado -->
        <pv-float-label class="field mt-5">
          <label for="filteredVolume">Volumen filtrado (litros)</label>
          <pv-input-text
              class="w-full"
              id="filteredVolume"
              v-model.number="item.filteredVolume"
              :class="{ 'p-invalid': submitted && item.filteredVolume === null }"
          />
        </pv-float-label>

        <!-- Filtración estéril -->
        <div class="field mt-5">
          <label for="sterileFiltration" class="block mb-2">Filtración estéril</label>
          <pv-input-switch
              id="sterileFiltration"
              v-model="item.sterileFiltration"
          />
        </div>

        <!-- Cambio de filtración -->
        <div class="field mt-5">
          <label for="changedFiltration" class="block mb-2">Cambio de filtración</label>
          <pv-input-switch
              id="changedFiltration"
              v-model="item.changedFiltration"
          />
        </div>

        <!-- Motivo del cambio -->
        <pv-float-label class="field mt-5">
          <label for="changeReason">Motivo del cambio</label>
          <pv-input-text
              class="w-full"
              id="changeReason"
              v-model="item.changeReason"
              :class="{ 'p-invalid': submitted && item.changedFiltration && !item.changeReason }"
          />
        </pv-float-label>

        <!-- Comentario -->
        <pv-float-label class="field mt-5">
          <label for="comment">Comentario</label>
          <pv-input-textarea
              class="w-full"
              id="comment"
              v-model="item.comment"
          />
        </pv-float-label>

      </div>
    </template>

  </create-and-edit>


</template>

<style>

</style>