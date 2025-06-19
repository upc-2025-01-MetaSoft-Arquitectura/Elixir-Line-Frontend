<script>

import CorrectionStageCreateAndEdit from "../components/correction-stage-create-and-edit.vue";
import ReceptionStageCreateAndEdit from "../components/reception-stage-create-and-edit.component.vue";
import {Stages} from "../model/stages.entity.js";
import {StagesApiService} from "../services/stages-api.service.js";
import {PressingStage} from "../model/pressingStage.entity.js";
import FermentationStageCreateAndEdit from "../components/fermentation-stage-create-and-edit.component.vue";
import PressingStageCreateAndEdit from "../components/pressing-stage-create-and-edit.component.vue";

export default {
  name: 'pressing-stage-management',

  components: {
    PressingStageCreateAndEdit,
    FermentationStageCreateAndEdit, CorrectionStageCreateAndEdit, ReceptionStageCreateAndEdit},

  props:{
    item: null,
    canAddStage: false
  },

  data() {
    return {
      title: { singular: 'Etapa de Fermentación', plural: 'Etapa de Fermentación' },
      itemObject: new Stages({}),
      pressingStage: new PressingStage({}),
      pressingStageApiService: null,
      createAndEditDialogIsVisible: false,
      isEdit: false,
      submitted: false,
      stageExist: false, // Assuming you want to check if a stage exists
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
      this.pressingStageApiService.create(this.itemObject).then(response => {

        this.pressingStage = new PressingStage(response.data.pressingStage);
        this.itemObject = new Stages(response.data);

        this.notifySuccessfulAction('Stage created successfully');
      }).catch(error => {
        console.error("Error creating a Stage",error);
      });
    },

    update() {
      this.pressingStageApiService.update(this.itemObject.id, this.itemObject).then(response => {

        this.pressingStage = new PressingStage(response.data.pressingStage);
        this.itemObject= new Stages(response.data);

        this.notifySuccessfulAction('Stage updated successfully');
      }).catch(error => {
        console.error("Error updating a Stage",error);
      });
    },

    //#endregion

  },


  //#region Lifecycle Hooks
  created() {
    this.pressingStageApiService = new StagesApiService ('/stages');

    if (!this.item || !this.item.pressingStage) {

      this.stageExist = false;

    } else {

      this.itemObject = this.item;
      this.stageExist = true;
      this.pressingStage = this.item.pressingStage;

    }

    console.log('RECEPTION STAGE ===================== ', this.pressingStage);

    console.log("🔍 Reception Stage Management created with item:", this.item);
  },

  //#endregion
}

</script>

<template>

  <div class="pressing-container flex flex-column flex-1 w-full h-full gap-3 p-3 surface-ground overflow-auto">

    <!-- Encabezado y botones de acción -->
    <div class="flex flex-wrap justify-content-between align-items-center gap-4 border-bottom-1 surface-border pb-3">

      <!-- Título de la etapa -->
      <div class="flex align-items-center gap-2">
        <i class="pi pi-cog text-xl"></i>
        <h3 class="m-0 text-xl font-medium">Etapa: Prensado</h3>
      </div>

      <!-- Botones de acción -->
      <div class="flex flex-wrap gap-2">
        <pv-button
            label="Nueva Etapa"
            icon="pi pi-plus"
            @click="onNewItem()"
            class="p-button-success"
            v-if="!stageExist && canAddStage"
        />

        <pv-button
            label="Editar"
            icon="pi pi-pencil"
            @click="onEditItem(itemObject)"
            class="p-button-warning"
            v-if="stageExist  && canAddStage"
        />

        <pv-button
            label="Eliminar"
            icon="pi pi-trash"
            @click="onDeleteItem(pressingStage)"
            class="p-button-danger"
            v-if="stageExist  && canAddStage"
        />
      </div>
    </div>

    <!-- Mensaje de aviso si no se puede agregar una nueva etapa -->
    <div v-if="!canAddStage" class="p-3 bg-yellow-100 text-yellow-800 border-round">
      <i class="pi pi-exclamation-triangle"></i>
      <span> No se puede agregar una nueva etapa de PRENSADO hasta que se complete la etapa de FERMENTACIÓN. </span>
    </div>


    <!-- Contenido de la etapa -->
    <pv-card v-if="pressingStage.stage && canAddStage">
      <template #header>
        <h4 class="m-0">Detalles de la etapa de añejamiento</h4>
      </template>

      <!-- contenido de la tarjeta -->
      <template #content>

        <div class="flex align-items-center gap-2">
          <i class="pi pi-user text-lg"></i>
          <p><strong>Registrado por:</strong> {{ pressingStage.registeredBy }}</p>
        </div>

        <div class="grid p-2">
          <div class="col-12 md:col-6">
            <p><strong>Fecha de inicio:</strong> {{ pressingStage.startDate }}</p>
            <p><strong>Fecha de finalización:</strong> {{ pressingStage.endDate }}</p>
            <p><strong>Tipo de prensa:</strong> {{ pressingStage.pressType }}</p>
          </div>
          <div class="col-12 md:col-6">
            <p><strong>Presión de la prensa (Bares):</strong> {{ pressingStage.pressPressureBars }}</p>
            <p><strong>Duración (minutos):</strong> {{ pressingStage.durationMinutes }}</p>
            <p><strong>Pomace (kg):</strong> {{ pressingStage.pomaceKg }}</p>
          </div>
          <div class="col-12 md:col-6">
            <p><strong>Rendimiento (litros):</strong> {{ pressingStage.yieldLiters }}</p>
            <p><strong>Uso del mosto:</strong> {{ pressingStage.mustUsage }}</p>
            <p><strong>Comentarios:</strong> {{ pressingStage.comments }}</p>
          </div>

        </div>

        <!-- Estado de finalización -->
        <div class="flex align-items-center gap-2 mt-4">
          <i class="pi text-xl" :class="pressingStage.isCompleted ? 'pi-check-circle text-green-500' : 'pi-times-circle text-red-500'"></i>
          <span class="text-lg font-medium">{{ pressingStage.isCompleted ? 'Etapa completada' : 'Etapa no completada' }} </span>
        </div>

      </template>

    </pv-card>

    <!-- Diálogo para crear o editar etapa -->
    <pressing-stage-create-and-edit
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