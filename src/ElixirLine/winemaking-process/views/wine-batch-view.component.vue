<script>
import {WineBatch} from "../model/wine-batch.entity.js";
import BatchManagement from "../pages/batch-management.component.vue";

export default {
  name: "wine-batch-views",
  components: {BatchManagement},

  data() {
    return {
      title: { singular: 'Batch', plural: 'Batches' },
      batches: [],
      batch: new WineBatch({}),
      selectedBatches: [],
      batchApiService: null,
      createAndEditDialogIsVisible: false,
      isEdit: false,
      submitted: false,
    }
  },

  computed: {
    buttons() {
      return [
        {
          titleKey: 'winemaking.button-option-1',
          icon: 'wine',
          component: 'batch-management',
        },
        {
          titleKey: 'winemaking.button-option-1',
          icon: 'fermentation',
          component: 'batch-management',
        },
      ];
    }
  },

  methods: {
    newItem() {
      this.$emit('new-item-requested-manager');
    },
  },


  created() {
    console.log("Batch Management Component Created");
  }


}

</script>

<template>

  <pv-toast/>
  <pv-confirm-dialog/>

  <div>

    <div class="header-container flex w-full h-full justify-content-center">
      <h2>{{$t('wine-batch.title')}}</h2>
    </div>

    <!-- Acordeón -->
    <pv-accordion >
      <pv-accordion-panel >
        <pv-accordion-header style="background: #F5F5DC">
          <span class="flex items-center gap-2 w-full">
            <span class="font-bold whitespace-nowrap">Amy Elsner</span>
            <pv-badge value="3" class="ml-auto mr-2" />
          </span>
        </pv-accordion-header>

        <pv-accordion-content>
          <BatchManagement :campana-id="1" />
        </pv-accordion-content>
      </pv-accordion-panel>
    </pv-accordion>
  </div>




</template>

<style>

</style>