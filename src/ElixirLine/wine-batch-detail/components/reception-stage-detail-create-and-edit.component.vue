<script >

import BasePageLayout from "../../../shared/components/base-page-layout.component.vue";

export default {
  name: 'reception-stage-detail-create-and-edit',
  components: {BasePageLayout},

  props: {
    itemEntity: null,
  },

  created() {
    console.log('Reception Stage Detail component created');
  }
}

</script>

<template>

    <!-- Etapa: Recepción -->
    <div v-if="itemEntity"
         class="flex flex-column h-full w-full overflow-hidden my-3 border-bottom-1 border-300">
      <pv-card>
        <template #header>
          <h3 class="m-0">Etapa: Recepción</h3>
        </template>

        <template #content>
          <div class="grid p-2">
            <div class="col-12 md:col-6">
              <p><strong>Registrado por:</strong> {{ itemEntity.registeredBy }}</p>
              <p><strong>Fecha:</strong> {{ itemEntity.startDate }}</p>
              <p><strong>Temperatura:</strong> {{ itemEntity.temperature }} °C</p>
              <p><strong>pH:</strong> {{ itemEntity.pH }}</p>
            </div>
            <div class="col-12 md:col-6">
              <p><strong>Brix:</strong> {{ itemEntity.sugarLevelBrix }}</p>
              <p><strong>Cantidad (kg):</strong> {{ itemEntity.quantityKg }}</p>
              <p><strong>Comentarios:</strong> {{ itemEntity.comments }}</p>
              <p><strong>Completado:</strong> {{ itemEntity.isCompleted ? 'Sí' : 'No' }}</p>
            </div>
          </div>
        </template>
      </pv-card>
    </div>

    <!-- Fin Etapa: Recepción -->

    <div v-else class="flex flex-column h-full w-full overflow-hidden my-3 border-bottom-1 border-300">
      <pv-card>
        <template #header>
          <h3 class="m-0">No hay datos de la etapa de recepción</h3>
        </template>
        <template #content>
          <p>No se han registrado datos para esta etapa.</p>
        </template>
      </pv-card>
    </div>

</template>

<style>

</style>