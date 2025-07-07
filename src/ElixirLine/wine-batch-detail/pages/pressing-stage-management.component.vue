<script>

import CorrectionStageCreateAndEdit from "../components/correction-stage-create-and-edit.vue";
import ReceptionStageCreateAndEdit from "../components/reception-stage-create-and-edit.component.vue";
import {PressingStage} from "../model/pressingStage.entity.js";
import FermentationStageCreateAndEdit from "../components/fermentation-stage-create-and-edit.component.vue";
import PressingStageCreateAndEdit from "../components/pressing-stage-create-and-edit.component.vue";
import {FermentationStage} from "../model/fermentationStage.entity.js";
import {CreatePressingStage} from "../model/create-pressing-stage.entity.js";
import {PressingStageApiService} from "../services/pressing-stage-api.service.js";
import {FermentationStageApiService} from "../services/fermentation-stage-api.service.js";

export default {
  name: 'pressing-stage-management',

  components: {
    PressingStageCreateAndEdit,
    FermentationStageCreateAndEdit, CorrectionStageCreateAndEdit, ReceptionStageCreateAndEdit},

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

      pressingStage: new PressingStage({}),
      fermentationStage : new FermentationStage({}),

      createPressingStage: new CreatePressingStage({}),

      //
      pressingStageApiService: null,
      fermentationStageApiService: null,


      createAndEditDialogIsVisible: false,


      isEdit: false,

      submitted: false,

    }
  },

  computed: {
    canAddStage() {
      return this.fermentationStage && this.fermentationStage.completionStatus === 'COMPLETED';
    }
  },




  methods: {

    //#region Utility Methods
    notifySuccessfulAction(message) {
      this.$toast.add({severity: 'success', summary: 'Success', detail: message, life: 3000});
    },


    //#region Event Handlers
    onNewItem() {
      this.pressingStage = new PressingStage({});
      console.log('======================= NEW ITEM MANAGEMENT', this.pressingStage);
      this.isEdit = false;
      this.submitted = false;
      this.createAndEditDialogIsVisible = true;
    },

    onEditItem(item) {
      console.log('======================= EDIT ITEM MANAGEMENT', item);
      this.pressingStage = new PressingStage(item);
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

      /*
            employee = null,
            startDate = null,
            endDate = null,
            pressType = null,
            pressure = 0.0,
            duration = 0, // Duration in seconds
            pomadeWeight = 0.0, // Weight of the pomace in kg
            mustYield = 0.0, // Yield percentage
            mustUsage = null, // Usage of the must
            comment = null
       */

      this.createPressingStage.employee = this.fermentationStage.employee;
      // formato de fecha yyyy-mm-dd
      // Para startDate, en caso sea nulo se asigna la fecha actual.
      this.createPressingStage.startDate = this.fermentationStage.endDate ? this.fermentationStage.endDate : new Date().toISOString().split('T')[0];
      // formato de fecha yyyy-mm-dd
      // Para endDate, asignar la fecha de inicio más un día si es nulo.
      this.createPressingStage.endDate = this.fermentationStage.endDate ? this.fermentationStage.endDate : new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0];
      this.createPressingStage.pressType = this.fermentationStage.pressType;
      //formatear float
      this.createPressingStage.pressure = this.fermentationStage.pressure ? parseFloat(this.fermentationStage.pressure.toFixed(2)) : 0.0;
      this.createPressingStage.duration = this.fermentationStage.duration ? parseInt(this.fermentationStage.duration) : 0;
      this.createPressingStage.pomadeWeight = this.fermentationStage.pomadeWeight ? parseFloat(this.fermentationStage.pomadeWeight.toFixed(2)) : 0.0;
      this.createPressingStage.yield = this.fermentationStage.yield ? parseFloat(this.fermentationStage.yield.toFixed(2)) : 0.0;
      this.createPressingStage.mustUsage = this.fermentationStage.mustUsage;
      this.createPressingStage.comment = this.fermentationStage.comment;


      this.pressingStageApiService.create(this.batchId, this.pressingStage).then(response => {

        this.pressingStage = new PressingStage(response.data);

        this.notifySuccessfulAction('Stage created successfully');
      }).catch(error => {
        console.error("Error creating a Stage",error);
        console.error('🔴 Message:', error.message);
        console.error('🔴 Status:', error.response?.status);
        console.error('🔴 Details:', error.response?.data);
      });
    },

    update() {

      this.pressingStageApiService.patch(this.batchId, this.pressingStage).then(response => {

        this.pressingStage = new PressingStage(response.data);

        this.notifySuccessfulAction('Stage updated successfully');
      }).catch(error => {
        console.error("Error updating a Stage",error);
        console.error('🔴 Message:', error.message);
        console.error('🔴 Status:', error.response?.status);
        console.error('🔴 Details:', error.response?.data);
      });
    },


    getPressingStage() {
      this.pressingStageApiService.getPressingStageByBatchId(this.batchId)
          .then(response => {

            this.pressingStage = new PressingStage(response.data);
            // Asegurarse de que el rendimiento del mosto sea un número

            console.log("=== ETAPA DE PRENSADO RECUPERADO: ===",response.data);

          })
          .catch(error => {
            console.error('❌ Error al obtener la etapa de prensado:', error);
            this.$toast.add({
              severity: 'error',
              summary: 'Error',
              detail: 'No se pudo obtener la etapa de prensado.',
              life: 3000
            });
          });
    },

    getFermentationStage() {
      this.fermentationStageApiService.getFermentationStageByBatchId(this.batchId)
          .then(response => {

            this.fermentationStage = new FermentationStage(response.data);

            console.log("=== ETAPA DE FERMENTACIÓN RECUPERADO: ===",response.data);

          })
          .catch(error => {
            console.error('❌ Error al obtener la etapa de fermentación:', error);
            this.$toast.add({
              severity: 'error',
              summary: 'Error',
              detail: 'No se pudo obtener la etapa de fermentación.',
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
      this.pressingStage.completionStatus = 'COMPLETED'

      this.pressingStageApiService.patch(this.pressingStage.batchId, this.pressingStage)
          .then(response => {
            this.pressingStage = new PressingStage(response.data)
            this.notifySuccessfulAction('Etapa completada correctamente')
            console.log("== ETAPA DE RECEPCIÓN COMPLETADA ==", this.pressingStage)
          })
          .catch(error => {
            this.pressingStage.completionStatus = 'NOT_COMPLETED'

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

    this.pressingStageApiService = new PressingStageApiService('/batches');
    this.fermentationStageApiService = new FermentationStageApiService('/batches');


    // Cargar la etapa de prensado y fermentación al crear el componente
    this.getPressingStage();
    this.getFermentationStage();

    console.log("= ESTAMOS EN PRESSING-STAGE-MANAGEMENT ==> BatchId: ", this.batchId);

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
            @click="onNewItem"
            class="p-button-success"
            v-if="!pressingStage.id"
        />

        <pv-button
            label="Editar"
            icon="pi pi-pencil"
            @click="onEditItem(pressingStage)"
            class="p-button-warning"
            v-if="pressingStage.id  && pressingStage.completionStatus !== 'COMPLETED'"
        />

        <pv-button
            label="Completar etapa"
            icon="pi pi-check"
            class="p-button-success"
            @click="confirmarCompletarEtapa"
            v-if="pressingStage.id  && pressingStage.completionStatus !== 'COMPLETED'"
        />
      </div>

      <!-- Mensaje de aviso si no se puede agregar una nueva etapa -->
      <div v-if="!canAddStage" class="p-3 bg-yellow-100 text-yellow-800 border-round">
        <i class="pi pi-exclamation-triangle"></i>
        <span> No se puede agregar una nueva etapa de PRENSADO hasta que se complete la etapa de FERMNETACIÓN. </span>
      </div>

      <!-- Mensaje de aviso si no hay una etapa de corrección -->
      <div v-if="canAddStage && !pressingStage.id "
           class="p-3 bg-red-100 text-red-800 border-round">
        <i class="pi pi-exclamation-triangle"></i>
        <span> No hay una etapa de PRENSADO registrada para este lote. </span>
      </div>



      <!-- contenido de la tarjeta -->
      <pv-card v-if="pressingStage && pressingStage.id && canAddStage === true">

        <template #content>

          <div class="flex align-items-center gap-2">
            <i class="pi pi-user text-lg"></i>
            <p><strong>Registrado por:</strong> {{ pressingStage.employee }}</p>
          </div>

          <div class="grid p-2">
            <div class="col-12 md:col-6">
              <p><strong>Fecha Inicio:</strong> {{ pressingStage.startDate }}</p>
              <p><strong>Tipo de Prensa:</strong> {{ pressingStage.pressType }}</p>
              <p><strong>Presión (bar):</strong> {{ pressingStage.pressure }}</p>
              <p><strong>Duración (min):</strong> {{ pressingStage.duration }}</p>
            </div>
            <div class="col-12 md:col-6">
              <p><strong>Fecha Fin:</strong> {{ pressingStage.endDate }}</p>
              <p><strong>Peso de la Poma (kg):</strong> {{ pressingStage.pomadeWeight }}</p>
              <p><strong>Rendimiento (Litros):</strong> {{ pressingStage.yield}}</p>
              <p><strong>Uso del Mosto:</strong> {{ pressingStage.mustUsage }}</p>
            </div>


            <!-- Comentario -->
            <div class="mt-4 w-full">
              <p><strong>Comentario:</strong></p>
              <p class="text-gray-700 ">{{ pressingStage.comment || 'No hay comentarios.' }}</p>
            </div>

            <!-- Visualización de estado -->
            <div class="flex align-items-center gap-2 mt-4">
              <i
                  class="pi text-xl"
                  :class="pressingStage.completionStatus === 'COMPLETED' ? 'pi-check-circle text-green-500' : 'pi-times-circle text-red-500'"
              ></i>
              <span class="text-lg font-medium">
            {{ pressingStage.completionStatus === 'COMPLETED' ? 'Etapa completada' : 'Etapa no completada' }}
            </span>
            </div>

          </div>
        </template>

      </pv-card>

      <!-- Diálogo para crear o editar etapa -->
      <pressing-stage-create-and-edit
          :edit="isEdit"
          :item="pressingStage"
          :visible="createAndEditDialogIsVisible"
          @cancel-requested="onCancelRequested"
          @save-requested="onSaveRequested($event)"
      />

    </div>
  </div>

</template>

<style>

</style>