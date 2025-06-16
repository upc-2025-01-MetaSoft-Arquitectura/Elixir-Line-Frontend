<script>

export default {

  name: 'clarification-stage-detail-create-and-edit',

  props: {
    itemEntity: null,
  },

  created() {
    console.log('Clarification Stage Detail component created');
  }
};

</script>

<template>

  <!-- Etapa: Clarificación -->
  <div v-if="itemEntity" class="my-3 border-bottom-1 border-300">
    <pv-card>
      <template #header>
        <h3 class="m-0">Etapa: Clarificación</h3>
      </template>

      <template #content>
        <div class="grid p-2">
          <div class="col-12 md:col-6">
            <p><strong>Registrado por:</strong> {{ itemEntity.registeredBy }}</p>
            <p><strong>Fecha de inicio:</strong> {{ itemEntity.startDate }}</p>
            <p><strong>Fecha de fin:</strong> {{ itemEntity.endDate }}</p>
            <p><strong>Método:</strong> {{ itemEntity.method }}</p>
          </div>
          <div class="col-12 md:col-6">
            <p><strong>Turbidez antes (NTU):</strong> {{ itemEntity.turbidityBeforeNTU }}</p>
            <p><strong>Turbidez después (NTU):</strong> {{ itemEntity.turbidityAfterNTU }}</p>
            <p><strong>Volumen (litros):</strong> {{ itemEntity.volumeLiters }}</p>
            <p><strong>Temperatura (°C):</strong> {{ itemEntity.temperature }}</p>
            <p><strong>Duración (horas):</strong> {{ itemEntity.durationHours }}</p>
          </div>
          <div class="col-12 md:col-6">
            <p><strong>Agentes clarificantes:</strong></p>
            <ul>
              <li v-for="agent in itemEntity.clarifyingAgents" :key="agent.name">
                {{ agent.name }} ({{ agent.dose }} g/L)
              </li>
            </ul>
          </div>
          <div class="col-12 md:col-6">
            <p><strong>Completado:</strong> {{ itemEntity.isCompleted ? 'Sí' : 'No' }}</p>
            <p><strong>Comentarios:</strong> {{ itemEntity.comments }}</p>
          </div>
          <div class="col-12">
            <p><strong>Brillo visual:</strong> {{ itemEntity.isCompleted ? 'Sí' : 'No' }}</p>
            <p><strong>Preparado para filtración:</strong> {{ itemEntity.isCompleted ? 'Sí' : 'No' }}</p>
          </div>
        </div>
      </template>

    </pv-card>
  </div>

  <!-- Fin Etapa: Clarificación -->

  <div v-else class="flex flex-column h-full w-full overflow-hidden my-3 border-bottom-1 border-300">
    <pv-card>
      <template #header>
        <h3 class="m-0">No hay datos de la etapa de Clarificación</h3>
      </template>
      <template #content>
        <p>No se han registrado datos para esta etapa.</p>
      </template>
    </pv-card>
  </div>

</template>

<style>

</style>