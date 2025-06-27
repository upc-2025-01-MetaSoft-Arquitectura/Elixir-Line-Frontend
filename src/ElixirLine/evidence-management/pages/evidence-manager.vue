<script>

import DataManager from '../../../shared/components/data-manager.component.vue'
import basePageLayoutComponent from "../../../shared/components/base-page-layout.component.vue";
import CreateAndEdit from '../../../shared/components/create-and-edit.component.vue'


export default {
  name: "evidence-manager",
  components: {
    DataManager,
    basePageLayoutComponent,
    CreateAndEdit
  },
  data() {
    return {
      title: { singular: 'Evidence', plural: 'Evidences' },
      activeTask: '0',
      taskOptions: [
        { label: 'Ambiente Industrial', value: '0' },
        { label: 'Ambiente de campo', value: '1' },
      ],
      showDialog: false,
      tasks: [],
      form: {
        taskId: "",
        percentage: 0,
        description: "",
        image: "",
        type: "industrial"
      },
      evidences: [],
      selectedTask: null,
      showEvidenceDialog: false,
      evidenceCarouselIndex: 0,
      minPercentageForTask: 0
      
      
    };
  },
  async mounted() {
    const resTasks = await fetch("http://localhost:3000/tasks");
    this.tasks = await resTasks.json();
    const resEvidences = await fetch("http://localhost:3000/evidences");
    this.evidences = await resEvidences.json();
  },
  computed: {
    selectedTaskType() {
      const task = this.tasks.find(t => t.id === this.form.taskId);
      return task ? (task.type || '') : '';
    },
    evidencesFiltered() {
      if (this.activeTask === '0') {
        // Industrial
        return this.evidences.filter(ev => this.getTaskById(ev.taskId)?.type === 'INDUSTRIAL');
      }
      if (this.activeTask === '1') {
        // Campo
        return this.evidences.filter(ev => this.getTaskById(ev.taskId)?.type === 'CAMPO');
      }
      return this.evidences;
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
    evidencesForSelectedTask() {
      if (!this.selectedTask) return [];
      return this.evidences
          .filter(ev => ev.taskId === this.selectedTask.id)
          .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    },
    maxPercentageForSelectedTask() {
      const taskId = this.selectedTask?.id || this.form.taskId;
      if (!taskId) return 0;
      return Math.max(
          0,
          ...this.evidences.filter(ev => ev.taskId === taskId).map(ev => ev.percentage)
      );
    }
  },
  methods: {
    setMinPercentageForTask() {
      this.minPercentageForTask = this.maxPercentageForSelectedTask;
      if (this.form.percentage < this.minPercentageForTask) {
        this.form.percentage = this.minPercentageForTask;
      }
    },
    updateTaskType() {
      const task = this.tasks.find(t => t.id === this.form.taskId);
      this.form.type = task ? (task.type || '') : '';
      this.setMinPercentageForTask();
    },
    openDialog() {
      this.showDialog = true;
      this.form = {
        taskId: "",
        percentage: 0,
        description: "",
        image: "",
        type: "industrial"
      };
      this.minPercentageForTask = 0;
      this.$nextTick(() => {
        this.$refs.evidenceDialog?.showModal?.();
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
    async saveEvidence() {
      const maxPercentage = Math.max(
          0,
          ...this.evidences
              .filter(ev => ev.taskId === this.form.taskId)
              .map(ev => ev.percentage)
      );
      if (this.form.percentage < maxPercentage) {
        alert(`El porcentaje no puede ser menor al ya avanzado (${maxPercentage}%) para esta tarea.`);
        return;
      }
      const newEvidence = {
        id: Date.now().toString(),
        taskId: this.form.taskId,
        percentage: this.form.percentage,
        description: this.form.description,
        image: this.form.image,
        createdAt: new Date().toISOString(),
        type: this.form.type
      };
      await fetch("http://localhost:3000/evidences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newEvidence)
      });
      this.showDialog = false;
      const resEvidences = await fetch("http://localhost:3000/evidences");
      this.evidences = await resEvidences.json();
    },
    openEvidenceDialog(task) {
      this.selectedTask = task;
      this.evidenceCarouselIndex = 0;
      this.showEvidenceDialog = true;
    },
    closeEvidenceDialog() {
      this.showEvidenceDialog = false;
      this.selectedTask = null;
    },
    nextEvidence() {
      if (this.evidenceCarouselIndex < this.evidencesForSelectedTask.length - 1) {
        this.evidenceCarouselIndex++;
      }
    },
    prevEvidence() {
      if (this.evidenceCarouselIndex > 0) {
        this.evidenceCarouselIndex--;
      }
    }
  },
  watch: {
    'form.percentage'(val) {
      if (val < this.minPercentageForTask) {
        this.form.percentage = this.minPercentageForTask;
      }
    }
  }
}
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
    <div class="flex-1 h-full overflow-hidden flex flex-column">
      <div v-if="activeTask === '0'" class="flex-1 flex-column w-full overflow-hidden"></div>
      <div v-if="activeTask === '1'" class="flex-1 flex-column w-full overflow-hidden"></div>
    </div>
    <create-and-edit
        class="create-and-edit"
        :entity="form"
        :visible="showDialog"
        entity-name="Evidencia"
        :edit="false"
        @saved-shared="saveEvidence"
        @canceled-shared="showDialog = false"
    >
      <template #content>
        <form @submit.prevent>
          <label>Tarea:
            <select v-model="form.taskId" required @change="updateTaskType">
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
            <input type="text" v-model="form.image" />
          </label>
        </form>
      </template>
    </create-and-edit>
    <div class="button-section">
      <button @click="openDialog">Nueva Evidencia</button>
    </div>
    <div class="evidencias-container">
      <div class="evidencias">
        <div
            v-for="task in filteredTasks"
            :key="task.id"
            class="card"
            @click="openEvidenceDialog(task)"
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

    <!-- Diálogo/carrousel de evidencias -->
    <dialog v-if="showEvidenceDialog" open class="evidence-dialog">
      <div v-if="evidencesForSelectedTask.length" class="carousel-evidence-wrapper">
        <button
            class="carousel-btn left"
            @click="prevEvidence"
            :disabled="evidenceCarouselIndex === 0"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M15 18l-6-6 6-6" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
        <div class="carousel-evidence">
          <img
              v-if="evidencesForSelectedTask[evidenceCarouselIndex].image"
              :src="evidencesForSelectedTask[evidenceCarouselIndex].image"
              alt="Imagen"
              class="evidence-img"
          />
          <div class="evidence-info">
            
            <div class="evidence-fecha">
              Fecha: {{ formatDate(evidencesForSelectedTask[evidenceCarouselIndex].createdAt) }}
            </div>
            <div class="evidence-percentage">
              Porcentaje: {{ maxPercentageForSelectedTask }}%
            </div>
            <div class="evidence-desc">
              {{ evidencesForSelectedTask[evidenceCarouselIndex].description }}
            </div>
          </div>
        </div>
        <button
            class="carousel-btn right"
            @click="nextEvidence"
            :disabled="evidenceCarouselIndex === evidencesForSelectedTask.length - 1"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M9 6l6 6-6 6" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>
      <div v-else>
        No hay evidencias para esta tarea.
      </div>
      <div class="dialog-footer">
        <button @click="closeEvidenceDialog">Cerrar</button>
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