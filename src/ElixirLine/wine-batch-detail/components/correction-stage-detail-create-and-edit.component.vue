<script>

export default {
  name: 'correction-stage-detail-create-and-edit',

  props: {
    itemEntity: null,
  },

  created() {
    console.log('Correction Stage Detail component created');
  },
}

</script>

<template>

  <!-- Etapa: Recepción -->
  <div v-if="itemEntity" class="my-3 border-bottom-1 border-300">
    <pv-card>
      <template #header>
        <h3 class="m-0">Etapa: Corrección</h3>
      </template>

      <template #content>
        <div class="grid p-2">
          <div class="col-12 md:col-6">
            <p><strong>Registrado por:</strong> {{ itemEntity.registeredBy }}</p>
            <p><strong>Fecha de inicio:</strong> {{ itemEntity.startDate }}</p>
            <p><strong>Fecha de fin:</strong> {{ itemEntity.endDate }}</p>
            <p><strong>Brix inicial:</strong> {{ itemEntity.initialBrix }}</p>
          </div>
          <div class="col-12 md:col-6">
            <p><strong>Brix final:</strong> {{ itemEntity.finalBrix }}</p>
            <p><strong>Añadido azúcar (kg):</strong> {{ itemEntity.addedSugarKg }}</p>
            <p><strong>pH inicial:</strong> {{ itemEntity.initialPH }}</p>
            <p><strong>pH final:</strong> {{ itemEntity.finalPH }}</p>
          </div>
          <div class="col-12 md:col-6">
            <p><strong>Tipo de ácido:</strong> {{ itemEntity.acidType }}</p>
            <p><strong>Ácido añadido (g/L):</strong> {{ itemEntity.acidAddedGL }}</p>
            <p><strong>SO2 añadido (mg/L):</strong> {{ itemEntity.SO2AddedMgL }}</p>
          </div>
          <div class="col-12 md:col-6">
            <ul v-if="itemEntity.nutrientsAdded && itemEntity.nutrientsAdded.length > 0">
              <li v-for="(nutrient, index) in itemEntity.nutrientsAdded" :key="index">
                <strong>{{ nutrient.name }}:</strong> {{ nutrient.quantityMgL }} mg/L
              </li>
            </ul>
            <p v-if="!itemEntity.nutrientsAdded || itemEntity.nutrientsAdded.length === 0"><em>No se añadieron nutrientes.</em></p>
          </div>
          <div class="col-12">
            <p><strong>Justificación:</strong> {{ itemEntity.justification }}</p>
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
        <h3 class="m-0">No hay datos de la etapa Corrección</h3>
      </template>
      <template #content>
        <p>No se han registrado datos para esta etapa.</p>
      </template>
    </pv-card>
  </div>

</template>

<style>

</style>