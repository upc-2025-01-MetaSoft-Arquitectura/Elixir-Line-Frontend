<script>

import CreateAndEdit from "../../../shared/components/create-and-edit.component.vue";
import BasePageLayout from "../../../shared/components/base-page-layout.component.vue";

export default {

  name: 'clarification-stage-create-and-edit',

  components: {CreateAndEdit, BasePageLayout},

  props: {
    item: null,
    edit : Boolean,
    visible: Boolean,
  },

  data() {
    return {
      submitted: false,
      clarifyingChips: this.item?.clarifyingAgents
          ? Object.entries(this.item.clarifyingAgents).map(([k, v]) => `${k}:${v}`)
          : []
    };
  },

  watch: {
    clarifyingChips: {
      handler(newChips) {
        const parsed = {};
        newChips.forEach((entry) => {
          const [key, value] = entry.split(":");
          if (key && !isNaN(parseFloat(value))) {
            parsed[key.trim()] = parseFloat(value);
          }
        });
        this.item.clarifyingAgents = parsed;
      },
      deep: true,
      immediate: true
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

  <!-- Etapa: Clarificación -->

  <create-and-edit
      :entity="item"
      :edit="edit"
      :visible="visible"
      :entity-name="'Clarificación'"
      @canceled-shared="onCancelRequested"
      @saved-shared="onSaveRequested($event)"
  >

    <template #content>

      <div class="field">

        <!-- Campos de la etapa de clarificación
        {
          "employee": "string",
          "startDate": "2025-07-07",
          "endDate": "2025-07-07",
          "methodUsed": "string",
          "initialTurbidity": 0.1,
          "finalTurbidity": 0.1,
          "volume": 0.1,
          "temperature": 0.1,
          "duration": 1073741824,
          "clarifyingAgents": {
            "additionalProp1": 0.1,
            "additionalProp2": 0.1,
            "additionalProp3": 0.1
          },
          "comment": "string"
        }
        -->

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
              placeholder="Fecha de inicio"
              :class="{ 'p-invalid': submitted && !item.startDate }"
          />
        </pv-float-label>


        <pv-float-label class="field mt-5">
          <label for="endDate">Fecha de fin</label>
          <pv-calendar
              class="w-full"
              id="endDate"
              v-model="item.endDate"
              placeholder="Fecha de fin"
              :class="{ 'p-invalid': submitted && !item.endDate }"
          />
        </pv-float-label>

        <pv-float-label class="field mt-5">
          <label for="methodUsed">Método utilizado</label>
          <pv-input-text
              class="w-full"
              id="methodUsed"
              v-model="item.methodUsed"
              placeholder="Método utilizado"
              :class="{ 'p-invalid': submitted && !item.methodUsed }"
          />
        </pv-float-label>

        <pv-float-label class="field mt-5">
          <label for="initialTurbidity">Turbidez inicial (NTU)</label>
          <pv-input-number
              class="w-full"
              id="initialTurbidity"
              v-model.number="item.initialTurbidity"
              placeholder="Turbidez inicial (NTU)"
              :class="{ 'p-invalid': submitted && !item.initialTurbidity }"
          />
        </pv-float-label>

        <pv-float-label class="field mt-5">
          <label for="finalTurbidity">Turbidez final (NTU)</label>
          <pv-input-number
              class="w-full"
              id="finalTurbidity"
              v-model.number="item.finalTurbidity"
              placeholder="Turbidez final (NTU)"
              :class="{ 'p-invalid': submitted && !item.finalTurbidity }"
          />
        </pv-float-label>

        <pv-float-label class="field mt-5">
          <label for="volume">Volumen (litros)</label>
          <pv-input-number
              class="w-full"
              id="volume"
              v-model.number="item.volume"
              placeholder="Volumen (litros)"
              :class="{ 'p-invalid': submitted && !item.volume }"
          />
        </pv-float-label>

        <pv-float-label class="field mt-5">
          <label for="temperature">Temperatura (°C)</label>
          <pv-input-number
              class="w-full"
              id="temperature"
              v-model.number="item.temperature"
              placeholder="Temperatura (°C)"
              :class="{ 'p-invalid': submitted && !item.temperature }"
          />
        </pv-float-label>

        <pv-float-label class="field mt-5">
          <label for="duration">Duración (minutos)</label>
          <pv-input-number
              class="w-full"
              id="duration"
              v-model.number="item.duration"
              placeholder="Duración (minutos)"
              :class="{ 'p-invalid': submitted && !item.duration }"
          />
        </pv-float-label>

        <pv-float-label class="field mt-5">
          <label for="clarifyingAgents">Agentes clarificantes (ej. bentonite:0.3)</label>
          <pv-chips
              id="clarifyingAgents"
              v-model="clarifyingChips"
              class="w-full"
              separator=","
              :class="{'p-invalid': submitted && (!clarifyingChips || clarifyingChips.length === 0)}"
          />
        </pv-float-label>

        <pv-float-label class="field mt-5">
          <label for="comment">Comentario</label>
          <pv-input-textarea
              class="w-full"
              id="comment"
              v-model="item.comment"
              placeholder="Comentario"
              :class="{ 'p-invalid': submitted && !item.comment }"
          />
        </pv-float-label>


      </div>
    </template>
  </create-and-edit>


</template>

<style>

</style>