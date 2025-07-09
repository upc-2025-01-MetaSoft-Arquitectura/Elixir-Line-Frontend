<script>
import basePageLayoutComponent from "../../../shared/components/base-page-layout.component.vue";
import { EvidenceApiService } from '../services/evidence-service.js';
import { TaskApiService } from "../../task-management/services/task-api.service.js";
import { useAuthenticationStore } from "../../security/services/authentication.store.js";
import { computed } from "vue";

const evidenceService = new EvidenceApiService();
const taskService = new TaskApiService();
const userId = computed(() => useAuthenticationStore().currentUserId);

export default {
  name: "evidence-manager",
  components: {
    basePageLayoutComponent
  },
  data() {
    return {
      title: { singular: 'Evidence', plural: 'Evidences' },
      activeTask: '0',
      taskOptions: [
        { label: 'Ambiente Industrial', value: '0' },
        { label: 'Ambiente de campo', value: '1' },
      ],
      tasks: [],
      evidences: []
    };
  },
  async mounted() {
    try {
      const winegrowerId = userId.value;
      const resTasks = await taskService.getByWinegrowerId(winegrowerId);
      this.tasks = resTasks.data;
      await this.loadAllEvidences();
    } catch (error) {
      console.error("Error cargando tareas o evidencias:", error);
    }
  },
  computed: {
    filteredTasks() {
      if (this.activeTask === '0') {
        return this.tasks.filter(t => t.type === 'INDUSTRIAL');
      }
      if (this.activeTask === '1') {
        return this.tasks.filter(t => t.type === 'CAMPO');
      }
      return this.tasks;
    },
    evidencesByTask() {
      // Agrupa evidencias por taskId
      const map = {};
      this.evidences.forEach(ev => {
        if (!map[ev.taskId]) map[ev.taskId] = [];
        map[ev.taskId].push(ev);
      });
      return map;
    }
  },
  methods: {
    async loadAllEvidences() {
      try {
        // Suponiendo que hay un endpoint para obtener todas las evidencias del winegrower
        const res = await evidenceService.getAllEvidences();
        this.evidences = res.data;
      } catch (error) {
        console.error("Error cargando evidencias:", error);
      }
    }
  }
};
</script>

<template>
  <div>
    <div class="header">
      <h1>{{ title.plural }}</h1>
      <p>Gestión de evidencias para tareas</p>
    </div>
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
    <div class="evidencias-container">
      <div class="evidencias">
        <div
            v-for="task in filteredTasks"
            :key="task.id"
            class="card"
        >
          <div class="contenido">
            <div class="titulo">{{ task.title || 'Sin título' }}</div>
            <div class="tipo">{{ task.type || 'N/A' }}</div>
            <div class="encargado">Encargado: {{ task.assignee || 'N/A' }}</div>
            <div class="fecha">ID: {{ task.id }}</div>
          </div>
          <div v-if="evidencesByTask[task.id] && evidencesByTask[task.id].length">
            <div v-for="evidence in evidencesByTask[task.id]" :key="evidence.id" class="evidence-item">
              <img v-if="evidence.image" :src="evidence.image" alt="Imagen" class="evidence-img" />
              <div class="evidence-info">
                <div class="evidence-fecha">Fecha: {{ evidence.createdAt ? new Date(evidence.createdAt).toLocaleDateString() : '' }}</div>
                <div class="evidence-desc">{{ evidence.description }}</div>
                <div class="evidence-percentage">Avance: {{ evidence.progressPercentage }}%</div>
              </div>
            </div>
          </div>
          <div v-else class="evidence-empty">No hay evidencias para esta tarea.</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
button {
  background-color: #1976d2;
  color: #fff;
  border: none;
  padding: 8px 18px;
  border-radius: 4px;
  margin: 8px 4px 0 0;
  cursor: pointer;
  font-size: 15px;
  transition: background 0.2s;
}
button:hover {
  background-color: #1565c0;
}

.create-and-edit form {
  display: flex;
  flex-direction: column;
  gap: 18px;
  margin-top: 12px;
}

.create-and-edit label {
  display: flex;
  flex-direction: column;
  font-weight: 500;
  color: #ffffff;
  margin-bottom: 0;
  gap: 6px;
}

.create-and-edit input,
.create-and-edit select {
  width: 100%;
  padding: 8px 10px;
  border: 1px solid #bdbdbd;
  border-radius: 4px;
  font-size: 15px;
  background: #303030;
  transition: border 0.2s;
}

.create-and-edit input:focus,
.create-and-edit select:focus {
  border-color: #1976d2;
  outline: none;
}


.evidence-img {
  width: 100%;
  max-height: 180px;
  object-fit: cover;
  border-radius: 7px;
  margin-bottom: 12px;
  background: #181818;
}

.evidence-info {
  width: 100%;
}

.evidence-title {
  font-size: 18px;
  font-weight: 700;
  color: #fff;
  margin-bottom: 4px;
}

.evidence-encargado,
.evidence-tipo,
.evidence-fecha {
  font-size: 14px;
  color: #bdbdbd;
  margin-bottom: 2px;
}

.evidence-desc {
  margin-top: 8px;
  color: #e0e0e0;
  font-size: 15px;
}
.evidence-dialog {
  width: 420px;
  max-width: 90vw;
  background: #23272f;
  border-radius: 10px;
  padding: 24px 18px 18px 18px;
  color: #fff;
  position: relative;
}
.carousel-evidence {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 260px; /* Ajusta según tu diseño */
}
.evidence-dialog[open] {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1001;
  box-shadow: 0 8px 32px rgba(0,0,0,0.35);
  border: none;
  outline: none;
  animation: fadeInDialog 0.2s;
}

@keyframes fadeInDialog {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Overlay para oscurecer el fondo */
.evidence-dialog::backdrop {
  background: rgba(20, 24, 31, 0.65);
  backdrop-filter: blur(2px);
}
.carousel-evidence-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 220px;
  gap: 18px;
  position: relative;
}

.carousel-btn {
  background: #1976d2;
  color: #fff;
  border: none;
  border-radius: 50%;
  width: 38px;
  height: 38px;
  font-size: 22px;
  cursor: pointer;
  z-index: 2;
  opacity: 0.92;
  transition: background 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  position: static; /* Importante: elimina el absolute */
}
.carousel-btn.left {
  left: -48px;
}
.carousel-btn.right {
  right: -48px;
}
.carousel-btn:disabled {
  opacity: 0.5;
  cursor: default;
}
.dialog-footer {
  display: flex;
  justify-content: center;
  margin-top: 24px;
}
.evidencias-container {
  display: flex;
  flex-direction: column;
}

.evidencias {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: left;
  padding: 10px;
}

.card {
  width: 350px;
  max-width: 100%;
  overflow: hidden;
  background: #23272f;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.13);
  display: flex;
  flex-direction: column;
}

.imagen {
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 7px 7px 0 0;
  background: #181818;
}

.imagenevidence {
  width: 100%;
  height: 250px;
  object-fit: cover;
  border-radius: 7px 7px 0 0;
  background: #181818;
}

.contenido {
  padding: 10px;
  text-align: left;
  flex: 1;
  word-break: break-word;
  overflow: hidden;
}

.tipo {
  color: orange;
  font-weight: bold;
}
.titulo {
  font-size: 20px;
  font-weight: bold;
  color: #fff;
  margin-bottom: 6px;
  letter-spacing: 0.5px;
  line-height: 1.2;
}
.header {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 8px;
  padding-left: 24px; /* Separación izquierda */
}

.filter-section {
  display: flex;
  align-items: flex-start;
  margin-bottom: 12px;
  padding-left: 24px; /* Separación izquierda */
}
.button-section {
  display: flex;
  align-items: flex-start;
  padding-left: 24px;
  margin-bottom: 12px;
}
</style>