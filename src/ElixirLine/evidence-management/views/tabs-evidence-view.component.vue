<script>

import BasePageLayoutComponent from "../../../shared/components/base-page-layout.component.vue";
import EvidenceManager from "../pages/evidence-manager.vue";
import IncidenceManager from "../pages/incidence-manager.vue";

export default {
  name : "evidence-view",
  components: {
    IncidenceManager,
    EvidenceManager,
    BasePageLayoutComponent,
  },

  data() {
    return{
      activeTab: "0",
    }
  },


}

</script>

<template>

  <base-page-layout-component>
    <template #header>
      <div class="button-tabs flex flex-row p-1">
        <pv-button
          @click="activeTab = '0'"
          label="Evidencias"
          :outlined="false"
          class="tab-button"
          :class="{ 'active-tab': activeTab === '0' }"
        />
        <pv-button
            @click="activeTab = '1'"
            label="Incidencias"
            :outlined="false"
            class="tab-button"
            :class="{ 'active-tab': activeTab === '1' }"
        />

      </div>
    </template>

    <div class="flex-1 h-full overflow-hidden flex flex-column">

      <div v-if="activeTab === '0'" class="flex-1 flex-column w-full  overflow-hidden">
        <evidence-manager></evidence-manager>
      </div>

      <div v-if="activeTab === '1'" class="flex-1 flex-column w-full  overflow-hidden">
        <incidence-manager></incidence-manager>
      </div>


    </div>


  </base-page-layout-component>

</template>

<style>

</style>