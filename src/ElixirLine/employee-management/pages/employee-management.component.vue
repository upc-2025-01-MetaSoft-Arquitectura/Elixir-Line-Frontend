<script>
import DataManager from "../../../shared/components/data-manager.component.vue";
import {FieldWorker} from "../model/employee.entity.js";
import {FieldWorkerApiService} from "../services/fieldWorker-api.service.js";
import EmployeeCreateAndEdit from "../component/employee-create-and-edit.component.vue";
import BasePageLayout from "../../../shared/components/base-page-layout.component.vue";
import {WineBatchesApiService} from "../../winemaking-process/services/wine-batches-api.service.js";

export default {
  name: "employee-management",

  components: {
    BasePageLayout,
    EmployeeCreateAndEdit,
    DataManager,
  },

  data() {
    return {
      title: { singular: 'FieldWorker', plural: 'FieldWorkers' },
      arrayItems: [],
      itemObject: new FieldWorker({}),
      selectedItems: [],
      batchAndCampaignApiService: null,
      createAndEditDialogIsVisible: false,
      isEdit: false,
      submitted: false,
      taskDialogIsVisible: false,
      selectedFieldWorkerForTask: {},
      typeOptions: [
        { label: 'INDUSTRIAL', value: 'INDUSTRIAL' },
        { label: 'CAMPO', value: 'CAMPO' }
      ],
      taskObject: {
        id: '',
        title: '',
        description: '',
        startDate: '',
        endDate: '',
        winegrowerId: '',
        fieldWorkerName: '',
        batchId: '',
        inputsIds: [],
        progressPercentage: 0,
        status: 'IN_PROGRESS',
        type: '',
        inputs: []
      },
      availableBatches: [],
    }
  },



  methods: {

    //#region Utility Methods
    notifySuccessfulAction(message) {
      this.$toast.add({severity: 'success', summary: 'Success', detail: message, life: 3000});
    },

    findIndexById(id) {
      return this.arrayItems.findIndex(item => item.id === id);
    },
    //#endregion

    //#region Event Handlers
    onNewItem() {
      this.itemObject = new FieldWorker({});
      this.isEdit = false;
      this.submitted = false;
      this.createAndEditDialogIsVisible = true;
    },
    onAddTaskItem(fieldWorker) {
      this.selectedFieldWorkerForTask = fieldWorker;
      this.taskObject = {
        id: '',
        title: '',
        description: '',
        startDate: '',
        endDate: '',
        winegrowerId: '',
        fieldWorkerName: fieldWorker.name + ' ' + fieldWorker.lastname,
        batchId: '',
        inputsIds: [],
        progressPercentage: 0,
        status: 'IN_PROGRESS',
        type: '',
        inputs: []
      };
      this.taskDialogIsVisible = true;
      this.loadAvailableBatches();
    },

    loadAvailableBatches() {
      const batchApiService = new EmployeeApiService('/wine-batches'); // o crea un servicio separado si prefieres

      batchApiService.getAllResources().then(response => {
        this.availableBatches = response.data;
      }).catch(error => {
        console.error("Error loading batches", error);
      });
    },


    async onBatchChanged() {
      if (!this.taskObject.relatedId) {
        this.taskObject.status = '';
        return;
      }

      try {
        const response = await this.batchApiService.getStatusByInternalCode(this.taskObject.relatedId);
        if (response.data && response.data.length > 0) {
          const batchInfo = response.data[0];
          this.taskObject.status = batchInfo.status || '';
        } else {
          this.taskObject.status = '';
        }
      } catch (error) {
        console.error("Error fetching batch status", error);
        this.taskObject.status = '';
      }
    },



    onCancelTask() {
      this.taskDialogIsVisible = false;
    },

    onSaveTask() {
      const taskToSend = {
        id: this.taskObject.id || undefined,
        title: this.taskObject.title,
        description: this.taskObject.description,
        startDate: this.taskObject.startDate,
        endDate: this.taskObject.endDate,
        winegrowerId: this.taskObject.winegrowerId,
        fieldWorkerName: this.selectedFieldWorkerForTask.name + ' ' + this.selectedFieldWorkerForTask.lastname,
        batchId: this.taskObject.batchId,
        inputsIds: this.taskObject.inputsIds,
        progressPercentage: this.taskObject.progressPercentage,
        status: this.taskObject.status,
        type: this.taskObject.type,
        inputs: this.taskObject.inputs
      };

      this.batchApiService.createTask(taskToSend)
          .then(() => {
            this.notifySuccessfulAction("Task saved successfully!");
            this.taskDialogIsVisible = false;
          })
          .catch((error) => {
            console.error("Error saving task:", error);
          });
    },



    onEditItem(item) {
      this.itemObject = new FieldWorker(item);
      this.isEdit = true;
      this.submitted = false;
      this.createAndEditDialogIsVisible = true;
    },

    onDeleteItem(item) {
      this.itemObject = new FieldWorker(item);
      this.deleteBatch();
    },

    onDeleteSelectedItems(selectedItems) {
      this.selectedItems = selectedItems;
      this.deleteSelectedItems();
    },

    onCancelRequested() {
      this.createAndEditDialogIsVisible = false;
      this.submitted = false;
      this.isEdit = false;
    },

    onSaveRequested(item) {

      console.log('onSaveRequestedManagement', item);

      this.submitted = true;

      if (item.id) {
        this.update();
      } else {
        this.create();
      }

      this.createAndEditDialogIsVisible = false;
      this.isEdit = false;
    },
    //#endregion

    //#region CRUD Operations
    create() {
      this.batchAndCampaignApiService.create(this.itemObject).then(response => {
        let newItem = new FieldWorker(response.data);
        this.arrayItems.push(newItem);
        this.notifySuccessfulAction('Employee created successfully');
      }).catch(error => {
        console.error("Error creating a Employee",error);
      });
    },

    update() {
      this.batchAndCampaignApiService.update(this.itemObject.id, this.itemObject).then(response => {
        let index = this.findIndexById(this.itemObject.id);
        this.arrayItems[index] = new FieldWorker(response.data);
        this.notifySuccessfulAction('Employee updated successfully');
      }).catch(error => {
        console.error("Error updating a Employee",error);
      });
    },

    delete() {
      this.batchAndCampaignApiService.delete(this.itemObject.id).then(() => {
        let index = this.findIndexById(this.itemObject.id);
        this.arrayItems.splice(index, 1);
        this.notifySuccessfulAction('Employee deleted successfully');
      }).catch(error => {
        console.error("Error deleting a Employee",error);
      });
    },

    deleteSelectedItems() {
      this.selectedItems.forEach((variable) => {
        this.batchAndCampaignApiService.delete(variable.id).then(() => {
          this.arrayItems = this.arrayItems.filter((b) => b.id !== variable.id);
        }).catch(error => {
          console.error("Error deleting a Employee", error);
        });
      });

      this.notifySuccessfulAction('Employees deleted successfully');
    },
    //#endregion

    getAllFieldWorkers() {
      this.batchAndCampaignApiService.getAllFieldWorkers().then(response => {
        this.arrayItems = response.data.map(resource => new FieldWorker(resource));
      }).catch(error => {
        console.error("Error getting FieldWorkers", error);
      });
    }
  },


  //#region Lifecycle Hooks
  created() {

    this.batchAndCampaignApiService = new FieldWorkerApiService();
    this.batchApiService = new WineBatchesApiService();

    this.getAllFieldWorkers();

    console.log("Employees Management component created");
  }
  //#endregion

}

</script>
<template>

<div class="employee-container h-full flex-1 overflow-hidden flex flex-column">

    <div class="border-bottom-1 border-300">
      <h2>{{$t('components.title-employees')}}</h2>
    </div>

    <!-- Scroll solo dentro del área del contenido -->

  <div class="data-table-container pt-2 h-full flex-1 overflow-hidden flex flex-column">

    <data-manager
        :title="title"
        :items="arrayItems"
        :label-name="$t('employees.button-new-employee')"
        @new-item-requested-manager="onNewItem"
        @edit-item-requested-manager="onEditItem($event)"
        @add-task-item-requested-manager="onAddTaskItem($event)"
        @delete-item-requested-manager="onDeleteItem($event)"
        @delete-selected-items-requested-manager="onDeleteSelectedItems($event)"
    >

      <template #custom-columns-manager>
        <pv-column
            :sortable
            field="name"
            header="Nombre" />

        <pv-column
            :sortable
            field="lastname"
            header="Apellido" />
        

        <pv-column
            :sortable
            field="phoneNumber"
            header="Phone Number" />

        <pv-column
            :sortable
            field="status"
            header="Estado" />

      </template>
      <template #actions="slotProps">
        <pv-button
            icon="pi pi-check-square"
            outlined
            rounded
            severity="info"
            class="mr-2"
            @click="() => { console.log('slotProps', slotProps); onAddTaskItem(slotProps.data); }"
        />
      </template>
    </data-manager>

    <employee-create-and-edit
        :edit="isEdit"
        :item-entity="itemObject"
        :visible="createAndEditDialogIsVisible"
        @cancel-requested="onCancelRequested"
        @save-requested="onSaveRequested($event)"
    />
    <pv-dialog
        :visible="taskDialogIsVisible"
        modal
        header="Asignar Tarea"
        @hide="onCancelTask"
        class="task-dialog"
    >
      <div class="task-form">
        <div class="field">
          <label class="field-label">Assignee</label>
          <pv-input-text
              class="field-input"
              :value="taskObject.assignee"
              disabled
          />
        </div>

        <div class="field">
          <label class="field-label">Related ID</label>
          <pv-select
              class="field-input"
              v-model="taskObject.relatedId"
              :options="availableBatches"
              optionLabel="internalCode"
              optionValue="internalCode"
              placeholder="Select a batch"
              @change="onBatchChanged"
          />
        </div>

        <div class="field">
          <label class="field-label">Status</label>
          <pv-input-text class="field-input" v-model="taskObject.status" disabled />
        </div>

        <div class="field">
          <label class="field-label">Title</label>
          <pv-input-text class="field-input" v-model="taskObject.title" />
        </div>
        <div class="field">
          <label class="field-label">Fecha de inicio</label>
          <pv-calendar class="field-input" v-model="taskObject.startDate" show-icon />
        </div>
        <div class="field">
          <label class="field-label">Due Date</label>
          <pv-calendar class="field-input" v-model="taskObject.dueDate" show-icon />
        </div>

        <div class="field">
          <label class="field-label">Type</label>
          <pv-select
              class="field-input"
              v-model="taskObject.type"
              :options="typeOptions"
              optionLabel="label"
              optionValue="value"
              placeholder="Select type"
          />
        </div>

        <div class="field">
          <label class="field-label">Description</label>
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

</style>