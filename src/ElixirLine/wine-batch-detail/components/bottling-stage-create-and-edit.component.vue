<script>

import CreateAndEdit from "../../../shared/components/create-and-edit.component.vue";
import {BottlingStage} from "../model/bottlingStage.entity.js";

export default {

  name: 'bottling-stage-create-and-edit',

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


  <create-and-edit
      :entity="item"
      :edit="edit"
      :visible="visible"
      :entity-name="item.stage || 'Embotellado'"
      @canceled-shared="onCancelRequested"
      @saved-shared="onSaveRequested($event)"
  >

    <!-- Content slot for the form fields -->

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
          <label for="bottlingLine">Línea de embotellado</label>
          <pv-input-text
              class="w-full"
              id="bottlingLine"
              v-model="item.bottlingLine"
              :class="{ 'p-invalid': submitted && !item.bottlingLine }"
          />
        </pv-float-label>

        <pv-float-label class="field mt-4 w-full">
          <label for="bottlesFilled">Botellas llenas</label>
          <pv-input-text
              class="w-full"
              id="bottlesFilled"
              v-model.number="item.bottlesFilled"
              :class="{ 'p-invalid': submitted && !item.bottlesFilled }"
          />
        </pv-float-label>


        <pv-float-label class="field mt-4 w-full">
          <label for="bottleVolumeMl">Volumen de botella (ml)</label>
          <pv-input-text
              class="w-full"
              id="bottleVolumeMl"
              v-model.number="item.bottleVolumeMl"
              :class="{ 'p-invalid': submitted && !item.bottleVolumeMl }"
          />
        </pv-float-label>


        <pv-float-label class="field mt-4 w-full">
          <label for="totalVolumeLiters">Volumen total (litros)</label>
          <pv-input-text
              class="w-full"
              id="totalVolumeLiters"
              v-model.number="item.totalVolumeLiters"
              :class="{ 'p-invalid': submitted && !item.totalVolumeLiters }"
          />
        </pv-float-label>


        <pv-float-label class="field mt-4 w-full">
          <label for="sealType">Tipo de sello</label>
          <pv-input-text
              class="w-full"
              id="sealType"
              v-model="item.sealType"
              :class="{ 'p-invalid': submitted && !item.sealType }"
          />
        </pv-float-label>


        <pv-float-label class="field mt-4 w-full">
          <label for="code">Código</label>
          <pv-input-text
              class="w-full"
              id="code"
              v-model="item.code"
              :class="{ 'p-invalid': submitted && !item.code }"
          />
        </pv-float-label>


        <pv-float-label class="field mt-4 w-full">
          <label for="temperature">Temperatura (°C)</label>
          <pv-input-text
              class="w-full"
              id="temperature"
              v-model.number="item.temperature"
              :class="{ 'p-invalid': submitted && !item.temperature }"
          />
        </pv-float-label>

        <div class="field-checkbox mt-4 w-full">
          <pv-checkbox
              id="wasFiltered"
              v-model="item.wasFiltered"
              :class="{ 'p-invalid': submitted && !item.wasFiltered }"
              inputId="wasFiltered"
              label="¿Fue filtrado?"
          />
        </div>

        <div class="field-checkbox mt-4 w-full">
          <pv-checkbox
              id="wereLabelsApplied"
              v-model="item.wereLabelsApplied"
              :class="{ 'p-invalid': submitted && !item.wereLabelsApplied }"
              inputId="wereLabelsApplied"
              label="¿Se aplicaron etiquetas?"
          />
        </div>

        <div class="field-checkbox mt-4 w-full">
          <pv-checkbox
              id="wereCapsulesApplied"
              v-model="item.wereCapsulesApplied"
              :class="{ 'p-invalid': submitted && !item.wereCapsulesApplied }"
              inputId="wereCapsulesApplied"
              label="¿Se aplicaron cápsulas?"
          />
        </div>

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