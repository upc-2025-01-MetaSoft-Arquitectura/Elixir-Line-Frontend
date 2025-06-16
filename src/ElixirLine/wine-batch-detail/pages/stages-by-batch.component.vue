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
import ReceptionStageDetail from "../components/reception-stage-detail.component.vue";
import CorrectionStageDetail from "../components/correction-stage-detail.component.vue";
import FermentationStageDetail from "../components/fermentation-stage-detail.component.vue";
import PressingStageDetail from "../components/pressing-stage-detail.component.vue";
import ClarificationStageDetail from "../components/clarification-stage-detail.component.vue";
import AgingStageDetail from "../components/aging-stage-detail.component.vue";
import BottlingStageDetail from "../components/bottling-stage-detail.component.vue";
import FiltrationStageDetail from "../components/filtration-stage-detail.component.vue";

export default {
  name: 'stages-by-batch',
  components: {
    FiltrationStageDetail,
    BottlingStageDetail,
    AgingStageDetail,
    ClarificationStageDetail,
    PressingStageDetail, FermentationStageDetail, CorrectionStageDetail, ReceptionStageDetail, BasePageLayout},

  props: {
    itemEntity: null,
    title: String,
    visible: Boolean
  },

  data() {
    return {

      receptionStage : new ReceptionStage({}),
      correctionStage : new CorrectionStage({}),
      fermentationStage : new FermentationStage({}),
      pressingStage : new PressingStage({}),
      clarificationStage: new ClarificationStage({}),
      agingStage : new AgingStage({}),
      filtrationStage : new FiltrationStage({}),
      bottlingStage : new BottlingStage({}),


      stagesApiService: null,




      //============ Datos de campañas y búsqueda ==============

      // Datos de la vista
      stagesByBatch: [], // Etapas obtenidas por batch (array de objetos)
      selectedItem: null, // campaña seleccionada (objeto)
      filteredItems: []   // campañas filtradas (objetos)
    };
  },

  methods: {
    onCancelRequested() {
      this.$emit('canceled');
    },

    onSaveRequested() {
      this.$emit('saved', this.itemEntity);
    },


    getAllStagesByBatch(batchId) {

      this.stagesApiService.findStagesByBatchId(batchId)
          .then(response => {
            const data = response.data[0];

            this.stagesByBatch = data; // guardas el objeto completo si quieres

            // Poblar etapas específicas
            this.receptionStage     = new ReceptionStage(data.receptionStage || {});
            this.correctionStage    = new CorrectionStage(data.correctionStage || {});
            this.fermentationStage  = new FermentationStage(data.fermentationStage || {});
            this.pressingStage      = new PressingStage(data.pressingStage || {});
            this.clarificationStage = new ClarificationStage(data.clarificationStage || {});
            this.agingStage         = new AgingStage(data.agingStage || {});
            this.filtrationStage    = new FiltrationStage(data.filtrationStage || {});
            this.bottlingStage      = new BottlingStage(data.bottlingStage || {});

            console.log('✅ Etapas cargadas por batch:', this.stagesByBatch);
          })
          .catch(error => {
            console.error('❌ Error fetching stages by batch:', error);
          });
    },


    buildStageSearchItems(data) {
      const stages = [];

      if (data.receptionStage) {
        stages.push({ name: 'Recepción', key: 'receptionStage' });
      }
      if (data.correctionStage) {
        stages.push({ name: 'Corrección', key: 'correctionStage' });
      }
      if (data.fermentationStage) {
        stages.push({ name: 'Fermentación', key: 'fermentationStage' });
      }
      if (data.pressingStage) {
        stages.push({ name: 'Prensado', key: 'pressingStage' });
      }
      if (data.clarificationStage) {
        stages.push({ name: 'Clarificación', key: 'clarificationStage' });
      }
      if (data.agingStage) {
        stages.push({ name: 'Crianza', key: 'agingStage' });
      }
      if (data.filtrationStage) {
        stages.push({ name: 'Filtración', key: 'filtrationStage' });
      }
      if (data.bottlingStage) {
        stages.push({ name: 'Embotellado', key: 'bottlingStage' });
      }

      return stages;
    },


    searchStages(event) {

      const query = event.query.toLowerCase();

      this.filteredItems = this.buildStageSearchItems(this.stagesByBatch).filter(item =>
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
    this.stagesApiService = new StagesApiService('/stages');
    this.getAllStagesByBatch(this.itemEntity.id);
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

    <div v-if="selectedItem && selectedItem.name === 'Recepción'" class="p-2 w-full h-full flex-1 flex flex-column overflow-hidden">
      <reception-stage-detail :itemEntity="receptionStage" />
    </div>

    <div v-else-if="selectedItem && selectedItem.name === 'Corrección'" class="p-2 w-full h-full flex-1 flex flex-column overflow-hidden ">
      <correction-stage-detail :itemEntity="correctionStage" />
    </div>

    <div v-else-if="selectedItem && selectedItem.name === 'Fermentación'" class="p-2 w-full h-full flex-1 flex flex-column overflow-hidden">
     <fermentation-stage-detail :itemEntity="fermentationStage" />
    </div>

    <div v-else-if="selectedItem && selectedItem.name === 'Prensado'" class="p-2 w-full h-full flex-1 flex flex-column overflow-hidden">
      <pressing-stage-detail :itemEntity="pressingStage" />
    </div>

    <div v-else-if="selectedItem && selectedItem.name === 'Clarificación'" class="p-2 w-full h-full flex-1 flex flex-column overflow-hidden">
      <clarification-stage-detail :itemEntity="clarificationStage" />
    </div>

    <div v-else-if="selectedItem && selectedItem.name === 'Crianza'" class="p-2 w-full h-full flex-1 flex flex-column overflow-hidden">
      <aging-stage-detail :itemEntity="agingStage" />
    </div>

    <div v-else-if="selectedItem && selectedItem.name === 'Filtración'" class="p-2 w-full h-full flex-1 flex flex-column overflow-hidden">
      <filtration-stage-detail :itemEntity="filtrationStage" />
    </div>

    <div v-else-if="selectedItem && selectedItem.name === 'Embotellado'" class="p-2 w-full h-full flex-1 flex flex-column overflow-hidden">
      <bottling-stage-detail :itemEntity="bottlingStage" />
    </div>

    <!-- Mensaje en caso de no haber etapas registradas -->
    <div v-else-if="!stagesByBatch || Object.keys(stagesByBatch).length === 0" class="p-2 w-full h-full flex-1 flex
    flex-column overflow-hidden">
      <p class="text-center">No hay etapas registradas para este lote: {{itemEntity.internalCode}}.</p>
    </div>

    <!-- Mensaje si no hay etapa seleccionada -->
    <div v-else-if="!selectedItem" class="p-2 w-full h-full flex-1 flex flex-column overflow-hidden">
      <p class="text-center">Selecciona una etapa para ver los detalles.</p>
    </div>









  </base-page-layout>

</template>

<style>

</style>