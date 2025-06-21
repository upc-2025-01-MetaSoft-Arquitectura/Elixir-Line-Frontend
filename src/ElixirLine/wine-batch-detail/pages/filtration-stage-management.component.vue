<script>

import AgingStageDetailCreateAndEdit from "../components/aging-stage-create-and-edit.component.vue";
import ClarificationStageCreateAndEdit from "../components/clarification-stage-create-and-edit.component.vue";
import {Stages} from "../model/stages.entity.js";
import {StagesApiService} from "../services/stages-api.service.js";
import {FiltrationStage} from "../model/filtrationStage.entity.js";
import FiltrationStageCreateAndEdit from "../components/filtration-stage-create-and-edit.component.vue";

export default {
  name: 'filtration-stage-management',

  components: {FiltrationStageCreateAndEdit, AgingStageDetailCreateAndEdit, ClarificationStageCreateAndEdit},

  props:{
    item: null,
    canAddStage: {
      type: Boolean,
      default: false // Default value for canAddStage
    }
  },

  data() {
    return {
      title: { singular: 'Etapa de Fermentación', plural: 'Etapa de Fermentación' },
      itemObject: new Stages({}),
      filtrationStage: new FiltrationStage({}),
      filtrationStageApiService: null,
      createAndEditDialogIsVisible: false,
      isEdit: false,
      submitted: false,
      stageExist: false, // Assuming you want to check if a stage exists
    }
  },

  computed: {
    canAddStage() {
      return this.item &&
          this.item.agingStage &&
          this.item.agingStage.isCompleted === true
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
      this.filtrationStageApiService.create(this.itemObject).then(response => {

        this.filtrationStage = new FiltrationStage(response.data.filtrationStage);
        this.itemObject = new Stages(response.data);

        this.notifySuccessfulAction('Stage created successfully');
      }).catch(error => {
        console.error("Error creating a Stage", error);
      });
    },

    update() {
      this.filtrationStageApiService.update(this.itemObject.id, this.itemObject).then(response => {

        this.filtrationStage = new FiltrationStage(response.data.filtrationStage);
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
    this.filtrationStageApiService = new StagesApiService ('/stages');


    if (!this.item || !this.item.filtrationStage) {

      this.stageExist = false;

    } else {

      this.itemObject = this.item;
      this.stageExist = true;
      this.filtrationStage = this.item.filtrationStage;

    }

    console.log('RECEPTION STAGE ===================== ', this.filtrationStage);

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
        <h3 class="m-0 text-xl font-medium">Etapa: Filtración </h3>
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
            @click="onDeleteItem(filtrationStage)"
            class="p-button-danger"
            v-if="stageExist  && canAddStage"
        />
      </div>
    </div>


    <!-- Mensaje de aviso si no se puede agregar una nueva etapa -->
    <div v-if="!canAddStage" class="p-3 bg-yellow-100 text-yellow-800 border-round">
      <i class="pi pi-exclamation-triangle"></i>
      <span> No se puede agregar una nueva etapa de FILTRACIÓN hasta que se complete la etapa de AÑEJAMIENTO. </span>
    </div>


    <!-- Contenido de la etapa -->
    <pv-card v-if="filtrationStage.stage && canAddStage">
      <template #header>
        <h4 class="m-0">Detalles de la etapa de filtración</h4>
      </template>

      <!-- contenido de la tarjeta-->
      <template #content>

        <!-- Registrado por -->
        <div class="flex align-items-center gap-2">
          <i class="pi pi-user text-lg"></i>
          <p><strong>Registrado por:</strong> {{ filtrationStage.registeredBy }}</p>
        </div>

        <!-- Datos técnicos -->
        <div class="grid p-2">
          <!-- Fila 1 -->
          <div class="col-12 md:col-6">
            <p><strong>Fecha de inicio:</strong> {{ filtrationStage.startDate }}</p>
            <p><strong>Fecha de finalización:</strong> {{ filtrationStage.endDate }}</p>
            <p><strong>Tipo de filtración:</strong> {{ filtrationStage.filtrationType }}</p>
          </div>
          <div class="col-12 md:col-6">
            <p><strong>Medio filtrante:</strong> {{ filtrationStage.filterMedia }}</p>
            <p><strong>Tamaño de poro (micrones):</strong> {{ filtrationStage.poreMicrons }}</p>
            <p><strong>Temperatura (°C):</strong> {{ filtrationStage.temperature }}</p>
          </div>

          <!-- Fila 2 -->
          <div class="col-12 md:col-6">
            <p><strong>Turbidez antes:</strong> {{ filtrationStage.turbidityBefore }} NTU</p>
            <p><strong>Turbidez después:</strong> {{ filtrationStage.turbidityAfter }} NTU</p>
            <p><strong>Presión (Bares):</strong> {{ filtrationStage.pressureBars }}</p>
          </div>
          <div class="col-12 md:col-6">
            <p><strong>Volumen filtrado (litros):</strong> {{ filtrationStage.filteredVolumeLiters }}</p>
            <p><strong>¿Es estéril?</strong> {{ filtrationStage.isSterile ? 'Sí' : 'No' }}</p>
            <p><strong>¿Se cambió el filtro?</strong> {{ filtrationStage.filterChanged ? 'Sí' : 'No' }}</p>
          </div>

          <!-- Fila 3 -->
          <div class="col-12 md:col-6" v-if="filtrationStage.filterChanged">
            <p><strong>Razón del cambio:</strong> {{ filtrationStage.changeReason }}</p>
          </div>

          <div v-if="filtrationStage.comments">
            <p><strong>Comentarios:</strong> {{ filtrationStage.comments }}</p>
          </div>
        </div>

        <!-- Estado de finalización -->
        <div class="flex align-items-center gap-2 mt-4">
          <i class="pi text-xl" :class="filtrationStage.isCompleted ? 'pi-check-circle text-green-500' : 'pi-times-circle text-red-500'"></i>
          <span class="text-lg font-medium">{{ filtrationStage.isCompleted ? 'Etapa completada' : 'Etapa no completada' }}</span>
        </div>

      </template>
    </pv-card>

    <!-- Diálogo para crear o editar etapa -->
    <filtration-stage-create-and-edit
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