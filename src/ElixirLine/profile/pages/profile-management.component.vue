<script>

import BasePageLayout from "../../../shared/components/base-page-layout.component.vue";
import DataManager from "../../../shared/components/data-manager.component.vue";
import {Profile} from "../model/profile.entity.js";
import {ProfileApiServices} from "../services/profile-api.services.js";
import ProfileEdit from "../component/profile-edit.component.vue";

export default {
  name: "profile-management",

  components: {
    ProfileEdit,
    BasePageLayout,
    DataManager,
  },

  data() {
    return {
      title: { singular: 'Perfil', plural: 'Perfiles' },
      arrayItems: [],
      itemObject: new Profile({}),
      itemObjectAux: new Profile({}),
      selectedItems: [],
      profileApiService: null,
      createAndEditDialogIsVisible: false,
      isEdit: false,
      submitted: false,
    }
  },



  methods: {

    //#region Utility Methods
    notifySuccessfulAction(message) {
      this.$toast.add({severity: 'success', summary: 'Success', detail: message, life: 3000});
    },

    findIndexById(id) {
      return this.arrayItems.findIndex(item => item.id === id);
    },
    //#endregion

    onEditItem() {
      this.itemObjectAux = new Profile(this.itemObject);
      console.log('edit item management');
      this.isEdit = true;
      this.submitted = false;
      this.createAndEditDialogIsVisible = true;
    },

    onEditPassword() {
      this.isEdit = true;
      this.submitted = false;
      this.createAndEditDialogIsVisible = true;
    },

    onCancelRequested() {
      this.createAndEditDialogIsVisible = false;
      this.submitted = false;
      this.isEdit = false;
    },

    onSaveRequested(item) {

      console.log('onSaveRequestedManagement', item);

      this.submitted = true;

      this.itemObject = item;

      this.update();

      this.createAndEditDialogIsVisible = false;
      this.isEdit = false;
    },
    //#endregion

    update() {
      this.profileApiService.update(this.itemObject.id, this.itemObject).then(response => {
        let index = this.findIndexById(this.itemObject.id);
        this.arrayItems[index] = new Profile(response.data);
        this.notifySuccessfulAction('Profile updated successfully');
      }).catch(error => {
        console.error("Error updating a Profile",error);
      });
    },


    //#endregion

    getAllProfiles() {

      this.profileApiService.getAllResources().then(response => {
        console.log("Profiles response", response.data);

        this.arrayItems = response.data.map(resource => new Profile(resource));

        console.log("Profiles resources", this.arrayItems);
      }).catch(error => {
        console.error("Error getting Profiles",error);
      });
    },


    getProfileById(id) {
      this.profileApiService.getResourceById(id).then(response => {
        this.itemObject = new Profile(response.data);
      }).catch(error => {
        console.error("Error getting Profile by ID", error);
      });
    }
  },


  //#region Lifecycle Hooks
  created() {

    this.profileApiService = new ProfileApiServices('/profiles');
    this.getProfileById(1);

    console.log("Profiles Management component created");
  }
  //#endregion


}
</script>

<template>

  <div class="page-profile-management flex flex-column w-full h-full align-items-start overflow-auto">

    <div class="flex flex-1 flex-column align-items-center p-4">

      <!-- Perfil del usuario -->
      <img
          src="https://cdn-icons-png.flaticon.com/512/3135/3135768.png"
          alt="Avatar"
          class="border-circle"
          style="width: 80px; height: 80px"
      />

      <!-- Información del usuario -->
      <div class="flex flex-column align-items-start mt-3">
        <p><strong>Nombre:</strong> {{itemObject.name}} {{itemObject.surname}}</p>
        <p><strong>Correo electrónico:</strong> {{itemObject.email}}</p>
        <p><strong>País:</strong> {{itemObject.country}}</p>
        <p><strong>Celular:</strong> {{itemObject.phone}}</p>
        <p><strong>Tipo de usuario:</strong> {{itemObject.user_type}}</p>

      </div>

      <!-- Botones -->
      <div class="flex gap-2 mt-3">
        <pv-button  label="Cambiar contraseña" class="p-button-secondary" @click = "onEditPassword" />
        <pv-button label="Modificar perfil" class="p-button-secondary" @click="onEditItem" />
      </div>

      <profile-edit
          :edit="isEdit"
          :item-entity="itemObjectAux"
          :visible="createAndEditDialogIsVisible"
          @cancel-requested="onCancelRequested"
          @save-requested="onSaveRequested($event)"
      />

    </div>

  </div>

</template>

<style>

</style>