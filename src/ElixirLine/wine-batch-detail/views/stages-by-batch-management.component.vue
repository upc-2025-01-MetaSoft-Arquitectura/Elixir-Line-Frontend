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
import PressingStageCreateAndEditComponent from "../components/pressing-stage-create-and-edit.component.vue";
import ClarificationStageDetailCreateAndEdit
  from "../components/clarification-stage-detail-create-and-edit.component.vue";
import BottlingStageDetailCreateAndEdit from "../components/bottling-stage-detail-create-and-edit.component.vue";
import AgingStageDetailCreateAndEdit from "../components/aging-stage-detail-create-and-edit.component.vue";
import FiltrationStageDetailCreateAndEdit from "../components/filtration-stage-detail-create-and-edit.component.vue";
import {Stages} from "../model/stages.entity.js";
import CorrectionStageManagement from "../pages/correction-stage-management.component.vue";
import FermentationStageManagement from "../pages/fermentation-stage-management.component.vue";
import PressingStageManagement from "../pages/pressing-stage-management.component.vue";


export default {
  name: 'stages-by-batch-management',
  components: {
    PressingStageManagement,
    FermentationStageManagement,
    CorrectionStageManagement,
    FiltrationStageDetailCreateAndEdit,
    AgingStageDetailCreateAndEdit,
    BottlingStageDetailCreateAndEdit,
    ClarificationStageDetailCreateAndEdit,
    PressingStageDetailCreateAndEdit: PressingStageCreateAndEditComponent,
    ReceptionStageManagement, BasePageLayout},


  props: {
    itemEntity: null,
    title: String,
    visible: Boolean
  },

  data() {
    return {

      itemObject: new Stages({}),
      stagesApiService: null,
      createAndEditDialogIsVisible: false,
      isEdit: false,
      submitted: false,



      // Etapas obtenidas por batch (objeto completo)
      stagesByBatch: new Stages({}),

      receptionStage : new ReceptionStage({}),
      correctionStage : new CorrectionStage({}),
      fermentationStage : new FermentationStage({}),
      pressingStage : new PressingStage({}),
      clarificationStage: new ClarificationStage({}),
      agingStage : new AgingStage({}),
      filtrationStage : new FiltrationStage({}),
      bottlingStage : new BottlingStage({}),



      //============ Datos de campañas y búsqueda ==============

      // Datos de la vista
      selectedItem: null, // campaña seleccionada (objeto)

      filteredItemsStages: [
        { name: 'Recepción' },
        { name: 'Corrección' },
        { name: 'Fermentación' },
        { name: 'Prensado' },
        { name: 'Clarificación' },
        { name: 'Crianza' },
        { name: 'Filtración' },
        { name: 'Embotellado' }
      ],  // campañas filtradas (objetos)

      filteredItems: [], // resultados filtrados para el autocomplete

    };
  },

  methods: {


    getAllStagesByBatch(batchId) {

      this.stagesApiService.findStagesByBatchId(batchId)
          .then(response => {
            const data = response.data[0];

            this.stagesByBatch = data; // guardas el objeto completo si quieres
            this.itemObject = new Stages(data); // Actualiza el itemEntity con el objeto completo

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

    // ===================================================================================================


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
      <reception-stage-management :item="itemObject" ></reception-stage-management>
    </div>

    <div v-else-if="selectedItem && selectedItem.name === 'Corrección'" class="p-2 w-full h-full flex-1 flex flex-column overflow-hidden ">
      <correction-stage-management :item="itemObject" ></correction-stage-management>
    </div>

    <div v-else-if="selectedItem && selectedItem.name === 'Fermentación'" class="p-2 w-full h-full flex-1 flex flex-column overflow-hidden">
     <fermentation-stage-management :item="itemObject" />
    </div>

    <div v-else-if="selectedItem && selectedItem.name === 'Prensado'" class="p-2 w-full h-full flex-1 flex flex-column overflow-hidden">
      <pressing-stage-management :item="itemObject" />
    </div>

    <div v-else-if="selectedItem && selectedItem.name === 'Clarificación'" class="p-2 w-full h-full flex-1 flex flex-column overflow-hidden">
      <clarification-stage-detail-create-and-edit :itemEntity="clarificationStage" />
    </div>

    <div v-else-if="selectedItem && selectedItem.name === 'Crianza'" class="p-2 w-full h-full flex-1 flex flex-column overflow-hidden">
      <aging-stage-detail-create-and-edit :itemEntity="agingStage" />
    </div>

    <div v-else-if="selectedItem && selectedItem.name === 'Filtración'" class="p-2 w-full h-full flex-1 flex flex-column overflow-hidden">
      <filtration-stage-detail-create-and-edit :itemEntity="filtrationStage" />
    </div>

    <div v-else-if="selectedItem && selectedItem.name === 'Embotellado'" class="p-2 w-full h-full flex-1 flex flex-column overflow-hidden">
      <bottling-stage-detail-create-and-edit :itemEntity="bottlingStage" />
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