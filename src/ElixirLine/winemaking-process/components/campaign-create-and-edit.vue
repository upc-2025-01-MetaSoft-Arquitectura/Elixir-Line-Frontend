<script>

import CreateAndEdit from "../../../shared/components/create-and-edit.component.vue";

export default {
  name: "campaign-create-and-edit",

  components: {CreateAndEdit},


  props: {
    item: null,
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
      this.$emit('save-requested', this.item);
    }
  },

  created() {
    console.log('Campaign Create and Edit Dialog component created');
  }

}
</script>

<template>

  <create-and-edit :entity="item" :visible="visible" entity-name="Campaign"
                   @canceled-shared="onCancelRequested" @saved-shared="onSaveRequested">

    <!--Definimos el contenido del diálogo de creación y edición de lotes en el slot content del componente -->
    <!--CreateAndEdit-->
    <template #content>

      <div class="p-fluid">

        <div class="field  mt-4">
          <pv-float-label>
            <label for="id"> Id </label>
            <pv-input-text id="id" v-model="item.id" :class="{ 'p-invalid': submitted && !item.id}"/>
          </pv-float-label>

          <pv-float-label>
            <label for="name"> Name </label>
            <pv-input-text id="name" v-model="item.name" :class="{ 'p-invalid': submitted && !item.name}"/>
          </pv-float-label>

          <pv-float-label>
            <label for="createdBy"> Created By </label>
            <pv-input-text id="createdBy" v-model="item.createdBy" :class="{ 'p-invalid': submitted && !item.createdBy}"/>
          </pv-float-label>

          <pv-float-label>
            <label for="startDate"> Start Date </label>
            <pv-input-text id="startDate" v-model="item.startDate" :class="{ 'p-invalid': submitted && !item.startDate}"/>
          </pv-float-label>

          <pv-float-label>
            <label for="endDate"> End Date </label>
            <pv-input-text id="endDate" v-model="item.endDate" :class="{ 'p-invalid': submitted && !item.endDate}"/>
          </pv-float-label>

          <pv-float-label>
            <label for="batchesQuantity"> Batches Quantity </label>
            <pv-input-text id="batchesQuantity" v-model="item.batchesQuantity" :class="{ 'p-invalid': submitted && !item.batchesQuantity}"/>
          </pv-float-label>

          <pv-float-label>
            <label for="status"> Status </label>
            <pv-input-text id="status" v-model="item.status" :class="{ 'p-invalid': submitted && !item.status}"/>
          </pv-float-label>


        </div>




      </div>
    </template>

  </create-and-edit>


</template>

<style>

</style>