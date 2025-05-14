<script>

import WineBatchViews from "./wine-batch-view.component.vue";
import CampaignsManagement from "../pages/campaigns-management.component.vue";

export default {
  name: 'winemaking-view',
  components: {
    CampaignsManagement,
    WineBatchViews
  },


  created() {
    console.log("Winemaking view Component Created");
  }
}

</script>

<template>

  <div class="page-container w-full h-full overflow-auto">
    <pv-tabs value="0">

      <pv-tab-list class="tab-list w-full  fixed z-1"  style="background: white">
        <pv-tab value="0">{{$t('winemaking.option-1')}}</pv-tab>
        <pv-tab value="1">{{$t('winemaking.option-2')}}</pv-tab>
      </pv-tab-list>

      <pv-tab-panels class="w-full mt-5 z-0">
        <pv-tab-panel value="0">

          <WineBatchViews></WineBatchViews>

        </pv-tab-panel>
        <pv-tab-panel value="1">
          <CampaignsManagement></CampaignsManagement>
        </pv-tab-panel>

      </pv-tab-panels>
    </pv-tabs>


  </div>

</template>

<style>


.tab-list .p-tab-active {
  border-color: #DAA520 !important;
  color: #DAA520;
}

</style>