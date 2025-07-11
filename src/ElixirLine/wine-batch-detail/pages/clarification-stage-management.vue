<script>

import PressingStageCreateAndEdit from "../components/pressing-stage-create-and-edit.component.vue";
import FermentationStageCreateAndEdit from "../components/fermentation-stage-create-and-edit.component.vue";
import CorrectionStageCreateAndEdit from "../components/correction-stage-create-and-edit.vue";
import ReceptionStageCreateAndEdit from "../components/reception-stage-create-and-edit.component.vue";
import {PressingStage} from "../model/pressingStage.entity.js";
import {ClarificationStage} from "../model/clarificationStage.entity.js";
import ClarificationStageCreateAndEdit from "../components/clarification-stage-create-and-edit.component.vue";
import {CreateClarificationStage} from "../model/create-clarification-stage.entity.js";
import {PressingStageApiService} from "../services/pressing-stage-api.service.js";
import {ClarificationStageApiService} from "../services/clarification-stage-api.service.js";

export default {
  name:'clarification-stage-management',

  components: {
    ClarificationStageCreateAndEdit,
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

      // Objeto de la etapa de clarificación y prensado
      clarificationStage: new ClarificationStage({}),
      pressingStage: new PressingStage({}),

      // Objeto para crear una nueva etapa de clarificación
      createClarificationStage : new CreateClarificationStage({}),

      // Servicios de la etapa de clarificación y prensado
      clarificationStageApiService: null,
      pressingStageApiService: null,


      createAndEditDialogIsVisible: false,

      isEdit: false,

      submitted: false,

    }
  },

  computed: {
    canAddStage() {
      return this.pressingStage && this.pressingStage.completionStatus === 'COMPLETED';
    }
  },

  methods: {

    //#region Utility Methods
    notifySuccessfulAction(message) {
      this.$toast.add({severity: 'success', summary: 'Success', detail: message, life: 3000});
    },

    //#region Event Handlers
    onNewItem() {
      this.clarificationStage = new ClarificationStage({});
      console.log('======================= NEW ITEM MANAGEMENT', this.clarificationStage);
      this.isEdit = false;
      this.submitted = false;
      this.createAndEditDialogIsVisible = true;
    },

    onEditItem(item) {
      console.log('======================= EDIT ITEM MANAGEMENT', item);
      this.clarificationStage = new ClarificationStage(item);
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

      // Formatear en los tipos de datos correctos
      this.createClarificationStage.employee = this.clarificationStage.employee;
      // formato de fecha yyyy-mm-dd
      // Para startDate, en caso sea nulo se asigna la fecha actual.
      this.createClarificationStage.startDate = this.clarificationStage.endDate ? this.clarificationStage.endDate : new Date().toISOString().split('T')[0];
      // formato de fecha yyyy-mm-dd
      // Para endDate, asignar la fecha de inicio más un día si es nulo.
      this.createClarificationStage.endDate = this.clarificationStage.endDate ? this.clarificationStage.endDate : new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0];
      this.createClarificationStage.methodUsed = this.clarificationStage.methodUsed;
      // Asegurarse de que initialTurbidity sea un número
      this.createClarificationStage.initialTurbidity = this.clarificationStage.initialTurbidity ? parseFloat(this.clarificationStage.initialTurbidity) : 0.0;
      // Asegurarse de que finalTurbidity sea un número
      this.createClarificationStage.finalTurbidity = this.clarificationStage.finalTurbidity ? parseFloat(this.clarificationStage.finalTurbidity) : 0.0;
      // Asegurarse de que volume sea un número
      this.createClarificationStage.volume = this.clarificationStage.volume ? parseFloat(this.clarificationStage.volume) : 0.0;
      // Asegurarse de que temperature sea un número
      this.createClarificationStage.temperature = this.clarificationStage.temperature ? parseFloat(this.clarificationStage.temperature) : 0.0;
      // Asegurarse de que duration sea un número
      this.createClarificationStage.duration = this.clarificationStage.duration ? parseInt(this.clarificationStage.duration) : 1;
      // Asegurarse de que clarifyingAgents sea un objeto
      this.createClarificationStage.clarifyingAgents = this.clarificationStage.clarifyingAgents;
      // Asegurarse de que comment sea una cadena
      this.createClarificationStage.comment = this.clarificationStage.comment;


      this.clarificationStageApiService.create(this.batchId, this.createClarificationStage).then(response => {

        this.clarificationStage = new ClarificationStage(response.data);

        this.notifySuccessfulAction('Stage created successfully');
      }).catch(error => {
        console.error("Error creating a Stage",error);
        console.error('🔴 Message:', error.message);
        console.error('🔴 Status:', error.response?.status);
        console.error('🔴 Details:', error.response?.data);
      });
    },

    update() {

      this.clarificationStageApiService.patch(this.batchId, this.clarificationStage).then(response => {

        this.clarificationStage = new ClarificationStage(response.data);

        this.notifySuccessfulAction('Stage updated successfully');
      }).catch(error => {
        console.error("Error updating a Stage",error);
        console.error('🔴 Message:', error.message);
        console.error('🔴 Status:', error.response?.status);
        console.error('🔴 Details:', error.response?.data);
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
      return this.clarificationStage.employee.trim() !== '' &&
          this.clarificationStage.startDate !== null &&
          this.clarificationStage.endDate !== null &&
          this.clarificationStage.methodUsed.trim() !== '' &&
          this.clarificationStage.initialTurbidity >= 0 &&
          this.clarificationStage.finalTurbidity >= 0 &&
          this.clarificationStage.volume >= 0 &&
          this.clarificationStage.temperature >= 0 &&
          this.clarificationStage.duration > 0 &&
          Object.keys(this.clarificationStage.clarifyingAgents).length > 0 && // Asegura que haya al menos un agente clarificante
          this.clarificationStage.comment.trim() !== '';
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



      this.clarificationStage.completionStatus = 'COMPLETED'

      this.clarificationStageApiService.patch(this.clarificationStage.batchId, this.clarificationStage)
          .then(response => {
            this.clarificationStage = new ClarificationStage(response.data)
            this.notifySuccessfulAction('Etapa completada correctamente')
            console.log("== ETAPA DE RECEPCIÓN COMPLETADA ==", this.clarificationStage)
          })
          .catch(error => {
            this.clarificationStage.completionStatus = 'NOT_COMPLETED'

            console.error('❌ Error al completar la etapa:', error)
            this.$toast.add({
              severity: 'error',
              summary: 'Error',
              detail: 'No se pudo completar la etapa.',
              life: 3000
            })
          })
    },

    copyHashToClipboard(hash) {
      navigator.clipboard.writeText(hash).then(() => {
        this.$toast.add({
          severity: 'success',
          summary: 'Hash copiado',
          detail: 'Se ha copiado el hash al portapapeles.',
          life: 2000
        });
      }).catch(() => {
        this.$toast.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo copiar el hash.',
          life: 2000
        });
      });
    },


  },


  //#region Lifecycle Hooks
  created() {
    this.batchId = this.item.id;
    this.clarificationStageApiService = new ClarificationStageApiService('/batches');
    this.pressingStageApiService = new PressingStageApiService('/batches');

    this.getClarificationStage();
    this.getPressingStage();

  },

  //#endregion
}

</script>

<template>

  <div class="pressing-container flex flex-column flex-1 w-full h-full gap-3 p-3 surface-ground overflow-auto">



    <!-- ================================================================================ -->
    <!-- Mostrar el hash del lote luego de que la etapa de recepción esté completada -->
    <div
        v-if="clarificationStage.id && clarificationStage.completionStatus === 'COMPLETED' && clarificationStage.dataHash"
        class="flex flex-wrap justify-content-between align-items-center gap-2 border-bottom-1 surface-border surface-ground pb-3"
    >
      <!-- Icono de verificación -->
      <i class="pi pi-shield text-2xl text-green-700"></i>
      <!-- Mostrar el hash del lote -->
      <div class="flex flex-column">
        <span class="text-sm font-semibold">Hash del Lote (verificación):</span>
        <code class="text-xs break-words max-w-[250px] bg-green-50 p-1 rounded-md border border-green-200">
          {{ clarificationStage.dataHash }}
        </code>
      </div>

      <!-- Botón para copiar el hash al portapapeles -->
      <pv-button
          icon="pi pi-copy"
          class="p-button-text text-green-700"
          @click="copyHashToClipboard(clarificationStage.dataHash)"
          label="Copiar Hash"
      />

    </div>
    <!-- =============================================================================== -->






    <!-- Encabezado y botones de acción -->
    <div class="flex flex-wrap justify-content-between align-items-center gap-4 border-bottom-1 surface-border pb-3">

      <!-- Título de la etapa -->
      <div class="flex align-items-center gap-2">
        <i class="pi pi-cog text-xl"></i>
        <h3 class="m-0 text-xl font-medium">Etapa: Clarificación </h3>
      </div>


      <!-- Botones de acción -->
      <div class="flex flex-wrap gap-2">
        <pv-button
            label="Nueva Etapa"
            icon="pi pi-plus"
            @click="onNewItem"
            class="p-button-success"
            v-if="!clarificationStage.id && canAddStage"
        />

        <pv-button
            label="Editar"
            icon="pi pi-pencil"
            @click="onEditItem(clarificationStage)"
            class="p-button-warning"
            v-if="clarificationStage.id  && clarificationStage.completionStatus !== 'COMPLETED'"
        />

        <pv-button
            label="Completar etapa"
            icon="pi pi-check"
            class="p-button-success"
            @click="confirmarCompletarEtapa"
            v-if="clarificationStage.id  && clarificationStage.completionStatus !== 'COMPLETED'"
        />

      </div>
    </div>

    <!-- Mensaje de aviso si no se puede agregar una nueva etapa -->
    <div v-if="!canAddStage" class="p-3 bg-yellow-100 text-yellow-800 border-round">
      <i class="pi pi-exclamation-triangle"></i>
      <span> No se puede agregar una nueva etapa de CLARIFICACIÓN hasta que se complete la etapa de PRENSADO.
      </span>
    </div>

    <!-- Mensaje de aviso si no hay una etapa de corrección -->
    <div v-if="canAddStage && !clarificationStage.id "
         class="p-3 bg-red-100 text-red-800 border-round">
      <i class="pi pi-exclamation-triangle"></i>
      <span> No hay una etapa de PRENSADO registrada para este lote. </span>
    </div>

    <!-- contenido de la tarjeta -->
    <pv-card v-if="clarificationStage && clarificationStage.id && canAddStage === true">

      <template #content>

        <div class="flex align-items-center gap-2">
          <i class="pi pi-user text-lg"></i>
          <p><strong>Registrado por:</strong> {{ clarificationStage.employee }}</p>
        </div>

        <div class="grid p-2">

          <div class="col-12 md:col-6">
            <p><strong>Fecha de inicio: </strong> {{ clarificationStage.startDate }}</p>
            <p><strong>Turbidez inicial: </strong> {{ clarificationStage.initialTurbidity }} NTU</p>
            <p><strong>Método usado: </strong>  {{ clarificationStage.methodUsed }}</p>
            <p><strong>Temperatura: </strong> {{ clarificationStage.temperature }} °C</p>
          </div>

          <div class="col-12 md:col-6">
            <p><strong>Fecha fin:</strong> {{ clarificationStage.endDate }}</p>
            <p><strong>Turbidez final:</strong> {{ clarificationStage.finalTurbidity }} NTU</p>
            <p><strong>Volumen tratado:</strong> {{ clarificationStage.volume }} L</p>
            <p><strong>Duración:</strong> {{ clarificationStage.duration }} horas</p>
          </div>

          <!-- Agentes clarificantes en linea separado por comas-->
          <div class="col-12">
            <p>
              <strong>Agentes clarificantes: </strong>
              <span v-if="clarificationStage.clarifyingAgents && Object.keys(clarificationStage.clarifyingAgents).length > 0">
                {{ Object.entries(clarificationStage.clarifyingAgents).map(([key, value]) => `${key}: ${value} g`).join(', ') }}
              </span>
            </p>

          </div>

          <!-- Comentario -->
          <div class="mt-4 w-full">
            <p><strong>Comentario:</strong></p>
            <p class="text-gray-700 ">{{ clarificationStage.comment || 'No hay comentarios.' }}</p>
          </div>

          <!-- Visualización de estado -->
          <div class="flex align-items-center gap-2 mt-4">
            <i
                class="pi text-xl"
                :class="clarificationStage.completionStatus === 'COMPLETED' ? 'pi-check-circle text-green-500' : 'pi-times-circle text-red-500'"
            ></i>
            <span class="text-lg font-medium">
              {{ clarificationStage.completionStatus === 'COMPLETED' ? 'Etapa completada' : 'Etapa no completada' }}
            </span>
          </div>


        </div>

      </template>

    </pv-card>

    <!-- Diálogo para crear o editar etapa -->
    <clarification-stage-create-and-edit
        :edit="isEdit"
        :item="clarificationStage"
        :visible="createAndEditDialogIsVisible"
        @cancel-requested="onCancelRequested"
        @save-requested="onSaveRequested($event)"
    />

  </div>

</template>

<style>

</style>