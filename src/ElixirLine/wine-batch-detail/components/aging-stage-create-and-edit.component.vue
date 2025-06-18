<script>

import CreateAndEdit from "../../../shared/components/create-and-edit.component.vue";
import {AgingStage} from "../model/agingStage.entity.js";

export default {
  name: 'aging-stage-detail-create-and-edit',

  components: {CreateAndEdit},

  props: {
    itemEntity: null,
    edit : Boolean,
    visible: Boolean,
  },

  data() {
    return {
      agingStage: new AgingStage({}),     submitted: false
    }
  },


  methods:{

    onCancelRequested() {
      this.$emit('cancel-requested');
    },

    onSaveRequested(newItem) {
      this.submitted = true;

      newItem.stage = "Añejamiento"; // Assuming the stage is always "Envejecimiento" for this component

      this.itemEntity.agingStage = newItem;

      console.log('batches-create-and-edit onSaveRequested',this.agingStage);

      this.$emit('save-requested', this.itemEntity);
    }
  },


  created() {

    this.agingStage = this.itemEntity?.agingStage ||  new AgingStage({})

    console.log('===============', this.agingStage);

    console.log('Pressing Stage Create and Edit component created');
  }



};

</script>

<template>

  <create-and-edit
      :entity="agingStage"
      :edit="edit"
      :visible="visible"
      :entity-name="agingStage.stage || 'Añejamiento'"
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
              v-model="agingStage.registeredBy"
              :class="{ 'p-invalid': submitted && !agingStage.registeredBy }"
          />
        </pv-float-label>

        <pv-float-label class="field mt-4 w-full">
          <label for="startDate">Fecha de inicio</label>
          <pv-calendar
              class="w-full"
              id="startDate"
              v-model="agingStage.startDate"
              date-format="yy-mm-dd"
              show-icon
              :class="{ 'p-invalid': submitted && !agingStage.startDate }"
          />
        </pv-float-label>

        <pv-float-label class="field mt-4 w-full">
          <label for="endDate">Fecha de fin</label>
          <pv-calendar
              class="w-full"
              id="endDate"
              v-model="agingStage.endDate"
              date-format="yy-mm-dd"
              show-icon
              :class="{ 'p-invalid': submitted && !agingStage.endDate }"
          />
        </pv-float-label>

        <pv-float-label class="field mt-4 w-full">
          <label for="containerType">Tipo de contenedor</label>
          <pv-input-text
              class="w-full"
              id="containerType"
              v-model="agingStage.containerType"
              :class="{ 'p-invalid': submitted && !agingStage.containerType }"
          />
        </pv-float-label>

        <pv-float-label class="field mt-4 w-full">
          <label for="material">Material</label>
          <pv-input-text
              class="w-full"
              id="material"
              v-model="agingStage.material"
              :class="{ 'p-invalid': submitted && !agingStage.material }"
          />
        </pv-float-label>

        <pv-float-label class="field mt-4 w-full">
          <label for="containerCode">Código del contenedor</label>
          <pv-input-text
              class="w-full"
              id="containerCode"
              v-model="agingStage.containerCode"
              :class="{ 'p-invalid': submitted && !agingStage.containerCode }"
          />
        </pv-float-label>

        <pv-float-label class="field mt-4 w-full">
          <label for="avgTemperature">Temperatura promedio (°C)</label>
          <pv-input-text
              class="w-full"
              id="avgTemperature"
              v-model.number="agingStage.avgTemperature"
              :class="{ 'p-invalid': submitted && !agingStage.avgTemperature }"
          />
        </pv-float-label>

        <pv-float-label class="field mt-4 w-full">
          <label for="volumeLiters">Volumen (litros)</label>
          <pv-input-text
              class="w-full"
              id="volumeLiters"
              v-model.number="agingStage.volumeLiters"
              :class="{ 'p-invalid': submitted && !agingStage.volumeLiters }"
          />
        </pv-float-label>

        <pv-float-label class="field mt-4 w-full">
          <label for="durationMonths">Duración (meses)</label>
          <pv-input-text
              class="w-full"
              id="durationMonths"
              v-model.number="agingStage.durationMonths"
              :class="{ 'p-invalid': submitted && !agingStage.durationMonths }"
          />
        </pv-float-label>

        <!-- Frecuencia (días) -->
        <pv-float-label class="field mt-4 w-full">
          <label for="frequencyDays">Frecuencia (días)</label>
          <pv-input-text
              class="w-full"
              id="frequencyDays"
              v-model.number="agingStage.frequencyDays"
              @input="(e) => agingStage.frequencyDays = e.target.value === '' ? 0 : Number(e.target.value)"
              :class="{ 'p-invalid': submitted && (agingStage.frequencyDays === null || agingStage.frequencyDays === undefined || agingStage.frequencyDays === '') }"
          />
        </pv-float-label>

        <!-- Batonnage -->
        <pv-float-label class="field mt-4 w-full">
          <label for="batonnage">Batonnage (número de veces)</label>
          <pv-input-text
              class="w-full"
              id="batonnage"
              v-model.number="agingStage.batonnage"
              @input="(e) => agingStage.batonnage = e.target.value === '' ? 0 : Number(e.target.value)"
              :class="{ 'p-invalid': submitted && (agingStage.batonnage === null || agingStage.batonnage === undefined || agingStage.batonnage === '') }"
          />
        </pv-float-label>

        <!-- Recargas -->
        <pv-float-label class="field mt-4 w-full">
          <label for="refilled">Recargas</label>
          <pv-input-text
              class="w-full"
              id="refilled"
              v-model.number="agingStage.refilled"
              @input="(e) => agingStage.refilled = e.target.value === '' ? 0 : Number(e.target.value)"
              :class="{ 'p-invalid': submitted && (agingStage.refilled === null || agingStage.refilled === undefined || agingStage.refilled === '') }"
          />
        </pv-float-label>

        <!-- Trasiegos -->
        <pv-float-label class="field mt-4 w-full">
          <label for="rackings">Trasiegos</label>
          <pv-input-text
              class="w-full"
              id="rackings"
              v-model.number="agingStage.rackings"
              @input="(e) => agingStage.rackings = e.target.value === '' ? 0 : Number(e.target.value)"
              :class="{ 'p-invalid': submitted && (agingStage.rackings === null || agingStage.rackings === undefined || agingStage.rackings === '') }"
          />
        </pv-float-label>

        <pv-float-label class="field mt-4 w-full">
          <label for="purpose">Propósito</label>
          <pv-input-text
              class="w-full"
              id="purpose"
              v-model="agingStage.purpose"
              :class="{ 'p-invalid': submitted && !agingStage.purpose }"
          />
        </pv-float-label>

        <pv-float-label class="field mt-4 w-full">
          <label for="comments">Comentarios</label>
          <pv-input-textarea
              class="w-full"
              id="comments"
              v-model="agingStage.comments"
              :class="{ 'p-invalid': submitted && !agingStage.comments }"
          />
        </pv-float-label>

        <div class="field-checkbox mt-4 w-full">
          <pv-checkbox
              input-id="isCompleted"
              v-model="agingStage.isCompleted"
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