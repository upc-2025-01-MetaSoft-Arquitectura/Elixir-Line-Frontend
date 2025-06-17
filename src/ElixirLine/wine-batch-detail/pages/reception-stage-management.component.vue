<script>

import CampaignCreateAndEdit from "../../winemaking-process/components/campaign-create-and-edit.vue";
import DataManager from "../../../shared/components/data-manager.component.vue";
import {StagesApiService} from "../services/stages-api.service.js";
import {Stages} from "../model/stages.entity.js";
import ReceptionStageCreateAndEdit from "../components/reception-stage-create-and-edit.component.vue";
import {ReceptionStage} from "../model/receptionStage.entity.js";

export default {
  name: 'reception-stage-management',

  components: {ReceptionStageCreateAndEdit, DataManager, CampaignCreateAndEdit},

  props:{
    item: {
      type: Object,
      default: () => ({})
    }
  },

  data() {
    return {
      title: { singular: 'Etapa de Recepción', plural: 'Etapa de Recepción' },
      itemObject: new Stages({}),
      receptionStage: new ReceptionStage({}),
      receptionStageApiService: null,
      createAndEditDialogIsVisible: false,
      isEdit: false,
      submitted: false,
      stageExist: false,
    }
  },



  methods: {

    //#region Utility Methods
    notifySuccessfulAction(message) {
      this.$toast.add({severity: 'success', summary: 'Success', detail: message, life: 3000});
    },

    //#region Event Handlers
    onNewItem() {
      this.itemObject = new Stages({});
      console.log('======================= NEW ITEM MANAGEMENT', this.itemObject);
      this.isEdit = false;
      this.submitted = false;
      this.createAndEditDialogIsVisible = true;
    },

    onEditItem(item) {
      console.log('======================= EDIT ITEM MANAGEMENT', item);
      this.itemObject = new Stages(item);
      this.isEdit = true;
      this.submitted = false;
      this.createAndEditDialogIsVisible = true;
    },

    onDeleteItem(item) {
      this.itemObject = new Stages(item);
      this.deleteBatch();
    },

    onCancelRequested() {
      this.createAndEditDialogIsVisible = false;
      this.submitted = false;
      this.isEdit = false;
    },

    onSaveRequested(item) {

      console.log('onSaveRequestedManagement', item);

      this.submitted = true;
      this.createAndEditDialogIsVisible = false;
      this.isEdit = false;

      if (item.id) {
        this.update();
      } else {
        this.create();
      }

    },
    //#endregion

    //#region CRUD Operations
    create() {
      this.receptionStageApiService.create(this.itemObject).then(response => {

        this.receptionStage = new ReceptionStage(response.data.receptionStage);
        this.itemObject = new Stages(response.data);

        this.notifySuccessfulAction('Stage created successfully');
      }).catch(error => {
        console.error("Error creating a Stage",error);
      });
    },

    update() {
      this.receptionStageApiService.update(this.itemObject.id, this.itemObject).then(response => {

        this.receptionStage = new ReceptionStage(response.data.receptionStage);
        this.itemObject= new Stages(response.data);

        this.notifySuccessfulAction('Stage updated successfully');
      }).catch(error => {
        console.error("Error updating a Stage",error);
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

  },


  //#region Lifecycle Hooks
  created() {
    this.receptionStageApiService = new StagesApiService ('/stages');


    if (!this.item || !this.item.receptionStage) {

      this.stageExist = false;

    } else {

      this.itemObject = this.item;
      this.stageExist = true;
      this.receptionStage = this.item.receptionStage;

    }

    console.log('RECEPTION STAGE ===================== ', this.receptionStage);

    console.log("Reception Stage Management component created");
  },
  //#endregion


}
</script>

<template>

  <div class="reception-container flex flex-column flex-1 w-full h-full gap-3 p-3 surface-ground overflow-auto">

    <!-- Encabezado y botones de acción -->
    <div class="flex flex-wrap justify-content-between align-items-center gap-4 border-bottom-1 surface-border pb-3">

      <!-- Título de la etapa -->
      <div class="flex align-items-center gap-2">
        <i class="pi pi-cog text-xl"></i>
        <h3 class="m-0 text-xl font-medium"> Etapa: Recepción </h3>
      </div>

      <!-- Botones de acción -->
      <div class="flex flex-wrap gap-2">
        <pv-button
            label="Nueva Etapa"
            icon="pi pi-plus"
            @click="onNewItem"
            class="p-button-success"
            v-if="!stageExist"
        />

        <pv-button
            label="Editar"
            icon="pi pi-pencil"
            @click="onEditItem(itemObject)"
            class="p-button-warning"
            v-if="stageExist"
        />

        <pv-button
            label="Eliminar"
            icon="pi pi-trash"
            @click="onDeleteItem(receptionStage)"
            class="p-button-danger"
            v-if="stageExist"
        />
      </div>
    </div>

    <!-- Tarjeta con detalles -->
    <pv-card v-if="receptionStage.stage">
      <template #header>
        <h4 class="m-0">Detalles de la etapa de recepción</h4>
      </template>

      <template #content>

        <div class="flex align-items-center gap-2">
          <i class="pi pi-user text-lg"></i>
          <p><strong>Registrado por:</strong> {{ receptionStage.registeredBy }}</p>
        </div>

        <div class="grid p-2">
          <div class="col-12 md:col-6">
            <p><strong>Fecha:</strong> {{ receptionStage.startDate }}</p>
            <p><strong>Temperatura:</strong> {{ receptionStage.temperature }} °C</p>
            <p><strong>pH:</strong> {{ receptionStage.pH }}</p>
          </div>
          <div class="col-12 md:col-6">
            <p><strong>Brix:</strong> {{ receptionStage.sugarLevelBrix }}</p>
            <p><strong>Cantidad (kg):</strong> {{ receptionStage.quantityKg }}</p>
            <p><strong>Comentarios:</strong> {{ receptionStage.comments }}</p>
          </div>
        </div>

        <!-- Estado de finalización -->
        <div class="flex align-items-center gap-2 mt-4">
          <i class="pi text-xl" :class="receptionStage.isCompleted ? 'pi-check-circle text-green-500' : 'pi-times-circle text-red-500'"></i>
          <span class="text-lg font-medium">{{ receptionStage.isCompleted ? 'Etapa completada' : 'Etapa no completada' }} </span>
        </div>


      </template>
    </pv-card>

    <!-- Diálogo para crear o editar etapa -->
    <reception-stage-create-and-edit
        :edit="isEdit"
        :item-entity="itemObject"
        :visible="createAndEditDialogIsVisible"
        @cancel-requested="onCancelRequested"
        @save-requested="onSaveRequested($event)"
    />
  </div>


</template>

<style>

</style>