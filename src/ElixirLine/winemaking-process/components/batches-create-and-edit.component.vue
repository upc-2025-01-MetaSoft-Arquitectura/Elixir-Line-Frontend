<script>

import CreateAndEdit from "../../../shared/components/create-and-edit.component.vue";


export default {
  name: "batches-create-and-edit",

  components: { CreateAndEdit},

  props: {
    itemEntity: null,
    visible: Boolean,
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

        <pv-float-label class="field mt-5">
          <label for="vineyardCode"> Vineyard Code </label>
          <pv-input-text class="flex w-full" id="vineyardCode" v-model="itemEntity.vineyardCode" :class="{ 'p-invalid': submitted && !itemEntity.vineyardCode}"/>
        </pv-float-label>

        <pv-float-label class="field mt-5">
          <label for="vineyardOrigin"> Vineyard Origin </label>
          <pv-input-text class="flex w-full" id="vineyardOrigin" v-model="itemEntity.vineyardOrigin" :class="{ 'p-invalid': submitted && !itemEntity.vineyardOrigin}"/>
        </pv-float-label>

        <pv-float-label class="field mt-5">
          <label for="grapeVariety"> Grape Variety </label>
          <pv-input-text class="flex w-full" id="grapeVariety" v-model="itemEntity.grapeVariety" :class="{ 'p-invalid': submitted && !itemEntity.grapeVariety}"/>
        </pv-float-label>

        <pv-float-label class="field mt-5">
          <label for="harvestCampaign"> Harvest Campaign </label>
          <pv-input-text class="flex w-full" id="harvestCampaign" v-model="itemEntity.harvestCampaign" :class="{ 'p-invalid': submitted && !itemEntity.harvestCampaign}"/>
        </pv-float-label>

        <pv-float-label class="field mt-5">
          <label for="receptionDate"> Reception Date </label>
          <pv-calendar class="flex w-full" id="receptionDate" v-model="itemEntity.receptionDate" :class="{ 'p-invalid':
          submitted && !itemEntity.receptionDate}" mode="date"/>
        </pv-float-label>

        <pv-float-label class="field mt-5">
          <label for="initialGrapeQuantityKg"> Initial Grape Quantity (Kg) </label>
          <pv-input-text class="flex w-full" id="initialGrapeQuantityKg" v-model="itemEntity.initialGrapeQuantityKg"
                           :class="{ 'p-invalid': submitted && !itemEntity.initialGrapeQuantityKg}"/>
        </pv-float-label>

        <pv-float-label class="field mt-5">
          <label for="createdBy"> Created By </label>
          <pv-input-text class="flex w-full" id="createdBy" v-model="itemEntity.createdBy" :class="{ 'p-invalid': submitted && !itemEntity.createdBy}"/>
        </pv-float-label>

      </div>
    </template>
  </create-and-edit>




</template>



<style>

</style>