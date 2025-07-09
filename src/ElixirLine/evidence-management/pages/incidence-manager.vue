<script>
import DataManager from '../../../shared/components/data-manager.component.vue';
import basePageLayoutComponent from "../../../shared/components/base-page-layout.component.vue";
import CreateAndEdit from '../../../shared/components/create-and-edit.component.vue';
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
    DataManager,
    basePageLayoutComponent,
    CreateAndEdit
  },
  data() {
    return {
      title: { singular: 'Incidencia', plural: 'Incidencias' },
      activeTask: '0',
      taskOptions: [
        { label: 'Ambiente Industrial', value: '0' },
        { label: 'Ambiente de campo', value: '1' },
      ],
      showDialog: false,
      tasks: [],
      form: {
        taskId: "",
        description: "",
        imageUrl: "",
        type: "industrial"
      },
      incidences: [],
      selectedTask: null,
      showIncidenceDialog: false,
      incidenceCarouselIndex: 0
    };
  },
  async mounted() {
    try {
      const winegrowerId = userId.value;

      const resTasks = await taskService.getByWinegrowerId(winegrowerId);
      this.tasks = resTasks.data;

      await this.loadIncidences();
    } catch (error) {
      console.error("Error cargando tareas o incidencias:", error);
    }
  },
  computed: {
    selectedTaskType() {
      const task = this.tasks.find(t => t.id === this.form.taskId);
      return task ? (task.type || '') : '';
    },
    incidencesFiltered() {
      return this.incidences.filter(inc => {
        const task = this.getTaskById(inc.taskId);
        if (!task) return false;
        if (this.activeTask === '0') return task.type === 'INDUSTRIAL';
        if (this.activeTask === '1') return task.type === 'CAMPO';
        return true;
      });
    },
    filteredTasks() {
      if (this.activeTask === '0') {
        return this.tasks.filter(t => t.type === 'INDUSTRIAL');
      }
      if (this.activeTask === '1') {
        return this.tasks.filter(t => t.type === 'CAMPO');
      }
      return this.tasks;
    },
    incidencesForSelectedTask() {
      if (!this.selectedTask) return [];
      return this.incidences
          .filter(inc => inc.taskId === this.selectedTask.id)
          .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    }
  },
  methods: {
    async loadIncidences() {
      try {
        const res = await incidenceService.getAllIncidences();
        this.incidences = res.data;
      } catch (error) {
        console.error("Error cargando incidencias:", error);
      }
    },
    openDialog() {
      this.showDialog = true;
      this.form = {
        taskId: "",
        description: "",
        imageUrl: "",
        type: "industrial"
      };
      this.$nextTick(() => {
        this.$refs.incidenceDialog?.showModal?.();
      });
    },
    getTaskById(id) {
      return this.tasks.find(t => t.id === id);
    },
    formatDate(dateStr) {
      if (!dateStr) return '';
      const d = new Date(dateStr);
      return d.toLocaleDateString();
    },
    async saveIncidence() {
      const incidence = new Incidence({
        id: Date.now(),
        taskId: this.form.taskId,
        description: this.form.description,
        imageUrl: this.form.imageUrl,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      try {
        await incidenceService.createIncidence(incidence);
        this.showDialog = false;
        await this.loadIncidences();
      } catch (error) {
        console.error("Error guardando incidencia:", error);
      }
    },
    openIncidenceDialog(task) {
      this.selectedTask = task;
      this.incidenceCarouselIndex = 0;
      this.showIncidenceDialog = true;
    },
    closeIncidenceDialog() {
      this.showIncidenceDialog = false;
      this.selectedTask = null;
    },
    nextIncidence() {
      if (this.incidenceCarouselIndex < this.incidencesForSelectedTask.length - 1) {
        this.incidenceCarouselIndex++;
      }
    },
    prevIncidence() {
      if (this.incidenceCarouselIndex > 0) {
        this.incidenceCarouselIndex--;
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
    <div class="flex-1 h-full overflow-hidden flex flex-column">
      <div v-if="activeTask === '0'" class="flex-1 flex-column w-full overflow-hidden"></div>
      <div v-if="activeTask === '1'" class="flex-1 flex-column w-full overflow-hidden"></div>
    </div>
    <create-and-edit
        class="create-and-edit"
        :entity="form"
        :visible="showDialog"
        entity-name="Incidencia"
        :edit="false"
        @saved-shared="saveIncidence"
        @canceled-shared="showDialog = false"
    >
      <template #content>
        <form @submit.prevent>
          <label>Tarea:
            <select v-model="form.taskId" required>
              <option v-for="task in tasks" :key="task.id" :value="task.id">
                {{ task.title || task.id }} ({{ task.relatedId }})
              </option>
            </select>
          </label>
          <label>Tipo:
            <input
                type="text"
                :value="selectedTaskType"
                readonly
                class="readonly-type"
                style="background: #222; color: #fff;"
            />
          </label>
          <label>Descripción:
            <input type="text" v-model="form.description" required />
          </label>
          <label>Imagen (URL):
            <input type="text" v-model="form.imageUrl" />
          </label>
        </form>
      </template>
    </create-and-edit>
    <div class="button-section">
      <button @click="openDialog">Nueva Incidencia</button>
    </div>
    <div class="incidencias-container">
      <div class="incidencias">
        <div
            v-for="task in filteredTasks"
            :key="task.id"
            class="card"
            @click="openIncidenceDialog(task)"
            style="cursor:pointer"
        >
          <img
              v-if="task.image"
              :src="task.image"
              alt="Imagen"
              class="imagen"
          />
          <div class="contenido">
            <div class="titulo">{{ task.title || 'Sin título' }}</div>
            <div class="tipo">{{ task.type || 'N/A' }}</div>
            <div class="encargado">Encargado: {{ task.assignee || 'N/A' }}</div>
            <div class="fecha">ID: {{ task.id }}</div>
          </div>
        </div>
      </div>
    </div>
    <dialog v-if="showIncidenceDialog" open class="incidence-dialog">
      <div v-if="incidencesForSelectedTask.length" class="carousel-incidence-wrapper">
        <button
            class="carousel-btn left"
            @click="prevIncidence"
            :disabled="incidenceCarouselIndex === 0"
        >
          ‹
        </button>
        <div class="carousel-incidence">
          <img
              v-if="incidencesForSelectedTask[incidenceCarouselIndex].imageUrl"
              :src="incidencesForSelectedTask[incidenceCarouselIndex].imageUrl"
              alt="Imagen"
              class="incidence-img"
          />
          <div class="incidence-info">
            <div class="incidence-fecha">
              Fecha: {{ formatDate(incidencesForSelectedTask[incidenceCarouselIndex].createdAt) }}
            </div>
            <div class="incidence-desc">
              {{ incidencesForSelectedTask[incidenceCarouselIndex].description }}
            </div>
          </div>
        </div>
        <button
            class="carousel-btn right"
            @click="nextIncidence"
            :disabled="incidenceCarouselIndex === incidencesForSelectedTask.length - 1"
        >
          ›
        </button>
      </div>
      <div v-else>
        No hay incidencias para esta tarea.
      </div>
      <div class="dialog-footer">
        <button @click="closeIncidenceDialog">Cerrar</button>
      </div>
    </dialog>
  </div>
</template>
<style >

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