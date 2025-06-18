<script>

import CreateAndEdit from "../../../shared/components/create-and-edit.component.vue";
import BasePageLayout from "../../../shared/components/base-page-layout.component.vue";
import {CorrectionStage} from "../model/correctionStage.entity.js";

export default {
  name: 'correction-stage-create-and-edit',
  components: {CreateAndEdit, BasePageLayout},

  props: {
    itemEntity: null,
    edit : Boolean,
    visible: Boolean,
  },

  data() {
    return {
      correctionStage: new CorrectionStage({}),
      submitted: false
    }
  },


  methods:{

    onCancelRequested() {
      this.$emit('cancel-requested');
    },

    onSaveRequested(newItem) {
      this.submitted = true;

      newItem.stage = "Corrección"; // Assuming the stage is always "Corrección" for this component

      this.itemEntity.correctionStage = newItem;

      console.log('AL GUARDAR ===============================',this.itemEntity);

      this.$emit('save-requested', this.itemEntity);
    }
  },


  created() {

    this.correctionStage = this.itemEntity?.correctionStage || new CorrectionStage({})

    console.log('===============', this.correctionStage);

    console.log('Reception Stage Detail component created');
  }

}

</script>

<template>

  <create-and-edit
      :entity="correctionStage"
      :edit="edit"
      :visible="visible"
      :entity-name="correctionStage.stage || 'Corrección'"
      @canceled-shared="onCancelRequested"
      @saved-shared="onSaveRequested($event)"
  >

    <!-- Content slot for additional fields or information -->

    <template #content>
      <div class="field">

        <pv-float-label class="field mt-4 w-full">
          <label for="startDate">Fecha de inicio</label>
          <pv-calendar
            class="w-full"
            id="startDate"
            v-model="correctionStage.startDate"
            date-format="yy-mm-dd"
            show-icon
            :class="{ 'p-invalid': submitted && !correctionStage.startDate }"
          />
        </pv-float-label>

        <pv-float-label class="field mt-4 w-full">
          <label for="endDate">Fecha de fin</label>
          <pv-calendar
            class="w-full"
            id="endDate"
            v-model="correctionStage.endDate"
            date-format="yy-mm-dd"
            show-icon
            :class="{ 'p-invalid': submitted && !correctionStage.endDate }"
          />
        </pv-float-label>

        <pv-float-label class="field mt-4 w-full">
          <label for="initialBrix">Brix inicial</label>
          <pv-input-text
            class="w-full"
            id="initialBrix"
            v-model.number="correctionStage.initialBrix"
            :class="{ 'p-invalid': submitted && !correctionStage.initialBrix }"
          />
        </pv-float-label>

        <!-- Brix final es decimal -->
        <pv-float-label class="field mt-4 w-full">
          <label for="finalBrix">Brix final</label>
          <pv-input-text
            class="w-full"
            id="finalBrix"
            v-model.number="correctionStage.finalBrix"
            :class="{ 'p-invalid': submitted && !correctionStage.finalBrix }"
          />
        </pv-float-label>

        <pv-float-label class="field mt-4 w-full">
          <label for="addedSugarKg">Azúcar añadido (kg)</label>
          <pv-input-text
            class="w-full"
            id="addedSugarKg"
            v-model.number="correctionStage.addedSugarKg"
            :class="{ 'p-invalid': submitted && !correctionStage.addedSugarKg }"
          />
        </pv-float-label>

        <pv-float-label class="field mt-4 w-full">
          <label for="initialPH">pH inicial</label>
          <pv-input-text
            class="w-full"
            id="initialPH"
            v-model.number="correctionStage.initialPH"
            :class="{ 'p-invalid': submitted && !correctionStage.initialPH }"
          />

        </pv-float-label>

        <pv-float-label class="field mt-4 w-full">
          <label for="finalPH">pH final</label>
          <pv-input-text
            class="w-full"
            id="finalPH"
            v-model.number="correctionStage.finalPH"
            :class="{ 'p-invalid': submitted && !correctionStage.finalPH }"
          />
        </pv-float-label>

        <pv-float-label class="field mt-4 w-full">
          <label for="acidType">Tipo de ácido</label>
          <pv-input-text
            class="w-full"
            id="acidType"
            v-model="correctionStage.acidType"
            :class="{ 'p-invalid': submitted && !correctionStage.acidType }"
          />
        </pv-float-label>

        <pv-float-label class="field mt-4 w-full">
          <label for="acidAddedGL">Ácido añadido (g/L)</label>
          <pv-input-text
            class="w-full"
            id="acidAddedGL"
            v-model.number="correctionStage.acidAddedGL"
            :class="{ 'p-invalid': submitted && !correctionStage.acidAddedGL }"
          />
        </pv-float-label>

        <pv-float-label class="field mt-4 w-full">
          <label for="SO2AddedMgL">Sulfitos añadidos (mg/L)</label>
          <pv-input-text
            class="w-full"
            id="SO2AddedMgL"
            v-model.number="correctionStage.SO2AddedMgL"
            :class="{ 'p-invalid': submitted && !correctionStage.SO2AddedMgL }"
          />
        </pv-float-label>

        <pv-float-label class="field mt-4 w-full">
          <label for="nutrientsAdded">Nutrientes añadidos</label>
          <pv-textarea
            class="w-full"
            id="nutrientsAdded"
            v-model="correctionStage.nutrientsAdded"
            :class="{ 'p-invalid': submitted && !correctionStage.nutrientsAdded }"
            rows="3"
            placeholder="Ingrese los nutrientes añadidos, separados por comas."
          />
        </pv-float-label>

        <pv-float-label class="field mt-4 w-full">
          <label for="justification">Justificación</label>
          <pv-textarea
            class="w-full"
            id="justification"
            v-model="correctionStage.justification"
            :class="{ 'p-invalid': submitted && !correctionStage.justification }"
            rows="3"
          />
        </pv-float-label>

        <pv-float-label class="field mt-4 w-full">
          <label for="comments">Comentarios</label>
          <pv-textarea
            class="w-full"
            id="comments"
            v-model="correctionStage.comments"
            :class="{ 'p-invalid': submitted && !correctionStage.comments }"
            rows="3"
          />
        </pv-float-label>


        <div class="field-checkbox mt-4 w-full">
          <pv-checkbox
              input-id="isCompleted"
              v-model="correctionStage.isCompleted"
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