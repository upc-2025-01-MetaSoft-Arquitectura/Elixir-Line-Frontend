<script>

import BasePageLayout from "../../../shared/components/base-page-layout.component.vue";
import {StagesApiService} from "../services/stages-api.service.js";
import {ReceptionStage} from "../model/receptionStage.entity.js";
import {CorrectionStage} from "../model/correctionStage.entity.js";
import {PressingStage} from "../model/pressingStage.entity.js";
import {FermentationStage} from "../model/fermentationStage.entity.js";
import {ClarificationStage} from "../model/clarificationStage.entity.js";
import {AgingStage} from "../model/agingStage.entity.js";
import {FiltrationStage} from "../model/filtrationStage.entity.js";
import {BottlingStage} from "../model/bottlingStage.entity.js";
import ReceptionStageManagement from "../pages/reception-stage-management.component.vue";
import {Stages} from "../model/stages.entity.js";
import CorrectionStageManagement from "../pages/correction-stage-management.component.vue";
import FermentationStageManagement from "../pages/fermentation-stage-management.component.vue";
import PressingStageManagement from "../pages/pressing-stage-management.component.vue";
import ClarificationStageManagement from "../pages/clarification-stage-management.vue";
import AgingStageManagement from "../pages/aging-stage-management.vue";
import FiltrationStageManagement from "../pages/filtration-stage-management.component.vue";
import BottlingStageManagement from "../pages/bottling-stage-management.vue";

export default {
  name: 'stages-by-batch-management',
  components: {
    BottlingStageManagement,
    FiltrationStageManagement,
    AgingStageManagement,
    ClarificationStageManagement,
    PressingStageManagement,
    FermentationStageManagement,
    CorrectionStageManagement,
    ReceptionStageManagement, BasePageLayout},

  provide() {
    return {
      batchId: this.itemBatch.id
    }
  },

  props: {
    itemBatch: null,
    title: String,
    visible: Boolean
  },

  data() {
    return {

      // Datos de la vista
      selectedItem: null, // campaña seleccionada (objeto)

      filteredItemsStages: [
        { name: 'Recepción' },
        { name: 'Corrección' },
        { name: 'Fermentación' },
        { name: 'Prensado' },
        { name: 'Clarificación' },
        { name: 'Añejamiento' },
        { name: 'Filtración' },
        { name: 'Embotellado' }
      ],  // campañas filtradas (objetos)

      filteredItems: [], // resultados filtrados para el autocomplete

    };
  },

  methods: {

    searchStages(event) {

      const query = event.query.toLowerCase();

      this.filteredItems = this.filteredItemsStages.filter(item =>
          item.name.toLowerCase().includes(query)
      );

      console.log("🔍 Resultados de búsqueda:", this.filteredItems);
    },

    onSelect(event) {
      this.selectedItem = event.value;
      console.log("🟢 Campaña seleccionada:", this.selectedItem);
    },

    onEnter() {

      if (this.selectedItem && this.selectedItem.name) {
        console.log("Enter presionado, campaña:", this.selectedItem);
        // Aquí puedes llamar a la misma lógica que quieras ejecutar al seleccionar
        this.onSelect({ value: this.selectedItem });
      } else {
        console.warn("No hay campaña válida seleccionada.");
      }
    }

  },

  created() {

    console.log("= ESTAMOS EN STAGES-BY-BATCH-MANAGEMENT = ");
    // Recuperar el batchId desde las props
    console.log('======= Batch ID recuperado de Tabs-view-details:', this.itemBatch.id);
  }
}

</script>

<template>

  <base-page-layout>

    <template #header>
      <div class="flex flex-column w-full gap-4 p-2 overflow-hidden" >

        <div class="flex flex-row justify-content-between align-items-center overflow-hidden">
          <h2 class="m-0">{{title}}</h2>
        </div>

        <!-- Buscar y Filtrar Campaign -->
        <div class="flex w-full align-items-start overflow-hidden">

          <pv-auto-complete
              class="w-full"
              v-model="selectedItem"
              :suggestions="filteredItems"
              option-label="name"
              placeholder="Ingresa la etapa"
              @complete="searchStages"
              @select="onSelect"
              @keydown.enter="onEnter"
              :dropdown="true"
              :force-selection="true"
              aria-label="Ingresa la etapa"
          />

        </div>

      </div>

    </template>

    <!-- ETAPA DE RECEPCIÓN  ====================================================================== -->
    <div v-if="selectedItem && selectedItem.name === 'Recepción'" class="p-2 w-full h-full flex-1 flex flex-column overflow-hidden">
      <reception-stage-management :item="itemBatch" />
    </div>

    <!-- ETAPA DE CORRECCIÓN  ====================================================================== -->
    <div v-else-if="selectedItem && selectedItem.name === 'Corrección'" class="p-2 w-full h-full flex-1 flex flex-column overflow-hidden ">
      <correction-stage-management :item="itemBatch"  />
    </div>

    <!-- ETAPA DE FERMENTACIÓN  ====================================================================== -->
    <div v-else-if="selectedItem && selectedItem.name === 'Fermentación' " class="p-2 w-full h-full flex-1 flex flex-column overflow-hidden">
      <fermentation-stage-management :item="itemBatch" />
    </div>

    <!-- ETAPA DE PRENSADO  ====================================================================== -->
    <div v-else-if="selectedItem && selectedItem.name === 'Prensado'" class="p-2 w-full h-full flex-1 flex flex-column overflow-hidden">
      <pressing-stage-management :item="itemBatch"/>
    </div>

    <!-- ETAPA DE CLARIFICACIÓN  ====================================================================== -->
    <div v-else-if="selectedItem && selectedItem.name === 'Clarificación'" class="p-2 w-full h-full flex-1 flex flex-column overflow-hidden">
      <clarification-stage-management :item="itemBatch"/>
    </div>

    <!-- ETAPA DE CRIANZA  ====================================================================== -->
    <div v-else-if="selectedItem && selectedItem.name === 'Crianza'" class="p-2 w-full h-full flex-1 flex flex-column overflow-hidden">
        <aging-stage-management :item="itemBatch"  />
    </div>

    <!-- ETAPA DE FILTRACIÓN  ====================================================================== -->
    <div v-else-if="selectedItem && selectedItem.name === 'Filtración'" class="p-2 w-full h-full flex-1 flex flex-column overflow-hidden">
      <filtration-stage-management :item="itemBatch" />
    </div>

    <!-- ETAPA DE EMBOTELLADO  ====================================================================== -->
    <div v-else-if="selectedItem && selectedItem.name === 'Embotellado'" class="p-2 w-full h-full flex-1 flex flex-column overflow-hidden">
      <bottling-stage-management :item="itemBatch" />
    </div>

    <!-- Mensaje en caso de no haber etapas registradas -->
    <div v-else-if="!stagesByBatch || Object.keys(stagesByBatch).length === 0" class="p-2 w-full h-full flex-1 flex
    flex-column overflow-hidden">
      <p class="text-center">No hay etapas registradas para este lote.</p>
    </div>

    <!-- Mensaje si no hay etapa seleccionada -->
    <div v-else-if="!selectedItem" class="p-2 w-full h-full flex-1 flex flex-column overflow-hidden">
      <p class="text-center">Selecciona una etapa para ver los detalles.</p>
    </div>

    <!-- Mensaje si no hay  -->

  </base-page-layout>

</template>

<style>

</style>