<script>

import CreateAndEdit from "../../../shared/components/create-and-edit.component.vue";

export default {
  name: "campaign-create-and-edit",

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
      this.$emit('save-requested', this.itemEntity);
    }
  },

  created() {
    console.log('Campaign Create and Edit Dialog component created');
  }

}
</script>

<template>

  <create-and-edit :entity="itemEntity" :visible="visible" entity-name="Campaign"
                   @canceled-shared="onCancelRequested" @saved-shared="onSaveRequested">

    <!--Definimos el contenido del diálogo de creación y edición de lotes en el slot content del componente -->
    <!--CreateAndEdit-->
    <template #content>

        <div class="field">

          <pv-float-label class="field mt-4">
            <label for="name"> Name </label>
            <pv-input-text id="name" v-model="itemEntity.name" :class="{ 'p-invalid': submitted && !itemEntity.name}"/>
          </pv-float-label>

          <pv-float-label class="field mt-4">
            <label for="createdBy"> Created By </label>
            <pv-input-text id="createdBy" v-model="itemEntity.createdBy" :class="{ 'p-invalid': submitted && !itemEntity.createdBy}"/>
          </pv-float-label>

          <pv-float-label class="field mt-4">
            <label for="startDate"> Start Date </label>
            <pv-input-text id="startDate" v-model="itemEntity.startDate" :class="{ 'p-invalid': submitted && !itemEntity.startDate}"/>
          </pv-float-label >

          <pv-float-label class="field mt-4">
            <label for="endDate"> End Date </label>
            <pv-input-text id="endDate" v-model="itemEntity.endDate" :class="{ 'p-invalid': submitted && !itemEntity.endDate}"/>
          </pv-float-label>

          <pv-float-label class="field mt-4">
            <label for="batchesQuantity"> Batches Quantity </label>
            <pv-input-text id="batchesQuantity" v-model="itemEntity.batchesQuantity" :class="{ 'p-invalid': submitted && !itemEntity.batchesQuantity}"/>
          </pv-float-label>

          <pv-float-label class="field mt-4">
            <label for="status"> Status </label>
            <pv-input-text id="status" v-model="itemEntity.status" :class="{ 'p-invalid': submitted && !itemEntity.status}"/>
          </pv-float-label>

        </div>


    </template>

  </create-and-edit>


</template>

<style>

</style>