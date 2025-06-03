<script>
import DataManager from "../../../shared/components/data-manager.component.vue";
import {Employee} from "../model/employee.entity.js";
import {EmployeeApiService} from "../services/employee-api.service.js";
import EmployeeCreateAndEdit from "../component/employee-create-and-edit.component.vue";
import BasePageLayout from "../../../shared/components/base-page-layout.component.vue";

export default {
  name: "employee-management",

  components: {
    BasePageLayout,
    EmployeeCreateAndEdit,
    DataManager,
  },

  data() {
    return {
      title: { singular: 'Employee', plural: 'Employees' },
      arrayItems: [],
      itemObject: new Employee({}),
      selectedItems: [],
      batchAndCampaignApiService: null,
      createAndEditDialogIsVisible: false,
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
      return this.arrayItems.findIndex(item => item.id === id);
    },
    //#endregion

    //#region Event Handlers
    onNewItem() {
      this.itemObject = new Employee({});
      this.isEdit = false;
      this.submitted = false;
      this.createAndEditDialogIsVisible = true;
    },

    onEditItem(item) {
      this.itemObject = new Employee(item);
      this.isEdit = true;
      this.submitted = false;
      this.createAndEditDialogIsVisible = true;
    },

    onDeleteItem(item) {
      this.itemObject = new Employee(item);
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
        let newItem = new Employee(response.data);
        this.arrayItems.push(newItem);
        this.notifySuccessfulAction('Employee created successfully');
      }).catch(error => {
        console.error("Error creating a Employee",error);
      });
    },

    update() {
      this.batchAndCampaignApiService.update(this.itemObject.id, this.itemObject).then(response => {
        let index = this.findIndexById(this.itemObject.id);
        this.arrayItems[index] = new Employee(response.data);
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

    getAllSupplies() {

      this.batchAndCampaignApiService.getAllResources().then(response => {
        console.log("Employees response", response.data);

        this.arrayItems = response.data.map(resource => new Employee(resource));

        console.log("Employees resources", this.arrayItems);
      }).catch(error => {
        console.error("Error getting Employees",error);
      });
    }
  },


  //#region Lifecycle Hooks
  created() {

    this.batchAndCampaignApiService = new EmployeeApiService('/employees');
    this.getAllSupplies();

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
        @delete-item-requested-manager="onDeleteItem($event)"
        @delete-selected-items-requested-manager="onDeleteSelectedItems($event)"
    >

      <template #custom-columns-manager>
        <pv-column
            :sortable
            field="firstName"
            header="First Name" />

        <pv-column
            :sortable
            field="lastName"
            header="Last Name" />

        <pv-column
            :sortable
            field="email"
            header="Email" />

        <pv-column
            :sortable
            field="phoneNumber"
            header="Phone Number" />

        <pv-column
            :sortable
            field="password"
            header="Password" />

      </template>

    </data-manager>

    <employee-create-and-edit
        :edit="isEdit"
        :item-entity="itemObject"
        :visible="createAndEditDialogIsVisible"
        @cancel-requested="onCancelRequested"
        @save-requested="onSaveRequested($event)"
    />

  </div>


</div>

</template>


<style>


</style>