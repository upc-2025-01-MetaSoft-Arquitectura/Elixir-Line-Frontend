<script>
import ViewDetails from "../../../shared/components/view-details.component.vue";
import CreateAndEdit from "../../../shared/components/create-and-edit.component.vue";
import BasePageLayout from "../../../shared/components/base-page-layout.component.vue";
import {WineBatch} from "../../winemaking-process/model/wine-batch.entity.js";

export default {
  name: "batch-view-details",
  components: {BasePageLayout, CreateAndEdit, ViewDetails},

  props: {
    itemEntity: null,
    title: String,
    visible: Boolean
  },


  created() {

    console.log('==== DATOS DEL BATCH ====', this.itemEntity);


    console.log('Batch View Details component created');
  }
}

</script>

<template>

  <base-page-layout>
    <template #header>
      <h4>{{title}}</h4>
    </template>

    <pv-card>

      <!--
      vineyardCode = '',
      receptionDate = '',
      harvestCampaign = '',
      vineyardOrigin = '',
      grapeVariety = '',
      initialGrapeQuantityKg = 0,
      createdBy = '',
      progress = 0,
      status = 'NOT_STARTED',
      currentStage = 'RECEPTION'
      -->
      <template #content>
        <div class="mb-3">
          <p><strong>Viñedo:</strong> {{ itemEntity.vineyardOrigin }}</p>
          <p><strong>Código de Viñedo:</strong> {{ itemEntity.vineyardCode }}</p>
          <p><strong>Variedad de uva:</strong> {{ itemEntity.grapeVariety }}</p>
          <p><strong>Campaña:</strong> {{ itemEntity.harvestCampaign }}</p>
          <p><strong>Fecha Recepción:</strong> {{ itemEntity.receptionDate }}</p>
          <p><strong>Cantidad inicial de uva (kg):</strong> {{ itemEntity.initialGrapeQuantityKg }}</p>
          <p><strong>Creado por:</strong> {{ itemEntity.createdBy }}</p>
          <p><strong>Estado:</strong> {{ itemEntity.status }}</p>
          <p><strong>Fase actual:</strong> {{ itemEntity.currentStage }}</p>
          <p><strong>Avance general:</strong> {{ itemEntity.progress }}%</p>
        </div>
      </template>

    </pv-card>


  </base-page-layout>

</template>

<style>


.tab-button {
  color: #708090 !important;
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