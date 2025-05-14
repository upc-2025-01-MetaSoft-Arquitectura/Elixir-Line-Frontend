<script>
import BatchManagement from "../pages/batch-management.component.vue";
import {Campaign} from "../model/campaign.entity.js";
import {batchAndCampaignApiService} from "../services/batch-and-campaign-api.service.js";

export default {
  name: "wine-batch-views",
  components: {BatchManagement},

  data() {
    return {
      itemObject: new Campaign({}),
      ArrayItems: [],
      batchAndCampaignApiService: null,
    }
  },

  methods:{

    getAll(){
      this.batchAndCampaignApiService.getAllResources()
        .then(response => {
          this.ArrayItems = response.data;
          console.log( 'Campañas recuperadas' ,this.ArrayItems);
        })
        .catch(error => {
          console.error("Error fetching data:", error);
        });
    }

  },

  computed: {
    campaignQuantity() {
      return this.ArrayItems.length ? this.ArrayItems.length : 0;
    }
  },


  created() {
    this.batchAndCampaignApiService = new batchAndCampaignApiService('/campaigns');

    this.getAll();

    console.log("Wine Batch view Component Created");
  }
}

</script>

<template>

  <div class="page-wine-batch-view w-full h-full">

    <div class="header-container w-full h-4rem ">
      <h2>{{$t('components.title-wine-batch')}}</h2>
    </div>

    <!-- Acordeón -->

      <pv-accordion class="w-full h-full" multiple>
        <pv-accordion-panel v-for="item in ArrayItems" :key="item.id" :value="item.id">
          <pv-accordion-header style="background: #F5F5DC; margin-top: 1rem;">
          <span class="flex items-center gap-2 w-full">
            <span class="font-bold whitespace-nowrap">{{item.name}}</span>
            <pv-badge class="ml-auto mr-2">{{item.batchesQuantity}} </pv-badge>
          </span>
          </pv-accordion-header>

          <pv-accordion-content value ="item.id" class="bg-white overflow-hidden">
            <BatchManagement :campanaName="item.name" />
          </pv-accordion-content>

        </pv-accordion-panel>
      </pv-accordion>

  </div>

</template>

<style scoped>

.page-wine-batch-view {
  display: flex;
  flex-direction: column;
  height: 100vh;
}


</style>