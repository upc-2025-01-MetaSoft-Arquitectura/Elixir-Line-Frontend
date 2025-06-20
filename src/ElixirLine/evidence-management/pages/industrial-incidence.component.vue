<script>
import createAndEditComponent from "../../../shared/components/create-and-edit.component.vue";
import CreateAndEditComponent from "../../../shared/components/create-and-edit.component.vue";

export default {
  name: "industrial-incidence-management",
  components: {
    CreateAndEditComponent
  },
  data() {
    return {
      incidences: [],
      showDialog: false,
      showIncidenceDialog: false,
      incidencesByTask: [],
      selectedTask: null,
      currentIncidenceIndex: 0,
      newincidence: {
        taskId: '',
        title: '',
        image: '',
        code: '',
        worker: '',
        type: 'Ambiente Industrial',
      }
    };
  },
  watch: {
    showIncidenceDialog(newVal) {
      if (!newVal) this.closeIncidenceDialog();
    }
  },
  computed: {
    filteredIncidences() {
      return this.incidences.filter(item => item.type === 'Ambiente Industrial');
    }
  },
  methods: {
    async fetchIncidences() {
      const response = await fetch("http://localhost:3000/tasks");
      const data = await response.json();
      this.incidences = data;
    },

    async onImageChange(event) {
      const file = event.target.files[0];
      if (!file) return;

      const img = new Image();
      const reader = new FileReader();

      reader.onload = (e) => {
        img.onload = () => {
          // Redimensiona la imagen (por ejemplo, ancho máximo 600px)
          const canvas = document.createElement('canvas');
          const maxWidth = 100;
          const scale = Math.min(1, maxWidth / img.width);
          canvas.width = img.width * scale;
          canvas.height = img.height * scale;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

          // Reduce la calidad (por ejemplo, 0.6)
          this.newIncidence.image = canvas.toDataURL('image/jpeg', 0.6);
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    },

    prevIncidence() {
      if (this.currentIncidenceIndex > 0) {
        this.currentIncidenceIndex--;
      } else {
        this.currentIncidenceIndex = this.incidencesByTask.length - 1;
      }
    },
    nextIncidence() {
      if (this.currentIncidenceIndex < this.incidencesByTask.length - 1) {
        this.currentIncidenceIndex++;
      } else {
        this.currentIncidenceIndex = 0;
      }
    },

    //async showEvidencesForTask(task) {
    // ...tu código actual
    // this.currentEvidenceIndex = 0; // Reinicia el índice al abrir el diálogo
    //},

    formatDate(isoString) {
      if (!isoString) return '';
      const date = new Date(isoString);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    },

    openDialog() {
      this.resetForm();
      this.showDialog = true;
    },

    cancelDialog() {
      this.showDialog = false;
    },

    closeIncidenceDialog() {
      this.showIncidenceDialog = false;
      this.incidencesByTask = [];
      this.selectedTask = null;
    },

    async showIncidencesForTask(task) {
      try {
        const response = await fetch("http://localhost:3000/incidenceIndustrial?taskId=" + task.taskId);
        if (!response.ok) {
          console.error('Error en la petición:', response.status);
          this.incidencesByTask = [];
          return;
        }
        const data = await response.json();
        console.log('Incidencias recibidas:', data);
        this.incidencesByTask = Array.isArray(data) ? data : [];
        this.selectedTask = task;
        this.showIncidenceDialog = true;
      } catch (error) {
        console.error('Error al obtener incidencias:', error);
        this.incidencesByTask = [];
      }
    },

    async saveDialog(incidence) {
      incidence.createdAt = new Date().toISOString();
      await fetch("http://localhost:3000/incidenceIndustrial", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(incidence)
      });
      this.showDialog = false;
      this.fetchIncidences();
    },

    resetForm() {
      this.newIncidence = {
        taskId: '',
        percentage: null,
        description: '',
        image: ''
      };
    }

  },
  mounted() {
    this.fetchIncidences();
  }
};
</script>

<template>

  <div class="scroll-container">
    <div class="button">
      <pv-button
          class="mb-2"
          label="Agregar Incidencia a Tarea Industrial"
          icon="pi pi-plus"
          @click="openDialog"
      />
    </div>

    <!-- Dialogo para agregar incidencia -->
    <create-and-edit-component
        :visible="showDialog"
        :entity="newIncidence"
        entityName="Incidencia"
        :edit="false"
        size="standard"
        @canceled-shared="cancelDialog"
        @saved-shared="saveDialog"
    >
      <template #content>
        <div class="form-grid">
          <pv-input-text v-model="newIncidence.taskId" placeholder="ID de la tarea" class="mb-3" />

          <input
              type="file"
              accept="image/*"
              class="mb-3"
              @change="onImageChange"
          />

          <pv-select
              v-model="newIncidence.percentage"
              :options="[10,20,30,40,50,60,70,80,90,100]"
              placeholder="Porcentaje"
              class="mb-3"
          />

          <pv-textarea
              v-model="newIncidence.description"
              placeholder="Descripción"
              auto-resize
              rows="5"
              class="mb-3 descripcion-grande"
          />
        </div>
      </template>
    </create-and-edit-component>


    <div class="incidencias-container">
      <div class="incidencias">
        <div v-for="item in filteredIncidences" :key="item.id" class="card">
          <img :src="item.image" class="imagen" />
          <div class="contenido">
            <h3>{{ item.taskId }}</h3>
            <p><strong>Nombre:</strong> {{ item.title }}</p>
            <p><strong>Código Relacionado:</strong> {{ item.code }}</p>
            <p><strong>Encargado:</strong> {{ item.worker }}</p>
            <p><strong>Tipo:</strong> <span class="tipo">{{ item.type }}</span></p>
            <pv-button
                label="Ver Incidencias"
                @click="showIncidencesForTask(item)"
                class="mb-2"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Diálogo para mostrar incidencias de la tarea -->
    <pv-dialog
        :visible="showIncidenceDialog"
        modal
        header="Incidencias de la tarea"
        @update:visible="showIncidenceDialog = $event"
    >
      <template #default>
        <div v-if="selectedTask">
          <h4>{{ selectedTask.title }}</h4>
          <div v-if="incidencesByTask.length">
            <div class="carousel-container">
              <button
                  v-if="incidencesByTask.length > 1"
                  @click="prevIncidence"
                  class="carousel-btn"
              >&lt;</button>
              <div class="incidence-detail">
                <img v-if="incidencesByTask[currentIncidenceIndex].image" :src="incidencesByTask[currentIncidenceIndex].image" class="imagenincidence" />
                <p><strong>Descripción:</strong> {{ incidencesByTask[currentIncidenceIndex].description }}</p>
                <p v-if="incidencesByTask[currentIncidenceIndex].createdAt">
                  <strong>Fecha de creación:</strong> {{ formatDate(incidencesByTask[currentIncidenceIndex].createdAt) }}
                </p>
                <p><strong>Porcentaje:</strong> {{ incidencesByTask[currentIncidenceIndex].percentage }}%</p>
              </div>
              <button
                  v-if="incidencesByTask.length > 1"
                  @click="nextIncidence"
                  class="carousel-btn"
              >&gt;</button>
            </div>
            <div v-if="incidencesByTask.length > 1" class="carousel-indicator">
              {{ currentIncidenceIndex + 1 }} / {{ incidencesByTask.length }}
            </div>
          </div>
          <div v-else>
            <p>No hay Incidencias para esta tarea.</p>
          </div>
        </div>
      </template>
    </pv-dialog>
  </div>
</template>

<style scoped>

.form-grid {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.descripcion-grande {
  min-height: 120px;
  width: 100%;
  resize: vertical;
}

.carousel-container {
  display: flex;
  align-items: center;
  justify-content: center;
}
.carousel-btn {
  background: none;
  border: none;
  font-size: 2rem;
  cursor: pointer;
  padding: 0 10px;
}
.carousel-indicator {
  text-align: center;
  margin-top: 8px;
  color: #888;
}

.mb-3 {
  margin-bottom: 1rem;
  display: flex;
  flex-wrap: wrap;
}

.scroll-container {
  padding: 10px;
  max-height: 80vh;
  overflow-y: auto;
  margin-bottom: 20px;
}

.button {
  text-align: left;
  padding-left: 10px;
  margin-top: 10px;
  margin-bottom: 10px;
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
}

.imagen {
  width: 100%;
  height: 150px;
  object-fit: cover;
}


.imagenincidence {
  width: 100%;
  height: 250px;
  object-fit: cover;
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
</style>