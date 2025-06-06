<script>

import CreateAndEdit from "../../../shared/components/create-and-edit.component.vue";

export default {
  name: "employee-create-and-edit",


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
    console.log('Employee Create and Edit Dialog component created');
  }

}
</script>

<template>

  <div class="page-container">

    <create-and-edit :entity="itemEntity" :visible="visible" entity-name="Employee"
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
            <label for="firstName"> First Name </label>
            <pv-input-text id="firstName" v-model="itemEntity.firstName" :class="{ 'p-invalid': submitted && !itemEntity.firstName}"/>
          </pv-float-label>

          <pv-float-label class="field mt-4">
            <label for="lastName"> Last Name </label>
            <pv-input-text id="lastName" v-model="itemEntity.lastName" :class="{ 'p-invalid': submitted && !itemEntity.lastName}"/>
          </pv-float-label>

          <pv-float-label class="field mt-4">
            <label for="email"> Email </label>
            <pv-input-text id="email" v-model="itemEntity.email" :class="{ 'p-invalid': submitted && !itemEntity.email}"/>

          </pv-float-label>

          <pv-float-label class="field mt-4">
            <label for="phoneNumber"> Phone Number </label>
            <pv-input-text id="phoneNumber" v-model="itemEntity.phoneNumber" :class="{ 'p-invalid': submitted && !itemEntity.phoneNumber}"/>
          </pv-float-label>

        </div>


      </template>

    </create-and-edit>



  </div>

</template>

<style>



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