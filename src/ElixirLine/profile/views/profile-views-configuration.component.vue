<script>

import CampaignsManagement from "../../winemaking-process/pages/campaigns-management.component.vue";
import WineBatchViews from "../../winemaking-process/views/wine-batch-view.component.vue";
import EmployeeManagement from "../../employee-management/pages/employee-management.component.vue";
import ProfileManagement from "../pages/profile-management.component.vue";

export default {
  name: "profile-views-configuration",
  components: {ProfileManagement, EmployeeManagement, WineBatchViews, CampaignsManagement},

}
</script>

<template>

  <div class="page-container-profile-views flex flex-1 flex-column h-full w-full">

    <pv-tabs value="0">

      <pv-tab-list class="profile-tab-list  w-full h-3rem fixed z-1" style="background: white">
        <pv-tab  value="0">{{$t('profile.tab-1')}}</pv-tab>
        <pv-tab  value="1">{{$t('profile.tab-2')}}</pv-tab>
      </pv-tab-list>

      <!-- ============================================== -->

      <pv-tab-panels class="w-full h-full z-0" style="margin-top: 2rem">

        <pv-tab-panel value="0" >
           <router-link to="/home/profile"> </router-link>
        </pv-tab-panel>

        <!-- ============================================== -->

        <pv-tab-panel value="1" >

          <div class="w-full h-full flex flex-column ">
            <div class="header-container w-full h-5rem ">
              <h2>{{$t('components.title-employees')}}</h2>
            </div>

            <employee-management></employee-management>

          </div>
        </pv-tab-panel>

      </pv-tab-panels>
    </pv-tabs>


  </div>
</template>

<style>

.p-tab-active {
  background: none;
  color: #DAA520;
}

.profile-tab-list .p-tab-active {
  background: none;
  color: #DAA520;
}

</style>