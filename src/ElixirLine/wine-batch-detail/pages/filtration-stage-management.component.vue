<script>

import AgingStageDetailCreateAndEdit from "../components/aging-stage-create-and-edit.component.vue";
import ClarificationStageCreateAndEdit from "../components/clarification-stage-create-and-edit.component.vue";
import {FiltrationStage} from "../model/filtrationStage.entity.js";
import FiltrationStageCreateAndEdit from "../components/filtration-stage-create-and-edit.component.vue";
import {AgingStage} from "../model/agingStage.entity.js";
import {CreateFiltrationStage} from "../model/create-filtration-stage.entity.js";
import {FiltrationStageApiService} from "../services/filtration-stage-api.service.js";
import {AgingStageApiService} from "../services/aging-stage-api.service.js";

export default {
  name: 'filtration-stage-management',

  components: {FiltrationStageCreateAndEdit, AgingStageDetailCreateAndEdit, ClarificationStageCreateAndEdit},

  props: {
    item: {
      type: Object,
      default: () => ({})
    },
  },


  data() {
    return {
      title: { singular: 'Etapa de Filtración', plural: 'Etapa de Filtración' },

      batchId: null,

      filtrationStage: new FiltrationStage({}),
      agingStage: new AgingStage({}),

      createFiltrationStage: new CreateFiltrationStage({}),

      filtrationStageApiService: null,
      agingStageApiService: null,

      createAndEditDialogIsVisible: false,


      isEdit: false,


      submitted: false,
    }
  },


  computed: {
    canAddStage() {
      return this.agingStage && this.agingStage.completionStatus === 'COMPLETED';
    }
  },


  methods: {

    //#region Utility Methods
    notifySuccessfulAction(message) {
      this.$toast.add({severity: 'success', summary: 'Success', detail: message, life: 3000});
    },

    //#region Event Handlers
    onNewItem() {
      this.filtrationStage = new FiltrationStage({});
      console.log('======================= NEW ITEM MANAGEMENT', this.filtrationStage);
      this.isEdit = false;
      this.submitted = false;
      this.createAndEditDialogIsVisible = true;
    },

    onEditItem(item) {
      console.log('======================= EDIT ITEM MANAGEMENT', item);
      this.filtrationStage = new FiltrationStage(item);
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
            filterType = null,
            filterMedium = null,
            porosity = 0.0,
            initialTurbidity = 0.0,
            finalTurbidity = 0.0,
            temperature = 0.0,
            pressure = 0.0,
            filteredVolume = 0.0,
            sterileFiltration = false,
            changedFiltration = false,
            changeReason = null,
            comment = null
       */

      this.createFiltrationStage.employee = this.filtrationStage.employee;
      // formato de fecha yyyy-mm-dd
      // Para startDate, en caso sea nulo se asigna la fecha actual.
      this.createFiltrationStage.startDate = this.filtrationStage.endDate ? this.filtrationStage.endDate : new Date().toISOString().split('T')[0];
      // formato de fecha yyyy-mm-dd
      // Para endDate, asignar la fecha de inicio más un día si es nulo.
      this.createFiltrationStage.endDate = this.filtrationStage.endDate ? this.filtrationStage.endDate : new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0];
      this.createFiltrationStage.filterType = this.filtrationStage.filterType;
      this.createFiltrationStage.filterMedium = this.filtrationStage.filterMedium;
      // Asegurarse de que sea un número
      this.createFiltrationStage.porosity = this.filtrationStage.porosity ? parseFloat(this.filtrationStage.porosity) : 0.0;
      // Asegurarse de que sea un número
      this.createFiltrationStage.initialTurbidity = this.filtrationStage.initialTurbidity ? parseFloat(this.filtrationStage.initialTurbidity) : 0.0;
      // Asegurarse de que sea un número
      this.createFiltrationStage.finalTurbidity = this.filtrationStage.finalTurbidity ? parseFloat(this.filtrationStage.finalTurbidity) : 0.0;
      // Asegurarse de que sea un número
      this.createFiltrationStage.temperature = this.filtrationStage.temperature ? parseFloat(this.filtrationStage.temperature) : 0.0;
      // Asegurarse de que sea un número
      this.createFiltrationStage.pressure = this.filtrationStage.pressure ? parseFloat(this.filtrationStage.pressure) : 0.0;
      // Asegurarse de que sea un número
      this.createFiltrationStage.filteredVolume = this.filtrationStage.filteredVolume ? parseFloat(this.filtrationStage.filteredVolume) : 0.0;
      this.createFiltrationStage.sterileFiltration = this.filtrationStage.sterileFiltration;
      this.createFiltrationStage.changedFiltration = this.filtrationStage.changedFiltration;
      this.createFiltrationStage.changeReason = this.filtrationStage.changeReason;
      this.createFiltrationStage.comment = this.filtrationStage.comment;






      this.filtrationStageApiService.create(this.batchId, this.filtrationStage).then(response => {

        this.filtrationStage = new FiltrationStage(response.data);

        this.notifySuccessfulAction('Stage created successfully');
      }).catch(error => {
        console.error("Error creating a Stage",error);
        console.error('🔴 Message:', error.message);
        console.error('🔴 Status:', error.response?.status);
        console.error('🔴 Details:', error.response?.data);
      });
    },

    update() {

      this.filtrationStageApiService.patch(this.batchId, this.filtrationStage).then(response => {

        this.filtrationStage = new FiltrationStage(response.data);

        this.notifySuccessfulAction('Stage updated successfully');
      }).catch(error => {
        console.error("Error updating a Stage",error);
        console.error('🔴 Message:', error.message);
        console.error('🔴 Status:', error.response?.status);
        console.error('🔴 Details:', error.response?.data);
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
      this.filtrationStage.completionStatus = 'COMPLETED'

      this.filtrationStageApiService.patch(this.filtrationStage.batchId, this.filtrationStage)
          .then(response => {
            this.filtrationStage = new FiltrationStage(response.data)
            this.notifySuccessfulAction('Etapa completada correctamente')
            console.log("== ETAPA DE RECEPCIÓN COMPLETADA ==", this.filtrationStage)
          })
          .catch(error => {
            this.filtrationStage.completionStatus = 'NOT_COMPLETED'

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
    // Inicializar servicios
    this.filtrationStageApiService = new FiltrationStageApiService('/batches');
    this.agingStageApiService = new AgingStageApiService('/batches');

    // Obtener la etapa de filtración al crear el componente
    this.getFiltrationStage();
    this.getAgingStage();

    console.log("= ESTAMOS EN FILTRATION-STAGE-MANAGEMENT = ");


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
            @click="onNewItem"
            class="p-button-success"
            v-if="!filtrationStage.id"
        />

        <pv-button
            label="Editar"
            icon="pi pi-pencil"
            @click="onEditItem(filtrationStage)"
            class="p-button-warning"
            v-if="filtrationStage.id  && filtrationStage.completionStatus !== 'COMPLETED'"
        />

        <pv-button
            label="Completar etapa"
            icon="pi pi-check"
            class="p-button-success"
            @click="confirmarCompletarEtapa"
            v-if="filtrationStage.id  && filtrationStage.completionStatus !== 'COMPLETED'"
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
    <div v-if="canAddStage && !filtrationStage.id "
         class="p-3 bg-red-100 text-red-800 border-round">
      <i class="pi pi-exclamation-triangle"></i>
      <span> No hay una etapa de AÑEJAMIENTO registrada para este lote. </span>
    </div>

    <!-- Contenido de la etapa -->
    <pv-card v-if="filtrationStage && filtrationStage.id && canAddStage === true">
      <template #header>
        <h4 class="m-0">Detalles de la etapa de filtración</h4>
      </template>

      <!-- contenido de la tarjeta
      {
        "pressure": 1.5,
        "filteredVolume": 1000,
        "sterileFiltration": true,
        "changedFiltration": false,
        "changeReason": null,
        "comment": "Filtración realizada con éxito.",
        "completionStatus": "NOT_COMPLETED",
        "currentStage": "FILTRATION",
        "completedAt": null,
        "dataHash": null
      }
      -->
      <template #content>

        <!-- Registrado por -->
        <div class="flex align-items-center gap-2">
          <i class="pi pi-user text-lg"></i>
          <p><strong>Registrado por:</strong> {{ filtrationStage.employee }}</p>
        </div>

        <!-- Datos técnicos -->
        <div class="grid p-2">


          <div class="col-12 md:col-6">
            <p><strong>Fecha de inicio:</strong> {{ filtrationStage.startDate }}</p>
            <p><strong>Tipo de filtro:</strong> {{ filtrationStage.filterType || 'No especificado' }}</p>
            <p><strong>Turbidez inicial:</strong> {{ filtrationStage.initialTurbidity || 'No especificado' }} NTU</p>
            <p><strong>Porosidad:</strong> {{ filtrationStage.porosity || 'No especificado' }} μm</p>
            <p><strong>Presión:</strong> {{ filtrationStage.pressure || 'No especificado' }} bar</p>
            <p><strong>Filtración estéril:</strong> {{ filtrationStage.sterileFiltration ? 'Sí' : 'No' }}</p>
          </div>

          <div class="col-12 md:col-6">
            <p><strong>Fecha de finalización:</strong> {{ filtrationStage.endDate || 'No finalizada' }}</p>
            <p><strong>Medio filtrante:</strong> {{ filtrationStage.filterMedium || 'No especificado' }}</p>
            <p><strong>Turbidez final:</strong> {{ filtrationStage.finalTurbidity || 'No especificado' }} NTU</p>
            <p><strong>Temperatura:</strong> {{ filtrationStage.temperature || 'No especificado' }} °C</p>
            <p><strong>Volumen filtrado:</strong> {{ filtrationStage.filteredVolume || 'No especificado' }} L</p>
            <p><strong>Filtro cambiada:</strong> {{ filtrationStage.changedFiltration ? 'Sí' : 'No' }}</p>
            <p v-if="filtrationStage.changedFiltration"><strong>Motivo del cambio:</strong> {{ filtrationStage.changeReason || 'No especificado' }}</p>
          </div>

        </div>



        <!-- Comentario -->
        <div class="mt-4 w-full">
          <p><strong>Comentario:</strong></p>
          <p class="text-gray-700 ">{{ filtrationStage.comment || 'No hay comentarios.' }}</p>
        </div>


        <!-- Visualización de estado -->
        <div class="flex align-items-center gap-2 mt-4">
          <i
              class="pi text-xl"
              :class="filtrationStage.completionStatus === 'COMPLETED' ? 'pi-check-circle text-green-500' : 'pi-times-circle text-red-500'"
          ></i>
          <span class="text-lg font-medium">
              {{ filtrationStage.completionStatus === 'COMPLETED' ? 'Etapa completada' : 'Etapa no completada' }}
            </span>
        </div>

      </template>
    </pv-card>

    <!-- Diálogo para crear o editar etapa -->
    <filtration-stage-create-and-edit
        :edit="isEdit"
        :item="filtrationStage"
        :visible="createAndEditDialogIsVisible"
        @cancel-requested="onCancelRequested"
        @save-requested="onSaveRequested($event)"
    />

  </div>


</template>

<style>

</style>