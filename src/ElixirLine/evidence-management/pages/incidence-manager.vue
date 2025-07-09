<script>
import basePageLayoutComponent from "../../../shared/components/base-page-layout.component.vue";
import { IncidenceApiService } from '../services/incidence-service.js';
import { TaskApiService } from "../../task-management/services/task-api.service.js";
import { useAuthenticationStore } from "../../security/services/authentication.store.js";
import { computed } from "vue";

const incidenceService = new IncidenceApiService();
const taskService = new TaskApiService();
const userId = computed(() => useAuthenticationStore().currentUserId);

export default {
  name: "incidence-manager",
  components: {
    basePageLayoutComponent
  },
  data() {
    return {
      title: { singular: 'Incidencia', plural: 'Incidencias' },
      activeTask: '0',
      taskOptions: [
        { label: 'Ambiente Industrial', value: '0' },
        { label: 'Ambiente de campo', value: '1' },
      ],
      tasks: [],
      incidences: []
    };
  },
  async mounted() {
    try {
      const winegrowerId = userId.value;
      const resTasks = await taskService.getByWinegrowerId(winegrowerId);
      this.tasks = resTasks.data;
      await this.loadAllIncidences();
    } catch (error) {
      console.error("Error cargando tareas o incidencias:", error);
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
    incidencesByTask() {
      // Agrupa incidencias por taskId
      const map = {};
      this.incidences.forEach(inc => {
        if (!map[inc.taskId]) map[inc.taskId] = [];
        map[inc.taskId].push(inc);
      });
      return map;
    }
  },
  methods: {
    async loadAllIncidences() {
      try {
        // Suponiendo que hay un endpoint para obtener todas las incidencias del winegrower
        const res = await incidenceService.getAllIncidences();
        this.incidences = res.data;
      } catch (error) {
        console.error("Error cargando incidencias:", error);
      }
    }
  }
};
</script>

<template>
  <div>
    <div class="header">
      <h1>{{ title.plural }}</h1>
      <p>Gestión de incidencias para tareas</p>
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
    <div class="incidencias-container">
      <div class="incidencias">
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
          <div v-if="incidencesByTask[task.id] && incidencesByTask[task.id].length">
            <div v-for="incidence in incidencesByTask[task.id]" :key="incidence.id" class="incidence-item">
              <img v-if="incidence.imageUrl" :src="incidence.imageUrl" alt="Imagen" class="incidence-img" />
              <div class="incidence-info">
                <div class="incidence-fecha">Fecha: {{ incidence.createdAt ? new Date(incidence.createdAt).toLocaleDateString() : '' }}</div>
                <div class="incidence-desc">{{ incidence.description }}</div>
              </div>
            </div>
          </div>
          <div v-else class="incidence-empty">No hay incidencias para esta tarea.</div>
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



.incidence-img {
  width: 100%;
  max-height: 180px;
  object-fit: cover;
  border-radius: 7px;
  margin-bottom: 12px;
  background: #181818;
}

.incidence-info {
  width: 100%;
}



.incidence-fecha {
  font-size: 14px;
  color: #bdbdbd;
  margin-bottom: 2px;
}

.incidence-desc {
  margin-top: 8px;
  color: #e0e0e0;
  font-size: 15px;
}

.incidence-dialog {
  width: 420px;
  max-width: 90vw;
  background: #23272f;
  border-radius: 10px;
  padding: 24px 18px 18px 18px;
  color: #fff;
  position: relative;
}
.carousel-incidence {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 260px;
}
.incidence-dialog[open] {
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

.incidence-dialog::backdrop {
  background: rgba(20, 24, 31, 0.65);
  backdrop-filter: blur(2px);
}
.carousel-incidence-wrapper {
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
  position: static;
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
.incidencias-container {
  display: flex;
  flex-direction: column;
}

.incidencias {
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

.titulo {
  font-size: 20px;
  font-weight: bold;
  color: #fff;
  margin-bottom: 6px;
  letter-spacing: 0.5px;
  line-height: 1.2;
}

.tipo {
  color: orange;
  font-weight: bold;
}
</style>