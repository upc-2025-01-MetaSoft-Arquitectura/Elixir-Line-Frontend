<script>
import createAndEditComponent from "../../../shared/components/create-and-edit.component.vue";
import CreateAndEditComponent from "../../../shared/components/create-and-edit.component.vue";

export default {
  name: "field-incidence-management",
  components: {
    CreateAndEditComponent
  },
  data() {
    return {
      incidences: [],
      showDialog: false,
      newIncidence: {
        title: '',
        image: '',
        code: '',
        worker: '',
        type: 'Ambiente de campo',
        date: '',
        description: ''
      }
    };
  },
  methods: {
    async fetchIncidences() {
      const response = await fetch("http://localhost:3000/incidenceField");
      const data = await response.json();
      this.incidences = data;
    },

    openDialog() {
      this.resetForm();
      this.showDialog = true;
    },

    cancelDialog() {
      this.showDialog = false;
    },

    async saveDialog(incidence) {
      await fetch("http://localhost:3000/incidenceField", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(incidence)
      });
      this.showDialog = false;
      this.fetchincidences();
    },

    resetForm() {
      this.newIncidence = {
        title: '',
        image: '',
        code: '',
        worker: '',
        type: 'Ambiente de campo',
        date: new Date().toISOString().split("T")[0],
        description: ''
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
    <!-- Dialogo para agregar evidencia -->
    <create-and-edit-component
        :visible="showDialog"
        :entity="newIncidence"
        entityName="Evidencia"
        :edit="false"
        size="standard"
        @canceled-shared="cancelDialog"
        @saved-shared="saveDialog"
    >
      <template #content>
        <pv-input-text v-model="newIncidence.title" placeholder="Título" class="mb-3" />
        <pv-input-text v-model="newIncidence.image" placeholder="URL de la imagen" class="mb-3" />
        <pv-input-text v-model="newIncidence.code" placeholder="Código relacionado" class="mb-3" />
        <pv-input-text v-model="newIncidence.worker" placeholder="Encargado" class="mb-3" />
        <pv-input-text v-model="newIncidence.type" placeholder="Tipo" class="mb-3" />
        <pv-calendar v-model="newIncidence.date" placeholder="Fecha" class="mb-3" dateFormat="yy-mm-dd" />
        <pv-textarea v-model="newIncidence.description" placeholder="Descripción" autoResize class="mb-3" />
      </template>
    </create-and-edit-component>


    <div class="evidencias-container">
      <div class="evidencias">
        <div v-for="item in incidences" :key="item.id" class="card">
          <img :src="item.image" class="imagen" />
          <div class="contenido">
            <h3>{{ item.title }}</h3>
            <p><strong>Código Relacionado:</strong> {{ item.code }}</p>
            <p><strong>Encargado:</strong> {{ item.worker }}</p>
            <p><strong>Tipo:</strong> <span class="tipo">{{ item.type }}</span></p>
            <p><strong>Fecha:</strong> {{ item.date }}</p>
            <p><strong>Descripción:</strong> {{ item.description }}</p>
          </div>
        </div>
      </div>
    </div>
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