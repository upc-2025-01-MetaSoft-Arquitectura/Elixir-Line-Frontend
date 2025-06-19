<script>
import createAndEditComponent from "../../../shared/components/create-and-edit.component.vue";
import CreateAndEditComponent from "../../../shared/components/create-and-edit.component.vue";

export default {
  name: "industrial-task-management",
  components: {
    CreateAndEditComponent
  },
  data() {
    return {
      evidences: [],
      showDialog: false,
      showEvidenceDialog: false,
      evidencesByTask: [],
      selectedTask: null,
      newEvidence: {
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
    showEvidenceDialog(newVal) {
      if (!newVal) this.closeEvidenceDialog();
    }
  },

  methods: {
    async fetchEvidences() {
      const response = await fetch("http://localhost:3000/tasks");
      const data = await response.json();
      this.evidences = data;
    },

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

    closeEvidenceDialog() {
      this.showEvidenceDialog = false;
      this.evidencesByTask = [];
      this.selectedTask = null;
    },

    async showEvidencesForTask(task) {
      try {
        const response = await fetch("http://localhost:3000/evidenceIndustrial?taskId=" + task.taskId);
        if (!response.ok) {
          console.error('Error en la petición:', response.status);
          this.evidencesByTask = [];
          return;
        }
        const data = await response.json();
        console.log('Evidencias recibidas:', data);
        this.evidencesByTask = Array.isArray(data) ? data : [];
        this.selectedTask = task;
        this.showEvidenceDialog = true;
      } catch (error) {
        console.error('Error al obtener evidencias:', error);
        this.evidencesByTask = [];
      }
    },

    async saveDialog(evidence) {
      evidence.createdAt = new Date().toISOString();
      await fetch("http://localhost:3000/evidenceIndustrial", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(evidence)
      });
      this.showDialog = false;
      this.fetchEvidences();
    },

    resetForm() {
      this.newEvidence = {
        taskId: '',
        percentage: null,
        description: '',
        image: ''
      };
    }

  },
  mounted() {
    this.fetchEvidences();
  }
};
</script>

<template>

  <div class="scroll-container">
  <div class="button">
    <pv-button
        class="mb-2"
        label="Agregar Evidencia a Tarea Industrial"
        icon="pi pi-plus"
        @click="openDialog"
    />
  </div>

  <!-- Dialogo para agregar evidencia -->
  <create-and-edit-component
      :visible="showDialog"
      :entity="newEvidence"
      entityName="Evidencia"
      :edit="false"
      size="standard"
      @canceled-shared="cancelDialog"
      @saved-shared="saveDialog"
  >
    <template #content>
      <pv-input-text v-model="newEvidence.taskId" placeholder="ID de la tarea" class="mb-3" />

      <input
          type="file"
          accept="image/*"
          class="mb-3"
          @change="onImageChange"
      />

      <pv-select
          v-model="newEvidence.percentage"
          :options="[10,20,30,40,50,60,70,80,90,100]"
          placeholder="Porcentaje"
          class="mb-3"
      />

      <pv-input-text v-model="newEvidence.description" placeholder="Descripción" class="mb-3" />
    </template>
  </create-and-edit-component>


    <div class="evidencias-container">
      <div class="evidencias">
        <div v-for="item in evidences" :key="item.id" class="card">
          <img :src="item.image" class="imagen" />
          <div class="contenido">
            <h3>{{ item.taskId }}</h3>
            <p><strong>Nombre:</strong> {{ item.title }}</p>
            <p><strong>Código Relacionado:</strong> {{ item.code }}</p>
            <p><strong>Encargado:</strong> {{ item.worker }}</p>
            <p><strong>Tipo:</strong> <span class="tipo">{{ item.type }}</span></p>
            <pv-button
                label="Ver avances"
                @click="showEvidencesForTask(item)"
                class="mb-2"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Diálogo para mostrar evidencias de la tarea -->
    <pv-dialog
        :visible="showEvidenceDialog"
        modal
        header="Evidencias de la tarea"
        @update:visible="showEvidenceDialog = $event"
    >
      <template #default>
        <div v-if="selectedTask">
          <h4>{{ selectedTask.title }}</h4>
          <div v-if="evidencesByTask.length">
            <div v-for="ev in evidencesByTask" :key="ev.id" class="evidence-detail">
              <p><strong>Descripción:</strong> {{ ev.description }}</p>
              <p v-if="ev.createdAt">
                <strong>Fecha de creación:</strong> {{ formatDate(ev.createdAt) }}
              </p>
              <p><strong>Porcentaje:</strong> {{ ev.percentage }}%</p>
              <img v-if="ev.image" :src="ev.image" class="imagen" />
            </div>
          </div>
          <div v-else>
            <p>No hay evidencias para esta tarea.</p>
          </div>
        </div>
      </template>
    </pv-dialog>
  </div>
</template>

<style scoped>

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
}

.imagen {
  width: 100%;
  height: 150px;
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