<script>

import CreateAndEdit from "../../../shared/components/create-and-edit.component.vue";
import BasePageLayout from "../../../shared/components/base-page-layout.component.vue";
import {ClarificationStage} from "../model/clarificationStage.entity.js";

export default {

  name: 'clarification-stage-create-and-edit',

  components: {CreateAndEdit, BasePageLayout},

  props: {
    itemEntity: null,
    edit : Boolean,
    visible: Boolean,
  },

  data() {
    return {
      clarificationStage: new ClarificationStage({}),     submitted: false
    }
  },


  methods:{

    onCancelRequested() {
      this.$emit('cancel-requested');
    },

    onSaveRequested(newItem) {
      this.submitted = true;

      newItem.stage = "Clarificación"; // Assuming the stage is always "Clarificación" for this component

      this.itemEntity.clarificationStage = newItem;

      this.$emit('save-requested', this.itemEntity);
    }
  },


  created() {

    this.clarificationStage =  this.itemEntity?.clarificationStage || new ClarificationStage({})

    console.log('===============', this.clarificationStage);

    console.log('Clarification Stage Create and Edit component created');
  }
};

</script>

<template>

  <!-- Etapa: Clarificación -->

  <create-and-edit
      :entity="clarificationStage"
      :edit="edit"
      :visible="visible"
      :entity-name="clarificationStage.stage || 'Clarificación'"
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
              v-model="clarificationStage.registeredBy"
              :class="{ 'p-invalid': submitted && !clarificationStage.registeredBy }"
          />
        </pv-float-label>

        <pv-float-label class="field mt-4 w-full">
          <label for="startDate">Fecha de inicio</label>
          <pv-calendar
              class="w-full"
              id="startDate"
              v-model="clarificationStage.startDate"
              date-format="yy-mm-dd"
              show-icon
              :class="{ 'p-invalid': submitted && !clarificationStage.startDate }"
          />
        </pv-float-label>

        <pv-float-label class="field mt-4 w-full">
          <label for="endDate">Fecha de fin</label>
          <pv-calendar
              class="w-full"
              id="endDate"
              v-model="clarificationStage.endDate"
              date-format="yy-mm-dd"
              show-icon
              :class="{ 'p-invalid': submitted && !clarificationStage.endDate }"
          />
        </pv-float-label>

        <pv-float-label class="field mt-4 w-full">
          <label for="method">Método</label>
          <pv-input-text
              class="w-full"
              id="method"
              v-model="clarificationStage.method"
              :class="{ 'p-invalid': submitted && !clarificationStage.method }"
          />
        </pv-float-label>

        <pv-float-label class="field mt-4 w-full">
          <label for="turbidityBeforeNTU">Turbidez antes (NTU)</label>
          <pv-input-text
              class="w-full"
              id="turbidityBeforeNTU"
              v-model="clarificationStage.turbidityBeforeNTU"
              :class="{ 'p-invalid': submitted && !clarificationStage.turbidityBeforeNTU }"
          />
        </pv-float-label>

        <pv-float-label class="field mt-4 w-full">
          <label for="turbidityAfterNTU">Turbidez después (NTU)</label>
          <pv-input-text
              class="w-full"
              id="turbidityAfterNTU"
              v-model="clarificationStage.turbidityAfterNTU"
              :class="{ 'p-invalid': submitted && !clarificationStage.turbidityAfterNTU }"
          />
        </pv-float-label>

        <pv-float-label class="field mt-4 w-full">
          <label for="volumeLiters">Volumen (litros)</label>
          <pv-input-text
              class="w-full"
              id="volumeLiters"
              v-model="clarificationStage.volumeLiters"
              :class="{ 'p-invalid': submitted && !clarificationStage.volumeLiters }"
          />
        </pv-float-label>

        <pv-float-label class="field mt-4 w-full">
          <label for="temperature">Temperatura (°C)</label>
          <pv-input-text
              class="w-full"
              id="temperature"
              v-model="clarificationStage.temperature"
              :class="{ 'p-invalid': submitted && !clarificationStage.temperature }"
          />
        </pv-float-label>


        <pv-float-label class="field mt-4 w-full">
          <label for="durationHours">Duración (horas)</label>
          <pv-input-text
              class="w-full"
              id="durationHours"
              v-model="clarificationStage.durationHours"
              :class="{ 'p-invalid': submitted && !clarificationStage.durationHours }"
          />
        </pv-float-label>

        <pv-float-label class="field mt-4 w-full">
          <label for="comments">Comentarios</label>
          <pv-input-textarea
              class="w-full"
              id="comments"
              v-model="clarificationStage.comments"
              :class="{ 'p-invalid': submitted && !clarificationStage.comments }"
          />
        </pv-float-label>


        <div class="field-checkbox mt-4 w-full">
          <pv-checkbox
              input-id="isCompleted"
              v-model="clarificationStage.isCompleted"
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