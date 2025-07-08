<script>
import SupplyCreateAndEdit from "../components/supply-create-and-edit.component.vue";
import DataManager from "../../../shared/components/data-manager.component.vue";
import {Supply} from "../model/supply.entity.js";
import BasePageLayout from "../../../shared/components/base-page-layout.component.vue";
import {SupplyApiService} from "../services/supply-api.service.js";
import {WinegrowerApiService} from "../../employee-management/services/winegrower-api.service.js";
import {Winegrower} from "../../employee-management/model/winegrower.entity.js";
import {useAuthenticationStore} from "../../security/services/authentication.store.js";

export default {
  name: "supply-management",


  components: {
    BasePageLayout,
    DataManager,
    SupplyCreateAndEdit

  },

  data() {
    return {
      title: { singular: 'Supply', plural: 'Supplies' },

      arrayItems: [],

      itemObject: new Supply({}),
      itemWinegrower: new Winegrower({}),

      selectedItems: [],

      arrayWinegrowers: [],

      supplyApiService: null,

      winegrowerApiService: null,

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
      this.$toast.add({severity: 'success', summary: 'Success', detail: message, life: 3000});
    },

    findIndexById(id) {
      return this.arrayItems.findIndex(item => item.id === id);
    },
    //#endregion

    //#region Event Handlers
    onNewItem() {
      this.itemObject = new Supply({});
      this.isEdit = false;
      this.submitted = false;
      this.createAndEditDialogIsVisible = true;
    },

    onEditItem(item) {
      this.itemObject = new Supply(item);
      this.isEdit = true;
      this.submitted = false;
      this.createAndEditDialogIsVisible = true;
    },

    onDeleteItem(item) {
      this.itemObject = new Supply(item);
      this.delete();
    },

    onDeleteSelectedItems(selectedItems) {
      this.selectedItems = selectedItems;
      this.deleteSelectedItems();
    },

    onCancelRequested() {
      this.createAndEditDialogIsVisible = false;
      this.submitted = false;
      this.isEdit = false;
    },

    onSaveRequested(item) {
      this.itemObject = new Supply(item);
      this.itemObject.winegrowerId = this.itemWinegrower.id; // Asignar el vinicultor actual

      console.log('=== DATO DE SUPPLY QUE SE VA A GUARDAR O CREAR ===', this.itemObject);

      this.submitted = true;

      if (item.id) {
        this.update();
      } else {
        this.create();
      }

      this.createAndEditDialogIsVisible = false;
      this.isEdit = false;
    },
    //#endregion

    //#region CRUD Operations
    create() {
      const winegrower = this.findWinegrowerByUserId(this.userId);
      if (!winegrower) {
        console.error("❌ No se encontró el vinicultor para este usuario");
        return;
      }

      const payload = {
        winegrowerId: winegrower.id,
        name:         this.itemObject.name,
        description:  this.itemObject.description,
        quantity:     this.itemObject.quantity,
        unit:         this.itemObject.unit
      };

      const formData = new FormData();

      formData.append(
          'input',
          new Blob([JSON.stringify(payload)], { type: 'application/json' })
      );

      if (this.itemObject.image instanceof File) {
        formData.append('image', this.itemObject.image);
      }

      // Debug: no mostramos headers, solo confirmamos que es FormData
      console.log('Enviando FormData con JSON+imagen');

      this.supplyApiService.create(formData)
          .then(res => {
            this.arrayItems.push(new Supply(res.data));
            this.notifySuccessfulAction('Supply created successfully');
            this.createAndEditDialogIsVisible = false;
            this.isEdit = false;
          })
          .catch(err => {
            console.error("Error creating supply:", err);
            console.error("🔴 Details:", err.response?.data);
          });
    },

    update() {
      const formData = new FormData();


      formData.append('id', this.itemObject.id);
      formData.append('winegrowerId', this.itemWinegrower.id);
      formData.append('name', this.itemObject.name);
      formData.append('description', this.itemObject.description);
      formData.append('quantity', this.itemObject.quantity);
      formData.append('unit', this.itemObject.unit);
      if (this.itemObject.image instanceof File) {
        formData.append('image', this.itemObject.image);
      }

      console.log('======= ENVIANDO DATOS ACTUALIZADOS =======');
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }

      this.supplyApiService.update(this.itemObject.id ,formData).then(response => {
        let index = this.findIndexById(this.itemObject.id);
        if (index !== -1) {
          this.arrayItems[index] = new Supply(response.data);
          this.notifySuccessfulAction('Supply updated successfully');
        } else {
          console.warn("Item not found for update:", this.itemObject.id);
        }
      }).catch(error => {
        console.error("Error updating supply", error);
      });




    },


    delete() {
      this.supplyApiService.delete(this.itemObject.id).then(() => {
        let index = this.findIndexById(this.itemObject.id);
        this.arrayItems.splice(index, 1);
        this.notifySuccessfulAction('Batch deleted successfully');
      }).catch(error => {
        console.error("Error deleting a campaign",error);
      });
    },

    deleteSelectedItems() {
      this.selectedItems.forEach((variable) => {
        this.supplyApiService.delete(variable.id).then(() => {
          this.arrayItems = this.arrayItems.filter((b) => b.id !== variable.id);
        }).catch(error => {
          console.error("Error deleting a campaign", error);
        });
      });

      this.notifySuccessfulAction('campaigns deleted successfully');
    },
    //#endregion

    // Recupera el vinicultor asociado a un userId específico
    findWinegrowerByUserId(userId) {
      return this.arrayWinegrowers.find(winegrower => winegrower.userId === userId);
    },

    // Obtiene todos los vinicultores
    getAllWinegrower() {
      return this.winegrowerApiService.getAllWinegrowers()
          .then(response => {
            this.arrayWinegrowers = response.data.map(item => new Winegrower(item));
            console.log("=== VINICULTORES RECUPERADOS: ===", this.arrayWinegrowers);
          })
          .catch(error => {
            console.error("Error fetching winegrowers", error);

          });
    },

    // Obtiene los insumos asociados al vinicultor del usuario
    getAllSupplies() {
      this.itemWinegrower = new Winegrower(this.findWinegrowerByUserId(this.userId));
      console.log("=== VINICULTOR EN USO ====", this.userId, this.itemWinegrower);
      if (!this.itemWinegrower) {
        console.warn("No winegrower found for userId:", this.userId);
        return;
      }

      this.supplyApiService.getAllResources(this.itemWinegrower.id)
          .then(response => {
            this.arrayItems = response.data.map(resource => new Supply(resource));
            console.log("Campaigns resources", this.arrayItems);

            this.$toast.add({
              severity: 'success',
              summary: 'Insumos cargados',
              detail: `${this.arrayItems.length} insumo(s) encontrados.`,
              life: 3000
            });
          })
          .catch(error => {
            console.error("Error getting supplies", error);
            this.$toast.add({
              severity: 'error',
              summary: 'Error al cargar insumos',
              detail: 'No se pudieron obtener los insumos.',
              life: 3000
            });
          });
    },
  },


  //#region Lifecycle Hooks
  created: async function () {
    this.supplyApiService = new SupplyApiService('/inputs');
    this.winegrowerApiService = new WinegrowerApiService('/winegrowers');

    await this.getAllWinegrower();
    this.getAllSupplies();

    console.log("Campaigns Management component created");
  },

  //#endregion

}

</script>

<template>

  <!-- Mostrar mensajes de notificaciones -->
  <pv-toast position="top-right" />

  <base-page-layout>

    <template #header>
      <h2>{{$t('components.title-supply')}}</h2>
    </template>

    <data-manager
        :title="title"
        v-bind:items="arrayItems"
        v-bind:label-name="$t('supplies.button-new-supply')"
        v-on:new-item-requested-manager="onNewItem"
        v-on:edit-item-requested-manager="onEditItem($event)"
        v-on:delete-item-requested-manager="onDeleteItem($event)"
        v-on:delete-selected-items-requested-manager="onDeleteSelectedItems($event)">

      <template #custom-columns-manager>

        <pv-column
            :sortable="true"
            field="name"
            header="Name"
        />

        <pv-column
            :sortable="true"
            field="quantity"
            header="Quantity"
        />

        <pv-column
            :sortable="true"
            field="unit"
            header="Unidad"
        />

        <!-- Imagen en la última columna -->
        <pv-column header="Image">
          <template #body="slotProps">
            <img
                :src="`${slotProps.data.image}`"
                :alt="slotProps.data.name"
                style="width: 48px; height: 48px; object-fit: contain"
            />
          </template>
        </pv-column>

      </template>
    </data-manager>


    <supply-create-and-edit
        :edit = "isEdit"
        :item-entity="itemObject"
        :visible="createAndEditDialogIsVisible"
        v-on:cancel-requested="onCancelRequested"
        v-on:save-requested="onSaveRequested($event)">
    </supply-create-and-edit>


  </base-page-layout>

</template>

<style>



</style>