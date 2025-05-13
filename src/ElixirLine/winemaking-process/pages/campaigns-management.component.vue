<script>

import DataManager from "../../../shared/components/data-manager.component.vue";
import {batchAndCampaignApiService} from "../services/batch-and-campaign-api.service.js";
import {Campaign} from "../model/campaign.entity.js";
import BatchesCreateAndEdit from "../components/batches-create-and-edit.component.vue";
import CampaignCreateAndEdit from "../components/campaign-create-and-edit.vue";

export default {
  name: "campaigns-management",

  components: {
    CampaignCreateAndEdit,
    DataManager,
    BatchesCreateAndEdit
  },

  props: {
    campanaId: {
      type: Number,
      required: true
    }
  },

  data() {
    return {
      title: { singular: 'Batch', plural: 'Batches' },
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
      return this.arrayItems.findIndex(batch => batch.id === id);
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
    createBatch() {
      this.batchAndCampaignApiService.create(this.batch).then(response => {
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
        this.arrayItems = response.data.map(item => new Campaign(item));

        console.log("Batch resources", this.arrayItems);
      }).catch(error => {
        console.error("Error getting campaigns",error);
      });
    }
  },



  //#region Lifecycle Hooks
  created() {
    this.batchAndCampaignApiService = new batchAndCampaignApiService('/campaigns');

    this.getAllCampaigns();
    console.log('Campaign Management component created');
  }
  //#endregion

}

</script>

<template>


  <div>

    <data-manager :title="title"
                  v-bind:items="arrayItems"
                  v-on:new-item-requested-manager="onNewItem"
                  v-on:edit-item-requested-manager="onEditItem($event)"
                  v-on:delete-item-requested-manager="onDeleteItem($event)"
                  v-on:delete-selected-items-requested-manager="onDeleteSelectedItems($event)">

      <template #custom-columns-manager >
        <!--
        <pv-column
            :sortable="true"
            field="id"
            header="Id"
        />
        -->
        <pv-column
            :sortable="true"
            field="internalCode"
            header="Code"
        />

        <pv-column
            :sortable="true"
            field="receptionDate"
            header="Reception"
        />

        <pv-column
            :sortable="true"
            field="harvestCampaign"
            header="Campaign"
        />

        <pv-column
            :sortable="true"
            field="vineyardOrigin"
            header="Vineyard"
        />

        <pv-column
            :sortable="true"
            field="grapeVariety"
            header="Grape Variety"
        />

        <pv-column
            :sortable="true"
            field="initialGrapeQuantityKg"
            header="Quantity Kg"
        />

        <pv-column
            :sortable="true"
            field="createdBy"
            header="Created By"
        />

        <pv-column
            :sortable="true"
            field="status"
            header="Status"
        />

        <pv-column
            :sortable="true"
            field="currentStage"
            header="Stage"
        />

      </template>
    </data-manager>

    <campaign-create-and-edit
        :edit = "isEdit"
        :item="itemObject"
        :visible="createAndEditDialogIsVisible"
        v-on:cancel-requested="onCancelRequested"
        v-on:save-requested="onSaveRequested($event)">
    </campaign-create-and-edit>

  </div>

</template>

<style scoped>

</style>