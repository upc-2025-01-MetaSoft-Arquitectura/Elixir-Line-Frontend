<script>
import ToolbarElixirLine from "../components/toolbar-elixir-line.component.vue";
import NavbarElixirLine from "../components/navbar-elixir-line.component.vue";

export default {
  name: "layout-elixir-line",
  components: {NavbarElixirLine, ToolbarElixirLine},



  created() {
    //visualización de la página
    console.log("Layout Elixir Line created");
    //this.$router.push("/vitivinicultor/supplies");
  }


}
</script>

<template>

  <div class="home-elixir-line flex flex-column h-screen w-full overflow-hidden">

    <!-- Toolbar ocupa altura fija -->
    <div class="toolbar-elixir-line w-full">
      <toolbar-elixir-line/>
    </div>


    <!-- Contenedor principal -->
    <div class="content-container flex flex-row flex-1 w-full overflow-hidden">

      <!-- Barra lateral -->
      <div class="navbar-elixir-line w-1/6 h-full flex flex-column border-top-1 border-white">
        <navbar-elixir-line/>
      </div>

      <!-- Vista principal -->
      <div class="view-container flex flex-column flex-1 w-full h-full overflow-auto">
        <router-view/>
      </div>

    </div>



  </div>


</template>

<style>

.view-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
}




</style>