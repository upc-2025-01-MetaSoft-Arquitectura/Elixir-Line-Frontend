<script>

import CreateAndEdit from "../../../shared/components/create-and-edit.component.vue";
import {BottlingStage} from "../model/bottlingStage.entity.js";

export default {

  name: 'bottling-stage-create-and-edit',

  components: {CreateAndEdit},

  props: {
    itemEntity: null,
    edit : Boolean,
    visible: Boolean,
  },

  data() {
    return {
      bottlingStage: new BottlingStage({}),     submitted: false
    }
  },


  methods:{

    onCancelRequested() {
      this.$emit('cancel-requested');
    },

    onSaveRequested(newItem) {
      this.submitted = true;

      this.itemEntity.bottlingStage = newItem;

      console.log('batches-create-and-edit onSaveRequested',this.bottlingStage);

      this.$emit('save-requested', this.itemEntity);
    }
  },


  created() {

    this.bottlingStage = new BottlingStage(this.itemEntity.bottlingStage)

    console.log('===============', this.bottlingStage);

    console.log('Pressing Stage Create and Edit component created');
  }

}

</script>



<template>


  <create-and-edit
      :entity="bottlingStage"
      :edit="edit"
      :visible="visible"
      :entity-name="bottlingStage.stage || 'Embotellado'"
      @canceled-shared="onCancelRequested"
      @saved-shared="onSaveRequested($event)"
  >

    <!-- Content slot for the form fields
    "bottlingStage": {
        "stage": "Embotellado",
        "registeredBy": "Camila Fuentes",
        "startDate": "2025-05-10",
        "endDate": "2025-05-10",
        "bottlingLine": "LINEA-2",
        "bottlesFilled": 1600,
        "bottleVolumeMl": 750,
        "totalVolumeLiters": 1200,
        "sealType": "Corcho natural",
        "code": "B2024-VINEYARD01",
        "temperature": 15,
        "wasFiltered": true,
        "wereLabelsApplied": true,
        "wereCapsulesApplied": true,
        "comments": "Proceso fluido. Sin incidencias.",
        "isCompleted": true
      }
      -->

    <template #content>

      <div class="field">

        <pv-float-label class="field mt-4 w-full">
          <label for="stage">Etapa</label>
          <pv-input-text
              class="w-full"
              id="stage"
              v-model="bottlingStage.stage"
              :class="{ 'p-invalid': submitted && !bottlingStage.stage }"
          />
        </pv-float-label>

        <pv-float-label class="field mt-4 w-full">
          <label for="registeredBy">Registrado por</label>
          <pv-input-text
              class="w-full"
              id="registeredBy"
              v-model="bottlingStage.registeredBy"
              :class="{ 'p-invalid': submitted && !bottlingStage.registeredBy }"
          />
        </pv-float-label>

        <pv-float-label class="field mt-4 w-full">
          <label for="startDate">Fecha de inicio</label>
          <pv-calendar
              class="w-full"
              id="startDate"
              v-model="bottlingStage.startDate"
              date-format="yy-mm-dd"
              show-icon
              :class="{ 'p-invalid': submitted && !bottlingStage.startDate }"
          />
        </pv-float-label>

        <pv-float-label class="field mt-4 w-full">
          <label for="endDate">Fecha de fin</label>
          <pv-calendar
              class="w-full"
              id="endDate"
              v-model="bottlingStage.endDate"
              date-format="yy-mm-dd"
              show-icon
              :class="{ 'p-invalid': submitted && !bottlingStage.endDate }"
          />
        </pv-float-label>

        <pv-float-label class="field mt-4 w-full">
          <label for="bottlingLine">Línea de embotellado</label>
          <pv-input-text
              class="w-full"
              id="bottlingLine"
              v-model="bottlingStage.bottlingLine"
              :class="{ 'p-invalid': submitted && !bottlingStage.bottlingLine }"
          />
        </pv-float-label>

        <pv-float-label class="field mt-4 w-full">
          <label for="bottlesFilled">Botellas llenas</label>
          <pv-input-text
              class="w-full"
              id="bottlesFilled"
              v-model.number="bottlingStage.bottlesFilled"
              :class="{ 'p-invalid': submitted && !bottlingStage.bottlesFilled }"
          />
        </pv-float-label>


        <pv-float-label class="field mt-4 w-full">
          <label for="bottleVolumeMl">Volumen de botella (ml)</label>
          <pv-input-text
              class="w-full"
              id="bottleVolumeMl"
              v-model.number="bottlingStage.bottleVolumeMl"
              :class="{ 'p-invalid': submitted && !bottlingStage.bottleVolumeMl }"
          />
        </pv-float-label>


        <pv-float-label class="field mt-4 w-full">
          <label for="totalVolumeLiters">Volumen total (litros)</label>
          <pv-input-text
              class="w-full"
              id="totalVolumeLiters"
              v-model.number="bottlingStage.totalVolumeLiters"
              :class="{ 'p-invalid': submitted && !bottlingStage.totalVolumeLiters }"
          />
        </pv-float-label>


        <pv-float-label class="field mt-4 w-full">
          <label for="sealType">Tipo de sello</label>
          <pv-input-text
              class="w-full"
              id="sealType"
              v-model="bottlingStage.sealType"
              :class="{ 'p-invalid': submitted && !bottlingStage.sealType }"
          />
        </pv-float-label>


        <pv-float-label class="field mt-4 w-full">
          <label for="code">Código</label>
          <pv-input-text
              class="w-full"
              id="code"
              v-model="bottlingStage.code"
              :class="{ 'p-invalid': submitted && !bottlingStage.code }"
          />
        </pv-float-label>


        <pv-float-label class="field mt-4 w-full">
          <label for="temperature">Temperatura (°C)</label>
          <pv-input-text
              class="w-full"
              id="temperature"
              v-model.number="bottlingStage.temperature"
              :class="{ 'p-invalid': submitted && !bottlingStage.temperature }"
          />
        </pv-float-label>

        <div class="field-checkbox mt-4 w-full">
          <pv-checkbox
              id="wasFiltered"
              v-model="bottlingStage.wasFiltered"
              :class="{ 'p-invalid': submitted && !bottlingStage.wasFiltered }"
              inputId="wasFiltered"
              label="¿Fue filtrado?"
          />
        </div>

        <div class="field-checkbox mt-4 w-full">
          <pv-checkbox
              id="wereLabelsApplied"
              v-model="bottlingStage.wereLabelsApplied"
              :class="{ 'p-invalid': submitted && !bottlingStage.wereLabelsApplied }"
              inputId="wereLabelsApplied"
              label="¿Se aplicaron etiquetas?"
          />
        </div>

        <div class="field-checkbox mt-4 w-full">
          <pv-checkbox
              id="wereCapsulesApplied"
              v-model="bottlingStage.wereCapsulesApplied"
              :class="{ 'p-invalid': submitted && !bottlingStage.wereCapsulesApplied }"
              inputId="wereCapsulesApplied"
              label="¿Se aplicaron cápsulas?"
          />
        </div>

        <pv-float-label class="field mt-4 w-full">
          <label for="comments">Comentarios</label>
          <pv-input-textarea
              class="w-full"
              id="comments"
              v-model="bottlingStage.comments"
              :class="{ 'p-invalid': submitted && !bottlingStage.comments }"
          />
        </pv-float-label>

        <div class="field-checkbox mt-4 w-full">
          <pv-checkbox
              input-id="isCompleted"
              v-model="bottlingStage.isCompleted"
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