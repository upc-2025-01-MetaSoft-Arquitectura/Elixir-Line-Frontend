<script>

import {batchAndCampaignApiService} from "../services/batch-and-campaign-api.service.js";
import {Campaign} from "../model/campaign.entity.js";
import CampaignCreateAndEdit from "../components/campaign-create-and-edit.vue";
import DataManager from "../../../shared/components/data-manager.component.vue";
import BasePageLayout from "../../../shared/components/base-page-layout.component.vue";
import TabsViewDetails from "../../wine-batch-detail/views/tabs-view-details.component.vue";
import CampaignViewDetails from "../components/campaign-view-details.component.vue";
import {CreateCampaign} from "../model/create-campaign.entity.js";

export default {
  name: "campaigns-management",

  components: {
    CampaignViewDetails,
    TabsViewDetails,
    BasePageLayout,
    DataManager,
    CampaignCreateAndEdit
  },

  data() {
    return {
      title: { singular: 'Campaign', plural: 'Campaigns' },
      arrayItems: [],
      itemObject: new Campaign({}),
      selectedItems: [],
      batchAndCampaignApiService: null,
      createAndEditDialogIsVisible: false,
      isEdit: false,
      submitted: false,

      createItem : new CreateCampaign({}), // Para crear una nueva campaña


      // Para ver detalles de una campaña
      isViewItem: false, // Para ver detalles de una campaña
      viewDetailsDialogIsVisible: false,

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

    //#region Event Handlers
    onNewItem() {
      this.itemObject = new Campaign({});
      this.isEdit = false;
      this.submitted = false;
      this.createAndEditDialogIsVisible = true;
    },

    onEditItem(item) {
      this.itemObject = new Campaign(item);
      this.isEdit = true;
      this.submitted = false;
      this.createAndEditDialogIsVisible = true;
    },

    onViewItem(item) {
      this.itemObject = new Campaign(item);
      this.isViewItem = true;
      this.viewDetailsDialogIsVisible = true;
    },

    onDeleteItem(item) {
      this.itemObject = new Campaign(item);
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

    onCloseDetails(){
      this.viewDetailsDialogIsVisible = false;
      this.isViewItem = false;
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

      this.createItem.name = this.itemObject.name;
      this.createItem.year = this.itemObject.year;
      this.createItem.winegrowerId = this.itemObject.winegrowerId;
      this.createItem.batches = this.itemObject.batches;
      this.createItem.status = this.itemObject.status;
      this.createItem.startDate = this.itemObject.startDate;
      this.createItem.endDate = this.itemObject.endDate;

      this.batchAndCampaignApiService.create(this.createItem).then(response => {
        let newItem = new Campaign(response.data);
        this.arrayItems.push(newItem);
        this.notifySuccessfulAction('Campaign created successfully');
      }).catch(error => {
        console.error("Error creating a Campaign",error);
      });
    },

    update() {
      this.batchAndCampaignApiService.update(this.itemObject.id, this.itemObject).then(response => {
        let index = this.findIndexById(this.itemObject.id);
        this.arrayItems[index] = new Campaign(response.data);
        this.notifySuccessfulAction('campaign updated successfully');
      }).catch(error => {
        console.error("Error updating a campaign",error);
      });
    },

    delete() {
      this.batchAndCampaignApiService.delete(this.itemObject.id).then(() => {
        let index = this.findIndexById(this.itemObject.id);
        this.arrayItems.splice(index, 1);
        this.notifySuccessfulAction('Batch deleted successfully');
      }).catch(error => {
        console.error("Error deleting a campaign",error);
      });
    },

    deleteSelectedItems() {
      this.selectedItems.forEach((variable) => {
        this.batchAndCampaignApiService.delete(variable.id).then(() => {
          this.arrayItems = this.arrayItems.filter((b) => b.id !== variable.id);
        }).catch(error => {
          console.error("Error deleting a campaign", error);
        });
      });

      this.notifySuccessfulAction('campaigns deleted successfully');
    },
    //#endregion

    getAllCampaigns() {

      this.batchAndCampaignApiService.getAllResources().then(response => {

        this.arrayItems = response.data.map(resource => new Campaign(resource));

        console.log('Campañas recuperadas' , this.arrayItems);
      }).catch(error => {
        console.error("Error getting campaigns",error);
      });
    }
  },


  //#region Lifecycle Hooks
  created() {

    this.batchAndCampaignApiService = new batchAndCampaignApiService('/campaigns');
    this.getAllCampaigns();

    console.log("Campaigns Management component created");
  }
  //#endregion

}

</script>

<template>



  <base-page-layout>

    <template #header>

      <div class="flex flex-column w-full gap-4 p-2">

        <div class="flex flex-row justify-content-between align-items-center">
          <h2>{{$t('components.title-campaign')}}</h2>
          <!--<span class="font-bold">{{$t('batch-management.total-campaigns')}} {{ campaignQuantity }}</span>
          -->
        </div>

      </div>


    </template>


    <div class="data-table-container p-2 h-full flex-1 overflow-hidden flex flex-column">

      <data-manager :title="title"
                    v-bind:items="arrayItems"
                    v-bind:label-name="$t('winemaking.button-new-campaign')"
                    v-on:new-item-requested-manager="onNewItem"
                    v-on:edit-item-requested-manager="onEditItem($event)"
                    v-on:view-item-details-requested-manager="onViewItem($event)"
                    v-on:delete-item-requested-manager="onDeleteItem($event)"
                    v-on:delete-selected-items-requested-manager="onDeleteSelectedItems($event)" >

        <!--
          {
          "id": 1,
          "name": "Campaña Vendimia Sur 2025",
          "year": "2025",
          "winegrowerId": 2,
          "batches": 0,
          "status": "NO_INICIADO",
          "startDate": "2025-02-15",
          "endDate": null
          }
         -->

      <template #custom-columns-manager >
          <pv-column
              :sortable="true"
              field="name"
              header="Name"
          />

          <pv-column
              :sortable="true"
              field="year"
              header="Year"
          />

          <pv-column
              :sortable="true"
              field="batches"
              header="Batches Quantity "
          />

          <pv-column
              :sortable="true"
              field="status"
              header="Status"
          />

          <pv-column
              :sortable="true"
              field="startDate"
              header="Start Date"
          />

          <pv-column
              :sortable="true"
              field= "endDate"
              header="End Date"
          />

        </template>
      </data-manager>

      <campaign-create-and-edit
          :edit = "isEdit"
          :item-entity="itemObject"
          :visible="createAndEditDialogIsVisible"
          v-on:cancel-requested="onCancelRequested"
          v-on:save-requested="onSaveRequested($event)">
      </campaign-create-and-edit>

      <campaign-view-details
          :item-entity="itemObject"
          :title="itemObject.name"
          :visible="viewDetailsDialogIsVisible"
          v-on:close-view-details="onCloseDetails">
      </campaign-view-details>


    </div>

  </base-page-layout>

</template>

<style>


</style>