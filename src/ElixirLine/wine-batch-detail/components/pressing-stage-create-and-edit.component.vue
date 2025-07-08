<script>

import CreateAndEdit from "../../../shared/components/create-and-edit.component.vue";
import {PressingStage} from "../model/pressingStage.entity.js";

export default {

  name: 'pressing-stage-create-and-edit',

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

};

</script>

<template>

  <create-and-edit
      :entity="item"
      :edit="edit"
      :visible="visible"
      :entity-name="'Prensado'"
      @canceled-shared="onCancelRequested"
      @saved-shared="onSaveRequested($event)"
  >

    <template #content>

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
          <label for="pressType">Tipo de prensa</label>
          <pv-input-text
              class="w-full"
              id="pressType"
              v-model="item.pressType"
              placeholder="Tipo de prensa"
              :class="{ 'p-invalid': submitted && !item.pressType }"
          />
        </pv-float-label>

        <pv-float-label class="field mt-5">
          <label for="pressure"> Presión (bar)</label>
          <pv-input-number
              class="w-full"
              id="pressure"
              v-model.number="item.pressure"
              placeholder="Presión (bar)"
              :class="{ 'p-invalid': submitted && !item.pressure }"
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
          <label for="pomadeWeight"> Peso de la pasta (kg)</label>
          <pv-input-number
              class="w-full"
              id="pomadeWeight"
              v-model.number="item.pomadeWeight"
              placeholder="Peso de la pasta (kg) "
              :class="{ 'p-invalid': submitted && !item.pomadeWeight }"
          />
        </pv-float-label>

        <pv-float-label class="field mt-5">
          <label for="yield">Rendimiento (%)</label>
          <pv-input-number
              class="w-full"
              id="yield"
              v-model.number="item.yield"
              placeholder=" Rendimiento (%) "
              :class="{ 'p-invalid': submitted && !item.yield }"
          />
        </pv-float-label>

        <pv-float-label class="field mt-5">
          <label for="mustUsage">Uso del mosto</label>
          <pv-input-text
              class="w-full"
              id="mustUsage"
              v-model="item.mustUsage"
              placeholder=" "
              :class="{ 'p-invalid': submitted && !item.mustUsage }"
          />
        </pv-float-label>

        <pv-float-label class="field mt-5">
          <label for="comment">Comentario</label>
          <pv-input-textarea
              class="w-full"
              id="comment"
              v-model="item.comment"
              placeholder=" "
              :class="{ 'p-invalid': submitted && !item.comment }"
          />
        </pv-float-label>



      </div>

    </template>
  </create-and-edit>



</template>

<style>

</style>