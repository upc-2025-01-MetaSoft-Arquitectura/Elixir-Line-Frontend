<script>

import CreateAndEdit from "../../../shared/components/create-and-edit.component.vue";
import {AgingStage} from "../model/agingStage.entity.js";

export default {
  name: 'aging-stage-detail-create-and-edit',

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



};

</script>

<template>

  <create-and-edit
      :entity="item"
      :edit="edit"
      :visible="visible"
      :entity-name="item.stage || 'Añejamiento'"
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
          <label for="containerType">Tipo de contenedor</label>
          <pv-input-text
              class="w-full"
              id="containerType"
              v-model="item.containerType"
              :class="{ 'p-invalid': submitted && !item.containerType }"
          />
        </pv-float-label>

        <pv-float-label class="field mt-4 w-full">
          <label for="material">Material</label>
          <pv-input-text
              class="w-full"
              id="material"
              v-model="item.material"
              :class="{ 'p-invalid': submitted && !item.material }"
          />
        </pv-float-label>

        <pv-float-label class="field mt-4 w-full">
          <label for="containerCode">Código del contenedor</label>
          <pv-input-text
              class="w-full"
              id="containerCode"
              v-model="item.containerCode"
              :class="{ 'p-invalid': submitted && !item.containerCode }"
          />
        </pv-float-label>

        <pv-float-label class="field mt-4 w-full">
          <label for="avgTemperature">Temperatura promedio (°C)</label>
          <pv-input-text
              class="w-full"
              id="avgTemperature"
              v-model.number="item.avgTemperature"
              :class="{ 'p-invalid': submitted && !item.avgTemperature }"
          />
        </pv-float-label>

        <pv-float-label class="field mt-4 w-full">
          <label for="volumeLiters">Volumen (litros)</label>
          <pv-input-text
              class="w-full"
              id="volumeLiters"
              v-model.number="item.volumeLiters"
              :class="{ 'p-invalid': submitted && !item.volumeLiters }"
          />
        </pv-float-label>

        <pv-float-label class="field mt-4 w-full">
          <label for="durationMonths">Duración (meses)</label>
          <pv-input-text
              class="w-full"
              id="durationMonths"
              v-model.number="item.durationMonths"
              :class="{ 'p-invalid': submitted && !item.durationMonths }"
          />
        </pv-float-label>

        <!-- Frecuencia (días) -->
        <pv-float-label class="field mt-4 w-full">
          <label for="frequencyDays">Frecuencia (días)</label>
          <pv-input-text
              class="w-full"
              id="frequencyDays"
              v-model.number="item.frequencyDays"
              @input="(e) => item.frequencyDays = e.target.value === '' ? 0 : Number(e.target.value)"
              :class="{ 'p-invalid': submitted && (item.frequencyDays === null || item.frequencyDays === undefined || item.frequencyDays === '') }"
          />
        </pv-float-label>

        <!-- Batonnage -->
        <pv-float-label class="field mt-4 w-full">
          <label for="batonnage">Batonnage (número de veces)</label>
          <pv-input-text
              class="w-full"
              id="batonnage"
              v-model.number="item.batonnage"
              @input="(e) => item.batonnage = e.target.value === '' ? 0 : Number(e.target.value)"
              :class="{ 'p-invalid': submitted && (item.batonnage === null || item.batonnage === undefined || item.batonnage === '') }"
          />
        </pv-float-label>

        <!-- Recargas -->
        <pv-float-label class="field mt-4 w-full">
          <label for="refilled">Recargas</label>
          <pv-input-text
              class="w-full"
              id="refilled"
              v-model.number="item.refilled"
              @input="(e) => item.refilled = e.target.value === '' ? 0 : Number(e.target.value)"
              :class="{ 'p-invalid': submitted && (item.refilled === null || item.refilled === undefined || item.refilled === '') }"
          />
        </pv-float-label>

        <!-- Trasiegos -->
        <pv-float-label class="field mt-4 w-full">
          <label for="rackings">Trasiegos</label>
          <pv-input-text
              class="w-full"
              id="rackings"
              v-model.number="item.rackings"
              @input="(e) => item.rackings = e.target.value === '' ? 0 : Number(e.target.value)"
              :class="{ 'p-invalid': submitted && (item.rackings === null || item.rackings === undefined || item.rackings === '') }"
          />
        </pv-float-label>

        <pv-float-label class="field mt-4 w-full">
          <label for="purpose">Propósito</label>
          <pv-input-text
              class="w-full"
              id="purpose"
              v-model="item.purpose"
              :class="{ 'p-invalid': submitted && !item.purpose }"
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