<script>

import FiltrationStageCreateAndEdit from "../components/filtration-stage-create-and-edit.component.vue";
import AgingStageDetailCreateAndEdit from "../components/aging-stage-create-and-edit.component.vue";
import ClarificationStageCreateAndEdit from "../components/clarification-stage-create-and-edit.component.vue";
import {Stages} from "../model/stages.entity.js";
import {StagesApiService} from "../services/stages-api.service.js";
import {BottlingStage} from "../model/bottlingStage.entity.js";
import BottlingStageCreateAndEdit from "../components/bottling-stage-create-and-edit.component.vue";

export default {
  name: 'bottling-stage-management',

  components: {
    BottlingStageCreateAndEdit,
    FiltrationStageCreateAndEdit, AgingStageDetailCreateAndEdit, ClarificationStageCreateAndEdit},

  props:{
    item: null
  },

  data() {
    return {
      title: { singular: 'Etapa de Fermentación', plural: 'Etapa de Fermentación' },
      itemObject: new Stages({}),
      bottlingStage: new BottlingStage({}),
      bottlingStageApiService: null,
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
      this.bottlingStageApiService.create(this.itemObject).then(response => {

        this.bottlingStage = new BottlingStage(response.data.bottlingStage);
        this.itemObject = new Stages(response.data);

        this.notifySuccessfulAction('Stage created successfully');
      }).catch(error => {
        console.error("Error creating a Stage", error);
      });
    },

    update() {
      this.bottlingStageApiService.update(this.itemObject.id, this.itemObject).then(response => {

        this.bottlingStage = new BottlingStage(response.data.bottlingStage);
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
    this.bottlingStageApiService = new StagesApiService ('/stages');

    this.itemObject = this.item;
    this.bottlingStage = this.item.bottlingStage;

    console.log('RECEPTION STAGE ===================== ', this.bottlingStage);

    console.log("🔍 Bottling Stage Management created with item:", this.item);
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
        <h3 class="m-0 text-xl font-medium">Etapa: {{ bottlingStage.stage || 'No registrada' }}</h3>
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
            v-if="bottlingStage.stage"
        />

        <pv-button
            label="Eliminar"
            icon="pi pi-trash"
            @click="onDeleteItem(bottlingStage)"
            class="p-button-danger"
            v-if="bottlingStage.stage"
        />
      </div>
    </div>

    <!-- Contenido de la etapa -->

    <pv-card v-if="bottlingStage.stage">
      <template #header>
        <h4 class="m-0">Detalles de la etapa de filtración</h4>
      </template>

      <!-- contenido de la tarjeta -->
      <template #content>

        <div class="flex align-items-center gap-2">
          <i class="pi pi-user text-lg"></i>
          <p><strong>Registrado por:</strong> {{ bottlingStage.registeredBy }}</p>
        </div>

        <div class="grid p-2">
          <!-- Fila 1 -->
          <div class="col-12 md:col-6">
            <p><strong>Fecha de inicio:</strong> {{ bottlingStage.startDate }}</p>
            <p><strong>Fecha de finalización:</strong> {{ bottlingStage.endDate }}</p>
            <p><strong>Línea de embotellado:</strong> {{ bottlingStage.bottlingLine }}</p>
          </div>
          <div class="col-12 md:col-6">
            <p><strong>Bottles filled:</strong> {{ bottlingStage.bottlesFilled }}</p>
            <p><strong>Volumen botella (ml):</strong> {{ bottlingStage.bottleVolumeMl }}</p>
            <p><strong>Volumen total (litros):</strong> {{ bottlingStage.totalVolumeLiters }}</p>
          </div>
          <!-- Fila 2 -->
          <div class="col-12 md:col-6">
            <p><strong>Tipo de sello:</strong> {{ bottlingStage.sealType }}</p>
            <p><strong>Código de lote:</strong> {{ bottlingStage.code }}</p>
            <p><strong>Temperatura (°C):</strong> {{ bottlingStage.temperature }}</p>
          </div>
          <div class="col-12 md:col-6">
            <p><strong>¿Filtrado?</strong> {{ bottlingStage.wasFiltered ? 'Sí' : 'No' }}</p>
            <p><strong>¿Etiquetas aplicadas?</strong> {{ bottlingStage.wereLabelsApplied ? 'Sí' : 'No' }}</p>
            <p><strong>¿Cápsulas aplicadas?</strong> {{ bottlingStage.wereCapsulesApplied ? 'Sí' : 'No' }}</p>
          </div>
          <!-- Fila 3 -->
          <div class="col-12 md:col-6" v-if="bottlingStage.comments">
            <p><strong>Comentarios:</strong> {{ bottlingStage.comments }}</p>
          </div>

          <!-- Estado de finalización -->
          <div class="flex align-items-center gap-2 mt-4">
            <i class="pi text-xl" :class="bottlingStage.isCompleted ? 'pi-check-circle text-green-500' : 'pi-times-circle text-red-500'"></i>
            <span class="text-lg font-medium">{{ bottlingStage.isCompleted ? 'Etapa completada' : 'Etapa no completada' }}</span>
          </div>

        </div>
      </template>

    </pv-card>


    <!-- Diálogo para crear o editar etapa -->
    <bottling-stage-create-and-edit
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