<script>

import CreateAndEdit from "../../../shared/components/create-and-edit.component.vue";
import {computed} from "vue";
import {useAuthenticationStore} from "../../security/services/authentication.store.js";
const userId = computed(() => useAuthenticationStore().currentUserId);

export default {
  name: "employee-create-and-edit",


  components: {CreateAndEdit},


  props: {
    itemEntity: {
      type: Object,
      default: () => ({
        name: "",
        lastname: "",
        phoneNumber: "",
        profilePicture: "",
        status: "ACTIVE"
      })
    },
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
      const fieldWorkerToSave = {
        // id y userId los asigna el backend, no los incluyas si no es necesario
        ...this.itemEntity,
        winegrowerId: userId.value, // Asigna el usuario actual como winegrowerId
        status: this.itemEntity.status || 'ACTIVE'
      };
      this.$emit('save-requested', fieldWorkerToSave);
    }
  },

  created() {
    console.log('Employee Create and Edit Dialog component created');
  }

}
</script>

<template>
  <div class="page-container">
    <create-and-edit
        :entity="itemEntity"
        :visible="visible"
        entity-name="Employee"
        @canceled-shared="onCancelRequested"
        @saved-shared="onSaveRequested"
    >
      <template #content>
        <div class="field">
          <!-- Nombre -->
          <pv-float-label class="field mt-4">
            <label for="firstName">First Name</label>
            <pv-input-text
                id="firstName"
                v-model="itemEntity.name"
                :class="{ 'p-invalid': submitted && !itemEntity.name }"
            />
          </pv-float-label>

          <!-- Apellidos -->
          <pv-float-label class="field mt-4">
            <label for="lastName">Last Name</label>
            <pv-input-text
                id="lastName"
                v-model="itemEntity.lastname"
                :class="{ 'p-invalid': submitted && !itemEntity.lastname }"
            />
          </pv-float-label>

          <!-- Número de Teléfono -->
          <pv-float-label class="field mt-4">
            <label for="phoneNumber">Phone Number</label>
            <pv-input-text
                id="phoneNumber"
                v-model="itemEntity.phoneNumber"
                :class="{ 'p-invalid': submitted && !itemEntity.phoneNumber }"
            />
          </pv-float-label>

          <!-- Foto de perfil -->
          <pv-float-label class="field mt-4">
            <label for="profilePicture">Profile Picture URL</label>
            <pv-input-text
                id="profilePicture"
                v-model="itemEntity.profilePicture"
                :class="{ 'p-invalid': submitted && !itemEntity.profilePicture }"
            />
          </pv-float-label>
          <!-- Si prefieres un input file, aquí puedes adaptar tu lógica -->

          <!-- Estado -->
          <pv-float-label class="field mt-4">
            <label for="status">Status</label>
            <select
                id="status"
                v-model="itemEntity.status"
                :class="{ 'p-invalid': submitted && !itemEntity.status }"
                class="editable-field"
            >
              <option value="ACTIVE">ACTIVE</option>
              <option value="INACTIVE">INACTIVE</option>
            </select>
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