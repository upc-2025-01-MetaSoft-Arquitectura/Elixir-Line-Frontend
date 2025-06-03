<script>

import CampaignsManagement from "../../winemaking-process/pages/campaigns-management.component.vue";
import AccordionBatchesByCampaignsComponent from "../../winemaking-process/views/accordion-batches-by-campaigns.component.vue";
import EmployeeManagement from "../../employee-management/pages/employee-management.component.vue";
import ProfileManagement from "../pages/profile-management.component.vue";
import BasePageLayout from "../../../shared/components/base-page-layout.component.vue";


export default {
  name: "profile-views-configuration",
  components: {BasePageLayout, ProfileManagement, EmployeeManagement, WineBatchViews: AccordionBatchesByCampaignsComponent, CampaignsManagement},

  data() {
    return {
      activeTab: '0'
    }
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
            :label="$t('profile.tab-1')"
            :outlined="false"
            class="tab-button"
            :class="{ 'active-tab': activeTab === '0' }"
        />

        <pv-button
            @click="activeTab = '1'"
            :label="$t('profile.tab-2')"
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
        <p>PROFILE</p>
      </div>

      <div v-if="activeTab === '1'" class="flex-1 flex-column w-full overflow-hidden">
        <employee-management />
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