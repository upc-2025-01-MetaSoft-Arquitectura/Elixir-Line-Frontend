<script>

import CreateAndEdit from "../../../shared/components/create-and-edit.component.vue";

export default {
  name: "batches-create-and-edit",

  components: {CreateAndEdit},

  props: {
    itemEntity: null,
    visible: Boolean
  },

  data() {
    return {
      submitted: false
    }
  },


  methods: {

    onCancelRequested() {
      this.$emit('cancel-requested');
    },

    onSaveRequested() {
      this.submitted = true;
      console.log('batches-create-and-edit onSaveRequested',this.itemEntity);
      this.$emit('save-requested', this.itemEntity);
    }
  },

  created() {
    console.log('Batches Create and Edit Dialog component created');
  }

}

</script>



<template>

  <create-and-edit :entity="itemEntity" :visible="visible" entity-name="Batch"
                   @canceled-shared="onCancelRequested" @saved-shared="onSaveRequested">
    <template #content>
      <div class="p-fluid">

        <div class="field mt-4">
          <pv-float-label>
            <label for="id">Id</label>
            <pv-input-text id="id" v-model="itemEntity.id" :class="{ 'p-invalid': submitted && !itemEntity.id }" />
          </pv-float-label>
        </div>

        <div class="field mt-4">
          <pv-float-label>
            <label for="createdBy">Created By</label>
            <pv-input-text id="createdBy" v-model="itemEntity.createdBy" :class="{ 'p-invalid': submitted && !itemEntity.createdBy }" />
          </pv-float-label>
        </div>

        <div class="field mt-4">
          <pv-float-label>
            <label for="internalCode">Internal Code</label>
            <pv-input-text id="internalCode" v-model="itemEntity.internalCode" :class="{ 'p-invalid': submitted && !itemEntity.internalCode }" />
          </pv-float-label>
        </div>

        <div class="field mt-4">
          <pv-float-label>
            <label for="receptionDate">Reception Date</label>
            <pv-input-text id="receptionDate" v-model="itemEntity.receptionDate" :class="{ 'p-invalid': submitted && !itemEntity.receptionDate }" />
          </pv-float-label>
        </div>

        <div class="field mt-4">
          <pv-float-label>
            <label for="grapeVariety">Grape Variety</label>
            <pv-input-text id="grapeVariety" v-model="itemEntity.grapeVariety" :class="{ 'p-invalid': submitted && !itemEntity.grapeVariety }" />
          </pv-float-label>
        </div>

        <div class="field mt-4">
          <pv-float-label>
            <label for="vineyardOrigin">Vineyard Origin</label>
            <pv-input-text id="vineyardOrigin" v-model="itemEntity.vineyardOrigin" :class="{ 'p-invalid': submitted && !itemEntity.vineyardOrigin }" />
          </pv-float-label>
        </div>

        <div class="field mt-4">
          <pv-float-label>
            <label for="harvestCampaign">Harvest Campaign</label>
            <pv-input-text id="harvestCampaign" v-model="itemEntity.harvestCampaign" :class="{ 'p-invalid': submitted && !itemEntity.harvestCampaign }" />
          </pv-float-label>
        </div>

        <div class="field mt-4">
          <pv-float-label>
            <label for="initialGrapeQuantityKg">Quantity Kg</label>
            <pv-input-text id="initialGrapeQuantityKg" v-model="itemEntity.initialGrapeQuantityKg" :class="{ 'p-invalid': submitted && !itemEntity.initialGrapeQuantityKg }" />
          </pv-float-label>
        </div>

        <div class="field mt-4">
          <pv-float-label>
            <label for="status">Batch Status</label>
            <pv-input-text id="status" v-model="itemEntity.status" :class="{ 'p-invalid': submitted && !itemEntity.status }" />
          </pv-float-label>
        </div>

        <div class="field mt-4">
          <pv-float-label>
            <label for="currentStage">Current Stage</label>
            <pv-input-text id="currentStage" v-model="itemEntity.currentStage" :class="{ 'p-invalid': submitted && !itemEntity.currentStage }" />
          </pv-float-label>
        </div>

      </div>
    </template>
  </create-and-edit>




</template>



<style>

</style>