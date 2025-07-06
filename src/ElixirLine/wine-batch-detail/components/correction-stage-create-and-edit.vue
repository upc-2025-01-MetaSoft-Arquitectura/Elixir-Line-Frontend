<script>

import CreateAndEdit from "../../../shared/components/create-and-edit.component.vue";
import BasePageLayout from "../../../shared/components/base-page-layout.component.vue";
import {CorrectionStage} from "../model/correctionStage.entity.js";

export default {
  name: 'correction-stage-create-and-edit',
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


}

</script>

<template>

  <create-and-edit
      :entity="item"
      :edit="edit"
      :visible="visible"
      :entity-name=" 'Corrección'"
      @canceled-shared="onCancelRequested"
      @saved-shared="onSaveRequested($event)"
  >

    <!-- Content slot for additional fields or information
    {
      "employee": "string",
      "startDate": "2025-07-06",
      "endDate": "2025-07-06",
      "initialSugarLevel": 0.1,
      "finalSugarLevel": 0.1,
      "addedSugar": 0.1,
      "initialPH": 0.1,
      "finalPH": 0.1,
      "acidType": "string",
      "addedAcid": 0.1,
      "addedSulphites": 0.1,
      "nutrients": [
        "string"
      ],
      "justification": "string",
      "comment": "string",
      "completionStatus": "COMPLETED"
    }
    -->

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
          <label for="startDate">Fecha de Inicio</label>
          <pv-calendar
              class="w-full"
              id="startDate"
              v-model="item.startDate"
              type="date"
              :class="{ 'p-invalid': submitted && !item.startDate }"
          />
        </pv-float-label>

        <pv-float-label class="field mt-5">
          <label for="endDate">Fecha de Fin</label>
          <pv-calendar
              class="w-full"
              id="endDate"
              v-model="item.endDate"
              type="date"
              :class="{ 'p-invalid': submitted && !item.endDate }"
          />
        </pv-float-label>

        <pv-float-label class="field mt-5">
          <label for="initialSugarLevel">Nivel de Azúcar Inicial (%)</label>
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
          <label for="finalSugarLevel">Nivel de Azúcar Final (%)</label>
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
          <label for="addedSugar">Azúcar Añadido (%)</label>
          <pv-input-text
              class="w-full"
              id="addedSugar"
              v-model="item.addedSugar"
              type="number"
              step="0.01"
              :class="{ 'p-invalid': submitted && !item.addedSugar }"
          />
        </pv-float-label>

        <pv-float-label class="field mt-5">
          <label for="initialPH">Nivel de pH Inicial</label>
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
          <label for="finalPH">Nivel de pH Final</label>
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
          <label for="acidType">Tipo de Ácido</label>
          <pv-input-text
              class="w-full"
              id="acidType"
              v-model="item.acidType"
              :class="{ 'p-invalid': submitted && !item.acidType }"
          />
        </pv-float-label>


        <pv-float-label class="field mt-5">
          <label for="addedAcid">Ácido Añadido (%)</label>
          <pv-input-text
              class="w-full"
              id="addedAcid"
              v-model="item.addedAcid"
              type="number"
              step="0.01"
              :class="{ 'p-invalid': submitted && !item.addedAcid }"
          />
        </pv-float-label>


        <pv-float-label class="field mt-5">
          <label for="addedSulphites">Sulfatos Añadidos (%)</label>
          <pv-input-text
              class="w-full"
              id="addedSulphites"
              v-model="item.addedSulphites"
              type="number"
              step="0.01"
              :class="{ 'p-invalid': submitted && !item.addedSulphites }"
          />
        </pv-float-label>

        <!-- Nutrients can be a string or an array, adjust accordingly -->
        <pv-float-label class="field mt-5">
          <label for="nutrients">Nutrientes</label>
          <pv-chips
              id="nutrients"
              v-model="item.nutrients"
              class="w-full"
              separator=","
              :class="{ 'p-invalid': submitted && (!item.nutrients || item.nutrients.length === 0) }"
          />
        </pv-float-label>


        <pv-float-label class="field mt-5">
          <label for="justification">Justificación</label>
          <pv-textarea
              class="w-full"
              id="justification"
              v-model="item.justification"
              :class="{ 'p-invalid': submitted && !item.justification }"
          />
        </pv-float-label>

        <pv-float-label class="field mt-5">
          <label for="comment">Comentario</label>
          <pv-textarea
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