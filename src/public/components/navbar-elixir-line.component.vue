<script>

export default {
  name: "navbar-elixir-line",


  data() {
    return {
      user: null,
      drawer: true,
      visible: true,
      items: [
        { label: "title-home-option", to: "/vitivinicultor/home",                     icon: 'pi pi-home' },
        { label: "title-inventory-option", to: "/vitivinicultor/supplies",            icon: 'pi pi-receipt' },
        { label: "title-winemaking-option", to: '/vitivinicultor/winemaking-process', icon: 'pi pi-spinner-dotted' },
        { label: "title-my-customers-option", to: '/vitivinicultor/customers',          icon: 'pi pi-user' },
        { label: "title-my-orders-option", to: '/vitivinicultor/orders/history',      icon: 'pi pi-list-check' },
        { label: "title-my-products-option", to: '/vitivinicultor/products',          icon: 'pi pi-tags' },
        { label: "title-support-option", to: '/vitivinicultor/Support',               icon: 'pi pi-wrench' },
      ]
    }
  },


  created() {
    console.log('Navbar created');
  }

}
</script>

<template>


  <div class="navbar-elixir-line flex flex-column flex-1 w-1/6 h-full">

    <!-- Nombre de la empresa -->
    <div
        class="header-navbar flex flex-row text-white align-content-center justify-content-center gap-4 w-full h-20 p-2 border-bottom-1">

      <div>
        <h1 class="text text-base ">Empresa 1</h1>
      </div>

      <div>
        <img src="../../../../../Downloads/Elixir-Line-Frontend-master/Elixir-Line-Frontend-master/src/assets/login.png" width="50" alt="Company logo"/></div>
    </div>

    <!--Barra de navegación-->
      <div class="options flex flex-column flex-1 w-full h-full p-4">
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
      <p class="text text-xs text-center text-white"> Janover Gonzalo Saldaña Vela</p>
    </div>

  </div>

</template>

<style scoped>



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