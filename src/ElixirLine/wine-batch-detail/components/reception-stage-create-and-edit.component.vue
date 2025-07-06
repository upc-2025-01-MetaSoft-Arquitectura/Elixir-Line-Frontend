<script >

import BasePageLayout from "../../../shared/components/base-page-layout.component.vue";
import CreateAndEdit from "../../../shared/components/create-and-edit.component.vue";
import {ReceptionStage} from "../model/receptionStage.entity.js";

export default {
  name: 'reception-stage-create-and-edit',
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
      :entity-name='"Recepción"'
      @canceled-shared="onCancelRequested"
      @saved-shared="onSaveRequested($event)"
  >
    <template #content>

      <div class="field">

        <pv-float-label  class="field mt-5">
          <label for="employee">Registrado por</label>
          <pv-input-text
              class="w-full"
              id="employee"
              v-model="item.employee"
              :class="{ 'p-invalid': submitted && !item.employee }"
          />
        </pv-float-label>

        <pv-float-label  class="field mt-5">
          <label for="startDate">Fecha de Inicio</label>
          <pv-calendar
              class="w-full"
              id="startDate"
              v-model="item.startDate"
              type="date"
              :class="{ 'p-invalid': submitted && !item.startDate }"
          />
        </pv-float-label>

        <pv-float-label  class="field mt-5">
          <label for="endDate">Fecha de Fin</label>
          <pv-calendar
              class="w-full"
              id="endDate"
              v-model="item.endDate"
              type="date"
              :class="{ 'p-invalid': submitted && !item.endDate }"
          />
        </pv-float-label>

        <pv-float-label  class="field mt-5">
          <label for="sugarLevel">Nivel de Azúcar (%)</label>
          <pv-input-text
              class="w-full"
              id="sugarLevel"
              v-model="item.sugarLevel"
              type="number"
              step="0.01"
              :class="{ 'p-invalid': submitted && !item.sugarLevel }"
          />
        </pv-float-label>


        <pv-float-label  class="field mt-5">
          <label for="pHLevel">Nivel de pH</label>
          <pv-input-text
              class="w-full"
              id="pHLevel"
              v-model="item.pHLevel"
              type="number"
              step="0.01"
              :class="{ 'p-invalid': submitted && !item.pHLevel }"
          />
        </pv-float-label>

        <pv-float-label  class="field mt-5">
          <label for="temperature">Temperatura (°C)</label>
          <pv-input-text
              class="w-full"
              id="temperature"
              v-model="item.temperature"
              type="number"
              step="0.01"
              :class="{ 'p-invalid': submitted && !item.temperature }"
          />
        </pv-float-label>

        <pv-float-label  class="field mt-5">
          <label for="quantityKg">Cantidad (Kg)</label>
          <pv-input-text
              class="w-full"
              id="quantityKg"
              v-model="item.quantityKg"
              type="number"
              step="0.01"
              :class="{ 'p-invalid': submitted && !item.quantityKg }"
          />
        </pv-float-label>

        <pv-float-label  class="field mt-5">
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