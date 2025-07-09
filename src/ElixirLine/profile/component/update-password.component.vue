<script>


import CreateAndEdit from "../../../shared/components/create-and-edit.component.vue";

export default {
  name: 'update-password',

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
      <template #content>

        <div class="field">

          <!-- Input new password -->
          <pv-float-label class="field mt-4">
            <label for="new-password"> New Password </label>
            <pv-input-text class="w-full" id="new-password" v-model="itemEntity.password" :class="{ 'p-invalid': submitted &&
          !itemEntity.password && 'invalid' }" type="password" />
          </pv-float-label>



        </div>


      </template>

    </create-and-edit>
  </div>

</template>

<style>

</style>