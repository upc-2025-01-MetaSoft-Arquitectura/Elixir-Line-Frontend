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

    console.log('Reception Stage Detail component created');
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

    <!-- "fermentationStage": {
        "stage": "Fermentación",
        "registeredBy": "Alonso Alvarez",
        "startDate": "2025-05-10",
        "endDate": "2025-05-10",
        "yeastUsedMgL": 225,
        "pH": 3.4,
        "initialBrix": 23.5,
        "finalBrix": 1.5,
        "initialpH": 3.6,
        "finalpH": 3.45,
        "temperatureMax": 25.8,
        "temperatureMin": 16.2,
        "fermentationType": "alcohólica",
        "tankCode": "TK-FRM-07",
        "isFinalized": true,
        "comments": "Fermentación controlada, sin desviaciones. Se mantuvo rango óptimo de temperatura.",
        "isCompleted": true
      },
      -->
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




      </div>

    </template>

  </create-and-edit>


</template>

<style>

</style>