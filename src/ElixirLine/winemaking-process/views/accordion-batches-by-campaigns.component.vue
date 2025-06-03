<script>
import BatchManagement from "../pages/batch-management.component.vue";
import {Campaign} from "../model/campaign.entity.js";
import {batchAndCampaignApiService} from "../services/batch-and-campaign-api.service.js";
import BasePageLayout from "../../../shared/components/base-page-layout.component.vue";

export default {
  name: "wine-batch-views",
  components: {BasePageLayout, BatchManagement},

  data() {
    return {
      arrayItems: [],
      batchAndCampaignApiService: null,
    }
  },

  methods:{


    getAll(){
      this.batchAndCampaignApiService.getAllResources()
        .then(response => {

          this.arrayItems = response.data.map(resource => new Campaign(resource));

          console.log( 'Campañas recuperadas' ,this.arrayItems);
        })
        .catch(error => {
          console.error("Error fetching data:", error);
        });
    }

  },

  computed: {
    campaignQuantity() {
      return this.arrayItems.length ? this.arrayItems.length : 0;
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

  <base-page-layout>


    <template #header>
      <h2>{{$t('components.title-wine-batch')}}</h2>
    </template>

    <!-- Acordeón -->
    <div class="accordion-content flex-1 flex flex-column p-2 overflow-auto">

      <pv-accordion multiple>

        <pv-accordion-panel v-for="item in arrayItems" :key="item.id" :value="item.id">

          <!-- Encabezado del acordeón -->
          <pv-accordion-header style="background: #F5F5DC; margin-top: 1rem;">
          <span class="flex items-center gap-2 w-full">
            <span class="font-bold whitespace-nowrap">{{item.name}}</span>
            <pv-badge class="ml-auto mr-2">{{item.batchesQuantity}} </pv-badge>
          </span>
          </pv-accordion-header>

          <!-- Contenido del acordeón -->
          <pv-accordion-content value ="item.id" class="bg-white overflow-auto">
            <BatchManagement :campanaName="item.name" />
          </pv-accordion-content>

        </pv-accordion-panel>
      </pv-accordion>
    </div>


  </base-page-layout>


</template>

<style scoped>


</style>