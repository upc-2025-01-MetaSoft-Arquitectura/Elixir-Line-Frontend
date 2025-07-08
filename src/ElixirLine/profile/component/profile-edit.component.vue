<script>


import CreateAndEdit from "../../../shared/components/create-and-edit.component.vue";

export default {
  name: 'profile-edit',


  components: {CreateAndEdit},


  props: {
    itemEntity: null,
    visible: Boolean,
    entityName: String,
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
    console.log('Profile Edit Dialog component created');
  }
};

</script>

<template>


  <div class="page-container">

    <create-and-edit :entity="itemEntity" :visible="visible" :entity-name="entityName"
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
            <label for="surname"> Surname </label>
            <pv-input-text id="surname" v-model="itemEntity.lastname" :class="{ 'p-invalid': submitted && !itemEntity.lastname}"/>
          </pv-float-label>

          <pv-float-label class="field mt-4">
            <label for="email"> Email </label>
            <pv-input-text id="email" v-model="itemEntity.email" :class="{ 'p-invalid': submitted && !itemEntity.email}"/>
          </pv-float-label>

          <pv-float-label class="field mt-4">
            <label for="country"> Country </label>
            <pv-input-text id="country" v-model="itemEntity.country" :class="{ 'p-invalid': submitted && !itemEntity.country}"/>
          </pv-float-label>

          <pv-float-label class="field mt-4">
            <label for="phone"> Phone </label>
            <pv-input-text id="phone" v-model="itemEntity.phoneNumber" :class="{
              'p-invalid': submitted && !itemEntity.phoneNumber}"/>
          </pv-float-label>

        </div>


      </template>

    </create-and-edit>


  </div>


</template>

<style>

</style>