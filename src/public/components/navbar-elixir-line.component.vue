<script>

import {useAuthenticationStore} from "../../ElixirLine/security/services/authentication.store.js";

export default {
  name: "navbar-elixir-line",


  data() {
    return {
      drawer: true,
      visible: true
    };
  },

  computed: {
    // Obtiene el userId desde el store de autenticación
    userId() {
      return useAuthenticationStore().currentUserId;
    },

    // Construye la lista de ítems con rutas dinámicas usando userId
    items() {
      const basePath = `/elixir-line/${this.userId}/home`;

      return [
        { label: 'navbar.title-dashboard-option', icon: 'pi pi-fw pi-home', to: `${basePath}/dashboard` },
        { label: 'navbar.title-batch-option', icon: 'pi pi-fw pi-table', to: `${basePath}/vinicultor/winemaking` },
        { label: 'navbar.title-task-option', icon: 'pi pi-pen-to-square', to: `${basePath}/vinicultor/tasks` },
        { label: 'navbar.title-map-option', icon: 'pi pi-fw pi-map', to: `${basePath}/vinicultor/map` },
        { label: 'navbar.title-supplies-option', icon: 'pi pi-fw pi-box', to: `${basePath}/vinicultor/supplies` },
        { label: 'navbar.title-calendar-option', icon: 'pi pi-fw pi-calendar', to: `${basePath}/vinicultor/calendar` },
      ];
    }
  },


  created() {
    console.log('Navbar created');
  }

}
</script>




<template>
  <div class="navbar-elixir-line flex flex-column h-full w-full" style="background-color: #8B0000; color: #e5edf6">

    <!-- Contenido scrollable -->
    <div class="options flex-1 overflow-auto p-3">
      <router-link v-for="item in items" :key="item.label" :to="item.to">
        <pv-button @click="visible = false" class="button-option m-1">
          <i :class="item.icon"></i>
          {{ $t(item.label) }}
        </pv-button>
      </router-link>
    </div>

    <!-- Footer fijo abajo -->
    <div class="footer-navbar p-2">
      <p class="text-xs text-center text-white mb-2">
        &copy; 2025 Elixir Line. Derechos Reservados
      </p>
    </div>

  </div>
</template>


<style>

.options{
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 15px;
}

.options .button-option {
  background-color: #8B0000;
  color: white;
  border: none;
  border-radius: 0;
  padding: 10px;
  width: 210px;
  align-items: start;
  justify-content: start;
  border-bottom: solid 1px #F5F5DC;

}

.options .button-option:not(:disabled):hover {
  background: #F5F5DC;
  border: none;
  color: black;
  font-weight: bold;
}



</style>