<script>

import PressingStageCreateAndEdit from "../components/pressing-stage-create-and-edit.component.vue";
import FermentationStageCreateAndEdit from "../components/fermentation-stage-create-and-edit.component.vue";
import CorrectionStageCreateAndEdit from "../components/correction-stage-create-and-edit.vue";
import ReceptionStageCreateAndEdit from "../components/reception-stage-create-and-edit.component.vue";
import {Stages} from "../model/stages.entity.js";
import {PressingStage} from "../model/pressingStage.entity.js";
import {StagesApiService} from "../services/stages-api.service.js";
import {ClarificationStage} from "../model/clarificationStage.entity.js";
import ClarificationStageCreateAndEdit from "../components/clarification-stage-create-and-edit.component.vue";

export default {
  name:'clarification-stage-management',

  components: {
    ClarificationStageCreateAndEdit,
    PressingStageCreateAndEdit,
    FermentationStageCreateAndEdit, CorrectionStageCreateAndEdit, ReceptionStageCreateAndEdit},

  props:{
    item: null,
    canAddStage: false
  },

  data() {
    return {
      title: { singular: 'Etapa de Fermentación', plural: 'Etapa de Fermentación' },
      itemObject: new Stages({}),
      clarificationStage: new PressingStage({}),
      clarificationStageApiService: null,
      createAndEditDialogIsVisible: false,
      isEdit: false,
      submitted: false,
      stageExist: false, // Assuming you want to check if a stage exists

    }
  },

  computed: {
    canAddStage() {
      return this.item &&
          this.item.pressingStage &&
          this.item.pressingStage.isCompleted === true
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
      this.clarificationStageApiService.create(this.itemObject).then(response => {

        this.clarificationStage = new ClarificationStage(response.data.clarificationStage);
        this.itemObject = new Stages(response.data);

        this.notifySuccessfulAction('Stage created successfully');
      }).catch(error => {
        console.error("Error creating a Stage",error);
      });
    },

    update() {
      this.clarificationStageApiService.update(this.itemObject.id, this.itemObject).then(response => {

        this.clarificationStage = new ClarificationStage(response.data.clarificationStage);
        this.itemObject= new Stages(response.data);

        this.notifySuccessfulAction('Stage updated successfully');
      }).catch(error => {
        console.error("Error updating a Stage",error);
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
      this.itemObject.clarificationStage.isCompleted = true

      this.clarificationStageApiService.update(this.itemObject.id, this.itemObject)
          .then(response => {
            this.clarificationStage = new ClarificationStage(response.data.clarificationStage)
            this.itemObject = new Stages(response.data)
            this.notifySuccessfulAction('Etapa completada correctamente')
          })
          .catch(error => {
            this.clarificationStage.isCompleted = false
            this.itemObject.clarificationStage.isCompleted = false

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
    this.clarificationStageApiService = new StagesApiService ('/stages');


    if (!this.item || !this.item.clarificationStage) {

      this.stageExist = false;

    } else {

      this.itemObject = this.item;
      this.stageExist = true;
      this.clarificationStage = this.item.clarificationStage;

    }

    console.log('RECEPTION STAGE ===================== ', this.clarificationStage);

    console.log("🔍 Reception Stage Management created with item:", this.item);
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
        <h3 class="m-0 text-xl font-medium">Etapa: Clarificación </h3>
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
            v-if="stageExist  && canAddStage /*&& !clarificationStage.isCompleted*/"
        />

        <pv-button
            label="Completar etapa"
            icon="pi pi-check"
            class="p-button-success"
            @click="confirmarCompletarEtapa"
            v-show="stageExist && !clarificationStage.isCompleted"
        />
      </div>
    </div>

    <!-- Mensaje de aviso si no se puede agregar una nueva etapa -->
    <div v-if="!canAddStage" class="p-3 bg-yellow-100 text-yellow-800 border-round">
      <i class="pi pi-exclamation-triangle"></i>
      <span> No se puede agregar una nueva etapa de CLARIFICACIÓN hasta que se complete la etapa de PRENSADO.
      </span>
    </div>


    <!-- Contenido de la etapa -->
    <pv-card v-if="clarificationStage.stage && canAddStage">
      <template #header>
        <h4 class="m-0">Detalles de la etapa de clarificación</h4>
      </template>

      <!-- contenido de la tarjeta -->
      <template #content>

        <div class="flex align-items-center gap-2">
          <i class="pi pi-user text-lg"></i>
          <p><strong>Registrado por:</strong> {{ clarificationStage.registeredBy }}</p>
        </div>

        <div class="grid p-2">
          <div class="col-12 md:col-6">
            <p><strong>Fecha de inicio:</strong> {{ clarificationStage.startDate }}</p>
            <p><strong>Fecha de finalización:</strong> {{ clarificationStage.endDate }}</p>
            <p><strong>Método:</strong> {{ clarificationStage.method }}</p>
          </div>
          <div class="col-12 md:col-6">
            <p><strong>Temperatura (°C):</strong> {{ clarificationStage.temperature }}</p>
            <p><strong>Duración (horas):</strong> {{ clarificationStage.durationHours }}</p>
            <p><strong>Volumen (litros):</strong> {{ clarificationStage.volumeLiters }}</p>
          </div>
          <div class="col-12 md:col-6">
            <p><strong>Agentes clarificantes:</strong></p>
            <ul>
              <li v-for="agent in clarificationStage.clarifyingAgents" :key="agent.name">
                {{ agent.name }} ({{ agent.dose }} g/hL)
              </li>
            </ul>
          </div>
          <div class="col-12 md:col-6">
            <p><strong>Turbidez antes (NTU):</strong> {{ clarificationStage.turbidityBeforeNTU }}</p>
            <p><strong>Turbidez después (NTU):</strong> {{ clarificationStage.turbidityAfterNTU }}</p>
          </div>
        </div>

        <div>
          <p><strong>Comentarios:</strong> {{ clarificationStage.comments }}</p>
        </div>


        <!-- Estado de finalización -->
        <div class="flex align-items-center gap-2 mt-4">
          <i class="pi text-xl" :class="clarificationStage.isCompleted ? 'pi-check-circle text-green-500' : 'pi-times-circle text-red-500'"></i>
          <span class="text-lg font-medium">{{ clarificationStage.isCompleted ? 'Etapa completada' : 'Etapa no completada' }} </span>
        </div>

      </template>

    </pv-card>

    <!-- Diálogo para crear o editar etapa -->
    <clarification-stage-create-and-edit
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