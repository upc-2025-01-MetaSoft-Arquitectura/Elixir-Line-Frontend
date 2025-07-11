<script>
import Card from 'primevue/card';
import PvButton from "primevue/button";
import BasePageLayout from "../../../shared/components/base-page-layout.component.vue";
import { useAuthenticationStore } from "../../security/services/authentication.store.js";
import { TaskApiService } from "../../task-management/services/task-api.service.js";
import { batchAndCampaignApiService } from "../../winemaking-process/services/batch-and-campaign-api.service.js";
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

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


  computed: {
    // Obtiene el userId desde el store de autenticación
    userId() {
      return useAuthenticationStore().currentUserId;
    },
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

      this.pendingTasks = tasks.filter(t => ['IN_PROCESS', 'NOT_STARTED'].includes(t.status));

      const now = new Date();
      const in30days = new Date(now);
      in30days.setDate(now.getDate() + 30);
      this.upcomingTasks = tasks.filter(t => {
        if (!t.endDate) return false;
        const due = new Date(t.endDate);
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
    this.$nextTick(() => {
      this.renderCampaignChart();
      this.renderCampaignDonut();
    });
  },
  methods: {
    renderCampaignChart() {
      if (!this.campaigns.length) return;
      const ctx = document.getElementById('campaign-bar-chart').getContext('2d');
      if (this._campaignChart) {
        this._campaignChart.destroy();
      }
      this._campaignChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: this.campaigns.map(c => c.name || 'Sin nombre'),
          datasets: [{
            label: 'Lotes por campaña',
            data: this.campaigns.map(c => c.batchesQuantity ?? 0),
            backgroundColor: '#8B0000',
            borderRadius: 8,
            borderSkipped: false,
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          layout: { padding: { left: 20, right: 20, top: 30, bottom: 30 } },
          plugins: {
            legend: { display: false },
            title: { display: true, text: 'Lotes de vino por campaña', color: '#fff', font: { size: 20 } }
          },
          scales: {
            x: {
              title: { display: true, text: 'Campaña', color: '#fff', font: { size: 16 } },
              ticks: { color: '#fff', font: { size: 14 }, maxRotation: 40, minRotation: 40 },
              grid: { color: 'rgba(255,255,255,0.08)' }
            },
            y: {
              title: { display: true, text: 'Cantidad de lotes', color: '#fff', font: { size: 16 } },
              beginAtZero: true,
              ticks: { color: '#fff', font: { size: 14 }, stepSize: 1 },
              grid: { color: 'rgba(255,255,255,0.08)' }
            }
          }
        }
      });
    },
    renderCampaignDonut() {
      if (!this.campaigns.length) return;
      const ctx = document.getElementById('campaign-donut-chart').getContext('2d');
      if (this._campaignDonut) {
        this._campaignDonut.destroy();
      }
      // Genera colores distintos para cada campaña
      const colors = this.campaigns.map((c, i) => {
        const palette = [
          '#8B0000', '#1976d2', '#ff9800', '#43a047', '#d32f2f', '#7b1fa2', '#009688', '#cddc39', '#f44336', '#00bcd4', '#e91e63', '#3f51b5'
        ];
        return palette[i % palette.length];
      });
      this._campaignDonut = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: this.campaigns.map(c => c.name || 'Sin nombre'),
          datasets: [{
            label: 'Lotes por campaña',
            data: this.campaigns.map(c => c.batchesQuantity ?? 0),
            backgroundColor: colors,
            borderWidth: 2,
            borderColor: '#18191c',
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: true, position: 'bottom', labels: { color: '#fff', font: { size: 15 } } },
            title: { display: true, text: 'Distribución de lotes por campaña', color: '#fff', font: { size: 20 } }
          }
        }
      });
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
      <div class="dashboard-columns-row">
        <div class="left-column">
          <pv-card v-if="!loading">
            <template #title>
              <router-link :to="{ name: 'Tasks', params: { id: userId } }" style="text-decoration: none; display: block;">
                <pv-button style="width: 100%; justify-content: space-between;" class="card-btn">
                  TAREAS PENDIENTES <span class="arrow-icon">🢂</span>
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
              <router-link :to="{ name: 'Tasks', params: { id: userId } }" style="text-decoration: none; display: block;">
                <pv-button style="width: 100%; justify-content: space-between;" class="card-btn">
                  TAREAS PRONTAS A VENCER <span class="arrow-icon">🢂</span>
                </pv-button>
              </router-link>
            </template>
            <template #content>
              <ul class="task-list">
                <li v-for="(task, index) in upcomingTasks" :key="task.id || index" class="task-item">
                  <span class="task-icon">⏰</span>
                  <span class="task-title">{{ task.title || 'Sin título' }}</span>
                  <span class="task-status">(Vence: {{ new Date(task.endDate).toLocaleDateString() || 'Sin fecha' }})</span>
                </li>
                <li v-if="upcomingTasks.length === 0" class="task-empty">No hay tareas próximas a vencer</li>
              </ul>
            </template>
          </pv-card>
        </div>
        <div class="right-column">
          <pv-card v-if="!loading">
            <template #title>
              <router-link :to="{ name: 'WinemakingProcess', params: { id: userId } }" style="text-decoration: none; display: block;">
                <pv-button style="width: 100%; justify-content: space-between;" class="card-btn">
                  CANTIDAD DE LOTES DE VINO POR CAMPAÑA <span class="arrow-icon">🢂</span>
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
      <div class="dashboard-chart-row">
        <div class="dashboard-chart-container">
          <canvas id="campaign-bar-chart" height="400"></canvas>
        </div>
      </div>
      <div class="dashboard-donut-row">
        <div class="dashboard-donut-container">
          <canvas id="campaign-donut-chart" height="340"></canvas>
        </div>
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
  flex-direction: column;
  gap: 2rem;
  padding: 2rem;
  justify-content: flex-start;
  align-items: stretch;
}

.dashboard-columns-row {
  display: flex;
  flex-direction: row;
  gap: 2rem;
  width: 100%;
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

.dashboard-chart-container {
  width: 100%;
  max-width: 1500px;
  margin: 0 auto;
  background: #18191c;
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(24,144,255,0.08);
  padding: 2rem 2rem 1.5rem 2rem;
}

#campaign-bar-chart {
  width: 100% !important;
  max-width: 1450px;
  margin: 0 auto;
  display: block;
  color: #8B0000;
  height: 520px !important;
  background: #18191c;
  border-radius: 12px;
}

.dashboard-chart-row {
  width: 100%;
  display: flex;
  justify-content: center;
}

.dashboard-donut-row {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 1.5rem;
}

.dashboard-donut-container {
  width: 100%;
  max-width: 1700px;
  margin: 0 auto;
  background: #18191c;
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(24,144,255,0.08);
  padding: 2rem 2rem 1.5rem 2rem;
}

#campaign-donut-chart {
  width: 100% !important;
  max-width: 1550px;
  margin: 0 auto;
  display: block;
  height: 640px !important;
  background: #18191c;
  border-radius: 12px;
}
</style>