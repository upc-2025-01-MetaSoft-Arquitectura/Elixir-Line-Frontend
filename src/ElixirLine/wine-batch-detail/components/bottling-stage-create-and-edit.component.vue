<script>

import CreateAndEdit from "../../../shared/components/create-and-edit.component.vue";

export default {

  name: 'bottling-stage-create-and-edit',

  components: {CreateAndEdit},

  props: {
    item: null,
    edit : Boolean,
    visible: Boolean,
  },

  data() {
    return {
      submitted: false
    }
  },


  methods:{

    onCancelRequested() {
      this.$emit('cancel-requested');
    },

    onSaveRequested() {
      this.submitted = true;

      console.log('batches-create-and-edit onSaveRequested',this.item);

      this.$emit('save-requested', this.item);
    }
  },

}

</script>



<template>


  <create-and-edit
      :entity="item"
      :edit="edit"
      :visible="visible"
      :entity-name="'Embotellado'"
      @canceled-shared="onCancelRequested"
      @saved-shared="onSaveRequested($event)"
  >

    <!-- Content slot for the form fields
    {
      "employee": "string",
      "startDate": "2025-07-07",
      "endDate": "2025-07-07",
      "bottlingLine": "string",
      "filledBottles": 1073741824,
      "bottleVolume": 0.1,
      "totalVolume": 0.1,
      "sealingType": "string",
      "vineyardCode": "string",
      "temperature": 0.1,
      "filteredBeforeBottling": true,
      "labelsAtThisStage": true,
      "capsuleOrSealApplication": true,
      "comment": "string"
    }
    -->

    <template #content>

      <div class="field">

        <!-- Campo: Registrado por -->
        <pv-float-label class="field mt-5">
          <label for="employee">Registrado por</label>
          <pv-input-text
              class="w-full"
              id="employee"
              v-model="item.employee"
              :class="{ 'p-invalid': submitted && !item.employee }"
          />
        </pv-float-label>

        <!-- Campo: Fecha de inicio -->
        <pv-float-label class="field mt-5">
          <label for="startDate">Fecha de inicio</label>
          <pv-calendar
              class="w-full"
              id="startDate"
              v-model="item.startDate"
              :class="{ 'p-invalid': submitted && !item.startDate }"
          />
        </pv-float-label>

        <!-- Campo: Fecha de fin -->
        <pv-float-label class="field mt-5">
          <label for="endDate">Fecha de fin</label>
          <pv-calendar
              class="w-full"
              id="endDate"
              v-model="item.endDate"
              :class="{ 'p-invalid': submitted && !item.endDate }"
          />
        </pv-float-label>

        <!-- Campo: Línea de embotellado -->
        <pv-float-label class="field mt-5">
          <label for="bottlingLine">Línea de embotellado</label>
          <pv-input-text
              class="w-full"
              id="bottlingLine"
              v-model="item.bottlingLine"
              :class="{ 'p-invalid': submitted && !item.bottlingLine }"
          />
        </pv-float-label>

        <!-- Campo: Botellas llenas -->
        <pv-float-label class="field mt-5">
          <label for="filledBottles">Botellas llenas</label>
          <pv-input-text
              class="w-full"
              id="filledBottles"
              v-model.number="item.filledBottles"
              type="number"
              :class="{ 'p-invalid': submitted && !item.filledBottles }"
          />
        </pv-float-label>

        <!-- Campo: Volumen de botella -->
        <pv-float-label class="field mt-5">
          <label for="bottleVolume">Volumen de botella (L)</label>
          <pv-input-text
              class="w-full"
              id="bottleVolume"
              v-model.number="item.bottleVolume"
              type="number"
              :class="{ 'p-invalid': submitted && !item.bottleVolume }"
          />
        </pv-float-label>


        <!-- Campo: Volumen total -->
        <pv-float-label class="field mt-5">
          <label for="totalVolume">Volumen total (L)</label>
          <pv-input-text
              class="w-full"
              id="totalVolume"
              v-model.number="item.totalVolume"
              type="number"
              :class="{ 'p-invalid': submitted && !item.totalVolume }"
          />
        </pv-float-label>


        <!-- Campo: Tipo de sellado -->
        <pv-float-label class="field mt-5">
          <label for="sealingType">Tipo de sellado</label>
          <pv-input-text
              class="w-full"
              id="sealingType"
              v-model="item.sealingType"
              :class="{ 'p-invalid': submitted && !item.sealingType }"
          />
        </pv-float-label>

        <!-- Campo: Código de viñedo -->
        <pv-float-label class="field mt-5">
          <label for="vineyardCode">Código de viñedo</label>
          <pv-input-text
              class="w-full"
              id="vineyardCode"
              v-model="item.vineyardCode"
              :class="{ 'p-invalid': submitted && !item.vineyardCode }"
          />
        </pv-float-label>


        <!-- Campo: Temperatura (°C) -->
        <pv-float-label class="field mt-5">
          <label for="temperature">Temperatura (°C)</label>
          <pv-input-text
              class="w-full"
              id="temperature"
              v-model.number="item.temperature"
              type="number"
              :class="{ 'p-invalid': submitted && item.temperature === null }"
          />
        </pv-float-label>


        <!-- Campo: Filtrado previo al embotellado -->
        <div class="field-checkbox mt-5">
          <pv-checkbox
              inputId="filteredBeforeBottling"
              v-model="item.filteredBeforeBottling"
              :binary="true"
          />
          <label for="filteredBeforeBottling">Filtrado previo al embotellado</label>
        </div>

        <!-- Campo: Etiquetas en esta etapa -->
        <div class="field-checkbox mt-5">
          <pv-checkbox
              inputId="labelsAtThisStage"
              v-model="item.labelsAtThisStage"
              :binary="true"
          />
          <label for="labelsAtThisStage">Etiquetas en esta etapa</label>
        </div>

        <!-- Campo: Aplicación de cápsula o sello -->
        <div class="field-checkbox mt-5">
          <pv-checkbox
              inputId="capsuleOrSealApplication"
              v-model="item.capsuleOrSealApplication"
              :binary="true"
          />
          <label for="capsuleOrSealApplication">Aplicación de cápsula o sello</label>
        </div>

        <!-- Campo: Comentario -->
        <pv-float-label class="field mt-5">
          <label for="comment">Comentario</label>
          <pv-input-text
              class="w-full"
              id="comment"
              v-model="item.comment"
              :class="{ 'p-invalid': submitted && !item.comment }"
          />
        </pv-float-label>



      </div>

    </template>
  </create-and-edit>


</template>




<style>

</style>