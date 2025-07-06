<script>

import CreateAndEdit from "../../../shared/components/create-and-edit.component.vue";
import {FiltrationStage} from "../model/filtrationStage.entity.js";

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
      :entity-name="item.stage || 'Filtración'"
      @canceled-shared="onCancelRequested"
      @saved-shared="onSaveRequested($event)"
  >


    <!-- Content of the create and edit dialog -->

    <template #content>

      <div class="field">

        <pv-float-label class="field mt-4 w-full">
          <label for="registeredBy">Registrado por</label>
          <pv-input-text
              class="w-full"
              id="registeredBy"
              v-model="item.registeredBy"
              :class="{ 'p-invalid': submitted && !item.registeredBy }"
          />
        </pv-float-label>

        <pv-float-label class="field mt-4 w-full">
          <label for="startDate">Fecha de inicio</label>
          <pv-calendar
              class="w-full"
              id="startDate"
              v-model="item.startDate"
              date-format="yy-mm-dd"
              show-icon
              :class="{ 'p-invalid': submitted && !item.startDate }"
          />
        </pv-float-label>

        <pv-float-label class="field mt-4 w-full">
          <label for="endDate">Fecha de fin</label>
          <pv-calendar
              class="w-full"
              id="endDate"
              v-model="item.endDate"
              date-format="yy-mm-dd"
              show-icon
              :class="{ 'p-invalid': submitted && !item.endDate }"
          />
        </pv-float-label>

        <pv-float-label class="field mt-4 w-full">
          <label for="filtrationType">Tipo de filtración</label>
          <pv-input-text
              class="w-full"
              id="filtrationType"
              v-model="item.filtrationType"
              :class="{ 'p-invalid': submitted && !item.filtrationType }"
          />
        </pv-float-label>

        <pv-float-label class="field mt-4 w-full">
          <label for="filterMedia">Medio filtrante</label>
          <pv-input-text
              class="w-full"
              id="filterMedia"
              v-model="item.filterMedia"
              :class="{ 'p-invalid': submitted && !item.filterMedia }"
          />
        </pv-float-label>

        <pv-float-label class="field mt-4 w-full">
          <label for="poreMicrons">Porosidad (micrones)</label>
          <pv-input-text
              class="w-full"
              id="poreMicrons"
              v-model.number="item.poreMicrons"
              :class="{ 'p-invalid': submitted && !item.poreMicrons }"
          />
        </pv-float-label>

        <pv-float-label class="field mt-4 w-full">
          <label for="turbidityBefore">Turbidez antes (NTU)</label>
          <pv-input-number
              class="w-full"
              id="turbidityBefore"
              v-model.number="item.turbidityBefore"
              :class="{ 'p-invalid': submitted && !item.turbidityBefore }"
          />
        </pv-float-label>

        <pv-float-label class="field mt-4 w-full">
          <label for="turbidityAfter">Turbidez después (NTU)</label>
          <pv-input-number
              class="w-full"
              id="turbidityAfter"
              v-model.number="item.turbidityAfter"
              :class="{ 'p-invalid': submitted && !item.turbidityAfter }"
          />
        </pv-float-label>

        <pv-float-label class="field mt-4 w-full">
          <label for="temperature">Temperatura (°C)</label>
          <pv-input-number
              class="w-full"
              id="temperature"
              v-model.number="item.temperature"
              :class="{ 'p-invalid': submitted && !item.temperature }"
          />
        </pv-float-label>

        <pv-float-label class="field mt-4 w-full">
          <label for="pressureBars">Presión (bares)</label>
          <pv-input-number
              class="w-full"
              id="pressureBars"
              v-model.number="item.pressureBars"
              :class="{ 'p-invalid': submitted && !item.pressureBars }"
          />
        </pv-float-label>

        <pv-float-label class="field mt-4 w-full">
          <label for="filteredVolumeLiters">Volumen filtrado (litros)</label>
          <pv-input-number
              class="w-full"
              id="filteredVolumeLiters"
              v-model.number="item.filteredVolumeLiters"
              :class="{ 'p-invalid': submitted && !item.filteredVolumeLiters }"
          />
        </pv-float-label>

        <div class="field-checkbox mt-4 w-full">
          <pv-checkbox
              input-id="isSterile"
              v-model="item.isSterile"
              :binary="true"
          />
          <label for="isSterile">Filtración estéril</label>
        </div>

        <div class="field-checkbox mt-4 w-full">
          <pv-checkbox
              input-id="filterChanged"
              v-model="item.filterChanged"
              :binary="true"
          />
          <label for="filterChanged">Filtro cambiado</label>
        </div>

        <pv-float-label class="field mt-4 w-full">
          <label for="changeReason">Motivo del cambio</label>
          <pv-input-text
              class="w-full"
              id="changeReason"
              v-model="item.changeReason"
              :class="{ 'p-invalid': submitted && !item.changeReason }"
          />
        </pv-float-label>

        <pv-float-label class="field mt-4 w-full">
          <label for="comments">Comentarios</label>
          <pv-input-textarea
              class="w-full"
              id="comments"
              v-model="item.comments"
              :class="{ 'p-invalid': submitted && !item.comments }"
          />
        </pv-float-label>

        <div class="field-checkbox mt-4 w-full">
          <pv-checkbox
              input-id="isCompleted"
              v-model="item.isCompleted"
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