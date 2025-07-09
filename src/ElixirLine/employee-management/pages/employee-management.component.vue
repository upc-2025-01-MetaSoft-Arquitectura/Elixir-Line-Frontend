<script>
import DataManager from "../../../shared/components/data-manager.component.vue";
import {EmployeeApiService} from "../services/employee-api.service.js";
import EmployeeCreateAndEdit from "../component/employee-create-and-edit.component.vue";
import BasePageLayout from "../../../shared/components/base-page-layout.component.vue";
import {useAuthenticationStore} from "../../security/services/authentication.store.js";
import {SignUpRequest} from "../../security/model/sign-up.request.js";
import {SignUpRequestApiService} from "../services/sign-up-request-api.service.js";
import {WinegrowerApiService} from "../services/winegrower-api.service.js";
import {Winegrower} from "../model/winegrower.entity.js";
import {FieldWorker} from "../model/field-worker.entity.js";
import {CreateFieldWorker} from "../model/create-field-worker.entity.js";
import {CreateCompleteFieldWorker} from "../model/create-complete-field-worker.entity.js";
import {UserApiService} from "../services/user-api.service.js";
import {UpdateFieldworker} from "../model/update-fieldworker.entity.js";

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

      fieldWorkerId: null,
      // Arreglo que contiene los empleados de un winegrower en específico
      arrayItems: [],

      arrayWinegrowers: [],
      arrayFieldWorkers: [],
      filteredFieldWorkers: [],
      currentWinegrower: null,
      selectedWinegrowerId: null,

      createCompleteFliedWorker: new CreateCompleteFieldWorker({}),

      CreateUser : new SignUpRequest(),

      // Objeto que representa el empleado que se está creando o editando
      itemObject: new FieldWorker({}),
      createFieldWorker: new CreateFieldWorker({}),
      userCreatedId: null,


      selectedItems: [],

      employeeApiService: null,
      signUpRequestApiService: null,
      winegrowerApiService: null,
      userApiService: null,
      updateFieldworker: new UpdateFieldworker({}),

      createAndEditDialogIsVisible: false,

      isEdit: false,

      submitted: false,
    }
  },

  computed: {
    // Obtiene el userId desde el store de autenticación
    userId() {
      return useAuthenticationStore().currentUserId;
    },
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

      this.createCompleteFliedWorker = new CreateCompleteFieldWorker({});

      this.itemObject = new FieldWorker({});

      this.isEdit = false;
      this.submitted = false;
      this.createAndEditDialogIsVisible = true;
    },

    async fetchUserByUserId(userId) {
      try {
        const response = await this.userApiService.getUserById(userId);
        const userData = response.data;
        console.log("✅ Usuario recuperado:", userData);
        return userData;
      } catch (error) {
        console.error("❌ Error al obtener usuario:", error);
        return null;
      }
    },

    async onEditItem(item) {

      const userData = await this.fetchUserByUserId(item.userId);

      if (!userData) {
        this.$toast.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo recuperar la información del usuario.',
          life: 5000
        });
        return;
      }

      // Crear una nueva instancia de CreateCompleteFieldWorker
      this.createCompleteFliedWorker = new CreateCompleteFieldWorker({});

      this.createCompleteFliedWorker.id = item.id;
      this.createCompleteFliedWorker.userId = item.userId;
      this.createCompleteFliedWorker.name = item.name;
      this.createCompleteFliedWorker.lastname = item.lastname;
      this.createCompleteFliedWorker.phoneNumber = item.phoneNumber;
      this.createCompleteFliedWorker.winegrowerId = item.winegrowerId;
      this.createCompleteFliedWorker.email = userData.email; // Asignar el email del usuario

      console.log('============= CREATE FIELDWORKER EN EDICIÓN ========= ', this.createCompleteFliedWorker);

      this.isEdit = true;
      this.submitted = false;
      this.createAndEditDialogIsVisible = true;
    },

    onDeleteItem(item) {
      this.itemObject = new FieldWorker(item);
      this.delete();
    },

    onDeleteSelectedItems(selectedItems) {
      this.selectedItems = selectedItems;
      this.deleteSelectedItems();
      this.deleteUsers();
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

    async createUserByFieldWorker() {
      try {
        this.CreateUser.email = this.createCompleteFliedWorker.email;
        this.CreateUser.password = this.createCompleteFliedWorker.password;
        this.CreateUser.role = 'FIELD_WORKER';

        const response = await this.signUpRequestApiService.create(this.CreateUser);

        const createdUserId = response.data?.id;

        if (!createdUserId) {
          throw new Error("El ID del usuario creado es nulo o inválido.");
        }

        console.log("✅ Usuario creado con ID:", createdUserId);
        this.notifySuccessfulAction('User created successfully');

        return createdUserId;

      } catch (error) {
        console.error("❌ Error al crear el usuario:", error);
        this.$toast.add({
          severity: 'error',
          summary: 'Error al crear usuario',
          detail: error.response?.data?.details || 'No se pudo registrar el usuario.',
          life: 5000
        });
        throw error; // corta la ejecución del método que lo llama
      }
    },

    //#region CRUD Operations
    async create() {
      try {
        const userId = await this.createUserByFieldWorker();

        // Validación explícita (por redundancia defensiva)
        if (!userId) {
          console.warn("⛔ El ID del usuario no es válido. Se detiene el proceso.");
          return;
        }

        // Asignación del nuevo empleado
        this.createFieldWorker.userId = userId;
        this.createFieldWorker.winegrowerId = this.selectedWinegrowerId;
        this.createFieldWorker.name = this.createCompleteFliedWorker.name;
        this.createFieldWorker.lastname = this.createCompleteFliedWorker.lastname;
        this.createFieldWorker.phoneNumber = this.createCompleteFliedWorker.phoneNumber;


        const response = await this.employeeApiService.create(this.createFieldWorker);
        const newItem = new FieldWorker(response.data);
        this.arrayItems.push(newItem);

        this.notifySuccessfulAction('Employee created successfully');

      } catch (error) {
        console.error("❌ Error al crear FieldWorker:", error);
        console.error('🔴 Message:', error.message);
        console.error('🔴 Status:', error.response?.status);
        console.error('🔴 Details:', error.response?.data);
      }
    },

    update() {

        this.updateFieldworker = new UpdateFieldworker({});

        this.updateFieldworker.name = this.createCompleteFliedWorker.name;
        this.updateFieldworker.lastname = this.createCompleteFliedWorker.lastname;
        this.updateFieldworker.phoneNumber = this.createCompleteFliedWorker.phoneNumber;
        this.updateFieldworker.winegrowerId = this.selectedWinegrowerId;
        this.updateFieldworker.image = this.createCompleteFliedWorker.image; // si estás usando esto también

        const formData = new FormData();

        if (this.updateFieldworker.name)
          formData.append("name", this.updateFieldworker.name);

        if (this.updateFieldworker.lastname)
          formData.append("lastname", this.updateFieldworker.lastname);

        if (this.updateFieldworker.phoneNumber)
          formData.append("phoneNumber", this.updateFieldworker.phoneNumber);

        if (this.updateFieldworker.winegrowerId)
          formData.append("winegrowerId", this.updateFieldworker.winegrowerId.toString());

        if (this.updateFieldworker.image)
          formData.append("image", this.updateFieldworker.image);

        console.log('======= ENVIANDO DATOS ACTUALIZADOS =======');
        for (let [key, value] of formData.entries()) {
          console.log(`${key}:`, value);
        }


      console.log('======= ESTAMOS ACTUALIZANDO EL FIELDWORKER =======',this.updateFieldworker);

      this.employeeApiService.update(this.createCompleteFliedWorker.id, formData).then(response => {
        let index = this.findIndexById(this.createCompleteFliedWorker.id);
        this.arrayItems[index] = new FieldWorker(response.data);
        this.notifySuccessfulAction('Employee updated successfully');
      }).catch(error => {
        console.error("Error updating a Employee",error);
        console.error('🔴 Message:', error.message);
        console.error('🔴 Status:', error.response?.status);
        console.error('🔴 Details:', error.response?.data);
        this.$toast.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to update employee',
          life: 3000
        });
      });
    },

    // Aqui se deberia eliminar el empleado (fieldworker) y el usuario asociado
    delete() {

      console.log("Eliminando empleado con ID:", this.itemObject.id);
      console.log("Eliminando usuario con ID:", this.itemObject.userId);

      Promise.all([
        this.employeeApiService.delete(this.itemObject.id),
        this.userApiService.delete(this.itemObject.userId)
      ])
          .then(() => {
            const idx = this.findIndexById(this.itemObject.id);
            this.arrayItems.splice(idx, 1);
            this.notifySuccessfulAction('Empleado y usuario eliminados');
          })
          .catch(error => {
            this.$toast.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Fallo al eliminar empleado o usuario',
              life: 3000
            });
            console.error("Error eliminando registros:", error);
          });
    },

    deleteSelectedItems() {
      this.selectedItems.forEach((variable) => {
        this.employeeApiService.delete(variable.id).then(() => {
          this.arrayItems = this.arrayItems.filter((b) => b.id !== variable.id);
        }).catch(error => {
          console.error("Error deleting a Employee", error);
        });
      });

      this.notifySuccessfulAction('Employees deleted successfully');
    },

    deleteUsers() {
      this.selectedItems.forEach((variable) => {
        this.userApiService.delete(variable.userId).then(() => {
          console.log("User deleted successfully");
        }).catch(error => {
          console.error("Error deleting user", error);
        });
      });
    },

    //#endregion

    // Recupera el vinicultor que está asociado a un userId específico
    findWinegrowerByUserId(userId) {
      return this.arrayWinegrowers.find(winegrower => winegrower.userId === userId);
    },

    // Obtiene todos los empleados en general
    getAllWinegrowers() {
      return this.winegrowerApiService.getAllWinegrowers().then(response => {
        this.arrayWinegrowers = response.data.map(item => new WinegrowerApiService(item));
        console.log("=== VINICULTORES RECUPERADOS: ===", this.arrayWinegrowers);
      }).catch(error => {
        console.error("Error fetching winegrowers", error);
      });
    },

    async initialize() {
      try {
        // Servicios
        this.userApiService  = new UserApiService('/users');
        this.employeeApiService = new EmployeeApiService('/fieldworkers');
        this.signUpRequestApiService = new SignUpRequestApiService('/authentication/sign-up');
        this.winegrowerApiService = new WinegrowerApiService('/winegrowers');

        // Obtener vinicultores
        const winegrowerResponse = await this.winegrowerApiService.getAllWinegrowers();
        this.arrayWinegrowers = winegrowerResponse.data.map(item => new Winegrower(item));

        // Obtener vinicultor actual
        const myWinegrower = this.findWinegrowerByUserId(this.userId);
        if (!myWinegrower) {
          console.warn("No se encontró vinicultor con userId:", this.userId);
          return;
        }

        this.currentWinegrower = myWinegrower;
        this.selectedWinegrowerId = myWinegrower.id;

        // Obtener todos los field workers
        const fieldWorkersResponse = await this.employeeApiService.getAllResources();
        this.arrayFieldWorkers = fieldWorkersResponse.data.map(item => new FieldWorker(item));

        // Filtrar fieldworkers por el vinicultor actual y añadir email
        this.arrayItems = await Promise.all(
            this.arrayFieldWorkers
                .filter(worker => worker.winegrowerId === this.selectedWinegrowerId)
                .map(async (worker) => {
                  const userData = await this.fetchUserByUserId(worker.userId);
                  return {
                    ...worker,
                    email: userData?.email || 'Sin correo'
                  };
                })
        );

        console.log("FieldWorkers filtrados con email:", this.arrayItems);

      } catch (error) {
        console.error("Error durante la inicialización:", error);
      }
    },

  },


  //#region Lifecycle Hooks
  created() {

    this.initialize();

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
            :sortable="true"
            field="name"
            header="Name"
        />

        <pv-column
            :sortable="true"
            field="lastname"
            header="Lastname"
        />

        <pv-column
            :sortable="true"
            field="phoneNumber"
            header="Phone Number"
        />

        <pv-column
            :sortable="true"
            field="email"
            header="Email"
        />

        <pv-column
            :sortable="true"
            field= "status"
            header="Status"
        />

      </template>


    </data-manager>

    <employee-create-and-edit
        :edit="isEdit"
        :item-entity="createCompleteFliedWorker"
        :visible="createAndEditDialogIsVisible"
        @cancel-requested="onCancelRequested"
        @save-requested="onSaveRequested($event)"
    />

  </div>


</div>

</template>


<style>


</style>