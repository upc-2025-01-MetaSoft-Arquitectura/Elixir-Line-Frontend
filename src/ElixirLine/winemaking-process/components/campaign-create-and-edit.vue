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
      submitted: false,
      campaignStatusOptions: [
        { label: 'No Iniciado', value: 'NO_INICIADO' },
        { label: 'En Proceso', value: 'EN_PROCESO' },
        { label: 'Finalizado', value: 'FINALIZADO' }
      ]
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

      <!--
      {
      "id": 1,
      "name": "Campaña Vendimia Sur 2025",
      "year": "2025",
      "winegrowerId": 2,
      "batches": 0,
      "status": "NO_INICIADO",
      "startDate": "2025-02-15",
      "endDate": null
      }
      -->

        <div class="field">

          <pv-float-label class="field mt-5">
            <label for="name"> Name Campaign </label>
            <pv-input-text class="flex w-full" id="name" v-model="itemEntity.name" :class="{ 'p-invalid': submitted && !itemEntity.name}"/>
          </pv-float-label>

          <pv-float-label class="field mt-4">
            <label for="year"> Year </label>
            <pv-input-text class="flex w-full" id="year" v-model="itemEntity.year" :class="{ 'p-invalid': submitted && !itemEntity.year}"/>
          </pv-float-label>

          <pv-float-label class="field mt-4">
            <label for="batches">  Batches Quantity </label>
            <pv-input-text class="flex w-full" id="batches" v-model="itemEntity.batches" :class="{ 'p-invalid': submitted &&
            !itemEntity.batches}"/>
          </pv-float-label>

          <pv-float-label class="field mt-4">
            <pv-dropdown
                class="flex w-full"
                id="status"
                v-model="itemEntity.status"
                :options="campaignStatusOptions"
                option-label="label"
                option-value="value"
                :class="{ 'p-invalid': submitted && !itemEntity.status }"
            />
            <label for="status">Status</label>
          </pv-float-label>


          <pv-float-label class="field mt-4">
            <label for="startDate"> Start Date </label>
            <pv-calendar class="flex w-full" id="startDate" v-model="itemEntity.startDate" :class="{ 'p-invalid': submitted &&
            !itemEntity.startDate}"/>
          </pv-float-label>

          <pv-float-label class="field mt-4">
            <label for="endDate" > End Date </label>
            <pv-calendar class="flex w-full" id="endDate" v-model="itemEntity.endDate"/>
          </pv-float-label>

        </div>


    </template>

  </create-and-edit>


</template>

<style>

</style>