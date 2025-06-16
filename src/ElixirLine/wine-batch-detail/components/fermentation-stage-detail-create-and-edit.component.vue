<script>

export default {
  name: 'fermentation-stage-detail-create-and-edit',


  props: {
    itemEntity: null,
  },

  created() {
    console.log('Correction Stage Detail component created');
  }


}

</script>

<template>


  <!-- Etapa: Fermentación -->
  <div v-if="itemEntity && itemEntity.stage" class="flex flex-column h-full w-full overflow-hidden my-3 border-bottom-1 border-300">
    <pv-card>
      <template #header>
        <h3 class="m-0">Etapa: {{itemEntity.stage}}</h3>
      </template>

      <template #content>
        <div class="grid p-2">
          <div class="col-12 md:col-6">
            <p><strong>Registrado por:</strong> {{ itemEntity.registeredBy }}</p>
            <p><strong>Fecha de inicio:</strong> {{ itemEntity.startDate }}</p>
            <p><strong>Fecha de fin:</strong> {{ itemEntity.endDate }}</p>
            <p><strong>Levadura utilizada (mg/L):</strong> {{ itemEntity.yeastUsedMgL }}</p>
          </div>
          <div class="col-12 md:col-6">
            <p><strong>pH:</strong> {{ itemEntity.pH }}</p>
            <p><strong>Brix inicial:</strong> {{ itemEntity.initialBrix }}</p>
            <p><strong>Brix final:</strong> {{ itemEntity.finalBrix }}</p>
          </div>
          <div class="col-12 md:col-6">
            <p><strong>Temperatura máxima (°C):</strong> {{ itemEntity.temperatureMax }}</p>
            <p><strong>Temperatura mínima (°C):</strong> {{ itemEntity.temperatureMin }}</p>
            <p><strong>Tipo de fermentación:</strong> {{ itemEntity.fermentationType }}</p>
          </div>
          <div class="col-12 md:col-6">
            <p><strong>Código del tanque:</strong> {{ itemEntity.tankCode }}</p>
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
        <h3 class="m-0">No hay datos de la etapa de Fermentación</h3>
      </template>
      <template #content>
        <p>No se han registrado datos para esta etapa.</p>
      </template>
    </pv-card>
  </div>

</template>

<style>

</style>