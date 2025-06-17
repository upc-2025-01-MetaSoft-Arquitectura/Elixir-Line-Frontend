<script>

import CreateAndEdit from "../../../shared/components/create-and-edit.component.vue";
import {FiltrationStage} from "../model/filtrationStage.entity.js";

export default {
  name: 'filtration-stage-create-and-edit',

  components: {CreateAndEdit},

  props: {
    itemEntity: null,
    edit : Boolean,
    visible: Boolean,
  },

  data() {
    return {
      filtrationStage: new FiltrationStage({}),     submitted: false
    }
  },


  methods:{

    onCancelRequested() {
      this.$emit('cancel-requested');
    },

    onSaveRequested(newItem) {
      this.submitted = true;

      this.itemEntity.filtrationStage = newItem;

      console.log('batches-create-and-edit onSaveRequested',this.itemEntity);

      this.$emit('save-requested', this.itemEntity);
    }
  },


  created() {

    this.filtrationStage =  this.itemEntity?.filtrationStage || new FiltrationStage({})

    console.log('===============', this.filtrationStage);

    console.log('Pressing Stage Create and Edit component created');
  }



}

</script>

<template>

  <!-- Etapa: Filtración -->
  <create-and-edit
      :entity="filtrationStage"
      :edit="edit"
      :visible="visible"
      :entity-name="filtrationStage.stage || 'Filtración'"
      @canceled-shared="onCancelRequested"
      @saved-shared="onSaveRequested($event)"
  >


    <!-- Content of the create and edit dialog
     "filtrationStage": {
        "stage": "Filtración",
        "registeredBy": "Alonso Alvarez",
        "startDate": "2025-05-10",
        "endDate": "2025-05-10",
        "filtrationType": "Filtración estéril",
        "filterMedia": "Membrana PES",
        "poreMicrons": 0.45,
        "turbidityBefore": 2.5,
        "turbidityAfter": 0.4,
        "temperature": 14,
        "pressureBars": 1,
        "filteredVolumeLiters": 1200,
        "isSterile": true,
        "filterChanged": false,
        "changeReason": "Sin cambio",
        "comments": "Filtración sin incidencias, vino limpio y brillante, listo para embotellado.",
        "isCompleted": true
      },
      -->

    <template #content>

      <div class="field">

        <pv-float-label class="field mt-4 w-full">
          <label for="stage">Etapa</label>
          <pv-input-text
              class="w-full"
              id="stage"
              v-model="filtrationStage.stage"
              :class="{ 'p-invalid': submitted && !filtrationStage.stage }"
          />
        </pv-float-label>

        <pv-float-label class="field mt-4 w-full">
          <label for="registeredBy">Registrado por</label>
          <pv-input-text
              class="w-full"
              id="registeredBy"
              v-model="filtrationStage.registeredBy"
              :class="{ 'p-invalid': submitted && !filtrationStage.registeredBy }"
          />
        </pv-float-label>

        <pv-float-label class="field mt-4 w-full">
          <label for="startDate">Fecha de inicio</label>
          <pv-calendar
              class="w-full"
              id="startDate"
              v-model="filtrationStage.startDate"
              date-format="yy-mm-dd"
              show-icon
              :class="{ 'p-invalid': submitted && !filtrationStage.startDate }"
          />
        </pv-float-label>

        <pv-float-label class="field mt-4 w-full">
          <label for="endDate">Fecha de fin</label>
          <pv-calendar
              class="w-full"
              id="endDate"
              v-model="filtrationStage.endDate"
              date-format="yy-mm-dd"
              show-icon
              :class="{ 'p-invalid': submitted && !filtrationStage.endDate }"
          />
        </pv-float-label>

        <pv-float-label class="field mt-4 w-full">
          <label for="filtrationType">Tipo de filtración</label>
          <pv-input-text
              class="w-full"
              id="filtrationType"
              v-model="filtrationStage.filtrationType"
              :class="{ 'p-invalid': submitted && !filtrationStage.filtrationType }"
          />
        </pv-float-label>

        <pv-float-label class="field mt-4 w-full">
          <label for="filterMedia">Medio filtrante</label>
          <pv-input-text
              class="w-full"
              id="filterMedia"
              v-model="filtrationStage.filterMedia"
              :class="{ 'p-invalid': submitted && !filtrationStage.filterMedia }"
          />
        </pv-float-label>

        <pv-float-label class="field mt-4 w-full">
          <label for="poreMicrons">Porosidad (micrones)</label>
          <pv-input-text
              class="w-full"
              id="poreMicrons"
              v-model.number="filtrationStage.poreMicrons"
              :class="{ 'p-invalid': submitted && !filtrationStage.poreMicrons }"
          />
        </pv-float-label>

        <pv-float-label class="field mt-4 w-full">
          <label for="turbidityBefore">Turbidez antes (NTU)</label>
          <pv-input-number
              class="w-full"
              id="turbidityBefore"
              v-model.number="filtrationStage.turbidityBefore"
              :class="{ 'p-invalid': submitted && !filtrationStage.turbidityBefore }"
          />
        </pv-float-label>

        <pv-float-label class="field mt-4 w-full">
          <label for="turbidityAfter">Turbidez después (NTU)</label>
          <pv-input-number
              class="w-full"
              id="turbidityAfter"
              v-model.number="filtrationStage.turbidityAfter"
              :class="{ 'p-invalid': submitted && !filtrationStage.turbidityAfter }"
          />
        </pv-float-label>

        <pv-float-label class="field mt-4 w-full">
          <label for="temperature">Temperatura (°C)</label>
          <pv-input-number
              class="w-full"
              id="temperature"
              v-model.number="filtrationStage.temperature"
              :class="{ 'p-invalid': submitted && !filtrationStage.temperature }"
          />
        </pv-float-label>

        <pv-float-label class="field mt-4 w-full">
          <label for="pressureBars">Presión (bares)</label>
          <pv-input-number
              class="w-full"
              id="pressureBars"
              v-model.number="filtrationStage.pressureBars"
              :class="{ 'p-invalid': submitted && !filtrationStage.pressureBars }"
          />
        </pv-float-label>

        <pv-float-label class="field mt-4 w-full">
          <label for="filteredVolumeLiters">Volumen filtrado (litros)</label>
          <pv-input-number
              class="w-full"
              id="filteredVolumeLiters"
              v-model.number="filtrationStage.filteredVolumeLiters"
              :class="{ 'p-invalid': submitted && !filtrationStage.filteredVolumeLiters }"
          />
        </pv-float-label>

        <div class="field-checkbox mt-4 w-full">
          <pv-checkbox
              input-id="isSterile"
              v-model="filtrationStage.isSterile"
              :binary="true"
          />
          <label for="isSterile">Filtración estéril</label>
        </div>

        <div class="field-checkbox mt-4 w-full">
          <pv-checkbox
              input-id="filterChanged"
              v-model="filtrationStage.filterChanged"
              :binary="true"
          />
          <label for="filterChanged">Filtro cambiado</label>
        </div>

        <pv-float-label class="field mt-4 w-full">
          <label for="changeReason">Motivo del cambio</label>
          <pv-input-text
              class="w-full"
              id="changeReason"
              v-model="filtrationStage.changeReason"
              :class="{ 'p-invalid': submitted && !filtrationStage.changeReason }"
          />
        </pv-float-label>

        <pv-float-label class="field mt-4 w-full">
          <label for="comments">Comentarios</label>
          <pv-input-textarea
              class="w-full"
              id="comments"
              v-model="filtrationStage.comments"
              :class="{ 'p-invalid': submitted && !filtrationStage.comments }"
          />
        </pv-float-label>

        <div class="field-checkbox mt-4 w-full">
          <pv-checkbox
              input-id="isCompleted"
              v-model="filtrationStage.isCompleted"
              :binary="true"
          />
          <label for="isCompleted">Completado</label>
        </div>



      </div>

    </template>

  </create-and-edit>


</template>

<style>

</style>