<script>

import BasePageLayout from "../../../shared/components/base-page-layout.component.vue";
import DataManager from "../../../shared/components/data-manager.component.vue";
import {Winegrower} from "../model/profile.entity.js";
import {ProfileApiServices} from "../services/profile-api.services.js";
import ProfileEdit from "../component/profile-edit.component.vue";
import {useAuthenticationStore} from "../../security/services/authentication.store.js";
import {User} from "../model/User.entity.js";
import {UserApiService} from "../../employee-management/services/user-api.service.js";
import UpdatePassword from "../component/update-password.component.vue";

export default {
  name: "profile-management",

  components: {
    UpdatePassword,
    ProfileEdit,
    BasePageLayout,
    DataManager,
  },

  data() {
    return {
      title: { singular: 'Perfil', plural: 'Perfiles' },
      arrayItems: [],
      itemObject: new Winegrower({}),
      userData: new User({}),

      selectedItems: [],

      profileApiService: null,
      usersApiService: null,


      isEditPassword: false,
      createAndEditDialogIsVisiblePassword: false,

      createAndEditDialogIsVisible: false,
      isEdit: false,
      submitted: false,
    }
  },


  computed: {
    // Obtiene el userId desde el store de autenticación
    userId() {
      return useAuthenticationStore().currentUserId;
    },
  },


  methods: {

    //#region Utility Methods
    notifySuccessfulAction(message) {
      this.$toast.add({severity: 'success', summary: 'Success', detail: message, life: 4000});
    },
    //#endregion

    onEditItem() {
      this.itemObject.email = this.userData.email;
      this.isEdit = true;
      this.submitted = false;
      this.createAndEditDialogIsVisible = true;
    },

    onEditPassword() {
      this.isEditPassword = true;
      this.submitted = false;
      this.createAndEditDialogIsVisiblePassword = true;
    },



    onCancelRequested() {
      this.createAndEditDialogIsVisible = false;
      this.submitted = false;
      this.isEdit = false;
    },

    onCancelRequestedPassword() {
      this.createAndEditDialogIsVisiblePassword = false;
      this.submitted = false;
      this.isEditPassword = false;

      console.log('==================== onCancelRequestedPassword ====================');
    },

    onSaveRequested(item) {

      console.log('onSaveRequestedManagement', item);

      this.submitted = true;

      this.userData.email = item.email;
      this.itemObject = new Winegrower(item);

      this.createAndEditDialogIsVisible = false;
      this.isEdit = false;

      this.update();
      this.updateUser();

    },


    onSaveRequestedPassword(item){
      console.log('onSaveRequestedPassword', item);

      this.submitted = true;

      this.userData.password = item.password;
      this.createAndEditDialogIsVisiblePassword = false;
      this.isEditPassword = false;

      this.updateUser();
      this.notifySuccessfulAction('Contraseña actualizada correctamente');

      console.log('==================== onSaveRequestedPassword ====================');
    },
    //#endregion

    update() {
      return this.profileApiService.update(this.itemObject.id, this.itemObject)
          .then(response => {
            this.itemObject = new Winegrower(response.data);
            this.notifySuccessfulAction('Perfil actualizado correctamente');
          }).catch(error => {
            console.error("Error updating Profile", error);
          });
    },

    updateUser() {
      return this.usersApiService.update(this.userId, this.userData)
          .then(response => {
            this.userData = new User(response.data);
          }).catch(error => {
            console.error("Error updating User", error);
          });
    },
    //#endregion

    getUser(){
      this.usersApiService.getUserById(this.userId).then(response => {
        this.userData = new User(response.data);
      }).catch(error => {
        console.error("Error getting Profile by ID", error);
      });
    },

    getWinegrowerByUserId() {
      this.profileApiService.getResourceById(this.userId).then(response => {
        this.itemObject = new Winegrower(response.data);
      }).catch(error => {
        console.error("Error getting Profile by ID", error);
      });
    }
  },


  //#region Lifecycle Hooks
  created() {

    this.profileApiService = new ProfileApiServices('/winegrowers');
    this.usersApiService = new UserApiService('/users');

    this.getWinegrowerByUserId();
    this.getUser();

    console.log('==========================================', this.userId);

    console.log("Profiles Management component created");
  }
  //#endregion


}
</script>

<template>

  <pv-toast position="top-right" />

  <div class="page-profile-management flex flex-column w-full h-full align-items-start overflow-auto">

    <div class="flex flex-1 flex-column align-items-center p-4">

      <!-- Perfil del usuario -->
      <img
          :src="itemObject.profilePicture"
          alt="Avatar"
          class="border-circle"
          style="width: 80px; height: 80px"
      />

      <div class="flex flex-column align-items-start mt-3">
        <p><strong>Nombre:</strong> {{itemObject.name}} {{itemObject.lastname}}</p>
        <p><strong>Correo electrónico:</strong> {{userData.email}}</p>
        <p><strong>País:</strong> {{itemObject.country}}</p>
        <p><strong>Celular:</strong> {{itemObject.phoneNumber}}</p>
        <p><strong>Tipo de usuario:</strong> {{itemObject.status}}</p>

      </div>

      <!-- Botones -->
      <div class="flex gap-2 mt-3">
        <pv-button  label="Cambiar contraseña" class="p-button-secondary" @click = "onEditPassword" />
        <pv-button label="Modificar perfil" class="p-button-secondary" @click="onEditItem" />
      </div>

      <profile-edit
          :edit="isEdit"
          :item-entity="itemObject"
          :entity-name="title.singular"
          :visible="createAndEditDialogIsVisible"
          @cancel-requested="onCancelRequested"
          @save-requested="onSaveRequested($event)"
      />

      <update-password
          :edit="isEditPassword"
          :item-entity="userData"
          :entity-name="'Actualizar Contraseña'"
          :visible="createAndEditDialogIsVisiblePassword"
          @cancel-requested="onCancelRequestedPassword"
          @save-requested="onSaveRequestedPassword($event)"
      />

    </div>

  </div>

</template>

<style>

</style>