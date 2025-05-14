<script>
import SupplyCreateAndEdit from "../components/supply-create-and-edit.component.vue";
import DataManager from "../../../shared/components/data-manager.component.vue";
import {supplyApiService} from "../services/supply-api.service.js";
import {Supply} from "../model/supply.entity.js";
import slotProps from "@primevue/core/baseeditableholder";

export default {
  name: "supply-management",
  computed: {
    slotProps() {
      return slotProps
    }
  },


  components: {
    DataManager,
    SupplyCreateAndEdit

  },

  data() {
    return {
      title: { singular: 'Supply', plural: 'Supplies' },
      arrayItems: [],
      itemObject: new Supply({}),
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
      this.batchAndCampaignApiService.create(this.itemObject).then(response => {
        let newItem = new Supply(response.data);
        this.arrayItems.push(newItem);
        this.notifySuccessfulAction('Campaign created successfully');
      }).catch(error => {
        console.error("Error creating a Campaign",error);
      });
    },

    update() {
      this.batchAndCampaignApiService.update(this.itemObject.id, this.itemObject).then(response => {
        let index = this.findIndexById(this.itemObject.id);
        this.arrayItems[index] = new Supply(response.data);
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

    getAllSupplies() {

      this.batchAndCampaignApiService.getAllResources().then(response => {
        console.log("Campaigns response", response.data);

        this.arrayItems = response.data.map(resource => new Supply(resource));

        console.log("Campaigns resources", this.arrayItems);
      }).catch(error => {
        console.error("Error getting campaigns",error);
      });
    }
  },


  //#region Lifecycle Hooks
  created() {

    this.batchAndCampaignApiService = new supplyApiService('/supplies');
    this.getAllSupplies();

    console.log("Campaigns Management component created");
  }
  //#endregion

}

</script>

<template>


  <div class="page-container p-2 flex flex-column h-full w-full overflow-hidden">

    <div class="header-container w-full">
      <h2>{{$t('components.title-supply')}}</h2>
    </div>


    <data-manager
                  :title="title"
                  v-bind:items="arrayItems"
                  v-bind:label-name="$t('supplies.button-new-supply')"
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

  </div>

</template>

<style>

.page-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  overflow: hidden;
}

</style>