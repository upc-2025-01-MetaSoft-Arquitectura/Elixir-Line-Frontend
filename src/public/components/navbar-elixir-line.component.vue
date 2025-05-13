<script>

export default {
  name: "navbar-elixir-line",


  data() {
    return {
      user: null,
      drawer: true,
      visible: true,
      items: [
        { label: 'navbar.title-dashboard-option', icon: 'pi pi-fw pi-home', to: '/dashboard' },
        { label: 'navbar.title-batch-option', icon: 'pi pi-fw pi-table', to: '/vinicultor/winemaking' },
        { label: 'navbar.title-map-option', icon: 'pi pi-fw pi-map', to: '/map' },
        { label: 'navbar.title-supplies-option', icon: 'pi pi-fw pi-box', to: '/supplies' },
        { label: 'navbar.title-calendar-option', icon: 'pi pi-fw pi-calendar', to: '/calendar' },
        { label: 'navbar.title-reports-option', icon: 'pi pi-fw pi-chart-bar', to: '/reports' }
      ]
    }
  },


  created() {
    console.log('Navbar created');
  }

}
</script>

<template>


  <div class="navbar-elixir-line flex flex-1 flex-column w-1/6 " style="background-color: #8B0000; color: #e5edf6">


    <div class="header-navbar flex flex-1 flex-column h-full" style="background-color: #8B0000; color: #e5edf6">


      <!--Barra de navegación-->
      <div class="options flex-1 p-4 overflow-auto" >
        <router-link v-for="item in items" :key="item.label" :to="item.to">
          <pv-button @click="visible = false" class="button-option m-1 " >
            <i :class="item.icon"></i>
            {{ $t(item.label) }}
          </pv-button>
        </router-link>
      </div>

      <!--Derechos reservados-->
      <div class="footer-navbar">
        <p class="text text-xs text-center text-white ">&copy; 2025 Elixir Line. Derechos Reservados</p>
      </div>

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