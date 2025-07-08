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
      this.deleteBatch();
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

      console.log('onSaveRequestedManagement', item);

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
      this.supplyApiService.create(this.itemObject).then(response => {
        let newItem = new Supply(response.data);
        this.arrayItems.push(newItem);
        this.notifySuccessfulAction('Campaign created successfully');
      }).catch(error => {
        console.error("Error creating a Campaign",error);
      });
    },

    update() {
      this.supplyApiService.update(this.itemObject.id, this.itemObject).then(response => {
        let index = this.findIndexById(this.itemObject.id);
        this.arrayItems[index] = new Supply(response.data);
        this.notifySuccessfulAction('campaign updated successfully');
      }).catch(error => {
        console.error("Error updating a campaign",error);
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
      const winegrower = this.findWinegrowerByUserId(this.userId);
      console.log("=== VINICULTOR EN USO ====", this.userId, winegrower);
      if (!winegrower) {
        console.warn("No winegrower found for userId:", this.userId);
        return;
      }

      this.supplyApiService.getAllResources(winegrower.id)
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
            field="unidad"
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