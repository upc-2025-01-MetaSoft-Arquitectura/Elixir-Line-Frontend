<script>

import FiltrationStageCreateAndEdit from "../components/filtration-stage-create-and-edit.component.vue";
import AgingStageDetailCreateAndEdit from "../components/aging-stage-create-and-edit.component.vue";
import ClarificationStageCreateAndEdit from "../components/clarification-stage-create-and-edit.component.vue";
import {BottlingStage} from "../model/bottlingStage.entity.js";
import BottlingStageCreateAndEdit from "../components/bottling-stage-create-and-edit.component.vue";
import {FiltrationStage} from "../model/filtrationStage.entity.js";
import {CreateBottlingStage} from "../model/create-bottling-stage.entity.js";
import {BottlingStageApiService} from "../services/bottling-stage-api.service.js";
import {FiltrationStageApiService} from "../services/filtration-stage-api.service.js";

export default {
  name: 'bottling-stage-management',

  components: {
    BottlingStageCreateAndEdit,
    FiltrationStageCreateAndEdit, AgingStageDetailCreateAndEdit, ClarificationStageCreateAndEdit},

  props: {
    item: {
      type: Object,
      default: () => ({})
    },
  },

  data() {
    return {
      title: { singular: 'Etapa de Fermentación', plural: 'Etapa de Fermentación' },

      batchId: null,

      bottlingStage: new BottlingStage({}),
      filtrationStage: new FiltrationStage({}),

      createBottlingStage: new CreateBottlingStage({}),


      bottlingStageApiService: null,
      filtrationStageApiService: null,

      createAndEditDialogIsVisible: false,

      isEdit: false,

      submitted: false,
    }
  },

  computed: {
    canAddStage() {
      return this.filtrationStage && this.filtrationStage.completionStatus === 'COMPLETED';
    }
  },

  methods: {

    //#region Utility Methods
    notifySuccessfulAction(message) {
      this.$toast.add({severity: 'success', summary: 'Success', detail: message, life: 3000});
    },

    //#region Event Handlers
    onNewItem() {
      this.bottlingStage = new BottlingStage({});
      console.log('======================= NEW ITEM MANAGEMENT', this.bottlingStage);
      this.isEdit = false;
      this.submitted = false;
      this.createAndEditDialogIsVisible = true;
    },

    onEditItem(item) {
      console.log('======================= EDIT ITEM MANAGEMENT', item);
      this.bottlingStage = new BottlingStage(item);
      this.isEdit = true;
      this.submitted = false;
      this.createAndEditDialogIsVisible = true;
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

      this.bottlingStageApiService.create(this.batchId, this.bottlingStage).then(response => {

        this.bottlingStage = new BottlingStage(response.data);

        this.notifySuccessfulAction('Stage created successfully');
      }).catch(error => {
        console.error("Error creating a Stage",error);
        console.error('🔴 Message:', error.message);
        console.error('🔴 Status:', error.response?.status);
        console.error('🔴 Details:', error.response?.data);
      });
    },

    update() {

      this.bottlingStageApiService.patch(this.batchId, this.bottlingStage).then(response => {

        this.bottlingStage = new BottlingStage(response.data);

        this.notifySuccessfulAction('Stage updated successfully');
      }).catch(error => {
        console.error("Error updating a Stage",error);
        console.error('🔴 Message:', error.message);
        console.error('🔴 Status:', error.response?.status);
        console.error('🔴 Details:', error.response?.data);
      });
    },

    getBottlingStage(){
      this.bottlingStageApiService.getBottlingStageByBatchId(this.batchId)
          .then(response => {

            this.bottlingStage = new BottlingStage(response.data);

            console.log("=== ETAPA DE EMBOTELLADO RECUPERADA: ===", response.data);

          })
          .catch(error => {
            console.error('❌ Error al obtener la etapa de embotellado:', error);
            this.$toast.add({
              severity: 'error',
              summary: 'Error',
              detail: 'No se pudo obtener la etapa de embotellado.',
              life: 3000
            });
          });
    },

    getFiltrationStage() {
      this.filtrationStageApiService.getFiltrationStageByBatchId(this.batchId)
          .then(response => {

            this.filtrationStage = new FiltrationStage(response.data);

            console.log("=== ETAPA DE FILTRACIÓN RECUPERADA: ===", response.data);

          })
          .catch(error => {
            console.error('❌ Error al obtener la etapa de filtración:', error);
            this.$toast.add({
              severity: 'error',
              summary: 'Error',
              detail: 'No se pudo obtener la etapa de filtración.',
              life: 3000
            });
          });
    },

    //#endregion


    // Confirmar y cerrar al confirmar
    confirmarCompletarEtapa() {
      this.$confirm.require({
        message: '¿Estás seguro de que deseas completar esta etapa? Esta acción no se puede deshacer.',
        header: 'Confirmación',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Sí, completar',
        rejectLabel: 'Cancelar',
        acceptClass: 'p-button-danger',
        accept: () => {
          this.completarEtapa()
          this.$confirm.close(); // Cierra el diálogo manualmente
        },

        reject: () => {
          this.$toast.add({
            severity: 'info',
            summary: 'Cancelado',
            detail: 'La etapa no fue completada.',
          })
          this.$confirm.close(); // También puedes cerrar aquí si lo deseas
        }
      })
    },


    completarEtapa() {
      this.bottlingStage.completionStatus = 'COMPLETED'

      this.bottlingStageApiService.patch(this.bottlingStage.batchId, this.bottlingStage)
          .then(response => {
            this.bottlingStage = new BottlingStage(response.data)
            this.notifySuccessfulAction('Etapa completada correctamente')
            console.log("== ETAPA DE RECEPCIÓN COMPLETADA ==", this.bottlingStage)
          })
          .catch(error => {
            this.bottlingStage.completionStatus = 'NOT_COMPLETED'

            console.error('❌ Error al completar la etapa:', error)
            this.$toast.add({
              severity: 'error',
              summary: 'Error',
              detail: 'No se pudo completar la etapa.',
              life: 3000
            })
          })
    },

  },

  //#region Lifecycle Hooks
  created() {

    this.batchId = this.item.id;
    this.bottlingStageApiService = new BottlingStageApiService('/batches');
    this.filtrationStageApiService = new FiltrationStageApiService('/batches');

    // Cargar la etapa de embotellado
    this.getBottlingStage();

    // Cargar la etapa de filtración
    this.getFiltrationStage();

    console.log("= ESTAMOS EN BOTTLE STAGE MANAGEMENT ==", this.item);
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
        <h3 class="m-0 text-xl font-medium">Etapa: Embotellado </h3>
      </div>


      <!-- Botones de acción -->
      <div class="flex flex-wrap gap-2">
        <pv-button
            label="Nueva Etapa"
            icon="pi pi-plus"
            @click="onNewItem"
            class="p-button-success"
            v-if="!bottlingStage.id"
        />

        <pv-button
            label="Editar"
            icon="pi pi-pencil"
            @click="onEditItem(bottlingStage)"
            class="p-button-warning"
            v-if="bottlingStage.id  && bottlingStage.completionStatus !== 'COMPLETED'"
        />

        <pv-button
            label="Completar etapa"
            icon="pi pi-check"
            class="p-button-success"
            @click="confirmarCompletarEtapa"
            v-if="bottlingStage.id  && bottlingStage.completionStatus !== 'COMPLETED'"
        />


      </div>
    </div>

    <!-- Mensaje de aviso si no se puede agregar una nueva etapa -->
    <div v-if="!canAddStage" class="p-3 bg-yellow-100 text-yellow-800 border-round">
      <i class="pi pi-exclamation-triangle"></i>
      <span> No se puede agregar una nueva etapa de EMBOTELLADO hasta que se complete la etapa de FILTRACIÓN.
      </span>
    </div>

    <!-- Mensaje de aviso si no hay una etapa de corrección -->
    <div v-if="canAddStage && !bottlingStage.id "
         class="p-3 bg-red-100 text-red-800 border-round">
      <i class="pi pi-exclamation-triangle"></i>
      <span> No hay una etapa de EMBOTELLADO registrada para este lote. </span>
    </div>


    <!-- Contenido de la etapa -->
    <pv-card v-if="bottlingStage && bottlingStage.id && canAddStage === true">
      <template #header>
        <h4 class="m-0">Detalles de la etapa de filtración</h4>
      </template>

      <!-- contenido de la tarjeta
      {
        "labelsAtThisStage": true,
        "capsuleOrSealApplication": true,
        "comment": "Embotellado realizado con éxito.",
        "completionStatus": "NOT_COMPLETED",
        "currentStage": "BOTTLING",
        "completedAt": null,
        "dataHash": null
      }
      -->
      <template #content>

        <div class="flex align-items-center gap-2">
          <i class="pi pi-user text-lg"></i>
          <p><strong>Registrado por:</strong> {{ bottlingStage.employee }}</p>
        </div>

        <div class="grid p-2">
          <!-- Fila 1 -->
          <div class="col-12 md:col-6">
            <p><strong>Fecha de inicio:</strong> {{ bottlingStage.startDate }}</p>
            <p><strong>Línea de embotellado:</strong> {{ bottlingStage.bottlingLine || 'No definida' }}</p>
            <p><strong>Botellas llenas:</strong> {{ bottlingStage.filledBottles || 'No definida' }}</p>
            <p><strong>Volumen total:</strong> {{ bottlingStage.totalVolume || 'No definido' }} ml</p>
            <p><strong>Temperatura:</strong> {{ bottlingStage.temperature || 'No definida' }} °C</p>
            <p><strong>Etiquetas en esta etapa:</strong> {{ bottlingStage.labelsAtThisStage ? 'Sí' : 'No' }}</p>

          </div>


          <div class="col-12 md:col-6">
            <p><strong>Fecha de finalización:</strong> {{ bottlingStage.endDate || 'No definida' }}</p>
            <p><strong>Tipo de sellado:</strong> {{ bottlingStage.sealingType || 'No definido' }}</p>
            <p><strong>Volumen de botella:</strong> {{ bottlingStage.bottleVolume || 'No definida' }} ml</p>
            <p><strong>Código del viñedo:</strong> {{ bottlingStage.vineyardCode || 'No definido' }}</p>
            <p><strong>Filtrado previo al embotellado:</strong>{{ bottlingStage.filteredBeforeBottling ? 'Sí' : 'No' }}</p>
            <p><strong>Aplicación de cápsula o sello:</strong> {{ bottlingStage.capsuleOrSealApplication ? 'Sí' : 'No' }}</p>

          </div>

        </div>

        <!-- Comentario -->
        <div class="mt-4 w-full">
          <p><strong>Comentario:</strong></p>
          <p class="text-gray-700 ">{{ bottlingStage.comment || 'No hay comentarios.' }}</p>
        </div>


        <!-- Visualización de estado -->
        <div class="flex align-items-center gap-2 mt-4">
          <i
              class="pi text-xl"
              :class="bottlingStage.completionStatus === 'COMPLETED' ? 'pi-check-circle text-green-500' : 'pi-times-circle text-red-500'"
          ></i>
          <span class="text-lg font-medium">
              {{ bottlingStage.completionStatus === 'COMPLETED' ? 'Etapa completada' : 'Etapa no completada' }}
            </span>
        </div>


      </template>

    </pv-card>


    <!-- Diálogo para crear o editar etapa -->
    <bottling-stage-create-and-edit
        :edit="isEdit"
        :item="bottlingStage"
        :visible="createAndEditDialogIsVisible"
        @cancel-requested="onCancelRequested"
        @save-requested="onSaveRequested($event)"
    />

  </div>


</template>

<style>

</style>