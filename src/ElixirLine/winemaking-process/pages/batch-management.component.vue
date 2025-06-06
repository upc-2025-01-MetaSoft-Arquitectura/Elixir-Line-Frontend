<script>


import {WineBatch} from "../model/wine-batch.entity.js";
import BatchesCreateAndEdit from "../components/batches-create-and-edit.component.vue";
import DataManager from "../../../shared/components/data-manager.component.vue";
import {batchAndCampaignApiService} from "../services/batch-and-campaign-api.service.js";

export default {
  name: "batch-management",
  components: {
    DataManager,
    BatchesCreateAndEdit
  },

  props: {
    campanaName: {
      type: String,
      required: true
    }
  },

  data() {
    return {
      title: { singular: 'Batch', plural: 'Batches' },
      batches: [],
      batch: new WineBatch({}),
      selectedBatches: [],
      batchAndCampaignApiService: null,
      createAndEditDialogIsVisible: false,
      taskDialogIsVisible: false,
      isEdit: false,
      submitted: false,
    }
  },



  methods: {

    //#region Utility Methods
    notifySuccessfulAction(message) {
      this.$toast.add({severity: 'success', summary: 'Success', detail: message, life: 3000});
    },

    findIndexById(id) {
      return this.batches.findIndex(batch => batch.id === id);
    },
    //#endregion

    //#region Event Handlers
    onNewItem() {
      this.batch = new WineBatch({});
      this.isEdit = false;
      this.submitted = false;
      this.createAndEditDialogIsVisible = true;
    },

    onEditItem(item) {
      this.batch = new WineBatch(item);
      this.isEdit = true;
      this.submitted = false;
      this.createAndEditDialogIsVisible = true;
      this.taskDialogIsVisible = false;
    },

    onDeleteItem(item) {
      this.batch = new WineBatch(item);
      this.deleteBatch();
      this.taskDialogIsVisible = false;
    },

    onAddTaskItem(employee) {
      this.selectedEmployeeForTask = employee;
      this.taskObject = {
        employee: employee,
        batchInternalCode: '',
        currentStage: '',
        title: '',
        dueDate: null,
        description: ''
      };
      this.taskDialogIsVisible = true;

      this.loadAvailableBatches(); // Cargar dropdown si no lo tienes aún
    },

    onCancelTask() {
      this.taskDialogIsVisible = false;
    },

    onSaveTask() {
      const taskToSend = {
        employeeId: this.selectedEmployeeForTask.id,
        batchInternalCode: this.taskObject.batchInternalCode,
        currentStage: this.taskObject.currentStage,
        status: this.taskObject.status,
        title: this.taskObject.title,
        dueDate: this.taskObject.dueDate,
        description: this.taskObject.description
      };

      this.batchApiService.createTask(taskToSend)
          .then(() => {
            this.notifySuccessfulAction("¡Tarea guardada exitosamente!");
            this.taskDialogIsVisible = false;
          })
          .catch((error) => {
            console.error("Error al guardar tarea:", error);
          });
    },


    onDeleteSelectedItems(selectedItems) {
      this.selectedBatches = selectedItems;
      this.deleteSelectedBatches();
    },

    onCancelRequested() {
      this.createAndEditDialogIsVisible = false;
      this.taskDialogIsVisible = false;
      this.submitted = false;
      this.isEdit = false;
    },

    onSaveRequested(item) {

      console.log('onSaveRequestedManagement', item);
      this.submitted = true;

      if (item.id) {
        this.updateBatch();
      } else {
        this.createBatch();
      }

      this.createAndEditDialogIsVisible = false;
      this.isEdit = false;
    },
    //#endregion

    //#region CRUD Operations
    createBatch() {
      this.batchAndCampaignApiService.create(this.batch).then(response => {
        let newBatch = new WineBatch(response.data);
        this.batches.push(newBatch);
        this.notifySuccessfulAction('Batch created successfully');
      }).catch(error => {
        console.error("Error creating a batch",error);
      });
    },

    updateBatch() {
      this.batchAndCampaignApiService.update(this.batch.id, this.batch).then(response => {
        let index = this.findIndexById(this.batch.id);
        this.batches[index] = new WineBatch(response.data);
        this.notifySuccessfulAction('Batch updated successfully');
      }).catch(error => {
        console.error("Error updating a batch",error);
      });
    },

    deleteBatch() {
      this.batchAndCampaignApiService.delete(this.batch.id).then(() => {
        let index = this.findIndexById(this.batch.id);
        this.batches.splice(index, 1);
        this.notifySuccessfulAction('Batch deleted successfully');
      }).catch(error => {
        console.error("Error deleting a batch",error);
      });
    },

    deleteSelectedBatches() {
      this.selectedBatches.forEach((variable) => {
        this.batchAndCampaignApiService.delete(variable.id).then(() => {
          this.batches = this.batches.filter((b) => b.id !== variable.id);
        }).catch(error => {
          console.error("Error deleting a batch", error);
        });
      });

      this.notifySuccessfulAction('Batches deleted successfully');
    },
    //#endregion

    getAllBatches() {

      this.batchAndCampaignApiService.getAllResources().then(response => {

        this.batches = response.data.map(batch => new WineBatch(batch));

        console.log("Batch resources", this.batches);
      }).catch(error => {
        console.error("Error getting batches",error);
      });
    }
  },



  //#region Lifecycle Hooks
  created() {
    this.batchAndCampaignApiService = new batchAndCampaignApiService('/wine-batches');

    this.getAllBatches();
    console.log('Batch Management component created');
  }
  //#endregion

}
</script>

<template>

  <div class="page-container-batch-management flex w-full h-full">


    <div class="data-table-container pt-2 h-full flex-1 overflow-hidden flex flex-column">

      <data-manager :title="title"
                    v-bind:items="batches"
                    v-bind:label-name="$t('winemaking.button-new-batch')"
                    v-on:new-item-requested-manager="onNewItem"
                    v-on:edit-item-requested-manager="onEditItem($event)"
                    v-on:delete-item-requested-manager="onDeleteItem($event)"
                    v-on:add-task-item-requested-manager="onAddTaskItem($event)"
                    v-on:delete-selected-items-requested-manager="onDeleteSelectedItems($event)" >

        <template #custom-columns-manager >
          <!--
          <pv-column
              :sortable="true"
              field="id"
              header="Id"
          />
          -->
          <pv-column
              :sortable="true"
              field="internalCode"
              header="Code"
          />

          <pv-column
              :sortable="true"
              field="receptionDate"
              header="Reception"
          />

          <pv-column
              :sortable="true"
              field="harvestCampaign"
              header="Campaign"
          />

          <pv-column
              :sortable="true"
              field="vineyardOrigin"
              header="Vineyard"
          />

          <pv-column
              :sortable="true"
              field="grapeVariety"
              header="Grape Variety"
          />

          <pv-column
              :sortable="true"
              field="initialGrapeQuantityKg"
              header="Quantity Kg"
          />

          <pv-column
              :sortable="true"
              field="createdBy"
              header="Created By"
          />

          <pv-column
              :sortable="true"
              field="status"
              header="Status"
          />

          <pv-column
              :sortable="true"
              field="currentStage"
              header="Stage"
          />

        </template>
      </data-manager>

      <batches-create-and-edit
          :edit = "isEdit"
          :item-entity="batch"
          :visible="createAndEditDialogIsVisible"
          v-on:cancel-requested="onCancelRequested"
          v-on:save-requested="onSaveRequested($event)">
      </batches-create-and-edit>

      <pv-dialog
          :visible="taskDialogIsVisible"
          modal
          header="Asignar Tarea"
          @hide="onCancelRequested"
          class="task-dialog"
      >
        <div class="task-form">

          <div class="field">
            <label class="field-label">Título de la tarea</label>
            <pv-input-text class="field-input" v-model="taskObject.title" />
          </div>

          <div class="field">
            <label class="field-label">Trabajador</label>
            <pv-select
                class="field-input"
                v-model="taskObject.batchInternalCode"
                :options="availableBatches"
                optionLabel="internalCode"
                optionValue="internalCode"
                placeholder="Trabajador"
                @change="onBatchChanged"
            />
          </div>

          <div class="field">
            <label class="field-label">Trabajador</label>
            <pv-select
                class="field-input"
                :value="selectedEmployeeForTask.firstName + ' ' + selectedEmployeeForTask.lastName"
            />
          </div>

          <div class="field">
            <label class="field-label">Parcela</label>
            <pv-input-text
                class="field-input"
                :value="selectedEmployeeForTask.firstName + ' ' + selectedEmployeeForTask.lastName"
                disabled
            />
          </div>

          <div class="field">
            <label class="field-label">Insumos agricolas</label>
            <pv-select
                class="field-input"
                v-model="taskObject.batchInternalCode"
                :options="availableBatches"
                optionLabel="internalCode"
                optionValue="internalCode"
                placeholder="Insumos"
                @change="onBatchChanged"
            />
          </div>

          <div class="field">
            <label class="field-label">Fecha límite</label>
            <pv-calendar class="field-input" v-model="taskObject.dueDate" show-icon />
          </div>

          <div class="field">
            <label class="field-label">Descripción</label>
            <pv-textarea class="field-input" v-model="taskObject.description" rows="3" auto-resize />
          </div>
        </div>

        <template #footer>
          <div class="dialog-footer">
            <pv-button label="Cancelar" icon="pi pi-times" @click="onCancelTask" class="p-button-text" />
            <pv-button label="Guardar" icon="pi pi-check" @click="onSaveTask" autofocus />
          </div>
        </template>
      </pv-dialog>

    </div>
  </div>

</template>

<style>

.task-dialog {
  width: 100%;
  max-width: 500px;
}

.task-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding-top: 0.5rem;
}

.field-label {
  font-weight: 600;
  margin-bottom: 0.25rem;
  display: block;
  color: #333;
}

.field-input {
  width: 100%;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}

.p-datatable-column-header-content {
  font-size: 0.85rem;
  font-weight: 600;
  text-align: center;

}

.p-datatable-header-cell {
  font-size: 1rem;
  font-weight: 600;
  text-align: center;
}


.p-datatable-header-cell {

  font-size: 0.8rem;
  font-weight: 600;
  text-align: center;
}

.p-datatable-tbody > tr > td {
  font-size: 0.75rem;
  font-weight: 400;
  text-align: center;
}

</style>