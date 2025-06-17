<script>

import {Stages} from "../model/stages.entity.js";
import {AgingStage} from "../model/agingStage.entity.js";
import {StagesApiService} from "../services/stages-api.service.js";
import ClarificationStageCreateAndEdit from "../components/clarification-stage-create-and-edit.component.vue";
import AgingStageDetailCreateAndEdit from "../components/aging-stage-create-and-edit.component.vue";

export default {
  name: 'aging-stage-management',

  components: {AgingStageDetailCreateAndEdit, ClarificationStageCreateAndEdit},

  props:{
    item: null
  },

  data() {
    return {
      title: { singular: 'Etapa de Fermentación', plural: 'Etapa de Fermentación' },
      itemObject: new Stages({}),
      agingStage: new AgingStage({}),
      agingStageApiService: null,
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
      this.agingStageApiService.create(this.itemObject).then(response => {

        this.agingStage = new AgingStage(response.data.agingStage);
        this.itemObject = new Stages(response.data);

        this.notifySuccessfulAction('Stage created successfully');
      }).catch(error => {
        console.error("Error creating a Stage", error);
      });
    },

    update() {
      this.agingStageApiService.update(this.itemObject.id, this.itemObject).then(response => {

        this.agingStage = new AgingStage(response.data.agingStage);
        this.itemObject = new Stages(response.data);

        this.notifySuccessfulAction('Stage updated successfully');
      }).catch(error => {
        console.error("Error updating a Stage", error);
      });
    },

    //#endregion
  },

  //#region Lifecycle Hooks
  created() {
    this.agingStageApiService = new StagesApiService ('/stages');

    this.itemObject = this.item;
    this.agingStage = this.item.agingStage;

    console.log('RECEPTION STAGE ===================== ', this.agingStage);

    console.log("🔍 Reception Stage Management created with item:", this.item);
  },
}

</script>

<template>


  <div class="pressing-container flex flex-column flex-1 w-full h-full gap-3 p-3 surface-ground overflow-auto">

    <!-- Encabezado y botones de acción -->
    <div class="flex flex-wrap justify-content-between align-items-center gap-4 border-bottom-1 surface-border pb-3">

      <!-- Título de la etapa -->
      <div class="flex align-items-center gap-2">
        <i class="pi pi-cog text-xl"></i>
        <h3 class="m-0 text-xl font-medium">Etapa: {{ agingStage.stage || 'No registrada' }}</h3>
      </div>

      <!-- Botones de acción -->
      <div class="flex flex-wrap gap-2">
        <pv-button
            label="Nueva Etapa"
            icon="pi pi-plus"
            @click="onNewItem"
            class="p-button-success"
        />

        <pv-button
            label="Editar"
            icon="pi pi-pencil"
            @click="onEditItem(itemObject)"
            class="p-button-warning"
            v-if="agingStage.stage"
        />

        <pv-button
            label="Eliminar"
            icon="pi pi-trash"
            @click="onDeleteItem(agingStage)"
            class="p-button-danger"
            v-if="agingStage.stage"
        />
      </div>
    </div>

    <!-- Contenido de la etapa -->
    <pv-card v-if="agingStage.stage">
      <template #header>
        <h4 class="m-0">Detalles de la etapa de clarificación</h4>
      </template>

      <!-- contenido de la tarjeta-->
      <template #content>

        <div class="flex align-items-center gap-2">
          <i class="pi pi-user text-lg"></i>
          <p><strong>Registrado por:</strong> {{ agingStage.registeredBy }}</p>
        </div>

        <div class="grid p-2">
          <div class="col-12 md:col-6">
            <p><strong>Fecha de inicio:</strong> {{ agingStage.startDate }}</p>
            <p><strong>Fecha de finalización:</strong> {{ agingStage.endDate }}</p>
            <p><strong>Tipo de contenedor:</strong> {{ agingStage.containerType }}</p>
          </div>
          <div class="col-12 md:col-6">
            <p><strong>Material del contenedor:</strong> {{ agingStage.material }}</p>
            <p><strong>Código del contenedor:</strong> {{ agingStage.containerCode }}</p>
            <p><strong>Temperatura promedio (°C):</strong> {{ agingStage.avgTemperature }}</p>
          </div>
          <div class="col-12 md:col-6">
            <p><strong>Volumen (litros):</strong> {{ agingStage.volumeLiters }}</p>
            <p><strong>Duración (meses):</strong> {{ agingStage.durationMonths }}</p>
            <p><strong>Frecuencia de revisión (días):</strong> {{ agingStage.frequencyDays || 'N/A' }}</p>
          </div>
          <div class="col-12 md:col-6">
            <p><strong>Número de recargas:</strong> {{ agingStage.refilled }}</p>
            <p><strong>Bâtonnage:</strong> {{ agingStage.batonnage || 0 }} veces</p>
            <p><strong>Sacas:</strong> {{ agingStage.rackings || 0 }} veces</p>
          </div>
          <div class="col-12">
            <p><strong>Propósito:</strong> {{ agingStage.purpose }}</p>
            <p><strong>Comentarios:</strong> {{ agingStage.comments }}</p>
          </div>
        </div>

        <!-- Estado de finalización -->
        <div class="flex align-items-center gap-2 mt-4">
          <i class="pi text-xl" :class="agingStage.isCompleted ? 'pi-check-circle text-green-500' : 'pi-times-circle text-red-500'"></i>
          <span class="text-lg font-medium">{{ agingStage.isCompleted ? 'Etapa completada' : 'Etapa no completada' }} </span>
        </div>

      </template>

    </pv-card>

    <!-- Diálogo para crear o editar etapa -->
    <aging-stage-detail-create-and-edit
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