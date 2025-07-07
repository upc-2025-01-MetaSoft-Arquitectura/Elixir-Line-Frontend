<script>

import CreateAndEdit from "../../../shared/components/create-and-edit.component.vue";

export default {
  name: 'aging-stage-detail-create-and-edit',

  components: { CreateAndEdit},

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



};

</script>

<template>

  <create-and-edit
      :entity="item"
      :edit="edit"
      :visible="visible"
      :entity-name="'Añejamiento'"
      @canceled-shared="onCancelRequested"
      @saved-shared="onSaveRequested($event)"
  >


    <!-- Content of the create and edit dialog -->
    <template #content>

      <!-- Example of the expected structure of the item object
      {
      "employee": "string",
      "startDate": "2025-07-07",
      "endDate": "2025-07-07",
      "containerType": "string",
      "material": "string",
      "containerCode": "string",
      "averageTemperature": 0.1,
      "volume": 0.1,
      "duration": 1073741824,
      "frequency": 1073741824,
      "batonnage": 0.1,
      "refills": 1073741824,
      "rackings": 1073741824,
      "purpose": "string",
      "comment": "string"
      }
      -->

      <div class="field">

        <pv-float-label class="field mt-5">
          <label for="employee">Registrado por</label>
          <pv-input-text
              class="w-full"
              id="employee"
              v-model="item.employee"
              :class="{ 'p-invalid': submitted && !item.employee }"
          />
        </pv-float-label>

        <pv-float-label class="field mt-5">
          <label for="startDate">Fecha de inicio</label>
          <pv-calendar
              class="w-full"
              id="startDate"
              v-model="item.startDate"
              :class="{ 'p-invalid': submitted && !item.startDate }"
          />
        </pv-float-label>

        <pv-float-label class="field mt-5">
          <label for="endDate">Fecha de fin</label>
          <pv-calendar
              class="w-full"
              id="endDate"
              v-model="item.endDate"
              :class="{ 'p-invalid': submitted && !item.endDate }"
          />
        </pv-float-label>

        <pv-float-label class="field mt-5">
          <label for="containerType">Tipo de contenedor</label>
          <pv-input-text
              class="w-full"
              id="containerType"
              v-model="item.containerType"
              :class="{ 'p-invalid': submitted && !item.containerType }"
          />
        </pv-float-label>


        <pv-float-label class="field mt-5">
          <label for="material">Material</label>
          <pv-input-text
              class="w-full"
              id="material"
              v-model="item.material"
              :class="{ 'p-invalid': submitted && !item.material }"
          />
        </pv-float-label>

        <pv-float-label class="field mt-5">
          <label for="containerCode">Código del contenedor</label>
          <pv-input-text
              class="w-full"
              id="containerCode"
              v-model="item.containerCode"
              :class="{ 'p-invalid': submitted && !item.containerCode }"
          />
        </pv-float-label>


        <pv-float-label class="field mt-5">
          <label for="averageTemperature">Temperatura promedio (°C)</label>
          <pv-input-number
              class="w-full"
              id="averageTemperature"
              v-model.number="item.averageTemperature"
              :class="{ 'p-invalid': submitted && !item.averageTemperature }"
          />
        </pv-float-label>

        <pv-float-label class="field mt-5">
          <label for="volume">Volumen (litros)</label>
          <pv-input-number
              class="w-full"
              id="volume"
              v-model.number="item.volume"
              :class="{ 'p-invalid': submitted && !item.volume }"
          />
        </pv-float-label>


        <pv-float-label class="field mt-5">
          <label for="duration">Duración (días)</label>
          <pv-input-number
              class="w-full"
              id="duration"
              v-model.number="item.duration"
              :class="{ 'p-invalid': submitted && !item.duration }"
          />
        </pv-float-label>


        <pv-float-label class="field mt-5">
          <label for="frequency">Frecuencia de batonnage (días)</label>
          <pv-input-number
              class="w-full"
              id="frequency"
              v-model.number="item.frequency"
              :class="{ 'p-invalid': submitted && !item.frequency }"
          />
        </pv-float-label>


        <pv-float-label class="field mt-5">
          <label for="batonnage">Batonnage (litros)</label>
          <pv-input-number
              class="w-full"
              id="batonnage"
              v-model.number="item.batonnage"
              :class="{ 'p-invalid': submitted && !item.batonnage }"
          />
        </pv-float-label>


        <pv-float-label class="field mt-5">
          <label for="refills">Rellenos</label>
          <pv-input-number
              class="w-full"
              id="refills"
              v-model.number="item.refills"
              :class="{ 'p-invalid': submitted && !item.refills }"
          />
        </pv-float-label>


        <pv-float-label class="field mt-5">
          <label for="rackings">Trasiegos</label>
          <pv-input-number
              class="w-full"
              id="rackings"
              v-model.number="item.rackings"
              :class="{ 'p-invalid': submitted && !item.rackings }"
          />
        </pv-float-label>


        <pv-float-label class="field mt-5">
          <label for="purpose">Propósito</label>
          <pv-input-text
              class="w-full"
              id="purpose"
              v-model="item.purpose"
              :class="{ 'p-invalid': submitted && !item.purpose }"
          />
        </pv-float-label>


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