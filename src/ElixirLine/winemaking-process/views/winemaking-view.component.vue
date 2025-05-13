<script>

import WineBatchViewComponent from "./wine-batch-view.component.vue";

export default {
  name: 'winemaking-view',
  components: {
    WineBatchViewComponent
    // Import your components here
  },
  data() {
    return {
      activeTab: '0',

      // Define your data properties here
    };
  },

  computed: {
    // Define your computed properties here
    lisTabs() {
      return [
        {
          titleKey: 'winemaking.option-1',
          title: 'components.title-wine-batch',
          icon: 'wine',
          tab: 'batch-management',
          component: 'WineBatchViewComponent',
          value: '0'
        },
        {
          titleKey: 'winemaking.option-2',
          title: 'components.title-campaign',
          icon: 'fermentation',
          tab: 'campaign-management',
          component: 'CampaignManagement',
          value: '1'
        },
      ];
    }
  },




  methods: {
    // Define your methods here
  },
  mounted() {
    // Code to run when the component is mounted
  }
}

</script>

<template>

  <div class="winemaking-component">

    <pv-tabs v-model="activeTab" style="background: white">

      <div class="header-container w-full fixed z-1 h-4" >

        <pv-tab-list class="tab-list"  >
          <pv-tab
              class="tab w-10rem"
              v-for="item in  lisTabs"
              :key="item.value"
              :value="item.value"
          >
            <span>{{$t(item.titleKey)}}</span>
            <i :class="item.icon" class="ml-2"></i>
          </pv-tab>

        </pv-tab-list>
      </div>

      <div class="content-container" >
        <pv-tab-panels>
          <pv-tab-panel v-for="tab in  lisTabs" :key="tab.tab" :value="tab.value">
            <component class="mt-7" :is="tab.component" />
          </pv-tab-panel>
        </pv-tab-panels>
      </div>
    </pv-tabs>



  </div>




</template>

<style>

.tab-list .p-tab-active {
  border-color: #DAA520 !important;
  color: #DAA520;
}

</style>