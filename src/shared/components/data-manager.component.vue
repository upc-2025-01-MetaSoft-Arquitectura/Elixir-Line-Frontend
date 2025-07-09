<script>
import {FilterMatchMode} from "@primevue/core";

export default {
  name: "data-manager",

  inheritAttrs: false,

  props: {
    items: {type: Array, required: true},title: {type: {singular: '', plural: ''}, required: true},
    labelName: {type: String, required: true},
    dynamic
    : {type: Boolean, default: false},
    columns: {type: Array, default: () => []}
  },

  data() {
    return {
      selectedItems: [],
      filters: null
    }
  },

  methods: {

    initFilters() {
      this.filters = {global: {value: null, matchMode: FilterMatchMode.CONTAINS}};
    },


    newItem() {
      this.$emit('new-item-requested-manager');
    },

    confirmDeleteSelected() {
      this.$confirm.require({
        message: `Are you sure you want to delete the selected ${this.title.plural}?`,
        header: 'Confirmation',
        icon: 'pi pi-exclamation-triangle',
        rejectClass: 'p-button-secondary p-button=outlined',
        rejectLabel: 'Cancel',
        acceptLabel: 'Delete',
        acceptClass: 'p-button-danger',
        accept: () => this.$emit('delete-selected-items-requested-manager', this.selectedItems),
        reject: () => {
        }
      });
    },

    exportToCsv() {
      this.$refs.dt.exportCSV();
    },

    editItem(item) {
      this.$emit('edit-item-requested-manager', item);
    },

    viewItemDetails(item) {
      this.$emit('view-item-details-requested-manager', item);
    },

    confirmDeleteItem(item) {
      this.$confirm.require({
        message: `Are you sure you want to delete the selected ${this.title.singular}?`,
        header: 'Confirmation',
        icon: 'pi pi-exclamation-triangle',
        rejectClass: 'p-button-secondary p-button=outlined',
        rejectLabel: 'Cancel',
        acceptLabel: 'Delete',
        acceptClass: 'p-button-danger',
        accept: () => this.$emit('delete-item-requested-manager', item),
        reject: () => {
        }
      })
    }
  },

  created() {
    this.initFilters();
  }

}
</script>

<template>

  <div class="page-container-shared flex flex-column h-full w-full overflow-hidden">
    <!-- Notificaciones -->
    <pv-toast />
    <pv-confirm-dialog />

    <!-- Toolbar fija arriba -->
    <pv-toolbar class="w-full" style="height: 4rem;">
      <template #start>
        <pv-button
            class="mr-2 w-12rem"
            icon="pi pi-plus"
            :label="labelName"
            severity="success"
            @click="newItem"
            style="background: #556B2F; color: white; border: none;"
        />
        <pv-button
            class="w-8rem"
            :disabled="!selectedItems || !selectedItems.length"
            icon="pi pi-trash"
            :label="$t('winemaking.button-delete')"
            severity="danger"
            @click="confirmDeleteSelected"
            style="background: #8B0000; color: white; border: none;"
        />
      </template>

      <template #end>
        <pv-button
            class="w-8rem"
            icon="pi pi-download"
            :label="$t('winemaking.button-export')"
            severity="help"
            @click="exportToCsv($event)"
            style="background: #708090; color: white; border: none;"
        />
      </template>
    </pv-toolbar>

    <!-- Tabla que ocupa el resto del espacio -->
    <div class="table-wrapper flex-1 overflow-auto">

      <pv-data-table
          class="w-full"
          ref="dt"
          v-model:selection="selectedItems"
          :filters="filters"
          :paginator="true"
          :rows="5"
          :rows-per-page-options="[5, 10, 15]"
          :value="items"
          scrollable
          scroll-height="flex"
          current-page-report-template="Showing {first} to {last} of {totalRecords} ${{title.plural}}"
          data-key="id"
          paginator-template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown">

        <pv-column :exportable="false" selection-mode="multiple" style="width: 3em" />

        <slot name="custom-columns-manager"></slot>

        <template #empty>
          <div class="p-4 text-center text-gray-600">
              <i class="pi pi-inbox text-2xl text-blue-400"></i>
              <p class="text-base">Aún no se han agregado datos.</p>
          </div>
        </template>

        <pv-column
            v-if="dynamic"
            v-for="column in columns"
            :key="column.field"
            :field="column.field"
            :header="column.header" />

        <pv-column :exportable="false" style="min-width:8rem">
          <template #body="slotProps">
            <div class="flex flex-row">
              <pv-button
                  icon="pi pi-pencil"
                  outlined rounded class="mr-2"
                  @click="editItem(slotProps.data)" />

              <pv-button
                  icon="pi pi-trash"
                  outlined rounded
                  class="mr-2"
                  severity="danger"
                  @click="confirmDeleteItem(slotProps.data)" />

              <pv-button
                  icon="pi pi-eye"
                  outlined rounded
                  severity="info"
                  @click="viewItemDetails(slotProps.data)" />
            </div>


          </template>
        </pv-column>

      </pv-data-table>

    </div>
  </div>
</template>

<style scoped>

.table-wrapper {
  flex: 1;
  min-height: 0; /* 🔧 necesario para que flex-children no crezcan indefinidamente */
  overflow: auto;
}

</style>