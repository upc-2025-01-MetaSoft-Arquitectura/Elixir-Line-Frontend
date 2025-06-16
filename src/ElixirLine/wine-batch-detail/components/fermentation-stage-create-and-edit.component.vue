<script>

import CreateAndEdit from "../../../shared/components/create-and-edit.component.vue";
import BasePageLayout from "../../../shared/components/base-page-layout.component.vue";
import {FermentationStage} from "../model/fermentationStage.entity.js";

export default {
  name: 'fermentation-stage-create-and-edit',
  components: {CreateAndEdit, BasePageLayout},

  props: {
    itemEntity: null,
    edit : Boolean,
    visible: Boolean,
  },

  data() {
    return {
      fermentationStage: new FermentationStage({}),
      submitted: false
    }
  },


  methods:{

    onCancelRequested() {
      this.$emit('cancel-requested');
    },

    onSaveRequested(newItem) {
      this.submitted = true;

      this.itemEntity.fermentationStage = newItem;

      console.log('batches-create-and-edit onSaveRequested',this.itemEntity);

      this.$emit('save-requested', this.itemEntity);
    }
  },


  created() {

    this.fermentationStage = new FermentationStage(this.itemEntity.fermentationStage)

    console.log('===============', this.fermentationStage);

    console.log('Fermentation Stage Detail component created');
  }



}

</script>

<template>


  <create-and-edit
      :entity="fermentationStage"
      :edit="edit"
      :visible="visible"
      :entity-name="fermentationStage.stage || 'Fermentación'"
      @canceled-shared="onCancelRequested"
      @saved-shared="onSaveRequested($event)"
  >
    <template #content>
      <div class="field">

        <pv-float-label class="field mt-4 w-full">
          <label for="stage">Etapa</label>
          <pv-input-text
              class="w-full"
              id="stage"
              v-model="fermentationStage.stage"
              :class="{ 'p-invalid': submitted && !fermentationStage.stage }"
          />
        </pv-float-label>

        <pv-float-label class="field mt-4 w-full">
          <label for="registeredBy">Registrado por</label>
          <pv-input-text
              class="w-full"
              id="registeredBy"
              v-model="fermentationStage.registeredBy"
              :class="{ 'p-invalid': submitted && !fermentationStage.registeredBy }"
          />
        </pv-float-label>

        <pv-float-label class="field mt-4 w-full">
          <label for="startDate">Fecha de inicio</label>
          <pv-calendar
              class="w-full"
              id="startDate"
              v-model="fermentationStage.startDate"
              date-format="yy-mm-dd"
              show-icon
              :class="{ 'p-invalid': submitted && !fermentationStage.startDate }"
          />
        </pv-float-label>

        <pv-float-label class="field mt-4 w-full">
          <label for="endDate">Fecha de fin</label>
          <pv-calendar
              class="w-full"
              id="endDate"
              v-model="fermentationStage.endDate"
              date-format="yy-mm-dd"
              show-icon
              :class="{ 'p-invalid': submitted && !fermentationStage.endDate }"
          />
        </pv-float-label>

        <pv-float-label class="field mt-4 w-full">
          <label for="yeastUsedMgL">Levadura usada (mg/L)</label>
          <pv-input-number
              class="w-full"
              id="yeastUsedMgL"
              v-model="fermentationStage.yeastUsedMgL"
              :min="0"
              mode="decimal"
              :class="{ 'p-invalid': submitted && !fermentationStage.yeastUsedMgL }"
          />
        </pv-float-label>

        <pv-float-label class="field mt-4 w-full">
          <label for="fermentationType">Tipo de fermentación</label>
          <pv-dropdown
              class="w-full"
              id="fermentationType"
              v-model="fermentationStage.fermentationType"
              :options="['alcohólica', 'maloláctica', 'espontánea']"
              placeholder="Selecciona tipo"
              :class="{ 'p-invalid': submitted && !fermentationStage.fermentationType }"
          />
        </pv-float-label>

        <pv-float-label class="field mt-4 w-full">
          <label for="initialBrix">Brix inicial</label>
          <pv-input-number
              class="w-full"
              id="initialBrix"
              v-model="fermentationStage.initialBrix"
              mode="decimal"
              :min="0"
              :max="40"
              :step="0.1"
              :class="{ 'p-invalid': submitted && !fermentationStage.initialBrix }"
          />
        </pv-float-label>

        <pv-float-label class="field mt-4 w-full">
          <label for="finalBrix">Brix final</label>
          <pv-input-number
              class="w-full"
              id="finalBrix"
              v-model="fermentationStage.finalBrix"
              mode="decimal"
              :min="0"
              :max="40"
              :step="0.1"
              :class="{ 'p-invalid': submitted && !fermentationStage.finalBrix }"
          />
        </pv-float-label>

        <pv-float-label class="field mt-4 w-full">
          <label for="initialpH">pH inicial</label>
          <pv-input-number
              class="w-full"
              id="initialpH"
              v-model="fermentationStage.initialpH"
              mode="decimal"
              :min="2"
              :max="5"
              :step="0.01"
              :class="{ 'p-invalid': submitted && !fermentationStage.initialpH }"
          />
        </pv-float-label>

        <pv-float-label class="field mt-4 w-full">
          <label for="finalpH">pH final</label>
          <pv-input-number
              class="w-full"
              id="finalpH"
              v-model="fermentationStage.finalpH"
              mode="decimal"
              :min="2"
              :max="5"
              :step="0.01"
              :class="{ 'p-invalid': submitted && !fermentationStage.finalpH }"
          />
        </pv-float-label>

        <pv-float-label class="field mt-4 w-full">
          <label for="temperatureMin">Temperatura mínima (°C)</label>
          <pv-input-number
              class="w-full"
              id="temperatureMin"
              v-model="fermentationStage.temperatureMin"
              mode="decimal"
              :step="0.1"
              :class="{ 'p-invalid': submitted && !fermentationStage.temperatureMin }"
          />
        </pv-float-label>

        <pv-float-label class="field mt-4 w-full">
          <label for="temperatureMax">Temperatura máxima (°C)</label>
          <pv-input-number
              class="w-full"
              id="temperatureMax"
              v-model="fermentationStage.temperatureMax"
              mode="decimal"
              :step="0.1"
              :class="{ 'p-invalid': submitted && !fermentationStage.temperatureMax }"
          />
        </pv-float-label>

        <pv-float-label class="field mt-4 w-full">
          <label for="tankCode">Código de tanque</label>
          <pv-input-text
              class="w-full"
              id="tankCode"
              v-model="fermentationStage.tankCode"
              :class="{ 'p-invalid': submitted && !fermentationStage.tankCode }"
          />
        </pv-float-label>

        <pv-float-label class="field mt-4 w-full">
          <label for="comments">Comentarios</label>
          <pv-textarea
              class="w-full"
              id="comments"
              v-model="fermentationStage.comments"
              auto-resize
              rows="3"
          />
        </pv-float-label>

        <div class="field-checkbox mt-4 w-full">
          <pv-checkbox
              input-id="isCompleted"
              v-model="fermentationStage.isCompleted"
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