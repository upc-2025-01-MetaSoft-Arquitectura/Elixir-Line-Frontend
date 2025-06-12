<script>

import ViewDetails from "../../../shared/components/view-details.component.vue";
import CreateAndEdit from "../../../shared/components/create-and-edit.component.vue";

export default {
  name: "batch-view-details",
  components: { CreateAndEdit, ViewDetails},

  props: {
    itemEntity: null,
    visible: Boolean
  },


  data() {
    return {
      close: false
    }
  },


  methods: {
    onClose() {
      this.$emit('close-view-details');
    }
  },

  created() {
    console.log('Batch View Details component created');
  }
}

</script>

<template>

  <view-details :entity="itemEntity" :visible="visible" entity-name="Batch"
                @close-shared="onClose">

    <template #content>

      <pv-card>
        <template #content>
          <div class="mb-3">
            <p><strong>Viñedo:</strong> {{ itemEntity.vineyardOrigin }}</p>
            <p><strong>Variedad de uva:</strong> {{ itemEntity.grapeVariety }}</p>
            <p><strong>Campaña:</strong> {{ itemEntity.harvestCampaign }}</p>
            <p><strong>Fecha Recepción:</strong> {{ itemEntity.receptionDate }}</p>
            <p><strong>Cantidad inicial de uva (kg):</strong> {{ itemEntity.initialGrapeQuantityKg }}</p>
            <p><strong>Código Interno:</strong> {{ itemEntity.internalCode }}</p>
            <p><strong>Creado por:</strong> {{ itemEntity.createdBy }}</p>
            <p><strong>Fase actual:</strong> {{ itemEntity.currentStage }}</p>
            <p><strong>Avance general:</strong> {{ itemEntity.progress }}%</p>
          </div>
        </template>


      </pv-card>


    </template>

  </view-details>

</template>

<style>

</style>