<script>

import CreateAndEdit from "../../../shared/components/create-and-edit.component.vue";
import {UserApiService} from "../services/user-api.service.js";
import {UpdateUser} from "../model/update-user.entity.js";

export default {
  name: "employee-create-and-edit",

  components: {CreateAndEdit},

  props: {
    edit: Boolean,
    itemEntity: null,
    visible: Boolean
  },

  data() {

    return {
      submitted: false,
      userApiService: null,
      updateUser: new UpdateUser({}),
      initEmail: null,
    };

  },


  methods: {
    notifySuccessfulAction() {
      this.$toast.add({
        severity: 'success',
        summary: 'Success',
        detail: 'User updated successfully',
        life: 3000
      });
    },

    onCancelRequested() {
      this.$emit('cancel-requested');
    },

    onSaveRequested() {
      this.submitted = true;

      if (
          this.edit &&
          (
              (this.itemEntity.password !== '' && this.itemEntity.password !== null) ||
              ((this.itemEntity.email || '').trim() !== (this.initEmail || '').trim())
          )
      ) {
        this.updateUserInfo();
      } else {
        this.$emit('save-requested', this.itemEntity);
      }
    },

    updateUserInfo() {
      this.userApiService = new UserApiService('/users');
      this.updateUser = new UpdateUser({});

      this.updateUser.email = this.itemEntity.email;
      this.updateUser.password = this.itemEntity.password;

      try {
        this.userApiService.update(this.itemEntity.userId, this.updateUser);

        this.$emit('save-requested', this.itemEntity);

        this.notifySuccessfulAction('User updated successfully');
      } catch (error) {
        console.error('Error updating user:', error);
        this.$toast.add({severity: 'error', summary: 'Error', detail: 'Failed to update user', life: 3000});
      }
    },

  },

  created() {
    this.initEmail = this.itemEntity.email;
    console.log('Employee Create and Edit Dialog component created');
  }

}
</script>

<template>

  <div class="page-container">

    <create-and-edit :entity="itemEntity" :visible="visible" :edit="edit" entity-name="Employee"
                     @canceled-shared="onCancelRequested" @saved-shared="onSaveRequested">

      <template #content>
        <div class="field">

          <pv-float-label class="field mt-4">
            <label for="name"> Name fieldworker </label>
            <pv-input-text
                class="w-full"
                id="name"
                v-model="itemEntity.name"
                :class="{ 'p-invalid': submitted && !itemEntity.name}"/>
          </pv-float-label>

          <pv-float-label class="field mt-4">
            <label for="lastname"> Last Name </label>
            <pv-input-text
                class="w-full"
                id="lastname"
                v-model="itemEntity.lastname"
                :class="{ 'p-invalid': submitted && !itemEntity.lastname}"/>
          </pv-float-label>


          <pv-float-label class="field mt-4">
            <label for="phoneNumber"> Phone Number </label>
            <pv-input-text
                class="w-full"
                id="phoneNumber"
                v-model="itemEntity.phoneNumber"
                :class="{ 'p-invalid': submitted && !itemEntity.phoneNumber}"/>
          </pv-float-label>

          <pv-float-label class="field mt-4">
            <label for="email"> Email </label>
            <pv-input-text
                class="w-full"
                id="email"
                v-model="itemEntity.email"
                :class="{ 'p-invalid': submitted && !itemEntity.email}"/>
          </pv-float-label>

          <pv-float-label class="field mt-4">
            <label v-if="!edit" for="password"> Create password </label>
            <label v-else for="password"> Update password </label>
            <pv-input-text
                id="password"
                class="w-full"
                v-model="itemEntity.password"
                type="password"
                :class="{ 'p-invalid': submitted && !itemEntity.password}"/>
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