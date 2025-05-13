<script>

import CreateAndEdit from "../../../shared/components/create-and-edit.component.vue";

export default {
  name: "batches-create-and-edit",
  components: {CreateAndEdit},


  props: {
    itemBatch: null,
    visible: Boolean
  },

  data() {
    return {
      submitted: false
    }
  },

  methods: {

    onCancelRequested() {
      this.$emit('cancel-requested-batches');
    },

    onSaveRequested() {
      this.submitted = true;
      this.$emit('save-requested-batches', this.item);
    }
  },

  created() {
    console.log('Batches Create and Edit Dialog component created');
  }

}
</script>



<template>

  <create-and-edit :entity="itemBatch" :visible="visible" entity-name="Batch"
                   @canceled-shared="onCancelRequested" @saved-shared="onSaveRequested">

    <!--Definimos el contenido del diálogo de creación y edición de lotes en el slot content del componente -->
    <!--CreateAndEdit-->
    <template #content>

      <div class="p-fluid">
        <div class="field  mt-5">
          <pv-float-label>
            <label for="grape_variety">Grape variety</label>
            <pv-input-text id="grape_variety" v-model="itemBatch.grape_variety" :class="{ 'p-invalid': submitted && !itemBatch.grape_variety}"/>
          </pv-float-label>
        </div>

        <div class="field mt-5">
          <pv-float-label>
            <label for="harvest_date">Harvest date</label>
            <pv-input-text id="harvest_date" v-model="itemBatch.harvest_date" :class="{ 'p-invalid': submitted && !itemBatch.harvest_date}"/>
          </pv-float-label>
        </div>

        <div class="field  mt-5">
          <pv-float-label>
            <label for="grape_quantity">Grape quantity</label>
            <pv-input-text id="grape_quantity" v-model="itemBatch.grape_quantity" :class="{ 'p-invalid': submitted && !itemBatch.grape_quantity}"/>
          </pv-float-label>
        </div>


        <div class="field  mt-5">
          <pv-float-label>
            <label for="vineyard_origin">Vineyard origin</label>
            <pv-input-text id="vineyard_origin" v-model="itemBatch.vineyard_origin" :class="{ 'p-invalid': submitted && !itemBatch.vineyard_origin}"/>
          </pv-float-label>
        </div>

        <div class="field  mt-5">
          <pv-float-label>
            <label for="current_status">Status</label>
            <pv-input-text id="current_status" v-model="itemBatch.current_status" :class="{ 'p-invalid': submitted && !itemBatch.current_status}"/>
          </pv-float-label>
        </div>

        <div class="field  mt-5">
          <pv-float-label>
            <label for="process_start_date">Start date</label>
            <pv-input-text id="process_start_date" v-model="itemBatch.process_start_date" :class="{ 'p-invalid': submitted && !itemBatch.process_start_date}"/>
          </pv-float-label>
        </div>

        <div class="field  mt-5">
          <pv-float-label>
            <label for="final_volume">Final volume</label>
            <pv-input-text id="final_volume" v-model="itemBatch.final_volume" :class="{ 'p-invalid': submitted && !itemBatch.final_volume}"/>
          </pv-float-label>
        </div>
      </div>
    </template>

  </create-and-edit>



</template>



<style>

</style>