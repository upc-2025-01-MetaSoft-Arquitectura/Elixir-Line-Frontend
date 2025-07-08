<script>
import Card from 'primevue/card';
import PvButton from "primevue/button";
import BasePageLayout from "../../../shared/components/base-page-layout.component.vue";
import { useAuthenticationStore } from "../../security/services/authentication.store.js";
import { TaskApiService } from "../../task-management/services/task-api.service.js";
import { batchAndCampaignApiService } from "../../winemaking-process/services/batch-and-campaign-api.service.js";

export default {
  name: "dashboard-component",
  components: { BasePageLayout, PvButton, 'pv-card': Card },
  data() {
    return {
      title: { singular: 'Dashboard' },
      pendingTasks: [],
      upcomingTasks: [],
      campaigns: [],
      wineBatches: 0,
      loading: true
    };
  },
  async mounted() {
    this.loading = true;
    try {
      const authStore = useAuthenticationStore();
      const userId = authStore.currentUserId;
      const token = authStore.currentToken;

      if (!token || !userId) {
        throw new Error("Token o userId no disponibles");
      }

      const config = { headers: { Authorization: `Bearer ${token}` } };

      // Obtener datos del vinicultor desde la API usando userId
      const winegrowerRes = await fetch(`https://elixirline-service-28111382458.us-west1.run.app/api/v1/winegrowers/${userId}`, config).then(res => res.json());
      const winegrowerId = winegrowerRes.id;

      // Instanciar servicios
      const taskService = new TaskApiService();
      const campaignService = new batchAndCampaignApiService('campaigns');
      const batchService = new batchAndCampaignApiService('batches');

      // Obtener tareas
      let tasks = [];
      try {
        const tasksRes = await taskService.getByWinegrowerId(winegrowerId);
        tasks = Array.isArray(tasksRes.data) ? tasksRes.data : tasksRes.data.items || [];
      } catch (err) {
        if (err.response && err.response.status === 404) {
          tasks = []; // Si no hay tareas, se devuelve lista vacía
        } else {
          throw err; // Otros errores se propagan
        }
      }

      this.pendingTasks = tasks.filter(t => ['InProcess', 'Pending'].includes(t.status));

      const now = new Date();
      const in30days = new Date(now);
      in30days.setDate(now.getDate() + 30);
      this.upcomingTasks = tasks.filter(t => {
        if (!t.dueDate) return false;
        const due = new Date(t.dueDate);
        return due > now && due <= in30days;
      });

      // Obtener campañas y lotes
      const [campaignsRes, batchesRes] = await Promise.all([
        campaignService.getAllResources(),
        batchService.getAllResources()
      ]);

      const campaigns = Array.isArray(campaignsRes.data) ? campaignsRes.data : campaignsRes.data.items || [];
      const batches = Array.isArray(batchesRes.data) ? batchesRes.data : batchesRes.data.items || [];

      campaigns.forEach(campaign => {
        campaign.batchesQuantity = batches.filter(b => b.campaignId === campaign.id).length;
      });

      this.campaigns = campaigns;
    } catch (e) {
      console.log('winegrowerId usado para tasks:', winegrowerId);
      const tasksRes = await taskService.getByWinegrowerId(winegrowerId);
      console.log('Respuesta de tasks:', tasksRes);
      console.error('Error al cargar datos del dashboard', e);
      alert('Error al cargar datos del dashboard');
    } finally {
      this.loading = false;
    }
  }
};
</script>

<template>
  <base-page-layout>
    <template #header>
      <div class="header">
        <h1>{{ title.singular }}</h1>
      </div>
    </template>

    <div class="dashboard-grid">
      <!-- Columna izquierda -->
      <div class="left-column">
        <pv-card v-if="!loading">
          <template #title>
            <router-link to="/vinicultor/tasks" style="text-decoration: none; display: block;">
              <pv-button style="width: 100%; justify-content: space-between;" class="card-btn">
                TAREAS PENDIENTES <span class="arrow-icon">&gt;</span>
              </pv-button>
            </router-link>
          </template>
          <template #content>
            <ul class="task-list">
              <li v-for="(task, index) in pendingTasks" :key="task.id || index" class="task-item">
                <span class="task-title">{{ task.title || 'Sin título' }}</span>
                <span class="task-status">({{ task.status || 'Sin estado' }})</span>
              </li>
              <li v-if="pendingTasks.length === 0" class="task-empty">No hay tareas pendientes</li>
            </ul>
          </template>
        </pv-card>

        <pv-card v-if="!loading">
          <template #title>
            <router-link to="/vinicultor/tasks" style="text-decoration: none; display: block;">
              <pv-button style="width: 100%; justify-content: space-between;" class="card-btn">
                TAREAS PRONTAS A VENCER <span class="arrow-icon">&gt;</span>
              </pv-button>
            </router-link>
          </template>
          <template #content>
            <ul class="task-list">
              <li v-for="(task, index) in upcomingTasks" :key="task.id || index" class="task-item">
                <span class="task-icon">⏰</span>
                <span class="task-title">{{ task.title || 'Sin título' }}</span>
                <span class="task-status">(Vence: {{ new Date(task.dueDate).toLocaleDateString() || 'Sin fecha' }})</span>
              </li>
              <li v-if="upcomingTasks.length === 0" class="task-empty">No hay tareas próximas a vencer</li>
            </ul>
          </template>
        </pv-card>
      </div>

      <!-- Columna derecha -->
      <div class="right-column">
        <pv-card v-if="!loading">
          <template #title>
            <router-link to="/vinicultor/winemaking" style="text-decoration: none; display: block;">
              <pv-button style="width: 100%; justify-content: space-between;" class="card-btn">
                CANTIDAD DE LOTES DE VINO POR CAMPAÑA <span class="arrow-icon">&gt;</span>
              </pv-button>
            </router-link>
          </template>
          <template #content>
            <table class="campaign-table">
              <thead>
              <tr><th>Campaña</th><th>Lotes</th></tr>
              </thead>
              <tbody>
              <tr v-for="(campaign, index) in campaigns" :key="campaign.id || index">
                <td>{{ campaign.name || 'Sin nombre' }}</td>
                <td>{{ campaign.batchesQuantity ?? 0 }}</td>
              </tr>
              <tr v-if="campaigns.length === 0">
                <td colspan="2">No hay campañas registradas</td>
              </tr>
              </tbody>
            </table>
          </template>
        </pv-card>
      </div>
    </div>
  </base-page-layout>
</template>

<style scoped>

:root {
  font-family: 'Segoe UI', Roboto, sans-serif;
  font-size: 15px;
  color: #333;
}

.dashboard-grid {
  display: flex;
  flex-direction: row;
  gap: 2rem;
  padding: 2rem;
  justify-content: space-between;
  align-items: flex-start;
}

.left-column {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  width: 30%;
}

.right-column {
  flex: 1;
}

.campaign-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

.campaign-table th,
.campaign-table td {
  padding: 0.75rem;
  border-bottom: 1px solid #ddd;
}


.arrow-icon {
  font-size: 1.2em;
  margin-left: 0.5em;
}

.p-card {
  border: none;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.06);
  border-radius: 12px;
  padding: 1rem;
}

.card-btn {
  background-color: #8B0000; /* naranja más suave */
  color: white;
  border: none;
  font-weight: 600;
  font-size: 1rem;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  transition: background-color 0.3s ease;
}

.card-btn:hover {
  background-color: #ff7676 !important;
  border: none !important;
}

.task-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.task-item {
  display: flex;
  align-items: center;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(139,0,0,0.04);
  padding: 0.75rem 1rem;
  font-size: 1rem;
  transition: box-shadow 0.2s;
}

.task-item:hover {
  box-shadow: 0 4px 16px rgba(139,0,0,0.10);
}

.task-icon {
  margin-right: 0.75rem;
  font-size: 1.2em;
}

.task-title {
  flex: 1;
  font-weight: 500;
}

.task-status {
  color: orange;
  font-size: 0.95em;
  margin-left: 0.5em;
}

.task-empty {
  color: #aaa;
  text-align: center;
  padding: 1rem 0;
}
html, body, #app {
  height: 100%;
  margin: 0;
  padding: 0;
}

.dashboard-grid {
  height: calc(100vh - 4rem); /* Ajusta 4rem si tu header es más alto o bajo */
  overflow-y: auto;
  padding-bottom: 2rem;
}

:deep(.page) {
  margin-top: 0 !important;
  padding-top: 0 !important;
}

</style>