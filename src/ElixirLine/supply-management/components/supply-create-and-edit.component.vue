<script>

import CreateAndEdit from "../../../shared/components/create-and-edit.component.vue";

export default {
  name: "supply-create-and-edit",

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
    console.log('Supply Create and Edit Dialog component created');
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
          <label for="id"> Id </label>
          <pv-input-text id="id" v-model="itemEntity.id" :class="{ 'p-invalid': submitted && !itemEntity.id}"/>
        </pv-float-label>

        <pv-float-label class="field mt-4">
          <label for="name"> Name </label>
          <pv-input-text id="name" v-model="itemEntity.name" :class="{ 'p-invalid': submitted && !itemEntity.name}"/>
        </pv-float-label>

        <pv-float-label class="field mt-4">
          <label for="quantity"> Quantity </label>
          <pv-input-text id="quantity" v-model="itemEntity.quantity" :class="{ 'p-invalid': submitted && !itemEntity.quantity}"/>
        </pv-float-label>

        <pv-float-label class="field mt-4">
          <label for="unidad"> Unidad </label>
          <pv-input-text id="unidad" v-model="itemEntity.unidad" :class="{ 'p-invalid': submitted && !itemEntity.unidad}"/>
        </pv-float-label>

        <pv-float-label class="field mt-4">
          <label for="image"> Image </label>
          <pv-input-text id="image" v-model="itemEntity.image" :class="{ 'p-invalid': submitted && !itemEntity.image}"/>
        </pv-float-label>

      </div>


    </template>

  </create-and-edit>


</template>

<style >


.p-datatable-column-header-content {
  font-size: 1rem;
  font-weight: 600;
  text-align: center;

}

.p-datatable-header-cell {
  font-size: 1rem;
  font-weight: 600;
  text-align: center;
}


.p-datatable-header-cell {
  font-size: 0.8rem;
  font-weight: 600;
  text-align: center;
}

.p-datatable-tbody > tr > td {
  font-size: 0.8rem;
  font-weight: 400;
}

</style>