<script>


import {WineBatch} from "../model/wine-batch.entity.js";
import BatchesCreateAndEdit from "../components/batches-create-and-edit.component.vue";
import DataManager from "../../../shared/components/data-manager.component.vue";
import {batchAndCampaignApiService} from "../services/batch-and-campaign-api.service.js";
import {Campaign} from "../model/campaign.entity.js";
import BasePageLayout from "../../../shared/components/base-page-layout.component.vue";
import BatchViewDetails from "../../wine-batch-detail/pages/bacth-view-detail.component.vue";
import TabsViewDetails from "../../wine-batch-detail/views/tabs-view-details.component.vue";

export default {
  name: "batch-management",
  components: {
    TabsViewDetails,
    BatchViewDetails,
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

      // Para ver detalles de un lote
      isViewItem: false, // Para ver detalles de un lote
      viewDetailsDialogIsVisible: false,

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

    onViewItem(item) {
      this.batch = new WineBatch(item);
      this.isViewItem = true;
      this.viewDetailsDialogIsVisible = true;
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

    onCloseDetails(){
      this.viewDetailsDialogIsVisible = false;
      this.isViewItem = false;
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

    /*
    getAllBatches() {

      this.batchAndCampaignApiService.getAllResources().then(response => {

        this.batches = response.data.map(batch => new WineBatch(batch));

        console.log("Batch resources", this.batches);
      }).catch(error => {
        console.error("Error getting batches",error);
      });
    },

    */


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

    getBatchesByCampaign(campaignId) {
      this.batchAndCampaignApiService.getResourcesByCampaignId(campaignId)
          .then(response => {
            this.batches = response.data.map(batch => new WineBatch(batch));
            console.log("Batches for campaign", this.batches);
          })
          .catch(error => {
            console.error("Error getting batches by campaign", error);
          });
    },

    searchCampaign(event) {

      // Limpiar lotes y selección al buscar
      this.batches = []; // Limpiar lotes al buscar
      this.selectedItem = null; // Limpiar selección al buscar

      const query = event.query.toLowerCase();

      this.filteredItems = this.arrayItems.filter(item =>
          item.name.toLowerCase().includes(query)
      );


    },

    onSelect(event) {
      this.batches = []; // Limpiar lotes antes de cargar los nuevos

      this.selectedItem = event.value;
      console.log("🟢 Campaña seleccionada:", this.selectedItem);

      this.batches = []; // Limpiar lotes antes de cargar los nuevos
      this.getBatchesByCampaign(this.selectedItem.id)
    },

    onEnter() {

      this.batches = []; // Limpiar lotes antes de cargar los nuevos

      if (this.selectedItem && this.selectedItem.name) {
        console.log("Enter presionado, campaña:", this.selectedItem);
        // Aquí puedes llamar a la misma lógica que quieras ejecutar al seleccionar
        this.onSelect({ value: this.selectedItem });
      } else {
        console.warn("No hay campaña válida seleccionada.");
      }

      this.batches = []; // Limpiar lotes antes de cargar los nuevos
      this.getBatchesByCampaign(this.selectedItem.id)
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

    //this.getAllBatches();
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
          <h2 class="m-0">{{$t('batch-management.title')}}</h2>
          <span class="font-bold">{{$t('batch-management.total-campaigns')}} {{ campaignQuantity }}</span>
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


    <div v-if="batches && batches.length > 0" class="data-table-container p-2 h-full flex-1 overflow-hidden flex flex-column">

      <data-manager :title="title"
                    v-bind:items="batches"
                    v-bind:label-name="$t('winemaking.button-new-batch')"
                    v-on:new-item-requested-manager="onNewItem"
                    v-on:edit-item-requested-manager="onEditItem($event)"
                    v-on:view-item-details-requested-manager="onViewItem($event)"
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
              field="harvestCampaign"
              header="Campaign"
          />

          <pv-column
              :sortable="true"
              field="currentStage"
              header="Stage"
              class=""
          />

          <!--Quiero que el color de fondo de texto sea diferente de acuerdo al Estado del lote-->
          <pv-column :sortable="true"
                     header="status">

              <template #body="slotProps">
                <span :style="{ backgroundColor: slotProps.data.status === 'No iniciado' ? '#708090' :
                                slotProps.data.status === 'En proceso' ? '#3978DE' :
                                slotProps.data.status === 'Finalizado' ? '#32CD32' :
                                slotProps.data.status === 'Archivado' ? '#B47D6C' : '#9b9b9b',
                padding: '0.2rem', borderRadius: '0.2rem', color: 'white', fontWeight: 'bold',
              }"
                >
                  {{ slotProps.data.status }}
                </span>
              </template>


          </pv-column>


          <!-- La barra de progreso es color #e0e0e0 de fondo y el avance es color #2ecc71 -->
          <pv-column :sortable="true"
                     header="Progress">
            <template #body="slotProps">
              <pv-progress-bar
                  :value="slotProps.data.progress"
                  :showValue="true"
                  :style="{ backgroundColor: '#D9D9D9' }"
                  class="custom-progress-bar"
              />
            </template>
          </pv-column>



        </template>
      </data-manager>

      <batches-create-and-edit
          :edit = "isEdit"
          :item-entity="batch"
          :visible="createAndEditDialogIsVisible"
          v-on:cancel-requested="onCancelRequested"
          v-on:save-requested="onSaveRequested($event)">
      </batches-create-and-edit>

      <tabs-view-details
          :item-entity="batch"
          :title="`${batch.internalCode} - ${batch.harvestCampaign}`"
          :visible="viewDetailsDialogIsVisible"
          v-on:close-tabs-view-details="onCloseDetails">
      </tabs-view-details>

    </div>


    <!-- Mostrar mensaje si batches está vacío o nulo -->
    <div v-else class="p-4 text-center text-gray-600">
      {{ $t('winemaking.batches-not-found') }}
    </div>

  </base-page-layout>

</template>

<style>

.custom-progress-bar .p-progressbar-value {
  background-color: #708090; /* color del avance */
  border-radius: 0;
}

.custom-progress-bar .p-progressbar-label {
  color: black;
  font-weight: bold;
}


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