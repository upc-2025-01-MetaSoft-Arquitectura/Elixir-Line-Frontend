<script>


import {WineBatch} from "../model/wine-batch.entity.js";
import BatchesCreateAndEdit from "../components/batches-create-and-edit.component.vue";
import DataManager from "../../../shared/components/data-manager.component.vue";
import {batchAndCampaignApiService} from "../services/batch-and-campaign-api.service.js";
import {Campaign} from "../model/campaign.entity.js";
import BasePageLayout from "../../../shared/components/base-page-layout.component.vue";

export default {
  name: "batch-management",
  components: {
    BasePageLayout,
    DataManager,
    BatchesCreateAndEdit
  },

  data() {
    return {
      title: { singular: 'Batch', plural: 'Batches' },
      batches: [],
      batch: new WineBatch({}),
      selectedBatches: [],
      batchAndCampaignApiService: null,
      createAndEditDialogIsVisible: false,
      isEdit: false,
      submitted: false,


      //============ Datos de campañas y búsqueda ==============
      campaignApiService: null,
      // Datos de la vista
      arrayItems: [], // campañas completas
      selectedItem: null, // campaña seleccionada (objeto)
      filteredItems: []   // campañas filtradas (objetos)
    }
  },



  methods: {

    //#region Utility Methods
    notifySuccessfulAction(message) {
      this.$toast.add({severity: 'success', summary: 'Success', detail: message, life: 3000});
    },

    findIndexById(id) {
      return this.batches.findIndex(batch => batch.id === id);
    },
    //#endregion

    //#region Event Handlers
    onNewItem() {
      this.batch = new WineBatch({});
      this.isEdit = false;
      this.submitted = false;
      this.createAndEditDialogIsVisible = true;
    },

    onEditItem(item) {
      this.batch = new WineBatch(item);
      this.isEdit = true;
      this.submitted = false;
      this.createAndEditDialogIsVisible = true;
    },

    onDeleteItem(item) {
      this.batch = new WineBatch(item);
      this.deleteBatch();
    },

    onDeleteSelectedItems(selectedItems) {
      this.selectedBatches = selectedItems;
      this.deleteSelectedBatches();
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
        this.updateBatch();
      } else {
        this.createBatch();
      }

      this.createAndEditDialogIsVisible = false;
      this.isEdit = false;
    },
    //#endregion

    //#region CRUD Operations
    createBatch() {
      this.batchAndCampaignApiService.create(this.batch).then(response => {
        let newBatch = new WineBatch(response.data);
        this.batches.push(newBatch);
        this.notifySuccessfulAction('Batch created successfully');
      }).catch(error => {
        console.error("Error creating a batch",error);
      });
    },

    updateBatch() {
      this.batchAndCampaignApiService.update(this.batch.id, this.batch).then(response => {
        let index = this.findIndexById(this.batch.id);
        this.batches[index] = new WineBatch(response.data);
        this.notifySuccessfulAction('Batch updated successfully');
      }).catch(error => {
        console.error("Error updating a batch",error);
      });
    },

    deleteBatch() {
      this.batchAndCampaignApiService.delete(this.batch.id).then(() => {
        let index = this.findIndexById(this.batch.id);
        this.batches.splice(index, 1);
        this.notifySuccessfulAction('Batch deleted successfully');
      }).catch(error => {
        console.error("Error deleting a batch",error);
      });
    },

    deleteSelectedBatches() {
      this.selectedBatches.forEach((variable) => {
        this.batchAndCampaignApiService.delete(variable.id).then(() => {
          this.batches = this.batches.filter((b) => b.id !== variable.id);
        }).catch(error => {
          console.error("Error deleting a batch", error);
        });
      });

      this.notifySuccessfulAction('Batches deleted successfully');
    },
    //#endregion

    getAllBatches() {

      this.batchAndCampaignApiService.getAllResources().then(response => {

        this.batches = response.data.map(batch => new WineBatch(batch));

        console.log("Batch resources", this.batches);
      }).catch(error => {
        console.error("Error getting batches",error);
      });
    },



    getAllCampaigns(){
      this.campaignApiService.getAllResources()
          .then(response => {

            this.arrayItems = response.data.map(resource => new Campaign(resource));

            console.log( 'Campañas recuperadas' ,this.arrayItems);
          })
          .catch(error => {
            console.error("Error fetching data:", error);
          });
    },

    searchCampaign(event) {

      const query = event.query.toLowerCase();

      this.filteredItems = this.arrayItems.filter(item =>
          item.name.toLowerCase().includes(query)
      );
    },

    onSelect(event) {
      this.selectedItem = event.value;
      console.log("🟢 Campaña seleccionada:", this.selectedItem);
    },

    onEnter() {
      if (this.selectedItem && this.selectedItem.name) {
        console.log("Enter presionado, campaña:", this.selectedItem);
        // Aquí puedes llamar a la misma lógica que quieras ejecutar al seleccionar
        this.onSelect({ value: this.selectedItem });
      } else {
        console.warn("No hay campaña válida seleccionada.");
      }
    }

  },

  computed: {
    campaignQuantity() {
      return this.arrayItems.length ? this.arrayItems.length : 0;
    }
  },

  //#region Lifecycle Hooks
  created() {
    this.batchAndCampaignApiService = new batchAndCampaignApiService('/wine-batches');
    this.campaignApiService = new batchAndCampaignApiService('/campaigns');

    this.getAllBatches();
    this.getAllCampaigns();


    console.log('Batch Management component created');
  }
  //#endregion

}
</script>

<template>


  <base-page-layout>

    <template #header>

      <div class="flex flex-column w-full gap-4 p-2">

        <div class="flex flex-row justify-content-between align-items-center">
          <h2 class="m-0">Gestión de Lotes por Campaña</h2>
          <span class="font-bold">Total de campañas: {{ campaignQuantity }}</span>
        </div>

        <!-- Buscar y Filtrar Campaign -->
        <div class="flex w-full align-items-start">

          <pv-auto-complete
              class="w-full"
              v-model="selectedItem"
              :suggestions="filteredItems"
              option-label="name"
              placeholder="Ingresa el nombre de la campaña"
              @complete="searchCampaign"
              @select="onSelect"
              @keydown.enter="onEnter"
              :dropdown="true"
              :force-selection="true"
              aria-label="Ingresa el nombre de la campaña"
          />

        </div>

      </div>

    </template>


    <div class="data-table-container p-2 h-full flex-1 overflow-hidden flex flex-column">

      <data-manager :title="title"
                    v-bind:items="batches"
                    v-bind:label-name="$t('winemaking.button-new-batch')"
                    v-on:new-item-requested-manager="onNewItem"
                    v-on:edit-item-requested-manager="onEditItem($event)"
                    v-on:delete-item-requested-manager="onDeleteItem($event)"
                    v-on:delete-selected-items-requested-manager="onDeleteSelectedItems($event)" >

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

      <batches-create-and-edit
          :edit = "isEdit"
          :item-entity="batch"
          :visible="createAndEditDialogIsVisible"
          v-on:cancel-requested="onCancelRequested"
          v-on:save-requested="onSaveRequested($event)">
      </batches-create-and-edit>

    </div>

  </base-page-layout>

</template>

<style>


.p-datatable-column-header-content {
  font-size: 0.85rem;
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
  font-size: 0.75rem;
  font-weight: 400;
  text-align: center;
}

</style>