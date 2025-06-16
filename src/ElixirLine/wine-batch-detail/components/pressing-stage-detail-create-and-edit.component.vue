<script>

export default {

  name: 'pressing-stage-detail-create-and-edit',


  props: {
    itemEntity: null,
  },

  created() {
    console.log('Pressing Stage Detail component created');
  }


};

</script>

<template>


  <!-- Etapa: Fermentación -->
  <div v-if="itemEntity" class="my-3 border-bottom-1 border-300">
    <pv-card>

      <template #header>
        <h3 class="m-0">Etapa: Prensado</h3>
      </template>

      <template #content>
        <div class="grid p-2">
          <div class="col-12 md:col-6">
            <p><strong>Registrado por:</strong> {{ itemEntity.registeredBy }}</p>
            <p><strong>Fecha de inicio:</strong> {{ itemEntity.startDate }}</p>
            <p><strong>Fecha de fin:</strong> {{ itemEntity.endDate }}</p>
            <p><strong>Tipo de prensa:</strong> {{ itemEntity.pressType }}</p>
          </div>
          <div class="col-12 md:col-6">
            <p><strong>Presión de la prensa (Bares):</strong> {{ itemEntity.pressPressureBars }}</p>
            <p><strong>Duración (minutos):</strong> {{ itemEntity.durationMinutes }}</p>
            <p><strong>Pomace (kg):</strong> {{ itemEntity.pomaceKg }}</p>
          </div>
          <div class="col-12 md:col-6">
            <p><strong>Rendimiento (litros):</strong> {{ itemEntity.yieldLiters }}</p>
            <p><strong>Uso del mosto:</strong> {{ itemEntity.mustUsage }}</p>
          </div>
          <div class="col-12 md:col-6">
            <p><strong>Completado:</strong> {{ itemEntity.isCompleted ? 'Sí' : 'No' }}</p>
          </div>
          <div class="col-12">
            <p><strong>Comentarios:</strong> {{ itemEntity.comments }}</p>
          </div>
        </div>

      </template>


    </pv-card>
  </div>

  <div v-else class="flex flex-column h-full w-full overflow-hidden my-3 border-bottom-1 border-300">
    <pv-card>
      <template #header>
        <h3 class="m-0">No hay datos de la etapa de Prensado</h3>
      </template>
      <template #content>
        <p>No se han registrado datos para esta etapa.</p>
      </template>
    </pv-card>
  </div>

</template>

<style>

</style>