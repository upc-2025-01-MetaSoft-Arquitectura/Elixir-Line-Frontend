<script>

export default {
  name: 'aging-stage-detail',


  props: {
    itemEntity: null,
  },

  created() {
    console.log('Aging Stage Detail component created');
  }
};

</script>

<template>

  <!-- Etapa: Añejamiento -->
  <div v-if="itemEntity" class="my-3 border-bottom-1 border-300">
    <pv-card>
      <template #header>
        <h3 class="m-0">Etapa: Añejamiento</h3>
      </template>

      <template #content>
        <div class="grid p-2">
          <div class="col-12 md:col-6">
            <p><strong>Registrado por:</strong> {{ itemEntity.registeredBy }}</p>
            <p><strong>Fecha de inicio:</strong> {{ itemEntity.startDate }}</p>
            <p><strong>Fecha de fin:</strong> {{ itemEntity.endDate }}</p>
            <p><strong>Tipo de contenedor:</strong> {{ itemEntity.containerType }}</p>
          </div>
          <div class="col-12 md:col-6">
            <p><strong>Material del contenedor:</strong> {{ itemEntity.material }}</p>
            <p><strong>Código del contenedor:</strong> {{ itemEntity.containerCode }}</p>
            <p><strong>Temperatura promedio (°C):</strong> {{ itemEntity.avgTemperature }}</p>
            <p><strong>Volumen (litros):</strong> {{ itemEntity.volumeLiters }}</p>
          </div>
          <div class="col-12 md:col-6">
            <p><strong>Duración (meses):</strong> {{ itemEntity.durationMonths }}</p>
            <p><strong>Frecuencia de revisión (días):</strong> {{ itemEntity.frequencyDays || 'N/A' }}</p>
            <p><strong>Número de recargas:</strong> {{ itemEntity.refilled }}</p>
          </div>
          <div class="col-12 md:col-6">
            <p><strong>Bâtonnage:</strong> {{ itemEntity.batonnage || 0 }} veces</p>
            <p><strong>Sacas:</strong> {{ itemEntity.rackings || 0 }} veces</p>
            <p><strong>Propósito:</strong> {{ itemEntity.purpose }}</p>
          </div>
          <div class="col-12">
            <p><strong>Comentarios:</strong> {{ itemEntity.comments }}</p>
            <p><strong>Completado:</strong> {{ itemEntity.isCompleted ? 'Sí' : 'No' }}</p>
          </div>
        </div>
      </template>

    </pv-card>

  </div>

  <!-- Si no hay datos de la etapa Añejamiento -->

  <div v-else class="flex flex-column h-full w-full overflow-hidden my-3 border-bottom-1 border-300">
    <pv-card>
      <template #header>
        <h3 class="m-0">No hay datos de la etapa Añejamiento</h3>
      </template>
      <template #content>
        <p>No se han registrado datos para esta etapa.</p>
      </template>
    </pv-card>
  </div>


</template>

<style>

</style>