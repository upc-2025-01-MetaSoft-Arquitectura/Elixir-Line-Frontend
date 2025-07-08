<script>

import ViewDetails from "../../../shared/components/view-details.component.vue";
import CreateAndEdit from "../../../shared/components/create-and-edit.component.vue";
import EmployeeManagement from "../../employee-management/pages/employee-management.component.vue";
import ProfileManagement from "../../profile/pages/profile-management.component.vue";
import BatchViewDetails from "../pages/bacth-view-detail.component.vue";
import TasksByBatch from "../pages/tasks-by-batch.component.vue";
import SuppliesByBatch from "../pages/supplies-by-batch.component.vue";
import StagesByBatchManagement from "./stages-by-batch-management.component.vue";

export default {
  name: "tabs-view-details",
  components: {
    StagesByBatchManagement,
    SuppliesByBatch,
    TasksByBatch, BatchViewDetails, ProfileManagement, EmployeeManagement, CreateAndEdit, ViewDetails},

  props: {
    itemBatch: null,
    title: String,
    visible: Boolean
  },


  data() {
    return {
      close: false,
      activeTab: '0', // Tab activa por defecto
      tabs: [
        { label: this.$t('details-tabs.tab-1'), value: '0' },
        { label: this.$t('details-tabs.tab-2'), value: '1' },
        { label: this.$t('details-tabs.tab-3'), value: '2' },
        { label: this.$t('details-tabs.tab-4'), value: '3' },
      ]
    }
  },


  methods: {
    onClose() {
      this.$emit('close-tabs-view-details');
    }
  },

  created() {
    console.log('Batch View Details component created');
  }
}

</script>

<template>

  <view-details :entity="itemBatch" :visible="visible" entity-name="Batch"
                @close-shared="onClose">


    <template #header>
      <div class="button-tabs flex flex-row">
        <!-- Botones de navegación tipo tab -->

        <pv-button
            v-for="tab in tabs"
            :key="tab.value"
            @click="activeTab = tab.value"
            :label="$t(tab.label)"
            :outlined="false"
            class="tab-button"
            :class="{ 'active-tab': activeTab === tab.value }"
        />

      </div>
    </template>

    <template #content>

      <!-- Contenido de los tabs -->
      <div class="flex-1 h-full flex flex-column overflow-hidden ">

        <!-- Contenido que cambia por tab -->
        <div v-if="activeTab === '0'" class="flex-1 flex-column w-full h-full overflow-hidden">
          <batch-view-details :item-entity="itemBatch" :title="title" />
        </div>

        <div v-if="activeTab === '1'" class="flex-1 flex-column w-full h-full overflow-hidden">
          <tasks-by-batch  :item-entity="itemBatch" :title="title" />
        </div>

        <div v-if="activeTab === '2'" class="flex-1 flex-column w-full h-full overflow-hidden">
          <stages-by-batch-management :item-batch="itemBatch" :title="title" :visible="visible" />
        </div>

        <div v-if="activeTab === '3'" class="flex-1 flex-column w-full h-full overflow-hidden">
          <supplies-by-batch :item-entity="itemBatch" :title="title" />
        </div>

      </div>

    </template>

  </view-details>

</template>

<style>


.tab-button {
  color: #708090 !important;
  padding: 10px 20px;
  border: none !important;
  background-color: transparent !important;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.tab-button.active-tab {
  color: #DAA520 !important; /* Dorado cuando está activo */
  background-color: rgba(255, 255, 255, 0.1); /* Leve fondo para resaltar si quieres */
}

</style>