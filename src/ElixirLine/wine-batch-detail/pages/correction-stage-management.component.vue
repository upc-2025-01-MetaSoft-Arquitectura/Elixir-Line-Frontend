<script>

import {Stages} from "../model/stages.entity.js";
import {StagesApiService} from "../services/stages-api.service.js";
import {CorrectionStage} from "../model/correctionStage.entity.js";
import ReceptionStageCreateAndEdit from "../components/reception-stage-create-and-edit.component.vue";
import CorrectionStageCreateAndEdit from "../components/correction-stage-create-and-edit.vue";

export default {
  name: 'correction-stage-management',
  components: {CorrectionStageCreateAndEdit, ReceptionStageCreateAndEdit},

  props:{
    item: null
  },

  data() {
    return {
      title: { singular: 'Etapa de Corrección', plural: 'Etapa de Corrección' },
      itemObject: new Stages({}),
      correctionStage: new CorrectionStage({}),
      correctionStageApiService: null,
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
      this.correctionStageApiService.create(this.itemObject).then(response => {

        this.correctionStage = new CorrectionStage(response.data.correctionStage);
        this.itemObject = new Stages(response.data);

        this.notifySuccessfulAction('Stage created successfully');
      }).catch(error => {
        console.error("Error creating a Stage",error);
      });
    },

    update() {
      this.correctionStageApiService.update(this.itemObject.id, this.itemObject).then(response => {

        this.correctionStage = new CorrectionStage(response.data.correctionStage);
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
    this.correctionStageApiService = new StagesApiService ('/stages');

    this.itemObject = this.item;
    this.correctionStage = this.item.correctionStage;

    console.log('RECEPTION STAGE ===================== ', this.correctionStage);

    console.log("🔍 Reception Stage Management created with item:", this.item);
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
        <h3 class="m-0 text-xl font-medium">Etapa: {{ correctionStage.stage || 'No registrada' }}</h3>
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
            v-if="correctionStage.stage"
        />

        <pv-button
            label="Eliminar"
            icon="pi pi-trash"
            @click="onDeleteItem(correctionStage)"
            class="p-button-danger"
            v-if="correctionStage.stage"
        />
      </div>
    </div>

    <!-- Detalles de la etapa de corrección -->
    <pv-card v-if="correctionStage.stage">
      <template #header>
        <h4 class="m-0">Detalles de la etapa de corrección</h4>
      </template>

      <template #content>
        <div class="grid p-2">
          <div class="col-12 md:col-6">
            <p><strong>Registrado por:</strong> {{ correctionStage.registeredBy }}</p>
            <p><strong>Fecha de inicio:</strong> {{ correctionStage.startDate }}</p>
            <p><strong>Fecha de finalización:</strong> {{ correctionStage.endDate }}</p>
            <p><strong>Brix inicial:</strong> {{ correctionStage.initialBrix }}</p>
          </div>
          <div class="col-12 md:col-6">
            <p><strong>Brix final:</strong> {{ correctionStage.finalBrix }}</p>
            <p><strong>Azúcar añadido (kg):</strong> {{ correctionStage.addedSugarKg }}</p>
            <p><strong>pH inicial:</strong> {{ correctionStage.initialPH }}</p>
            <p><strong>pH final:</strong> {{ correctionStage.finalPH }}</p>
          </div>
          <div class="col-12 md:col-6">
            <p><strong>Tipo de ácido:</strong> {{ correctionStage.acidType }}</p>
            <p><strong>Ácido añadido (g/L):</strong> {{ correctionStage.acidAddedGL }}</p>
            <p><strong>Sulfitos añadidos (mg/L):</strong> {{ correctionStage.SO2AddedMgL }}</p>
          </div>
          <div class="col-12 md:col-6">
            <p v-for="(nutrient, index) in correctionStage.nutrientsAdded" :key="index">
              <strong>Nutriente añadido:</strong> {{ nutrient.name }} ({{ nutrient.quantity }} mg/L)
            </p>
            <p><strong>Justificación:</strong> {{ correctionStage.justification }}</p>
            <p><strong>Comentarios:</strong> {{ correctionStage.comments }}</p>
            <p><strong>Completado:</strong> {{ correctionStage.isCompleted ? 'Sí' : 'No' }}</p>
          </div>
        </div>
      </template>
    </pv-card>

    <!-- Diálogo para crear o editar etapa -->
    <correction-stage-create-and-edit
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