<script>

export default {
  name: 'filtration-stage-detail-create-and-edit',


  props: {
    itemEntity: null,
  },


  created() {
    console.log('Filtration Stage Detail component created');
  }
}

</script>

<template>

  <!-- Etapa: Filtración -->

  <div v-if="itemEntity" class="my-3 border-bottom-1 border-300">
    <pv-card>
      <template #header>
        <h3 class="m-0">Etapa: Filtración</h3>
      </template>

      <!-- Contenido de la tarjeta -->
      <template #content>
        <div class="grid p-2">
          <div class="col-12 md:col-6">
            <p><strong>Registrado por:</strong> {{ itemEntity.registeredBy }}</p>
            <p><strong>Fecha de inicio:</strong> {{ itemEntity.startDate }}</p>
            <p><strong>Fecha de fin:</strong> {{ itemEntity.endDate }}</p>
            <p><strong>Tipo de filtración:</strong> {{ itemEntity.filtrationType }}</p>
          </div>
          <div class="col-12 md:col-6">
            <p><strong>Medio filtrante:</strong> {{ itemEntity.filterMedia }}</p>
            <p><strong>Tamaño de poro (micrones):</strong> {{ itemEntity.poreMicrons }}</p>
            <p><strong>Turbidez antes (NTU):</strong> {{ itemEntity.turbidityBefore }}</p>
            <p><strong>Turbidez después (NTU):</strong> {{ itemEntity.turbidityAfter }}</p>
          </div>
          <div class="col-12 md:col-6">
            <p><strong>Temperatura (°C):</strong> {{ itemEntity.temperature }}</p>
            <p><strong>Presión (bares):</strong> {{ itemEntity.pressureBars }}</p>
            <p><strong>Volumen filtrado (litros):</strong> {{ itemEntity.filteredVolumeLiters }}</p>
          </div>
          <div class="col-12 md:col-6">
            <p><strong>Esterilizado:</strong> {{ itemEntity.isSterile ? 'Sí' : 'No' }}</p>
            <p><strong>Cambio de filtro:</strong> {{ itemEntity.filterChanged ? 'Sí' : 'No' }}</p>
            <p v-if="itemEntity.filterChanged"><strong>Razón del cambio:</strong> {{ itemEntity.changeReason }}</p>
          </div>
          <div class="col-12">
            <p><strong>Comentarios:</strong> {{ itemEntity.comments }}</p>
            <p><strong>Completado:</strong> {{ itemEntity.isCompleted ? 'Sí' : 'No' }}</p>
          </div>
        </div>
      </template>

    </pv-card>
  </div>


  <div v-else class="flex flex-column h-full w-full overflow-hidden my-3 border-bottom-1 border-300">
    <pv-card>
      <template #header>
        <h3 class="m-0">No hay datos de la etapa Filtración</h3>
      </template>
      <template #content>
        <p>No se han registrado datos para esta etapa.</p>
      </template>
    </pv-card>
  </div>

</template>

<style>

</style>