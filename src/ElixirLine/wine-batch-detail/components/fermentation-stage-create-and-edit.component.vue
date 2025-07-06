<script>

import CreateAndEdit from "../../../shared/components/create-and-edit.component.vue";
import BasePageLayout from "../../../shared/components/base-page-layout.component.vue";
import {FermentationStage} from "../model/fermentationStage.entity.js";
import {Calendar as PvCalendar} from "primevue";

export default {
  name: 'fermentation-stage-create-and-edit',
  components: {PvCalendar, CreateAndEdit, BasePageLayout},

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


  <create-and-edit
      :entity="item"
      :edit="edit"
      :visible="visible"
      :entity-name=" 'Fermentación'"
      @canceled-shared="onCancelRequested"
      @saved-shared="onSaveRequested($event)"
  >
    <template #content>
      <div class="field">

        <pv-float-label class="field mt-5">
          <label for="employee">Registrado por</label>
          <pv-input-text
              class="w-full"
              id="employee"
              v-model="item.employee"
              :class="{ 'p-invalid': submitted && !item.employee }"
          />
        </pv-float-label>

        <pv-float-label class="field mt-5">
          <label for="startDate">Fecha de inicio</label>
          <pv-calendar
              class="w-full"
              id="startDate"
              v-model="item.startDate"
              :class="{ 'p-invalid': submitted && !item.startDate }"
          />

        </pv-float-label>
        <pv-float-label class="field mt-5">
          <label for="endDate">Fecha de fin</label>
          <pv-calendar
              class="w-full"
              id="endDate"
              v-model="item.endDate"
              :class="{ 'p-invalid': submitted && !item.endDate }"
          />
        </pv-float-label>

        <pv-float-label class="field mt-5">
          <label for="yeastUsed">Levadura utilizada</label>
          <pv-input-text
              class="w-full"
              id="yeastUsed"
              v-model="item.yeastUsed"
              :class="{ 'p-invalid': submitted && !item.yeastUsed }"
          />

        </pv-float-label>
        <pv-float-label class="field mt-5">
          <label for="fermentationType">Tipo de fermentación</label>
          <pv-input-text
              class="w-full"
              id="fermentationType"
              v-model="item.fermentationType"
              :class="{ 'p-invalid': submitted && !item.fermentationType }"
          />
        </pv-float-label>


        <pv-float-label class="field mt-5">
          <label for="initialSugarLevel">Nivel de azúcar inicial (%)</label>
          <pv-input-text
              class="w-full"
              id="initialSugarLevel"
              v-model="item.initialSugarLevel"
              type="number"
              step="0.01"
              :class="{ 'p-invalid': submitted && !item.initialSugarLevel }"
          />
        </pv-float-label>


        <pv-float-label class="field mt-5">
          <label for="finalSugarLevel">Nivel de azúcar final (%)</label>
          <pv-input-text
              class="w-full"
              id="finalSugarLevel"
              v-model="item.finalSugarLevel"
              type="number"
              step="0.01"
              :class="{ 'p-invalid': submitted && !item.finalSugarLevel }"
          />
        </pv-float-label>


        <pv-float-label class="field mt-5">
          <label for="initialPH">pH inicial</label>
          <pv-input-text
              class="w-full"
              id="initialPH"
              v-model="item.initialPH"
              type="number"
              step="0.01"
              :class="{ 'p-invalid': submitted && !item.initialPH }"
          />
        </pv-float-label>



        <pv-float-label class="field mt-5">
          <label for="finalPH">pH final</label>
          <pv-input-text
              class="w-full"
              id="finalPH"
              v-model="item.finalPH"
              type="number"
              step="0.01"
              :class="{ 'p-invalid': submitted && !item.finalPH }"
          />
        </pv-float-label>


        <pv-float-label class="field mt-5">
          <label for="maxTemperature">Temperatura máxima (°C)</label>
          <pv-input-text
              class="w-full"
              id="maxTemperature"
              v-model="item.maxTemperature"
              type="number"
              step="0.01"
              :class="{ 'p-invalid': submitted && !item.maxTemperature }"
          />
        </pv-float-label>


        <pv-float-label class="field mt-5">
          <label for="minTemperature">Temperatura mínima (°C)</label>
          <pv-input-text
              class="w-full"
              id="minTemperature"
              v-model="item.minTemperature"
              type="number"
              step="0.01"
              :class="{ 'p-invalid': submitted && !item.minTemperature }"
          />
        </pv-float-label>


        <pv-float-label class="field mt-5">
          <label for="tankCode">Código del tanque</label>
          <pv-input-text
              class="w-full"
              id="tankCode"
              v-model="item.tankCode"
              :class="{ 'p-invalid': submitted && !item.tankCode }"
          />
        </pv-float-label>


        <pv-float-label class="field mt-5">
          <label for="comment">Comentario</label>
          <pv-input-text
              class="w-full"
              id="comment"
              v-model="item.comment"
              :class="{ 'p-invalid': submitted && !item.comment }"
          />
        </pv-float-label>


      </div>
    </template>


  </create-and-edit>


</template>

<style>

</style>