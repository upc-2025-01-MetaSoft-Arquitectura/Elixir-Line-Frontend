<script>

import {batchAndCampaignApiService} from "../services/batch-and-campaign-api.service.js";
import {Campaign} from "../model/campaign.entity.js";
import CampaignCreateAndEdit from "../components/campaign-create-and-edit.vue";
import DataManager from "../../../shared/components/data-manager.component.vue";

export default {
  name: "campaigns-management",

  components: {
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

    onDeleteItem(item) {
      this.itemObject = new Campaign(item);
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
      this.batchAndCampaignApiService.create(this.itemObject).then(response => {
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
        console.log("Campaigns response", response.data);

        this.arrayItems = response.data.map(resource => new Campaign(resource));

        console.log("Campaigns resources", this.arrayItems);
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


  <div class="campaigns-container flex flex-column flex-1 w-full h-full overflow-hidden">


    <div class="header-container w-full border-bottom-1 border-300">
      <h2>{{$t('components.title-campaign')}}</h2>
    </div>


    <div class="data-table-container pt-2 h-full flex-1 overflow-hidden flex flex-column">
      <data-manager :title="title"
                    v-bind:items="arrayItems"
                    v-bind:label-name="$t('winemaking.button-new-campaign')"
                    v-on:new-item-requested-manager="onNewItem"
                    v-on:edit-item-requested-manager="onEditItem($event)"
                    v-on:delete-item-requested-manager="onDeleteItem($event)"
                    v-on:delete-selected-items-requested-manager="onDeleteSelectedItems($event)">

        <template #custom-columns-manager >
          <pv-column
              :sortable="true"
              field="name"
              header="Name"
          />

          <pv-column
              :sortable="true"
              field="createdBy"
              header="Created By"
          />

          <pv-column
              :sortable="true"
              field="startDate"
              header="Start Date"
          />

          <pv-column
              :sortable="true"
              field="endDate"
              header="End Date"
          />

          <pv-column
              :sortable="true"
              field="batchesQuantity"
              header="Batches Quantity"
          />

          <pv-column
              :sortable="true"
              field="status"
              header="Status"
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
    </div>

  </div>

</template>

<style>


</style>