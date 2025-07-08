<script>

import {CorrectionStage} from "../model/correctionStage.entity.js";
import CorrectionStageCreateAndEdit from "../components/correction-stage-create-and-edit.vue";
import {ReceptionStageApiService} from "../services/reception-stage-api.service.js";
import {ReceptionStage} from "../model/receptionStage.entity.js";
import {CorrectionStageApiService} from "../services/correction-stage-api.service.js";
import {CreateCorrectionStage} from "../model/create-correction-stage.entity.js";

export default {
  name: 'correction-stage-management',
  components: {CorrectionStageCreateAndEdit },

  props: {
    item: {
      type: Object,
      default: () => ({})
    },
  },

  data() {
    return {
      title: { singular: 'Etapa de Corrección', plural: 'Etapa de Corrección' },

      batchId: null,

      correctionStage: new CorrectionStage({}),
      receptionStage: new ReceptionStage({}),

      createCorrectionStage: new CreateCorrectionStage({}),

      correctionStageApiService: null,
      receptionStageApiService: null,

      createAndEditDialogIsVisible: false,

      isEdit: false,

      submitted: false,

    }
  },

  computed: {
    canAddStage() {
      return this.receptionStage && this.receptionStage.completionStatus === 'COMPLETED';
    }
  },

  methods: {

    //#region Utility Methods
    notifySuccessfulAction(message) {
      this.$toast.add({severity: 'success', summary: 'Success', detail: message, life: 3000});
    },

    //#region Event Handlers
    onNewItem() {
      this.correctionStage = new CorrectionStage({});
      console.log('======================= NEW ITEM MANAGEMENT', this.correctionStage);
      this.isEdit = false;
      this.submitted = false;
      this.createAndEditDialogIsVisible = true;
    },

    onEditItem(item) {

      this.correctionStage = new CorrectionStage(item);


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

      this.createCorrectionStage.employee = this.correctionStage.employee;
      this.createCorrectionStage.startDate = this.correctionStage.startDate ? this.correctionStage.startDate : new Date().toISOString().split('T')[0]; // Asignar fecha actual si no está definida
      this.createCorrectionStage.endDate = this.correctionStage.endDate ? this.correctionStage.endDate : null; // Asignar null si no está definida
      this.createCorrectionStage.initialSugarLevel = this.correctionStage.initialSugarLevel ? parseFloat(this.correctionStage.initialSugarLevel) : 0.0;
      this.createCorrectionStage.finalSugarLevel = this.correctionStage.finalSugarLevel ? parseFloat(this.correctionStage.finalSugarLevel) : 0.0;
      this.createCorrectionStage.addedSugar = this.correctionStage.addedSugar ? parseFloat(this.correctionStage.addedSugar) : 0.0;
      this.createCorrectionStage.initialPH = this.correctionStage.initialPH ? parseFloat(this.correctionStage.initialPH) : 0.0;
      this.createCorrectionStage.finalPH = this.correctionStage.finalPH ? parseFloat(this.correctionStage.finalPH) : 0.0;
      this.createCorrectionStage.acidType = this.correctionStage.acidType ? this.correctionStage.acidType : null;
      this.createCorrectionStage.addedAcid = this.correctionStage.addedAcid ? parseFloat(this.correctionStage.addedAcid) : 0.0;
      this.createCorrectionStage.addedSulphites = this.correctionStage.addedSulphites ? parseFloat(this.correctionStage.addedSulphites) : 0.0;
      this.createCorrectionStage.nutrients = this.correctionStage.nutrients && this.correctionStage.nutrients.length > 0 ? this.correctionStage.nutrients : [];
      this.createCorrectionStage.justification = this.correctionStage.justification ? this.correctionStage.justification : ' ';
      this.createCorrectionStage.comment = this.correctionStage.comment ? this.correctionStage.comment : ' ';

      this.correctionStageApiService.create(this.batchId, this.createCorrectionStage).then(response => {

        this.correctionStage = new CorrectionStage(response.data);

        this.notifySuccessfulAction('Stage created successfully');
      }).catch(error => {
        console.error("Error creating a Stage",error);
        console.error('🔴 Message:', error.message);
        console.error('🔴 Status:', error.response?.status);
        console.error('🔴 Details:', error.response?.data);
      });
    },

    update() {
      this.correctionStageApiService.patch(this.batchId, this.correctionStage).then(response => {

        this.correctionStage = new CorrectionStage(response.data);

        this.notifySuccessfulAction('Stage updated successfully');
      }).catch(error => {
        console.error("Error updating a Stage",error);
        console.error('🔴 Message:', error.message);
        console.error('🔴 Status:', error.response?.status);
        console.error('🔴 Details:', error.response?.data);
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

    getReceptionStage() {
      this.receptionStageApiService.getReceptionStageByBatchId(this.batchId)
          .then(response => {
            this.receptionStage = new ReceptionStage(response.data);

            console.log("===== ETAPA DE RECEPCIÓN RECUPERADO: ===== ", this.receptionStage);
          })
          .catch(error => {
            console.error('❌ Error al obtener la etapa de recepción:', error);
            this.$toast.add({
              severity: 'error',
              summary: 'Error',
              detail: 'No se pudo obtener la etapa de recepción.',
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
      return this.correctionStage.employee !== '' &&
              this.correctionStage.startDate !== null &&
              this.correctionStage.endDate !== null &&
              this.correctionStage.initialSugarLevel !== null && this.correctionStage.initialSugarLevel >= 0 &&
              this.correctionStage.finalSugarLevel !== null && this.correctionStage.finalSugarLevel >= 0 &&
              this.correctionStage.addedSugar >= 0 &&
              this.correctionStage.initialPH !== null && this.correctionStage.initialPH >= 0 &&
              this.correctionStage.finalPH !== null && this.correctionStage.finalPH >= 0 &&
              this.correctionStage.acidType !== '' &&
              this.correctionStage.addedAcid >= 0 &&
              this.correctionStage.addedSulphites >= 0 &&
              Array.isArray(this.correctionStage.nutrients) && this.correctionStage.nutrients.length > 0 &&
              this.correctionStage.justification !== '' &&
              this.correctionStage.comment !== '';
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

      this.correctionStage.completionStatus = 'COMPLETED'

      this.correctionStageApiService.patch(this.correctionStage.batchId, this.correctionStage)
          .then(response => {
            this.correctionStage = new CorrectionStage(response.data)
            this.notifySuccessfulAction('Etapa completada correctamente')
            console.log("== ETAPA DE RECEPCIÓN COMPLETADA ==", this.correctionStage)
          })
          .catch(error => {
            this.correctionStage.completionStatus = 'NOT_COMPLETED'

            console.error('❌ Error al completar la etapa:', error)
            this.$toast.add({
              severity: 'error',
              summary: 'Error',
              detail: 'No se pudo completar la etapa.',
              life: 3000
            })
          })
    }
  },


  //#region Lifecycle Hooks
  created() {
    this.batchId = this.item.id;

    this.correctionStageApiService = new CorrectionStageApiService('/batches');
    this.receptionStageApiService = new ReceptionStageApiService('/batches');

    this.getCorrectionStage();
    this.getReceptionStage();

    console.log("= ESTAMOS EN CORRECTION-STAGE-MANAGEMENT ==> BatchId: ", this.batchId);
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
        <h3 class="m-0 text-xl font-medium"> Etapa: Corrección </h3>
      </div>

      <!-- Botones de acción -->
      <div class="flex flex-wrap gap-2">
        <pv-button
            label="Nueva Etapa"
            icon="pi pi-plus"
            @click="onNewItem"
            class="p-button-success"
            v-if="!correctionStage.id"
        />

        <pv-button
            label="Editar"
            icon="pi pi-pencil"
            @click="onEditItem(correctionStage)"
            class="p-button-warning"
            v-if="correctionStage.id  && correctionStage.completionStatus !== 'COMPLETED'"
        />

        <pv-button
            label="Completar etapa"
            icon="pi pi-check"
            class="p-button-success"
            @click="confirmarCompletarEtapa"
            v-if="correctionStage.id  && correctionStage.completionStatus !== 'COMPLETED'"
        />
      </div>
    </div>

    <!-- Mensaje de aviso si no se puede agregar una nueva etapa -->
    <div v-if="!canAddStage" class="p-3 bg-yellow-100 text-yellow-800 border-round">
      <i class="pi pi-exclamation-triangle"></i>
      <span> No se puede agregar una nueva etapa de CORRECCIÓN hasta que se complete la etapa de RECEPCIÓN. </span>
    </div>

    <!-- Mensaje de aviso si no hay una etapa de corrección -->
    <div v-if="canAddStage && !correctionStage.id "
         class="p-3 bg-red-100 text-red-800 border-round">
      <i class="pi pi-exclamation-triangle"></i>
      <span> No hay una etapa de corrección registrada para este lote. </span>
    </div>



    <!-- Detalles de la etapa de corrección -->
    <pv-card v-if="correctionStage && correctionStage.id && canAddStage === true">
      <template #header>
        <h4 class="m-0">Detalles de la etapa de corrección</h4>
      </template>

      <template #content>

        <div class="flex align-items-center gap-2">
          <i class="pi pi-user text-lg"></i>
          <p><strong>Registrado por:</strong> {{ correctionStage.employee }}</p>
        </div>

        <div class="grid p-2">
          <div class="col-12 md:col-6">
            <p><strong>Fecha Inicio:</strong> {{ correctionStage.startDate }}</p>
            <p><strong>Nivel de Azúcar Inicial:</strong> {{ correctionStage.initialSugarLevel }}</p>
            <p><strong>Nivel de pH inicial:</strong> {{ correctionStage.initialPH }}</p>
            <p><strong>Azúcar añadido:</strong> {{ correctionStage.addedSugar }}</p>
          </div>
          <div class="col-12 md:col-6">
            <p><strong>Fecha Fin:</strong> {{ correctionStage.endDate }}</p>
            <p><strong>Nivel de Azúcar Final:</strong> {{ correctionStage.finalSugarLevel }}</p>
            <p><strong>Nivel de pH final:</strong> {{ correctionStage.finalPH }}</p>
          </div>
          <div class="col-12 md:col-6">
            <p><strong>Tipo de ácido:</strong> {{ correctionStage.acidType }}</p>
            <p><strong>Sulfitos añadidos (mg/L):</strong> {{ correctionStage.addedSulphites }}</p>
            <p><strong>Justificación:</strong> {{ correctionStage.justification }}</p>

          </div>
          <div class="col-12 md:col-6">
            <p><strong>Ácido añadido (g/L):</strong> {{ correctionStage.addedAcid }}</p>
            <p>
              <strong>Nutrientes añadidos:</strong>
              {{ correctionStage.nutrients?.length ? correctionStage.nutrients.join(', ') : 'Ninguno' }}
            </p>
            <p><strong>Comentarios:</strong> {{ correctionStage.comment }}</p>
          </div>
        </div>

        <!-- Visualización de estado -->
        <div class="flex align-items-center gap-2 mt-4">
          <i
              class="pi text-xl"
              :class="correctionStage.completionStatus === 'COMPLETED' ? 'pi-check-circle text-green-500' : 'pi-times-circle text-red-500'"
          ></i>
          <span class="text-lg font-medium">
            {{ correctionStage.completionStatus === 'COMPLETED' ? 'Etapa completada' : 'Etapa no completada' }}
          </span>
        </div>

      </template>
    </pv-card>

    <!-- Diálogo para crear o editar etapa -->
    <correction-stage-create-and-edit
        :edit="isEdit"
        :item="correctionStage"
        :visible="createAndEditDialogIsVisible"
        @cancel-requested="onCancelRequested"
        @save-requested="onSaveRequested($event)"
    />

  </div>

</template>

<style>

</style>