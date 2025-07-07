<script>

import {AgingStage} from "../model/agingStage.entity.js";
import ClarificationStageCreateAndEdit from "../components/clarification-stage-create-and-edit.component.vue";
import AgingStageDetailCreateAndEdit from "../components/aging-stage-create-and-edit.component.vue";
import {ClarificationStage} from "../model/clarificationStage.entity.js";
import {ClarificationStageApiService} from "../services/clarification-stage-api.service.js";
import {AgingStageApiService} from "../services/aging-stage-api.service.js";
import {CreateAgingStage} from "../model/create-aging-stage.entity.js";

export default {
  name: 'aging-stage-management',

  components: {AgingStageDetailCreateAndEdit, ClarificationStageCreateAndEdit},

  props: {
    item: {
      type: Object,
      default: () => ({})
    },
  },


  data() {
    return {
      title: { singular: 'Etapa de Añejamiento', plural: 'Etapa de Añejamiento' },

      batchId: null,

      agingStage: new AgingStage({}),
      clarificationStage: new ClarificationStage({}),

      createAgingStage: new CreateAgingStage({}),

      agingStageApiService: null,
      clarificationStageApiService: null,

      createAndEditDialogIsVisible: false,

      isEdit: false,

      submitted: false,

    }
  },

  computed: {
    canAddStage() {
      return this.clarificationStage && this.clarificationStage.completionStatus === 'COMPLETED';
    }
  },


  methods: {

    //#region Utility Methods
    notifySuccessfulAction(message) {
      this.$toast.add({severity: 'success', summary: 'Success', detail: message, life: 3000});
    },

    //#region Event Handlers
    onNewItem() {
      this.agingStage = new AgingStage({});
      console.log('======================= NEW ITEM MANAGEMENT', this.agingStage);
      this.isEdit = false;
      this.submitted = false;
      this.createAndEditDialogIsVisible = true;
    },

    onEditItem(item) {
      console.log('======================= EDIT ITEM MANAGEMENT', item);
      this.agingStage = new AgingStage(item);
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

      this.createAgingStage.employee = this.agingStage.employee;
      // formato de fecha yyyy-mm-dd
      // Para startDate, en caso sea nulo se asigna la fecha actual.
      this.createAgingStage.startDate = this.agingStage.endDate ? this.agingStage.endDate : new Date().toISOString().split('T')[0];
      // formato de fecha yyyy-mm-dd
      // Para endDate, asignar la fecha de inicio más un día si es nulo.
      this.createAgingStage.endDate = this.agingStage.endDate ? this.agingStage.endDate : new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0];

      this.createAgingStage.containerType = this.agingStage.containerType;
      this.createAgingStage.material = this.agingStage.material;
      this.createAgingStage.containerCode = this.agingStage.containerCode;
      // Asignar el volumen, asegurando que sea un número
      this.createAgingStage.averageTemperature = this.agingStage.averageTemperature ? parseFloat(this.agingStage.averageTemperature) : 0.0;
      this.createAgingStage.volume = this.agingStage.volume ? parseFloat(this.agingStage.volume) : 0.0;
      this.createAgingStage.duration = this.agingStage.duration ? parseInt(this.agingStage.duration) : 0;
      this.createAgingStage.frequency = this.agingStage.frequency ? parseInt(this.agingStage.frequency) : 0;
      this.createAgingStage.batonnage = this.agingStage.batonnage ? parseFloat(this.agingStage.batonnage) : 0.0;
      this.createAgingStage.refills = this.agingStage.refills ? parseInt(this.agingStage.refills) : 0;
      this.createAgingStage.rackings = this.agingStage.rackings ? parseInt(this.agingStage.rackings) : 0;
      this.createAgingStage.purpose = this.agingStage.purpose;
      this.createAgingStage.comment = this.agingStage.comment;


      this.agingStageApiService.create(this.batchId, this.agingStage).then(response => {

        this.agingStage = new AgingStage(response.data);

        this.notifySuccessfulAction('Stage created successfully');
      }).catch(error => {
        console.error("Error creating a Stage",error);
        console.error('🔴 Message:', error.message);
        console.error('🔴 Status:', error.response?.status);
        console.error('🔴 Details:', error.response?.data);
      });
    },

    update() {

      this.agingStageApiService.patch(this.batchId, this.agingStage).then(response => {

        this.agingStage = new AgingStage(response.data);

        this.notifySuccessfulAction('Stage updated successfully');
      }).catch(error => {
        console.error("Error updating a Stage",error);
        console.error('🔴 Message:', error.message);
        console.error('🔴 Status:', error.response?.status);
        console.error('🔴 Details:', error.response?.data);
      });
    },


    getAgingStage() {
      this.agingStageApiService.getAgingStageByBatchId(this.batchId)
          .then(response => {

            this.agingStage = new AgingStage(response.data);

            console.log("=== ETAPA DE AÑEJAMIENTO RECUPERADA: ===", response.data);

          })
          .catch(error => {
            console.error('❌ Error al obtener la etapa de añejamiento:', error);
            this.$toast.add({
              severity: 'error',
              summary: 'Error',
              detail: 'No se pudo obtener la etapa de añejamiento.',
              life: 3000
            });
          });
    },

    getClarificationStage() {
      this.clarificationStageApiService.getClarificationStageByBatchId(this.batchId)
          .then(response => {

            this.clarificationStage = new ClarificationStage(response.data);
            // Asegurarse de que el rendimiento del mosto sea un número

            console.log("=== ETAPA DE CLARIFICACIÓN RECUPERADA: ===",response.data);

          })
          .catch(error => {
            console.error('❌ Error al obtener la etapa de clarificación:', error);
            this.$toast.add({
              severity: 'error',
              summary: 'Error',
              detail: 'No se pudo obtener la etapa de clarificación.',
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
      this.agingStage.completionStatus = 'COMPLETED'

      this.agingStageApiService.patch(this.agingStage.batchId, this.agingStage)
          .then(response => {
            this.agingStage = new AgingStage(response.data)
            this.notifySuccessfulAction('Etapa completada correctamente')
            console.log("== ETAPA DE RECEPCIÓN COMPLETADA ==", this.agingStage)
          })
          .catch(error => {
            this.agingStage.completionStatus = 'NOT_COMPLETED'

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
    this.agingStageApiService = new AgingStageApiService('/batches');
    this.clarificationStageApiService = new ClarificationStageApiService('/batches');

    this.getAgingStage();

    this.getClarificationStage();


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
        <h3 class="m-0 text-xl font-medium">Etapa: Añejamiento </h3>
      </div>



      <!-- Botones de acción -->
      <div class="flex flex-wrap gap-2">
        <pv-button
            label="Nueva Etapa"
            icon="pi pi-plus"
            @click="onNewItem"
            class="p-button-success"
            v-if="!agingStage.id"
        />

        <pv-button
            label="Editar"
            icon="pi pi-pencil"
            @click="onEditItem(agingStage)"
            class="p-button-warning"
            v-if="agingStage.id  && agingStage.completionStatus !== 'COMPLETED'"
        />

        <pv-button
            label="Completar etapa"
            icon="pi pi-check"
            class="p-button-success"
            @click="confirmarCompletarEtapa"
            v-if="agingStage.id  && agingStage.completionStatus !== 'COMPLETED'"
        />


      </div>
    </div>


    <!-- Mensaje de aviso si no se puede agregar una nueva etapa -->
    <div v-if="!canAddStage" class="p-3 bg-yellow-100 text-yellow-800 border-round">
      <i class="pi pi-exclamation-triangle"></i>
      <span> No se puede agregar una nueva etapa de AÑEJAMIENTO hasta que se complete la etapa de CLARIFICACIÓN.
      </span>
    </div>

    <!-- Mensaje de aviso si no hay una etapa de corrección -->
    <div v-if="canAddStage && !agingStage.id "
         class="p-3 bg-red-100 text-red-800 border-round">
      <i class="pi pi-exclamation-triangle"></i>
      <span> No hay una etapa de AÑEJAMIENTO registrada para este lote. </span>
    </div>



    <!-- Contenido de la etapa -->
    <pv-card v-if="agingStage && agingStage.id && canAddStage === true">
      <template #header>
        <h4 class="m-0">Detalles de la etapa de clarificación</h4>
      </template>

      <template #content>

        <div class="flex align-items-center gap-2">
          <i class="pi pi-user text-lg"></i>
          <p><strong>Registrado por:</strong> {{ agingStage.employee }}</p>
        </div>

        <div class="grid p-2">

          <div class="col-12 md:col-6">
            <p><strong>Fecha de inicio:</strong> {{ agingStage.startDate }}</p>
            <p><strong>Contenedor:</strong> {{ agingStage.containerType || 'No definido' }}</p>
            <p><strong>Código del contenedor:</strong> {{ agingStage.containerCode || 'No definido' }}</p>
            <p><strong>Volumen:</strong> {{ agingStage.volume || 'No definido' }} L</p>
            <p><strong>Frecuencia de batonnage:</strong> {{ agingStage.frequency || 'No definida' }} días</p>
            <p><strong>Recargas:</strong> {{ agingStage.refills || 'No definidas' }}</p>
          </div>

          <div class="col-12 md:col-6">
            <p><strong>Fecha de finalización:</strong> {{ agingStage.endDate || 'No definida' }}</p>
            <p><strong>Material del contenedor:</strong> {{ agingStage.material || 'No definido' }}</p>
            <p><strong>Temperatura promedio:</strong> {{ agingStage.averageTemperature || 'No definida' }} °C</p>
            <p><strong>Duración:</strong> {{ agingStage.duration || 'No definida' }} meses</p>
            <p><strong>Batonnage:</strong> {{ agingStage.batonnage || 'No definido' }} veces</p>
            <p><strong>Trasiegos:</strong> {{ agingStage.rackings || 'No definidos' }}</p>
          </div>

        </div>

        <!-- Propósito -->
        <div class="mt-4 w-full">
          <p><strong>Propósito:</strong></p>
          <p class="text-gray-700 ">{{ agingStage.purpose || 'No hay comentarios.' }}</p>
        </div>


        <!-- Comentario -->
        <div class="mt-4 w-full">
          <p><strong>Comentario:</strong></p>
          <p class="text-gray-700 ">{{ agingStage.comment || 'No hay comentarios.' }}</p>
        </div>

        <!-- Visualización de estado -->
        <div class="flex align-items-center gap-2 mt-4">
          <i
              class="pi text-xl"
              :class="agingStage.completionStatus === 'COMPLETED' ? 'pi-check-circle text-green-500' : 'pi-times-circle text-red-500'"
          ></i>
          <span class="text-lg font-medium">
              {{ agingStage.completionStatus === 'COMPLETED' ? 'Etapa completada' : 'Etapa no completada' }}
            </span>
        </div>

      </template>

    </pv-card>

    <!-- Diálogo para crear o editar etapa -->
    <aging-stage-detail-create-and-edit
        :edit="isEdit"
        :item="agingStage"
        :visible="createAndEditDialogIsVisible"
        @cancel-requested="onCancelRequested"
        @save-requested="onSaveRequested($event)"
    />

  </div>

</template>

<style>

</style>