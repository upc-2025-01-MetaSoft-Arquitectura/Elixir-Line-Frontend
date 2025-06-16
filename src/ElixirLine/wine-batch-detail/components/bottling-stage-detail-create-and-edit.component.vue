<script>

export default {

  name: 'bottling-stage-detail-create-and-edit',

  props: {
    itemEntity: null,
  },

  created() {
    console.log('Bottling Stage Detail component created');
  }
}

</script>

<template>

  <!-- Etapa: Embotellado -->
  <div v-if="itemEntity && itemEntity.stage" class="flex flex-column h-full w-full overflow-hidden my-3 border-bottom-1 border-300">
    <pv-card>
      <template #header>
        <h3 class="m-0">Etapa: {{itemEntity.stage}}</h3>
      </template>

      <!-- Contenido de la tarjeta -->
      <template #content>
        <div class="grid p-2">
          <div class="col-12 md:col-6">
            <p><strong>Registrado por:</strong> {{ itemEntity.registeredBy }}</p>
            <p><strong>Fecha de inicio:</strong> {{ itemEntity.startDate }}</p>
            <p><strong>Fecha de fin:</strong> {{ itemEntity.endDate }}</p>
            <p><strong>Línea de embotellado:</strong> {{ itemEntity.bottlingLine }}</p>
          </div>
          <div class="col-12 md:col-6">
            <p><strong>Bottles filled:</strong> {{ itemEntity.bottlesFilled }}</p>
            <p><strong>Volumen de botella (ml):</strong> {{ itemEntity.bottleVolumeMl }}</p>
            <p><strong>Volumen total (litros):</strong> {{ itemEntity.totalVolumeLiters }}</p>
            <p><strong>Tipo de sello:</strong> {{ itemEntity.sealType }}</p>
          </div>
          <div class="col-12 md:col-6">
            <p><strong>Código del lote:</strong> {{ itemEntity.code }}</p>
            <p><strong>Temperatura (°C):</strong> {{ itemEntity.temperature }}</p>
          </div>
          <div class="col-12 md:col-6">
            <p><strong>Filtrado previo:</strong> {{ itemEntity.wasFiltered ? 'Sí' : 'No' }}</p>
            <p><strong>Etiquetas aplicadas:</strong> {{ itemEntity.wereLabelsApplied ? 'Sí' : 'No' }}</p>
            <p><strong>Cápsulas aplicadas:</strong> {{ itemEntity.wereCapsulesApplied ? 'Sí' : 'No' }}</p>
          </div>
          <div class="col-12">
            <p><strong>Comentarios:</strong> {{ itemEntity.comments }}</p>
            <p><strong>Completado:</strong> {{ itemEntity.isCompleted ? 'Sí' : 'No' }}</p>
          </div>
        </div>
      </template>
    </pv-card>
  </div>

  <!-- Fin Etapa: Embotellado -->

  <div v-else class="flex flex-column h-full w-full overflow-hidden my-3 border-bottom-1 border-300">
    <pv-card>
      <template #header>
        <h3 class="m-0">No hay datos de la etapa de embotellado</h3>
      </template>
      <template #content>
        <p>No se han registrado datos para esta etapa.</p>
      </template>
    </pv-card>
  </div>



</template>

<style>

</style>