<script>

import CreateAndEdit from "../../../shared/components/create-and-edit.component.vue";
import BasePageLayout from "../../../shared/components/base-page-layout.component.vue";
import {ClarificationStage} from "../model/clarificationStage.entity.js";

export default {

  name: 'clarification-stage-create-and-edit',

  components: {CreateAndEdit, BasePageLayout},

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

  <!-- Etapa: Clarificación -->

  <create-and-edit
      :entity="item"
      :edit="edit"
      :visible="visible"
      :entity-name="item.stage || 'Clarificación'"
      @canceled-shared="onCancelRequested"
      @saved-shared="onSaveRequested($event)"
  >

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
          <label for="method">Método</label>
          <pv-input-text
              class="w-full"
              id="method"
              v-model="item.method"
              :class="{ 'p-invalid': submitted && !item.method }"
          />
        </pv-float-label>

        <pv-float-label class="field mt-4 w-full">
          <label for="turbidityBeforeNTU">Turbidez antes (NTU)</label>
          <pv-input-text
              class="w-full"
              id="turbidityBeforeNTU"
              v-model="item.turbidityBeforeNTU"
              :class="{ 'p-invalid': submitted && !item.turbidityBeforeNTU }"
          />
        </pv-float-label>

        <pv-float-label class="field mt-4 w-full">
          <label for="turbidityAfterNTU">Turbidez después (NTU)</label>
          <pv-input-text
              class="w-full"
              id="turbidityAfterNTU"
              v-model="item.turbidityAfterNTU"
              :class="{ 'p-invalid': submitted && !item.turbidityAfterNTU }"
          />
        </pv-float-label>

        <pv-float-label class="field mt-4 w-full">
          <label for="volumeLiters">Volumen (litros)</label>
          <pv-input-text
              class="w-full"
              id="volumeLiters"
              v-model="item.volumeLiters"
              :class="{ 'p-invalid': submitted && !item.volumeLiters }"
          />
        </pv-float-label>

        <pv-float-label class="field mt-4 w-full">
          <label for="temperature">Temperatura (°C)</label>
          <pv-input-text
              class="w-full"
              id="temperature"
              v-model="item.temperature"
              :class="{ 'p-invalid': submitted && !item.temperature }"
          />
        </pv-float-label>


        <pv-float-label class="field mt-4 w-full">
          <label for="durationHours">Duración (horas)</label>
          <pv-input-text
              class="w-full"
              id="durationHours"
              v-model="item.durationHours"
              :class="{ 'p-invalid': submitted && !item.durationHours }"
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