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
  <div class="home-elixir-line flex flex-column w-full h-screen overflow-hidden">

    <!-- Barra superior -->
    <div class="toolbar-elixir-line w-full" style="height: 4rem;">
      <toolbar-elixir-line />
    </div>

    <!-- Contenedor principal -->
    <div class="content-container flex flex-row flex-1 w-full overflow-hidden">

      <!-- Sidebar -->
      <div class="navbar-elixir-line" style="width: 18%; height: 100%;">
        <navbar-elixir-line />
      </div>

      <!-- Área de contenido con scroll interno -->
      <div class="view-container flex-1 h-full w-full overflow-hidden">
        <router-view />
      </div>

    </div>
  </div>
</template>


<style>


</style>