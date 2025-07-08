<script>

import CorrectionStageCreateAndEdit from "../components/correction-stage-create-and-edit.vue";
import ReceptionStageCreateAndEdit from "../components/reception-stage-create-and-edit.component.vue";

import {FermentationStage} from "../model/fermentationStage.entity.js";
import FermentationStageCreateAndEdit from "../components/fermentation-stage-create-and-edit.component.vue";
import {CorrectionStage} from "../model/correctionStage.entity.js";
import {CreateFermentationStage} from "../model/create-fermentation-stage.entity.js";
import {CorrectionStageApiService} from "../services/correction-stage-api.service.js";
import {FermentationStageApiService} from "../services/fermentation-stage-api.service.js";

export default {
  name: 'fermentation-stage-management',

  components: {FermentationStageCreateAndEdit, CorrectionStageCreateAndEdit, ReceptionStageCreateAndEdit},

  props: {
    item: {
      type: Object,
      default: () => ({})
    },
  },


  data() {
    return {
      title: { singular: 'Etapa de Fermentación', plural: 'Etapa de Fermentación' },

      batchId: null, // Assuming you want to track the batch ID

      fermentationStage: new FermentationStage({}),
      correctionStage: new CorrectionStage({}),

      createFermentationStage: new CreateFermentationStage({}),

      correctionStageApiService: null,
      fermentationStageApiService: null,

      createAndEditDialogIsVisible: false,

      isEdit: false,

      submitted: false,

      stageExist: false, // Assuming you want to check if a stage exists
    }
  },

  computed: {
    canAddStage() {
      return this.correctionStage && this.correctionStage.completionStatus === 'COMPLETED';
    }
  },


  methods: {

    //#region utility methods
    notifySuccessfulAction(message) {
      this.$toast.add({severity: 'success', summary: 'Success', detail: message, life: 3000});
    },

    //#region Event Handlers
    onNewItem() {
      this.fermentationStage = new FermentationStage({});
      console.log('======================= NEW ITEM MANAGEMENT', this.fermentationStage);
      this.isEdit = false;
      this.submitted = false;
      this.createAndEditDialogIsVisible = true;
    },

    onEditItem(item) {
      console.log('======================= EDIT ITEM MANAGEMENT', item);
      this.fermentationStage = new FermentationStage(item);
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

      this.createFermentationStage.employee = this.fermentationStage.employee;
      this.createFermentationStage.startDate = this.fermentationStage.startDate ? this.fermentationStage.startDate.toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
      this.createFermentationStage.endDate = this.fermentationStage.endDate ? this.fermentationStage.endDate.toISOString().split('T')[0] : null;
      this.createFermentationStage.yeastUsed = this.fermentationStage.yeastUsed ? parseFloat(this.fermentationStage.yeastUsed) : 0;
      this.createFermentationStage.fermentationType = this.fermentationStage.fermentationType;
      this.createFermentationStage.initialSugarLevel = this.fermentationStage.initialSugarLevel ? parseFloat(this.fermentationStage.initialSugarLevel) : 0;
      this.createFermentationStage.finalSugarLevel = this.fermentationStage.finalSugarLevel ? parseFloat(this.fermentationStage.finalSugarLevel) : 0;
      this.createFermentationStage.initialPH = this.fermentationStage.initialPH ? parseFloat(this.fermentationStage.initialPH) : 0;
      this.createFermentationStage.finalPH = this.fermentationStage.finalPH ? parseFloat(this.fermentationStage.finalPH) : 0;
      this.createFermentationStage.maxTemperature = this.fermentationStage.maxTemperature ? parseFloat(this.fermentationStage.maxTemperature) : 0;
      this.createFermentationStage.minTemperature = this.fermentationStage.minTemperature ? parseFloat(this.fermentationStage.minTemperature) : 0;
      this.createFermentationStage.tankCode = this.fermentationStage.tankCode ? this.fermentationStage.tankCode : '';
      this.createFermentationStage.comment = this.fermentationStage.comment ? this.fermentationStage.comment : '';


      this.fermentationStageApiService.create(this.batchId, this.fermentationStage).then(response => {

        this.fermentationStage = new FermentationStage(response.data);

        this.notifySuccessfulAction('Stage created successfully');
      }).catch(error => {
        console.error("Error creating a Stage",error);
        console.error('🔴 Message:', error.message);
        console.error('🔴 Status:', error.response?.status);
        console.error('🔴 Details:', error.response?.data);
      });
    },

    update() {

      this.fermentationStageApiService.patch(this.batchId, this.fermentationStage).then(response => {

        this.fermentationStage = new FermentationStage(response.data);

        this.notifySuccessfulAction('Stage updated successfully');
      }).catch(error => {
        console.error("Error updating a Stage",error);
        console.error('🔴 Message:', error.message);
        console.error('🔴 Status:', error.response?.status);
        console.error('🔴 Details:', error.response?.data);
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

    getCorrectionStage() {
      this.correctionStageApiService.getCorrectionStageByBatchId(this.batchId)
          .then(response => {

            this.correctionStage = new CorrectionStage(response.data);

            console.log("=== ETAPA DE CORRECTION RECUPERADO: ===",response.data);

          })
          .catch(error => {
            console.error('❌ Error al obtener la etapa de corrección:', error);
            this.$toast.add({
              severity: 'error',
              summary: 'Error',
              detail: 'No se pudo obtener la etapa de corrección.',
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

    isDataComplete() {

      // Verifica que todos los campos requeridos estén completos
      // los valores numerico no pueden ser menor que 0, las fechas no pueden ser nulas y los strings no pueden estar vacíos
      return this.fermentationStage.employee.trim() !== '' &&
              this.fermentationStage.startDate !== null &&
              this.fermentationStage.yeastUsed >= 0 &&
              this.fermentationStage.fermentationType.trim() !== '' &&
              this.fermentationStage.initialSugarLevel >= 0 &&
              this.fermentationStage.finalSugarLevel >= 0 &&
              this.fermentationStage.initialPH >= 0 &&
              this.fermentationStage.finalPH >= 0 &&
              this.fermentationStage.maxTemperature >= 0 &&
              this.fermentationStage.minTemperature >= 0 &&
              this.fermentationStage.tankCode.trim() !== '';
    },

    completarEtapa() {

      if (!this.isDataComplete()) {
        this.$toast.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Por favor, completa todos los campos requeridos antes de completar la etapa.',
          life: 4000
        });
        return;
      }

      this.fermentationStage.completionStatus = 'COMPLETED'

      this.fermentationStageApiService.patch(this.fermentationStage.batchId, this.fermentationStage)
          .then(response => {
            this.fermentationStage = new FermentationStage(response.data)
            this.notifySuccessfulAction('Etapa completada correctamente')
            console.log("== ETAPA DE RECEPCIÓN COMPLETADA ==", this.fermentationStage)
          })
          .catch(error => {
            this.fermentationStage.completionStatus = 'NOT_COMPLETED'

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

    this.correctionStageApiService = new CorrectionStageApiService('/batches');
    this.fermentationStageApiService = new FermentationStageApiService('/batches');

    this.getFermentationStage();
    this.getCorrectionStage();

    console.log("= ESTAMOS EN FERMENTATION-STAGE-MANAGEMENT ==> BatchId: ", this.batchId);

  },
  //#endregion  
  
}

</script>

<template>

  <div class="fermentation-container flex flex-column flex-1 w-full h-full gap-3 p-3 surface-ground overflow-auto">

    <!-- Encabezado y botones de acción -->
    <div
        class="flex flex-wrap justify-content-between align-items-center gap-4 border-bottom-1 surface-border pb-3">

      <!-- Título de la etapa -->
      <div class="flex align-items-center gap-2">
        <i class="pi pi-cog text-xl"></i>
        <h3 class="m-0 text-xl font-medium">Etapa: Fermentación</h3>
      </div>

      <!-- Botones de acción -->
      <div class="flex flex-wrap gap-2">
        <pv-button
            label="Nueva Etapa"
            icon="pi pi-plus"
            @click="onNewItem"
            class="p-button-success"
            v-if="!fermentationStage.id"
        />

        <pv-button
            label="Editar"
            icon="pi pi-pencil"
            @click="onEditItem(fermentationStage)"
            class="p-button-warning"
            v-if="fermentationStage.id  && fermentationStage.completionStatus !== 'COMPLETED'"
        />

        <pv-button
            label="Completar etapa"
            icon="pi pi-check"
            class="p-button-success"
            @click="confirmarCompletarEtapa"
            v-if="fermentationStage.id  && fermentationStage.completionStatus !== 'COMPLETED'"
        />
      </div>

      <!-- Mensaje de aviso si no se puede agregar una nueva etapa -->
      <div v-if="!canAddStage" class="p-3 bg-yellow-100 text-yellow-800 border-round">
        <i class="pi pi-exclamation-triangle"></i>
        <span> No se puede agregar una nueva etapa de FERMENTACIÓN hasta que se complete la etapa de CORRECCIÓN. </span>
      </div>

      <!-- Mensaje de aviso si no hay una etapa de corrección -->
      <div v-if="canAddStage && !fermentationStage.id "
           class="p-3 bg-red-100 text-red-800 border-round">
        <i class="pi pi-exclamation-triangle"></i>
        <span> No hay una etapa de FERMENTACIÓN registrada para este lote. </span>
      </div>


      <!-- Detalles de la etapa de fermentación -->

      <pv-card v-if="fermentationStage && fermentationStage.id && canAddStage === true">

        <template #header>
          <h4 class="m-0">Detalles de la etapa de fermentación</h4>
        </template>

        <template #content>

          <div class="flex align-items-center gap-2">
            <i class="pi pi-user text-lg"></i>
            <p><strong>Registrado por:</strong> {{ fermentationStage.employee }}</p>
          </div>

          <div class="grid p-2">
            <div class="col-12 md:col-6">
              <p><strong>Fecha de inicio: </strong> {{ fermentationStage.startDate }}</p>
              <p><strong>Nivel de pH inicial:</strong> {{ fermentationStage.initialPH }}</p>
              <p><strong>Tipo de fermentación:</strong> {{ fermentationStage.fermentationType }}</p>
              <p><strong>Nivel de Azúcar Inicial:</strong> {{ fermentationStage.initialSugarLevel }}</p>
              <p><strong>Temperatura mínima:</strong> {{ fermentationStage.minTemperature }} °C</p>
              <p><strong>Código de tanque: </strong> {{ fermentationStage.tankCode }} </p>

            </div>

            <div class="col-12 md:col-6">
              <p><strong>Fecha fin: </strong> {{ fermentationStage.endDate }}</p>
              <p><strong>Nivel de pH final:</strong> {{ fermentationStage.finalPH }}</p>
              <p><strong>Levadura utilizada:</strong> {{ fermentationStage.yeastUsed }} g</p>
              <p><strong>Nivel de Azúcar Final:</strong> {{ fermentationStage.finalSugarLevel }}</p>
              <p><strong>Temperatura máxima:</strong> {{ fermentationStage.maxTemperature }} °C</p>
            </div>

          </div>

          <!-- Comentario -->
          <div class="mt-4">
            <p><strong>Comentario:</strong></p>
            <p class="text-gray-700">{{ fermentationStage.comment || 'No hay comentarios.' }}</p>
          </div>

          <!-- Visualización de estado -->
          <div class="flex align-items-center gap-2 mt-4">
            <i
                class="pi text-xl"
                :class="fermentationStage.completionStatus === 'COMPLETED' ? 'pi-check-circle text-green-500' : 'pi-times-circle text-red-500'"
            ></i>
            <span class="text-lg font-medium">
            {{ fermentationStage.completionStatus === 'COMPLETED' ? 'Etapa completada' : 'Etapa no completada' }}
            </span>
          </div>

        </template>
      </pv-card>



      <!-- Diálogo para crear o editar etapa -->
      <fermentation-stage-create-and-edit
          :edit="isEdit"
          :item="fermentationStage"
          :visible="createAndEditDialogIsVisible"
          @cancel-requested="onCancelRequested"
          @save-requested="onSaveRequested($event)"
      />

    </div>
  </div>


</template>

<style>

</style>