<script>
import LanguageSwitcher from "./language-switcher.component.vue";

export default {
  name: "toolbar-elixir-line",
  components: {LanguageSwitcher},

  data() {
    return {
      items: [
        {label: 'sign-in', to: "/home/sign-in", icon: 'pi pi-user'},
        {label: 'sign-up', to: "/home/sign-up", icon: 'pi pi-user-plus'}
      ]
    }

  },

  created()
  {
    console.log('Toolbar Home Elixir Line Created');
  }
}

</script>

<template>


  <pv-toolbar class="toolbar-elixir-line m-0  w-full border-none "
              style="background-color: var(--vino-tinto-color);">
    <template #center>
      <div class="brand">
        <img src="https://www.primefaces.org/primevue/showcase/assets/showcase/images/primelogo.svg" alt="primevue"/>
      </div>
    </template>

    <template #end>
      <div class="language-switcher">
        <language-switcher/>
      </div>
    </template>

  </pv-toolbar>



</template>

<style scoped>

</style>