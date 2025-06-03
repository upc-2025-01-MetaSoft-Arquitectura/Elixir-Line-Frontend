<script>

import AccordionCampaignsComponent from "./accordion-campaigns.component.vue";
import CampaignsManagement from "../pages/campaigns-management.component.vue";
import BasePageLayout from "../../../shared/components/base-page-layout.component.vue";
import EmployeeManagement from "../../employee-management/pages/employee-management.component.vue";

export default {
  name: 'winemaking-view',
  components: {
    EmployeeManagement, BasePageLayout,
    CampaignsManagement,
    WineBatchViews: AccordionCampaignsComponent
  },

  data() {
    return {
      activeTab: '0'
    }
  },


  created() {
    console.log("Winemaking view Component Created");
  }
}

</script>

<template>


  <base-page-layout>
    <!-- Tabs en el header -->
    <template #header>

      <div class="button-tabs flex flex-row p-1">
        <!-- Botones de navegación tipo tab -->
        <pv-button
            @click="activeTab = '0'"
            :label="$t('winemaking.option-1')"
            :outlined="false"
            class="tab-button"
            :class="{ 'active-tab': activeTab === '0' }"
        />

        <pv-button
            @click="activeTab = '1'"
            :label="$t('winemaking.option-2')"
            :outlined="false"
            class="tab-button"
            :class="{ 'active-tab': activeTab === '1' }"
        />

      </div>

    </template>


    <!-- Contenido de los tabs -->
    <div class="flex-1 h-full overflow-hidden flex flex-column">

      <!-- Contenido que cambia por tab -->
      <div v-if="activeTab === '0'" class="flex-1 flex-column w-full  overflow-hidden">
        <WineBatchViews></WineBatchViews>
      </div>

      <div v-if="activeTab === '1'" class="flex-1 flex-column w-full overflow-hidden">
        <CampaignsManagement ></CampaignsManagement>
      </div>

    </div>

  </base-page-layout>


</template>

<style>


.tab-button {
  color: white !important;
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