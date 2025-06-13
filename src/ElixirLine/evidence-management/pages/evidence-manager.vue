<script>

import DataManager from '../../../shared/components/data-manager.component.vue'
import basePageLayoutComponent from "../../../shared/components/base-page-layout.component.vue";
import IndustrialTaskManagement from "./industrial-task.component.vue";
import FieldTaskManagement from "./field-task.component.vue";

export default {
  name: "evidence-manager",
  components: {
    FieldTaskManagement,
    IndustrialTaskManagement,
    DataManager,
    basePageLayoutComponent,
  },

  data() {
    return {
      title: { singular: 'Evidence', plural: 'Evidences' },
      activeTask: '0',
      taskOptions: [
        { label: 'Ambiente Industrial', value: '0' },
        { label: 'Ambiente de campo', value: '1' },
      ],
    };
  },
  methods: {
    updateActiveTask(value) {
      this.activeTask = value;
      console.log('activeTask actualizado:', this.activeTask);
    },
  }

}

</script>

<template>

  <div class="filter-section">
    <pv-select
        class="type-select"
        :options="taskOptions"
        placeholder="Seleccionar tipo de Tarea"
        v-model="activeTask"
        option-label="label"
        option-value="value"
    />
  </div>

  <div class="flex-1 h-full overflow-hidden flex flex-column">
    <div v-if="activeTask === '0'" class="flex-1 flex-column w-full overflow-hidden">
      <industrial-task-management></industrial-task-management>
    </div>

    <div v-if="activeTask === '1'" class="flex-1 flex-column w-full overflow-hidden">
      <field-task-management></field-task-management>
    </div>
  </div>
</template>

<style >

.type-select {
  width: 100%;
  margin-top: 2px;
  margin-bottom: 10px;
  box-sizing: border-box;
  text-align: left;
}
.filter-section {
  padding-left: 10px;
  padding-right: 10px;
}

</style>