<script>

import {Stages} from "../model/stages.entity.js";
import {StagesApiService} from "../services/stages-api.service.js";
import {CorrectionStage} from "../model/correctionStage.entity.js";
import ReceptionStageCreateAndEdit from "../components/reception-stage-create-and-edit.component.vue";
import CorrectionStageCreateAndEdit from "../components/correction-stage-create-and-edit.vue";

export default {
  name: 'correction-stage-management',
  components: {CorrectionStageCreateAndEdit, ReceptionStageCreateAndEdit},

  props:{
    item: null,
  },

  data() {
    return {
      title: { singular: 'Etapa de Corrección', plural: 'Etapa de Corrección' },
      itemObject: new Stages({}),
      correctionStage: new CorrectionStage({}),
      correctionStageApiService: null,
      createAndEditDialogIsVisible: false,
      isEdit: false,
      submitted: false,
      stageExist: false, // Assuming you want to check if a stage exists
      canAddStage: false, // Controla si se puede agregar una nueva etapa
    }
  },

  computed: {
    canAddStage() {
      return this.item &&
          this.item.receptionStage &&
          this.item.receptionStage.isCompleted === true
    }
  },

  methods: {

    //#region Utility Methods
    notifySuccessfulAction(message) {
      this.$toast.add({severity: 'success', summary: 'Success', detail: message, life: 3000});
    },


    //#region Event Handlers
    onNewItem() {
      this.itemObject = this.item;
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
      this.correctionStageApiService.create(this.itemObject).then(response => {

        this.correctionStage = new CorrectionStage(response.data.correctionStage);
        this.itemObject = new Stages(response.data);

        this.notifySuccessfulAction('Stage created successfully');
      }).catch(error => {
        console.error("Error creating a Stage",error);
      });
    },

    update() {
      this.correctionStageApiService.update(this.itemObject.id, this.itemObject).then(response => {

        this.correctionStage = new CorrectionStage(response.data.correctionStage);
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
      this.itemObject.correctionStage.isCompleted = true

      this.correctionStageApiService.update(this.itemObject.id, this.itemObject)
          .then(response => {
            this.correctionStage = new CorrectionStage(response.data.correctionStage)
            this.itemObject = new Stages(response.data)
            this.notifySuccessfulAction('Etapa completada correctamente')
          })
          .catch(error => {
            this.correctionStage.isCompleted = false
            this.itemObject.correctionStage.isCompleted = false

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
    this.correctionStageApiService = new StagesApiService ('/stages');

    if (!this.item || !this.item.correctionStage) {
      this.stageExist = false;
    } else {
      this.itemObject = this.item;
      this.stageExist = true;
      this.correctionStage = this.item.correctionStage;
    }

    console.log('RECEPTION STAGE ===================== ', this.correctionStage);

    console.log('CAN STAGE ===================== ', this.canAddStage);

    console.log("Reception Stage Management component created");
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
            @click="onNewItem()"
            class="p-button-success"
            v-if="!stageExist && canAddStage"
        />

        <pv-button
            label="Editar"
            icon="pi pi-pencil"
            @click="onEditItem(itemObject)"
            class="p-button-warning"
            v-if="stageExist  && canAddStage /*&& !correctionStage.isCompleted*/"
        />

        <pv-button
            label="Completar etapa"
            icon="pi pi-check"
            class="p-button-success"
            @click="confirmarCompletarEtapa"
            v-show="stageExist && !correctionStage.isCompleted"
        />
      </div>
    </div>

    <!-- Mensaje de aviso si no se puede agregar una nueva etapa -->
    <div v-if="!canAddStage" class="p-3 bg-yellow-100 text-yellow-800 border-round">
      <i class="pi pi-exclamation-triangle"></i>
      <span> No se puede agregar una nueva etapa de CORRECCIÓN hasta que se complete la etapa de RECEPCIÓN. </span>
    </div>

    <!-- Detalles de la etapa de corrección -->
    <pv-card v-if="correctionStage.stage && canAddStage === true">
      <template #header>
        <h4 class="m-0">Detalles de la etapa de corrección</h4>
      </template>

      <template #content>

        <div class="flex align-items-center gap-2">
          <i class="pi pi-user text-lg"></i>
          <p><strong>Registrado por:</strong> {{ correctionStage.registeredBy }}</p>
        </div>

        <div class="grid p-2">
          <div class="col-12 md:col-6">
            <p><strong>Registrado por:</strong> {{ correctionStage.registeredBy }}</p>
            <p><strong>Fecha de inicio:</strong> {{ correctionStage.startDate }}</p>
            <p><strong>Fecha de finalización:</strong> {{ correctionStage.endDate }}</p>
            <p><strong>Brix inicial:</strong> {{ correctionStage.initialBrix }}</p>
          </div>
          <div class="col-12 md:col-6">
            <p><strong>Brix final:</strong> {{ correctionStage.finalBrix }}</p>
            <p><strong>Azúcar añadido (kg):</strong> {{ correctionStage.addedSugarKg }}</p>
            <p><strong>pH inicial:</strong> {{ correctionStage.initialPH }}</p>
            <p><strong>pH final:</strong> {{ correctionStage.finalPH }}</p>
          </div>
          <div class="col-12 md:col-6">
            <p><strong>Tipo de ácido:</strong> {{ correctionStage.acidType }}</p>
            <p><strong>Ácido añadido (g/L):</strong> {{ correctionStage.acidAddedGL }}</p>
            <p><strong>Sulfitos añadidos (mg/L):</strong> {{ correctionStage.SO2AddedMgL }}</p>
          </div>
          <div class="col-12 md:col-6">
            <p v-for="(nutrient, index) in correctionStage.nutrientsAdded" :key="index">
              <strong>Nutriente añadido:</strong> {{ nutrient.name }} ({{ nutrient.quantity }} mg/L)
            </p>
            <p><strong>Justificación:</strong> {{ correctionStage.justification }}</p>
            <p><strong>Comentarios:</strong> {{ correctionStage.comments }}</p>
          </div>
        </div>

        <!-- Estado de finalización -->
        <div class="flex align-items-center gap-2 mt-4">
          <i class="pi text-xl" :class="correctionStage.isCompleted ? 'pi-check-circle text-green-500' : 'pi-times-circle text-red-500'"></i>
          <span class="text-lg font-medium">{{ correctionStage.isCompleted ? 'Etapa completada' : 'Etapa no completada' }} </span>
        </div>


      </template>
    </pv-card>

    <!-- Diálogo para crear o editar etapa -->
    <correction-stage-create-and-edit
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