<script>

import CampaignCreateAndEdit from "../../winemaking-process/components/campaign-create-and-edit.vue";
import DataManager from "../../../shared/components/data-manager.component.vue";
import ReceptionStageCreateAndEdit from "../components/reception-stage-create-and-edit.component.vue";
import {ReceptionStage} from "../model/receptionStage.entity.js";
import {ReceptionStageApiService} from "../services/reception-stage-api.service.js";
import {CreateReceptionStage} from "../model/create-reception-stage.entity.js";

export default {
  name: 'reception-stage-management',

  components: {ReceptionStageCreateAndEdit, DataManager, CampaignCreateAndEdit},

  inject: ['batchId'], // Recibe el batchId desde el padre

  props: {
    item: {
      type: Object,
      default: () => ({})
    },
  },

  data() {
    return {
      title: {singular: 'Etapa de Recepción', plural: 'Etapa de Recepción'},

      batchId: null,

      receptionStage: new ReceptionStage({}),

      createReceptionStage: new CreateReceptionStage({}),

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
      this.receptionStage = new ReceptionStage({});
      console.log('=== NEW RECEPTION', this.receptionStage);
      this.isEdit = false;
      this.submitted = false;
      this.createAndEditDialogIsVisible = true;
    },

    onEditItem(item) {
      console.log('=== EDIT RECEPTION STAGE ===', item);
      this.receptionStage = new ReceptionStage(item);

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
      console.log('== CREANDO RECEPTION: ==', this.receptionStage);

      this.createReceptionStage.employee = this.receptionStage.employee ? this.receptionStage.employee : ''; // Asignar cadena vacía si no está definida
      this.createReceptionStage.startDate = this.receptionStage.startDate ? this.receptionStage.startDate : new Date().toISOString().split('T')[0]; // Asignar fecha actual si no está definida
      this.createReceptionStage.endDate = this.receptionStage.endDate ? this.receptionStage.endDate : null; // Asignar null si no está definida
      this.createReceptionStage.temperature = this.receptionStage.temperature ? parseFloat(this.receptionStage.temperature) : 0.0; // Asignar 0.0 si no está definida
      this.createReceptionStage.pHLevel = this.receptionStage.pHLevel ? parseFloat(this.receptionStage.pHLevel) : 0.0; // Asignar 0.0 si no está definida
      this.createReceptionStage.sugarLevel = this.receptionStage.sugarLevel ? parseFloat(this.receptionStage.sugarLevel) : 0.0; // Asignar 0.0 si no está definida
      this.createReceptionStage.quantityKg = this.receptionStage.quantityKg ? parseFloat(this.receptionStage.quantityKg) : 0.0; // Asignar 0.0 si no está definida
      this.createReceptionStage.comment = this.receptionStage.comment ? this.receptionStage.comment : ''; // Asignar cadena vacía si no está definida

      this.receptionStageApiService.create(this.batchId, this.createReceptionStage).then(response => {

        this.receptionStage = new ReceptionStage(response.data);

        this.notifySuccessfulAction('Stage created successfully');
      }).catch(error => {
        console.error("Error creating a Stage", error);
        console.error('🔴 Message:', error.message);
        console.error('🔴 Status:', error.response?.status);
        console.error('🔴 Details:', error.response?.data);
      });
    },

    update() {
      this.receptionStageApiService.patch(this.batchId, this.receptionStage).then(response => {

        this.receptionStage = new ReceptionStage(response.data);

        this.notifySuccessfulAction('Stage updated successfully');
      }).catch(error => {
        console.error("Error updating a Stage", error);
        console.error('🔴 Message:', error.message);
        console.error('🔴 Status:', error.response?.status);
        console.error('🔴 Details:', error.response?.data);
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
      this.receptionStage.completionStatus = 'COMPLETED'

      this.receptionStageApiService.patch(this.receptionStage.batchId, this.receptionStage)
          .then(response => {
            this.receptionStage = new ReceptionStage(response.data)
            this.notifySuccessfulAction('Etapa completada correctamente')
            console.log("== ETAPA DE RECEPCIÓN COMPLETADA ==", this.receptionStage)
          })
          .catch(error => {
            this.receptionStage.completionStatus = 'NOT_COMPLETED'

            console.error('❌ Error al completar la etapa:', error)
            this.$toast.add({
              severity: 'error',
              summary: 'Error',
              detail: 'No se pudo completar la etapa.',
              life: 3000
            })
          })
    }
    //#endregion

  },

  //#region Lifecycle Hooks
  created() {
    this.batchId = this.item.id;
    this.receptionStageApiService = new ReceptionStageApiService('/batches');
    this.getReceptionStage();

    console.log("= ESTAMOS EN RECEPTION-STAGE-MANAGEMENT ==> BatchId: ", this.batchId);

    console.log("Reception Stage Management component created");
  },

}

</script>

<template>

  <pv-confirm-dialog></pv-confirm-dialog>

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
            v-if="!receptionStage.id"
        />

        <pv-button
            label="Editar"
            icon="pi pi-pencil"
            @click="onEditItem(receptionStage)"
            class="p-button-warning"
            v-if="receptionStage.id  && receptionStage.completionStatus !== 'COMPLETED'"
        />

        <pv-button
            label="Completar etapa"
            icon="pi pi-check"
            class="p-button-success"
            @click="confirmarCompletarEtapa"
            v-if="receptionStage.id  && receptionStage.completionStatus !== 'COMPLETED'"
        />

      </div>
    </div>

    <!-- Tarjeta con detalles -->
    <pv-card v-if="receptionStage && receptionStage.id" class="mt-3">
      <template #header>
        <h4 class="m-0">Detalles de la etapa de recepción</h4>
      </template>

      <template #content>
        <!--
        completionStatus = '',
        dataHash = null
        -->
        <div class="flex align-items-center gap-2">
          <i class="pi pi-user text-lg"></i>
          <p><strong>Registrado por:</strong> {{ receptionStage.employee }}</p>
        </div>

        <div class="grid p-2">
          <div class="col-12 md:col-6">
            <p><strong>Fecha Inicio:</strong> {{ receptionStage.startDate }}</p>
            <p><strong>Temperatura:</strong> {{ receptionStage.temperature }} °C</p>
            <p><strong>Nivel de pH:</strong> {{ receptionStage.pHLevel }}</p>
          </div>
          <div class="col-12 md:col-6">
            <p><strong>Fecha Fin:</strong> {{ receptionStage.endDate }}</p>
            <p><strong>Nivel de Azúcar (%):</strong> {{ receptionStage.sugarLevel }}</p>
            <p><strong>Cantidad (kg):</strong> {{ receptionStage.quantityKg }}</p>
          </div>
        </div>

        <p><strong>Comentarios:</strong> {{ receptionStage.comment }}</p>


        <!-- Visualización de estado -->
        <div class="flex align-items-center gap-2 mt-4">
          <i
              class="pi text-xl"
              :class="receptionStage.completionStatus === 'COMPLETED' ? 'pi-check-circle text-green-500' : 'pi-times-circle text-red-500'"
          ></i>
          <span class="text-lg font-medium">
            {{ receptionStage.completionStatus === 'COMPLETED' ? 'Etapa completada' : 'Etapa no completada' }}
          </span>
        </div>

      </template>
    </pv-card>

    <!-- Diálogo para crear o editar etapa -->
    <reception-stage-create-and-edit
        :edit="isEdit"
        :item="receptionStage"
        :visible="createAndEditDialogIsVisible"
        @cancel-requested="onCancelRequested"
        @save-requested="onSaveRequested($event)"
    />
  </div>


</template>

<style>

</style>