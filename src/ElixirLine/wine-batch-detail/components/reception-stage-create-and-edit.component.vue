<script >

import BasePageLayout from "../../../shared/components/base-page-layout.component.vue";
import CreateAndEdit from "../../../shared/components/create-and-edit.component.vue";
import {ReceptionStage} from "../model/receptionStage.entity.js";

export default {
  name: 'reception-stage-create-and-edit',
  components: {CreateAndEdit, BasePageLayout},

  props: {
    itemEntity: null,
    edit : Boolean,
    visible: Boolean,
  },

  data() {
    return {
      receptionStage: new ReceptionStage({}),
      submitted: false
    }
  },


  methods:{

    onCancelRequested() {
      this.$emit('cancel-requested');
    },

    onSaveRequested(newItem) {
      this.submitted = true;

      this.itemEntity.receptionStage = newItem;

      console.log('batches-create-and-edit onSaveRequested',this.itemEntity);

      this.$emit('save-requested', this.itemEntity);
    }
  },


  created() {

    this.receptionStage = new ReceptionStage(this.itemEntity.receptionStage)

    console.log('===============', this.receptionStage);

    console.log('Reception Stage Detail component created');
  }
}

</script>

<template>


  <create-and-edit
      :entity="receptionStage"
      :edit="edit"
      :visible="visible"
      :entity-name="receptionStage.stage || 'Recepción'"
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
              v-model="receptionStage.registeredBy"
              :class="{ 'p-invalid': submitted && !receptionStage.registeredBy }"
          />
        </pv-float-label>

        <pv-float-label class="field mt-4 w-full">
          <label for="startDate">Fecha de inicio</label>
          <pv-calendar
              class="w-full"
              id="startDate"
              v-model="receptionStage.startDate"
              date-format="yy-mm-dd"
              show-icon
              :class="{ 'p-invalid': submitted && !receptionStage.startDate }"
          />
        </pv-float-label>

        <pv-float-label class="field mt-4 w-full">
          <label for="endDate">Fecha de fin</label>
          <pv-calendar
              class="w-full"
              id="endDate"
              v-model="receptionStage.endDate"
              date-format="yy-mm-dd"
              show-icon
              :class="{ 'p-invalid': submitted && !receptionStage.endDate }"
          />
        </pv-float-label>

        <pv-float-label class="field mt-4 w-full" >
          <label for="sugarLevelBrix">Nivel de azúcar (Brix)</label>
          <pv-input-number
              class="w-full"
              id="sugarLevelBrix"
              v-model="receptionStage.sugarLevelBrix"
              input-id="sugarLevelBrix"
              :class="{ 'p-invalid': submitted && receptionStage.sugarLevelBrix == null }"
              :step="0.1"
              mode="decimal"
          />
        </pv-float-label>

        <pv-float-label class="field mt-4 w-full">
          <label for="pH">pH</label>
          <pv-input-number
              class="w-full"
              id="pH"
              v-model="receptionStage.pH"
              input-id="pH"
              :class="{ 'p-invalid': submitted && receptionStage.pH == null }"
              :step="0.1"
              mode="decimal"
          />
        </pv-float-label>

        <pv-float-label class="field mt-4 w-full">
          <label for="temperature">Temperatura (°C)</label>
          <pv-input-number
              class="w-full"
              id="temperature"
              v-model="receptionStage.temperature"
              input-id="temperature"
              :class="{ 'p-invalid': submitted && receptionStage.temperature == null }"
              :step="0.1"
              mode="decimal"
          />
        </pv-float-label>

        <pv-float-label class="field mt-4 w-full">
          <label for="quantityKg">Cantidad (kg)</label>
          <pv-input-number
              class="w-full"
              id="quantityKg"
              v-model="receptionStage.quantityKg"
              input-id="quantityKg"
              :class="{ 'p-invalid': submitted && receptionStage.quantityKg == null }"
              :step="0.1"
              mode="decimal"
          />
        </pv-float-label>

        <pv-float-label class="field mt-4 w-full">
          <label for="comments">Comentarios</label>
          <pv-textarea
              class="w-full"
              id="comments"
              v-model="receptionStage.comments"
              rows="3"
              :class="{ 'p-invalid': submitted && !receptionStage.comments }"
              auto-resize
          />
        </pv-float-label>

        <div class="field-checkbox mt-4 w-full">
          <pv-checkbox
              input-id="isCompleted"
              v-model="receptionStage.isCompleted"
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