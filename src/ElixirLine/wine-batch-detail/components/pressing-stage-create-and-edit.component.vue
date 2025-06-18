<script>

import CreateAndEdit from "../../../shared/components/create-and-edit.component.vue";
import {PressingStage} from "../model/pressingStage.entity.js";

export default {

  name: 'pressing-stage-create-and-edit',

  components: {CreateAndEdit},

  props: {
    itemEntity: null,
    edit : Boolean,
    visible: Boolean,
  },

  data() {
    return {
      pressingStage: new PressingStage({}),     submitted: false
    }
  },


  methods:{

    onCancelRequested() {
      this.$emit('cancel-requested');
    },

    onSaveRequested(newItem) {
      this.submitted = true;

      newItem.stage = "Prensado"; // Assuming the stage is always "Prensado" for this component

      this.itemEntity.pressingStage = newItem;

      console.log('batches-create-and-edit onSaveRequested',this.itemEntity);

      this.$emit('save-requested', this.itemEntity);
    }
  },


  created() {

    this.pressingStage =  this.itemEntity?.pressingStage || new PressingStage({})

    console.log('===============', this.pressingStage);

    console.log('Pressing Stage Create and Edit component created');
  }





};

</script>

<template>

  <create-and-edit
      :entity="pressingStage"
      :edit="edit"
      :visible="visible"
      :entity-name="pressingStage.stage || 'Prensado'"
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
              v-model="pressingStage.registeredBy"
              :class="{ 'p-invalid': submitted && !pressingStage.registeredBy }"
          />
        </pv-float-label>

        <pv-float-label class="field mt-4 w-full">
          <label for="startDate">Fecha de inicio</label>
          <pv-calendar
              class="w-full"
              id="startDate"
              v-model="pressingStage.startDate"
              date-format="yy-mm-dd"
              show-icon
              :class="{ 'p-invalid': submitted && !pressingStage.startDate }"
          />
        </pv-float-label>

        <pv-float-label class="field mt-4 w-full">
          <label for="endDate">Fecha de fin</label>
          <pv-calendar
              class="w-full"
              id="endDate"
              v-model="pressingStage.endDate"
              date-format="yy-mm-dd"
              show-icon
              :class="{ 'p-invalid': submitted && !pressingStage.endDate }"
          />
        </pv-float-label>

        <pv-float-label class="field mt-4 w-full">
          <label for="pressType">Tipo de prensa</label>
          <pv-input-text
              class="w-full"
              id="pressType"
              v-model="pressingStage.pressType"
              :class="{ 'p-invalid': submitted && !pressingStage.pressType }"
          />

        </pv-float-label>


        <pv-float-label class="field mt-4 w-full">
          <label for="pressPressureBars">Presión de la prensa (Bares)</label>
          <pv-input-number
              class="w-full"
              id="pressPressureBars"
              v-model.number="pressingStage.pressPressureBars"
              :min="0"
              mode="decimal"
              :class="{ 'p-invalid': submitted && !pressingStage.pressPressureBars }"
          />
        </pv-float-label>


        <pv-float-label class="field mt-4 w-full">
          <label for="durationMinutes">Duración (minutos)</label>
          <pv-input-number
              class="w-full"
              id="durationMinutes"
              v-model.number="pressingStage.durationMinutes"
              :min="0"
              mode="decimal"
              :class="{ 'p-invalid': submitted && !pressingStage.durationMinutes }"
          />
        </pv-float-label>


        <pv-float-label class="field mt-4 w-full">
          <label for="pomaceKg">Peso de orujo (kg)</label>
          <pv-input-number
              class="w-full"
              id="pomaceKg"
              v-model.number="pressingStage.pomaceKg"
              :min="0"
              mode="decimal"
              :class="{ 'p-invalid': submitted && !pressingStage.pomaceKg }"
          />
        </pv-float-label>


        <pv-float-label class="field mt-4 w-full">
          <label for="yieldLiters">Rendimiento (litros)</label>
          <pv-input-number
              class="w-full"
              id="yieldLiters"
              v-model.number="pressingStage.yieldLiters"
              :min="0"
              mode="decimal"
              :class="{ 'p-invalid': submitted && !pressingStage.yieldLiters }"
          />
        </pv-float-label>


        <pv-float-label class="field mt-4 w-full">
          <label for="mustUsage">Uso del mosto</label>
          <pv-input-text
              class="w-full"
              id="mustUsage"
              v-model="pressingStage.mustUsage"
              :class="{ 'p-invalid': submitted && !pressingStage.mustUsage }"
          />
        </pv-float-label>


        <pv-float-label class="field mt-4 w-full">
          <label for="comments">Comentarios</label>
          <pv-textarea
              class="w-full"
              id="comments"
              v-model="pressingStage.comments"
              :class="{ 'p-invalid': submitted && !pressingStage.comments }"
          />
        </pv-float-label>


        <div class="field-checkbox mt-4 w-full">
          <pv-checkbox
              input-id="isCompleted"
              v-model="pressingStage.isCompleted"
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